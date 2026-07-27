#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
بوابة فحص SEO الآلية — تتحقق من مخاطر R1-R10 في docs/SEO-BASELINE-AND-RISKS.md
الاستخدام (على بناء إنتاجي محلي أو الموقع الحي):
    python3 scripts/seo_gate_check.py http://localhost:3000
    python3 scripts/seo_gate_check.py https://keifaldiafa.com
المخرجات: تقرير نجاح/فشل لكل قاعدة + JSON في docs/evidence/seo/gate-<timestamp>.json
كود الخروج: 0 = كل القواعد ناجحة، 1 = يوجد فشل (يمنع الدمج).
"""
import json
import re
import sys
import time
import urllib.request
from datetime import datetime, timezone

BASE = (sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000").rstrip("/")
UA = {"User-Agent": "Mozilla/5.0 keif-seo-gate"}

# القيم المرجعية من خط الأساس (eaa7fdb)
CITY_SLUGS = ["jeddah", "riyadh", "makkah", "madinah", "dammam", "taif", "abha", "yanbu"]
CITY_PREFIXES = ["/qahwajiin-", "/sababin-qahwa-", "/diyafa-munasabat-"]
EXPECTED_CITY_LINKS = [p + c for p in CITY_PREFIXES for c in CITY_SLUGS]  # 24
REQUIRED_SCHEMA_TYPES = {"WebSite", "Organization", "CateringService", "BreadcrumbList"}
HOME_HTML_KB_MAX = 150          # R8 (خط الأساس 264KB)
HOME_MIN_WORDS = 600            # C5 من PLAN.md §4
H1_REQUIRED_TERMS = ["قهوجيين", "صبابين"]  # R4: أحدهما على الأقل


def fetch(path):
    req = urllib.request.Request(BASE + path, headers=UA)
    return urllib.request.urlopen(req, timeout=30).read().decode("utf-8", "ignore")


results = []


def check(rule, name, ok, detail):
    results.append({"rule": rule, "name": name, "ok": bool(ok), "detail": str(detail)})
    print(f"{'✅' if ok else '❌'} {rule} {name}: {detail}")


html = fetch("/")

# R1: روابط المدن الـ24 نصية في HTML الأولي
links = set(re.findall(r'href="(/[^"#?]*)"', html))
missing = [l for l in EXPECTED_CITY_LINKS if l not in links]
check("R1", "روابط صفحات المدن الـ24", not missing,
      f"مفقود: {missing}" if missing else "24/24 موجودة في HTML الأولي")
check("R1b", "رابط /locations", "/locations" in links, "/locations")

# R2: الوسوم الأساسية
title = re.search(r"<title[^>]*>(.*?)</title>", html, re.S)
desc = re.search(r'<meta name="description" content="(.*?)"', html)
canon = re.search(r'<link rel="canonical" href="(.*?)"', html)
check("R2", "title موجود", bool(title and title.group(1).strip()),
      (title.group(1).strip()[:80] if title else "مفقود"))
check("R2", "description موجود", bool(desc and desc.group(1).strip()),
      f"{len(desc.group(1)) if desc else 0} حرف")
check("R2", "canonical موجود", bool(canon), canon.group(1) if canon else "مفقود")

# R3: أنواع JSON-LD المطلوبة + صلاحية parsing
lds = re.findall(r'<script type="application/ld\+json"[^>]*>(.*?)</script>', html, re.S)
types, bad = set(), 0
for ld in lds:
    try:
        d = json.loads(ld)
        def collect(o):
            if isinstance(o, dict):
                t = o.get("@type")
                if isinstance(t, str):
                    types.add(t)
                elif isinstance(t, list):
                    types.update(x for x in t if isinstance(x, str))
                for v in o.values():
                    collect(v)
            elif isinstance(o, list):
                for v in o:
                    collect(v)
        collect(d)
    except Exception:
        bad += 1
check("R3", "كل كتل JSON-LD صالحة", bad == 0, f"{len(lds)} كتلة، {bad} فاسدة")
miss_t = REQUIRED_SCHEMA_TYPES - types
check("R3", "أنواع Schema الإلزامية", not miss_t,
      f"مفقود: {miss_t}" if miss_t else f"موجودة كلها ({len(types)} نوع إجمالاً)")

# R4: H1 واحد يتضمن كلمة خدمية
h1s = re.findall(r"<h1[^>]*>(.*?)</h1>", html, re.S)
h1_text = re.sub(r"<[^>]+>", "", h1s[0]).strip() if h1s else ""
check("R4", "H1 واحد فقط", len(h1s) == 1, f"العدد: {len(h1s)}")
check("R4", "H1 يتضمن كلمة خدمية", any(t in h1_text for t in H1_REQUIRED_TERMS), h1_text[:80])

# R5/C5: كثافة نصية
text = re.sub(r"<script.*?</script>|<style.*?</style>", "", html, flags=re.S)
words = len(re.sub(r"<[^>]+>", " ", text).split())
check("R5", f"كلمات الرئيسية ≥{HOME_MIN_WORDS}", words >= HOME_MIN_WORDS, f"{words} كلمة")

# R6: og:image
og = re.search(r'<meta property="og:image" content="(.*?)"', html)
check("R6", "og:image موجود", bool(og), og.group(1) if og else "مفقود")

# R7: صور above-the-fold بأبعاد (فحص تقريبي: أول 5 وسوم img)
imgs = re.findall(r"<img[^>]*>", html)[:5]
no_dim = [i[:60] for i in imgs if ("width=" not in i or "height=" not in i) and "aspect" not in i]
check("R7", "أبعاد لأوائل الصور", not no_dim, f"بلا أبعاد: {len(no_dim)}/5" if no_dim else "5/5")

# R8: وزن HTML
kb = round(len(html.encode()) / 1024)
check("R8", f"HTML الرئيسية ≤{HOME_HTML_KB_MAX}KB", kb <= HOME_HTML_KB_MAX, f"{kb}KB")

# R9: عينة صفحات مدن سليمة (لم تُمسّ)
for path in ["/qahwajiin-jeddah", "/sababin-qahwa-riyadh", "/diyafa-munasabat-dammam"]:
    try:
        ch = fetch(path)
        ct = re.search(r"<title[^>]*>(.*?)</title>", ch, re.S)
        cc = re.search(r'<link rel="canonical" href="(.*?)"', ch)
        ok = bool(ct and cc and len(re.findall(r"<h1[\s>]", ch)) == 1)
        check("R9", f"صفحة مدينة سليمة {path}", ok, "title+canonical+H1 ✓" if ok else "خلل")
    except Exception as e:
        check("R9", f"صفحة مدينة {path}", False, f"خطأ: {e}")

# R10: robots + sitemaps
try:
    robots = fetch("/robots.txt")
    check("R10", "robots.txt", "Sitemap:" in robots, "يتضمن Sitemap")
except Exception as e:
    check("R10", "robots.txt", False, str(e))
for sm in ["/sitemap.xml", "/image-sitemap.xml"]:
    try:
        s = fetch(sm)
        n = s.count("<loc>")
        check("R10", f"sitemap {sm}", n > 0, f"{n} loc")
    except Exception as e:
        check("R10", f"sitemap {sm}", False, str(e))

# الحفظ والخروج
failed = [r for r in results if not r["ok"]]
out = {
    "base": BASE,
    "checked_at": datetime.now(timezone.utc).isoformat(),
    "passed": len(results) - len(failed),
    "failed": len(failed),
    "results": results,
}
import os
os.makedirs("docs/evidence/seo", exist_ok=True)
fname = f"docs/evidence/seo/gate-{time.strftime('%Y%m%d-%H%M%S')}.json"
with open(fname, "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=1)
print(f"\n{'🟢 البوابة ناجحة' if not failed else '🔴 البوابة فاشلة'} — {out['passed']} نجح / {out['failed']} فشل → {fname}")
sys.exit(1 if failed else 0)
