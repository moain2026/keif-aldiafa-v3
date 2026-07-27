#!/usr/bin/env python3
"""Full site crawl — keif-aldiafa-v3 production build (localhost:3100).
Loop 1 baseline: crawl every route from sitemap + discovered internal links,
verify every internal link, image, and external link. Output JSON evidence.
Run: python3 scripts/crawl_audit.py  (from repo root, next start -p 3100 running)
"""
import json, re, sys, time, os
from urllib.parse import urljoin, urlparse, unquote
import requests
from bs4 import BeautifulSoup

BASE = "http://localhost:3100"
PROD = "https://keifaldiafa.com"
OUT = "docs/evidence/loop-1/crawl"
os.makedirs(OUT, exist_ok=True)

s = requests.Session()
s.headers["User-Agent"] = "Mozilla/5.0 (crawl-audit; loop-1 baseline)"

def norm(u: str) -> str:
    """Map production URLs to local, strip fragments/query for page identity."""
    u = u.replace(PROD, BASE)
    p = urlparse(u)
    path = p.path or "/"
    if path != "/" and path.endswith("/"):
        path = path.rstrip("/")
    return f"{BASE}{path}"

# 1. seed from sitemap
seeds = []
for sm in ["/sitemap.xml"]:
    xml = s.get(BASE + sm, timeout=15).text
    seeds += re.findall(r"<loc>([^<]+)</loc>", xml)
seeds = [norm(u) for u in seeds]

pages = {}          # url -> result
to_visit = list(dict.fromkeys(seeds + [BASE + "/"]))
internal_links = {} # link -> [source pages]
external_links = {} # link -> [source pages]
images = {}         # src -> [source pages]

while to_visit:
    url = to_visit.pop(0)
    if url in pages:
        continue
    t0 = time.time()
    try:
        r = s.get(url, timeout=30)
        elapsed = round(time.time() - t0, 3)
        ct = r.headers.get("content-type", "")
        pages[url] = {"status": r.status_code, "time_s": elapsed,
                      "bytes": len(r.content), "content_type": ct}
        if r.status_code != 200 or "text/html" not in ct:
            continue
        soup = BeautifulSoup(r.text, "html.parser")
        pages[url]["title"] = (soup.title.string or "").strip() if soup.title else None
        pages[url]["h1_count"] = len(soup.find_all("h1"))
        imgs = soup.find_all("img")
        pages[url]["img_count"] = len(imgs)
        pages[url]["img_missing_alt"] = sum(1 for i in imgs if not (i.get("alt") or "").strip())
        for i in imgs:
            src = i.get("src") or ""
            if src.startswith("data:"):
                continue
            full = urljoin(url, src)
            images.setdefault(full, []).append(url)
        for a in soup.find_all("a", href=True):
            href = a["href"].strip()
            if href.startswith(("mailto:", "tel:", "javascript:", "#")):
                continue
            full = urljoin(url, href)
            if full.startswith(BASE) or full.startswith(PROD):
                n = norm(full)
                internal_links.setdefault(n, []).append(url)
                if n not in pages and n not in to_visit:
                    to_visit.append(n)
            else:
                external_links.setdefault(full.split("#")[0], []).append(url)
    except Exception as e:
        pages[url] = {"status": "ERROR", "error": str(e)}

# 2. verify local images (sample via GET; local so cheap)
img_results = {}
for src in sorted(images):
    try:
        r = s.get(src, timeout=30, stream=True)
        size = int(r.headers.get("content-length") or 0)
        if not size:
            size = len(r.content)
        img_results[src] = {"status": r.status_code, "bytes": size,
                            "content_type": r.headers.get("content-type"),
                            "used_on_pages": len(set(images[src]))}
    except Exception as e:
        img_results[src] = {"status": "ERROR", "error": str(e)}

# 3. verify external links (HEAD, fall back GET)
ext_results = {}
for link in sorted(external_links):
    try:
        r = s.head(link, timeout=20, allow_redirects=True)
        if r.status_code in (403, 405, 501):
            r = s.get(link, timeout=20, allow_redirects=True, stream=True)
        ext_results[link] = {"status": r.status_code,
                             "final_url": r.url,
                             "referenced_from": sorted(set(external_links[link]))}
    except Exception as e:
        ext_results[link] = {"status": "ERROR", "error": str(e),
                             "referenced_from": sorted(set(external_links[link]))}

# 4. summarize
broken_pages = {u: p for u, p in pages.items()
                if p.get("status") not in (200,) }
broken_imgs = {u: r for u, r in img_results.items() if r.get("status") != 200}
broken_ext = {u: r for u, r in ext_results.items()
              if not (isinstance(r.get("status"), int) and r["status"] < 400)}

summary = {
    "crawl_base": BASE,
    "generated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    "pages_crawled": len(pages),
    "pages_broken": len(broken_pages),
    "internal_links_unique": len(internal_links),
    "images_unique": len(images),
    "images_broken": len(broken_imgs),
    "external_links_unique": len(external_links),
    "external_links_broken_or_error": len(broken_ext),
    "html_pages_missing_alt_total": sum(p.get("img_missing_alt", 0) for p in pages.values()),
    "multi_h1_pages": {u: p["h1_count"] for u, p in pages.items() if p.get("h1_count", 0) > 1},
    "zero_h1_pages": [u for u, p in pages.items() if p.get("h1_count") == 0 and p.get("status") == 200 and "text/html" in str(p.get("content_type"))],
}

json.dump(pages, open(f"{OUT}/pages.json", "w"), ensure_ascii=False, indent=1)
json.dump(img_results, open(f"{OUT}/images.json", "w"), ensure_ascii=False, indent=1)
json.dump(ext_results, open(f"{OUT}/external-links.json", "w"), ensure_ascii=False, indent=1)
json.dump({"broken_pages": broken_pages, "broken_images": broken_imgs,
           "broken_external": broken_ext}, open(f"{OUT}/broken.json", "w"),
          ensure_ascii=False, indent=1)
json.dump(summary, open(f"{OUT}/summary.json", "w"), ensure_ascii=False, indent=1)
print(json.dumps(summary, ensure_ascii=False, indent=1))
