import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "الحقوق القانونية | كيف الضيافة",
  description:
    "معلومات الحقوق القانونية والملكية الفكرية لصور ومحتوى موقع كيف الضيافة — شركة سعودية لخدمات الضيافة الفاخرة.",
  alternates: { canonical: "https://keifaldiafa.com/legal" },
  robots: { index: true, follow: true },
};

export default function LegalPage() {
  const year = new Date().getFullYear();

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#F5F5DC] py-24 md:py-32" dir="rtl">
      <div className="mx-auto max-w-3xl px-6 md:px-10">
        <h1 className="text-gold-highlight text-3xl md:text-4xl font-bold mb-8 font-cairo">
          الحقوق القانونية والملكية الفكرية
        </h1>

        <div className="space-y-8 leading-loose text-[#F5F5DC]/85">
          <section>
            <h2 className="text-gold-matte text-xl font-bold mb-3 font-cairo">
              حقوق الصور والمحتوى
            </h2>
            <p>
              جميع الصور ومقاطع الفيديو والنصوص المنشورة على موقع
              <strong className="text-gold-highlight"> كيف الضيافة </strong>
              محمية بموجب قوانين حقوق النشر والملكية الفكرية في المملكة العربية السعودية والاتفاقيات الدولية.
            </p>
            <p className="mt-3">
              © {year} كيف الضيافة للأفراح والمناسبات — جميع الحقوق محفوظة.
            </p>
          </section>

          <section>
            <h2 className="text-gold-matte text-xl font-bold mb-3 font-cairo">
              شروط استخدام الصور
            </h2>
            <p>
              يُمنع نسخ أو إعادة نشر أو استخدام أي صورة من صور موقعنا لأغراض تجارية أو غير تجارية
              دون الحصول على إذن كتابي مسبق من إدارة الشركة.
            </p>
            <p className="mt-3">
              الصور تحمل علامة مائية مسجّلة للحماية من الاستخدام غير المصرّح به.
              أي استخدام غير مرخّص يعرّض المستخدم للمساءلة القانونية.
            </p>
          </section>

          <section>
            <h2 className="text-gold-matte text-xl font-bold mb-3 font-cairo">
              الحصول على ترخيص استخدام
            </h2>
            <p>
              للحصول على ترخيص استخدام أي من صور أو مقاطع الموقع لأغراض
              تسويقية، إعلامية، أو تحريرية، يرجى التواصل معنا مباشرة عبر:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-1 marker:text-gold-highlight">
              <li>
                البريد الإلكتروني: <span dir="ltr">info@keifaldiafa.com</span>
              </li>
              <li>
                واتساب: <span dir="ltr">+966 50 825 2134</span>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gold-highlight underline hover:opacity-80 transition-opacity"
                >
                  صفحة التواصل الرسمية
                </Link>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-gold-matte text-xl font-bold mb-3 font-cairo">
              العلامة التجارية
            </h2>
            <p>
              «كيف الضيافة» و«Keif Al-Diafa» علامات تجارية للشركة.
              الشعار وهوية العلامة البصرية محمية ومسجّلة، ويُمنع استخدامها إلا بإذن رسمي.
            </p>
          </section>

          <section>
            <h2 className="text-gold-matte text-xl font-bold mb-3 font-cairo">
              التواصل القانوني
            </h2>
            <p>
              لأي استفسار قانوني، طلب ترخيص، أو الإبلاغ عن استخدام غير مصرّح به،
              يرجى مراسلتنا على <span dir="ltr">info@keifaldiafa.com</span>
              أو زيارة{" "}
              <Link href="/contact" className="text-gold-highlight underline hover:opacity-80">
                صفحة التواصل
              </Link>
              .
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-xs text-[#F5F5DC]/40 text-center">
          آخر تحديث: {year} · كيف الضيافة للأفراح والمناسبات · جدة، المملكة العربية السعودية
        </div>
      </div>
    </main>
  );
}
