# جرد وترشيح صور «المعرض المقصود» (B5) — صور الذكاء الاصطناعي

> دعم لدفعة B5 (المعرض المقصود C3). المنهج: جرد آلي كامل لـ393 أصلاً في public/images
> (أمر: python3 PIL walk — النتائج الخام في /tmp/opencode/img_inventory.json تُعاد
> بإعادة تشغيل السكربت أدناه) + معيار ترشيح موضوعي: الحافة الطويلة ≥1200px
> وكثافة بايت/بكسل ≥0.09 (احتفاظ بالتفاصيل) + توزيع فئات متوازن.

## أرقام الجرد (مقيسة 2026-07-27)
- 393 ملفاً = 34.7MB (388 webp + 5 svg)
- 183 مرشحاً بجودة معرض (≥1200px) في فئات الفخامة (events/weddings/services/sweets/equipment)
- 82 صورة <900px و49 <600px — **يجب استبعادها من أي عرض بطولي/معرض**
- 9 صور >2000px بمجموع 3.2MB — الأثقل sideriya-1.webp = 1134KB@4032px
  → تحتاج تحجيماً قبل الاستخدام البطولي (سيقصّها Next/Image لكن التنزيل الأصلي يبقى ثقيلاً إن استُخدمت raw)

## الترشيح النهائي المقترح للمعرض (20 صورة، ≥1200px، موزّعة)
| # | المسار | الأبعاد | لماذا |
|---|---|---|---|
| 1 | /images/events/majlis-traditional-attire-dates-tower-ceremonial-coffee-display.webp | 720x1280 | برج تمور + زي تراثي — أيقونية |
| 2 | /images/events/official-ceremony-saudi-hosts-traditional-attire-vip-reception.webp | 720x1280 | بروتوكول رسمي |
| 3 | /images/events/gala-dinner-vip-reception-royal-protocol-marble-luxury.webp | 960x1280 | غالا مرمر — أفخم لقطة قاعة |
| 4 | /images/events/royal-protocol-vip-reception-makkah-hotel-towers-majlis.webp | 960x1280 | فنادق مكة الكبرى |
| 5 | /images/events/government-event-hospitality-staff-ceremonial-coffee-ministry-transport.webp | 720x1280 | عميل حكومي ظاهر |
| 6 | /images/events/saudi-event-hifawa-vip-traditional-attire-qahwa-service.webp | 720x1280 | حفاوة استقبال |
| 7 | /images/weddings/vip-wedding-traditional-uniform-dallah-wedding-hall.webp | 720x1280 | أعراس + دلة |
| 8 | /images/weddings/luxury-wedding-decoration-male-hosts-traditional-uniform.webp | 720x1280 | ديكور عرس فاخر |
| 9 | /images/weddings/jeddah-wedding-men-section-traditional-uniform-luxury-wedding.webp | 1280x960 | قسم رجال جدة |
| 10 | /images/services/male/hosts/dagla-janbiya/dagla-janbiya-1.webp | 720x1280 | الزي المطرّز بالجنبية |
| 11 | /images/services/male/sawas/sawas-1.webp | 900x1600 | سقاء زمزم |
| 12 | /images/services/male/hosts/hizam/hizam-2.webp | 1280x720 | أعلى كثافة تفاصيل في الجرد |
| 13 | /images/services/artistic/heritage-tent/tent-1.webp | — | الخيمة التراثية |
| 14 | /images/services/artistic/folkband/folkband-1.webp | 1280x960 | الفرقة الشعبية |
| 15 | /images/services/artistic/artist/artist-8.webp | 960x1280 | اللمسة الفنية |
| 16 | /images/sweets/saudi-elegant-dessert-station-mango-panna-cotta-red-velvet.webp | 1165x960 | ركن حلا متكامل |
| 17 | /images/sweets/saudi-fruit-platter-baklava-pistachio-dessert.webp | 1200x801 | بقلاوة وفواكه |
| 18 | /images/equipment/royal-golden-dallah-coffee-pot-saudi-hospitality.webp | — | الدلة الملكية |
| 19 | /images/equipment/vip-saudi-golden-dallah-dates-table.webp | — | طاولة ذهبية |
| 20 | /images/events/vip-reception-luxury-catering-millennium-hotels-golden-dallah.webp | — | شريك فندقي ظاهر |

## تحذيرات للتنفيذ (B5)
1. **صورة مقلوبة مؤكدة**: sweets/saudi-luxury-dessert-station-fresh-fruit-mix.webp (1200x2793) مخزّنة
   بتدوير جانبي — لا تُستخدم قبل تصحيح الاتجاه (اكتُشفت بالفحص البصري أثناء كاروسيل «رحلة الضيف»).
2. صور partners (67 ملفاً) متوسط حافتها <400px — تصلح لشريط شعارات فقط، ليست للمعرض.
3. hero-desktop 3168px/237KB وhero-mobile 1536px/189KB — جيدة كما هي.
4. للعلامة المائية على صور المعرض: رمز الشعار متاح SVG في site-images/watermarks/svg/logo-1.svg
   (ملاحظة تقنية: ImageMagick يفشل في تحويله — استخدموا cairosvg).

## سكربت إعادة القياس
```python
from PIL import Image; import os
for root,_,fs in os.walk('public/images'):
    for f in fs:
        p=os.path.join(root,f)
        try: print(p, Image.open(p).size, os.path.getsize(p))
        except: pass
```
