#!/usr/bin/env bash
# مصفوفة القبول الكاملة — Lighthouse لكل نوع صفحة (موبايل + ديسكتوب) على الإنتاج
# الاستخدام: ./scripts/measure-matrix.sh <loop-number> [port]
# عالم أبحاث — توسيع نطاق اللفة 3 (الموقع الكامل)
set -euo pipefail
LOOP="${1:?usage: measure-matrix.sh <loop-number> [port]}"
PORT="${2:-3190}"
BASE="http://localhost:${PORT}"
OUT="docs/evidence/lighthouse/loop-${LOOP}-matrix"
mkdir -p "$OUT"
CF="--headless --no-sandbox --disable-gpu"
curl -sf -o /dev/null "$BASE/" || { echo "FATAL: prod server down on $BASE"; exit 1; }

# كل أنواع الصفحات: المسار|الاسم
PAGES="/|home
/services|services
/offerings|offerings
/portfolio|portfolio
/about|about
/contact|contact
/locations|locations
/locations/جدة|city-jeddah
/sababin-qahwa-jeddah|servicecity-sample"

echo "$PAGES" | while IFS='|' read -r P NAME; do
  [ -z "$P" ] && continue
  echo "== $NAME (mobile) =="
  npx lighthouse "$BASE$P" --form-factor=mobile --screenEmulation.mobile --throttling-method=simulate \
    --output=json --output-path="$OUT/${NAME}-mobile.json" --chrome-flags="$CF" --quiet || echo "WARN: $NAME mobile failed"
  echo "== $NAME (desktop) =="
  npx lighthouse "$BASE$P" --preset=desktop \
    --output=json --output-path="$OUT/${NAME}-desktop.json" --chrome-flags="$CF" --quiet || echo "WARN: $NAME desktop failed"
done

python3 - "$OUT" <<'PYEOF'
import json,sys,glob,os
out=sys.argv[1]
rows={}
for f in sorted(glob.glob(f"{out}/*.json")):
    b=os.path.basename(f)[:-5]
    name,ff=b.rsplit('-',1)
    try: d=json.load(open(f))
    except: continue
    c={k:round(v['score']*100) for k,v in d['categories'].items() if v.get('score') is not None}
    a=d['audits']
    lcp=a['largest-contentful-paint']['numericValue']/1000
    tbt=a['total-blocking-time']['numericValue']
    cls=a['cumulative-layout-shift']['numericValue']
    rows.setdefault(name,{})[ff]=(c.get('performance'),c.get('accessibility'),lcp,tbt,cls)
print(f"\n{'صفحة':<22}{'Perf(m/d)':<12}{'A11y(m)':<9}{'LCP(m)':<9}{'TBT(m)':<9}{'CLS(m)':<8}gate")
fail_pages=[]
for name,d in rows.items():
    m=d.get('mobile'); dk=d.get('desktop')
    if not m: continue
    p,a11y,lcp,tbt,cls=m
    pd=dk[0] if dk else '-'
    gate = "✅" if (p>=85 and a11y==100 and lcp<=2.5 and tbt<=300 and cls<=0.1) else "🔴"
    if gate=="🔴": fail_pages.append(name)
    print(f"{name:<22}{str(p)+'/'+str(pd):<12}{a11y:<9}{lcp:<9.1f}{tbt:<9.0f}{cls:<8.3f}{gate}")
print(f"\nبوابة المادة 8: {len(rows)-len(fail_pages)}/{len(rows)} صفحات ناجحة. الفاشلة: {', '.join(fail_pages) if fail_pages else '—'}")
PYEOF
echo "DONE — $OUT"
