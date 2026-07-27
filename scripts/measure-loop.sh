#!/usr/bin/env bash
# حزمة قياس اللفات — عالم أبحاث
# الاستخدام: ./scripts/measure-loop.sh <loop-number> [port]
# المتطلبات: CHROME_PATH مضبوط على chrome-headless-shell، وبناء إنتاجي شغّال على المنفذ.
# المنهجية مطابقة لخط الأساس 992630c (المادة 9: قياس إنتاجي فقط).
set -euo pipefail
LOOP="${1:?usage: measure-loop.sh <loop-number> [port]}"
PORT="${2:-3190}"
BASE="http://localhost:${PORT}"
OUT="docs/evidence/lighthouse/loop-${LOOP}"
mkdir -p "$OUT"
CHROME_FLAGS="--headless --no-sandbox --disable-gpu"

echo "== 0) prod server check =="
curl -sf -o /dev/null "$BASE/" || { echo "FATAL: production server not responding on $BASE"; exit 1; }

echo "== 1) TypeScript =="
npx tsc --noEmit && echo "tsc: 0 errors" | tee "$OUT/tsc.txt"

echo "== 2) Lighthouse mobile (home) =="
npx lighthouse "$BASE/" --form-factor=mobile --screenEmulation.mobile \
  --throttling-method=simulate --output=json --output-path="$OUT/home-mobile.json" \
  --chrome-flags="$CHROME_FLAGS" --quiet
echo "== 3) Lighthouse desktop (home) =="
npx lighthouse "$BASE/" --preset=desktop --output=json --output-path="$OUT/home-desktop.json" \
  --chrome-flags="$CHROME_FLAGS" --quiet

echo "== 4) A11y sweep — كل الصفحات الرئيسية (المادة 8: A11y=100 على الكل) =="
for P in contact about services offerings portfolio locations sababin-qahwa-jeddah "locations/جدة"; do
  SLUG=$(echo "$P" | tr '/' '_')
  npx lighthouse "$BASE/$P" --form-factor=mobile --screenEmulation.mobile \
    --only-categories=accessibility --output=json --output-path="$OUT/a11y-${SLUG}.json" \
    --chrome-flags="$CHROME_FLAGS" --quiet || echo "WARN: $P failed"
done

echo "== 5) summary =="
python3 - "$OUT" <<'PYEOF'
import json,sys,glob,os
out=sys.argv[1]
def scores(f):
    d=json.load(open(f)); return {k:round(v['score']*100) for k,v in d['categories'].items()}, d['audits']
rows=[]
m,a=scores(f"{out}/home-mobile.json")
rows.append(("home mobile",m,{k:a[k]['displayValue'] for k in ('largest-contentful-paint','total-blocking-time','cumulative-layout-shift')}))
d,_=scores(f"{out}/home-desktop.json")
rows.append(("home desktop",d,{}))
print("\n=== LOOP SUMMARY ===")
for name,s,extra in rows: print(name,s,extra)
fails=[]
for f in sorted(glob.glob(f"{out}/a11y-*.json")):
    dd=json.load(open(f)); sc=round(dd['categories']['accessibility']['score']*100)
    page=os.path.basename(f)[5:-5]
    flag="✅" if sc==100 else "🔴"
    print(f"a11y {page}: {sc} {flag}")
    if sc<100:
        for ref in dd['categories']['accessibility']['auditRefs']:
            au=dd['audits'][ref['id']]
            if au.get('score') is not None and au['score']<1: fails.append((page,ref['id']))
if fails:
    print("\nA11y failures:")
    for p,i in fails: print(f"  {p}: {i}")
# gate check vs المادة 8
lcp=a['largest-contentful-paint']['numericValue']/1000
tbt=a['total-blocking-time']['numericValue']
cls=a['cumulative-layout-shift']['numericValue']
perf=m['performance']
print("\n=== المادة 8 GATE ===")
print(f"Perf {perf} {'✅' if perf>=85 else '🔴'} (≥85) | LCP {lcp:.1f}s {'✅' if lcp<=2.5 else '🔴'} (≤2.5) | TBT {tbt:.0f}ms {'✅' if tbt<=300 else '🔴'} (≤300) | CLS {cls:.3f} {'✅' if cls<=0.1 else '🔴'} (≤0.1)")
PYEOF
echo "DONE — evidence in $OUT"
