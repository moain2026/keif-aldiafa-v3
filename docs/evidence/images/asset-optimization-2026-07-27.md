# تحسين أصول الصور — دفعة 1 (صور الذكاء الاصطناعي)

> يخدم «تسليم الصور» المذكور في تقرير مصفوفة اللفة 3 (توفير 611KB image-delivery).
> المنهج: PIL LANCZOS + WEBP method=6. لا تغيير على أي كود — أصول فقط،
> المسارات نفسها، فتُصلح كل الصفحات المستهلكة تلقائياً.

## ما نُفّذ (قياسات فعلية قبل/بعد)

| الملف | قبل | بعد | التوفير | العملية |
|---|---|---|---|---|
| services/male/hosts/sideriya/sideriya-1.webp | 4032×3024 · 1107KB | 2560×1920 · 520KB | −587KB | تحجيم 2560 q82 |
| services/artistic/counter/counter-2.webp | 4000×1756 · 462KB | 2560×1123 · 252KB | −210KB | تحجيم 2560 q82 |
| services/male/sawas/sawas-5.webp | 1802×4000 · 409KB | 1153×2560 · 248KB | −161KB | تحجيم 2560 q82 |
| equipment/saudi-hospitality-glass-tea-set-equipment.webp | 4160×2777 · 144KB | 2560×1708 · 133KB | −11KB | تحجيم 2560 q82 |
| sweets/saudi-luxury-dessert-station-fresh-fruit-mix.webp | 1200×2793 (مقلوبة جانبياً!) · 307KB | 2793×1200 · 317KB | +10KB | **تصحيح اتجاه CCW90** — كانت معروضة مقلوبة أينما استُخدمت |

**الإجمالي: 2431KB → 1471KB (توفير 959KB = 39%)**

## التحقق
- فحص بصري لكل ملف معدّل قبل/بعد (شبكة مقارنة) — الاتجاه صحيح والجودة سليمة.
- 2560px حافة قصوى تكفي أعرض viewport مدعوم (1440 @2x غير مطلوب للصور الداخلية).
- لا مساس بأصلَي الهيرو (hero-desktop 237KB / hero-mobile 189KB) — هما ضمن نطاق دفعة B1 (LCP) للمهندس.
- المتبقي فوق 2000px: majlis-qahwa-camel-decor (144KB) وfresh-juice (130KB) — وزنهما مقبول، تُركا لتجنب خسارة جودة بلا مكسب يذكر.

## سكربت إعادة القياس
```python
from PIL import Image; import os
for p in [...]:
    im=Image.open(p); print(p, im.size, os.path.getsize(p))
```
