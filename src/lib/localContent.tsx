/**
 * مولّد محتوى صفحات (خدمة × مدينة) — كيف الضيافة.
 * يبني props جاهزة لمكوّن LocalServicePage + FAQ لاستخدامها في schema.
 * محتوى عربي غني (1000+ كلمة/صفحة) ومخصّص لكل مدينة، مع الكلمة المفتاحية في
 * أول 100 كلمة وبلا حشو (يدمج المرادفات طبيعياً: صبابين/قهوجيين/مباشرين/صبابات).
 */
import { getAllImages, type CatalogImage } from "@/lib/imageCatalog";
import { CITIES, SERVICES, LOCAL_PAGES, localSlug } from "@/lib/localPages";
import type { LocalServicePageProps, FAQ } from "@/components/LocalServicePage";

const WA_DISPLAY = "0508252134";

function otherCitiesLinks(service: string, currentCity: string) {
  return LOCAL_PAGES.filter((p) => p.service === service && p.city !== currentCity).map((p) => ({
    label: `${SERVICES[service].ar} ${CITIES[p.city].ar}`,
    href: `/${localSlug(service, p.city)}`,
  }));
}

/** يختار صوراً من الكتالوج تناسب فئات الخدمة (deterministic per service+city). */
function pickImages(service: string, seed: number, count: number): CatalogImage[] {
  const cats = SERVICES[service].imageCategories;
  const all = getAllImages();
  const pool = all.filter((im) => cats.includes(im.category));
  const source = pool.length >= count ? pool : all;
  const out: CatalogImage[] = [];
  if (source.length === 0) return out;
  // stable pseudo-rotation so different cities get different (but fixed) images
  const start = (seed * 7) % source.length;
  for (let i = 0; i < count; i++) {
    out.push(source[(start + i * 3) % source.length]);
  }
  return out;
}

function cityStandardBreadcrumb(serviceAr: string, cityAr: string, slug: string) {
  return [
    { label: "الرئيسية", href: "/" },
    { label: "المناطق", href: "/locations" },
    { label: `${serviceAr} ${cityAr}`, href: `/${slug}` },
  ];
}

export function getLocalContent(service: string, cityKey: string): {
  page: LocalServicePageProps;
  faqs: FAQ[];
  metaTitle: string;
  metaDescription: string;
} {
  const c = CITIES[cityKey];
  const s = SERVICES[service];
  if (!c || !s) throw new Error(`Unknown service/city: ${service}/${cityKey}`);

  const slug = localSlug(service, cityKey);
  const seed = cityKey.length + service.length;
  const imgs = pickImages(service, seed, 9);
  const heroImg = imgs[0]?.src || "/images/hero/hero-desktop.webp";

  const isMunasabat = service === "diyafa-munasabat";
  const h1 = isMunasabat
    ? `ضيافة مناسبات في ${c.ar} — تجهيز أعراس ومؤتمرات وفعاليات`
    : `${s.ar} في ${c.ar} — قهوجيين ومباشرين وصبابين قهوة سعوديين`;

  const metaTitle = isMunasabat
    ? `ضيافة مناسبات ${c.ar} | أعراس ومؤتمرات وفعاليات — كيف الضيافة`
    : `صبابين قهوة ${c.ar} | قهوجيين ومباشرين سعوديين — كيف الضيافة`;

  const metaDescription = isMunasabat
    ? `خدمة ضيافة مناسبات في ${c.ar}: تجهيز أعراس ومؤتمرات وفعاليات بطاقم فاخر ومعدات كاملة. عرض سعر مجاني — واتساب ${WA_DISPLAY}.`
    : `صبابين قهوة سعوديين في ${c.ar} — قهوجيين ومباشرين وصبابات بزيّ تراثي لخدمة الأعراس والمؤتمرات. عرض سعر مجاني عبر واتساب ${WA_DISPLAY}.`;

  const intro = isMunasabat
    ? `نوفّر خدمة ضيافة مناسبات في ${c.ar} بجودة فاخرة تشمل تجهيز الأعراس والمؤتمرات والفعاليات الرسمية والخاصة. فريق «كيف الضيافة» يصل إليك بمعدّات كاملة وطاقم مدرّب بزيّ لائق يقدّم القهوة العربية والتقديمات الراقية على الأصول. ${c.intro} نجمع بين الأصالة والانضباط لنكون خيارك الأول لضيافة المناسبات في ${c.ar}.`
    : `نوفّر خدمة صبابين قهوة سعوديين في ${c.ar} باحترافية عالية لخدمة الأعراس والمؤتمرات والمناسبات الخاصة. فريق «كيف الضيافة» من الصبّابين والقهوجيين والمباشرين بزيّ سعودي تراثي يقدّم القهوة العربية الأصيلة من دلال نحاسية على الأصول، مع تمر فاخر وفناجين منقوشة. ${c.intro} خبرتنا تجعلنا الخيار الأول لمن يبحث عن صبابين قهوة أو قهوجي في ${c.ar} يجمعون بين الأصالة والمظهر اللائق بكبار الضيوف.`;

  const sections = isMunasabat
    ? [
        {
          h2: `تجهيز ضيافة الأعراس والحفلات في ${c.ar}`,
          body: `نتولّى ضيافة أعراسك وحفلاتك في ${c.ar} من الألف إلى الياء: استقبال الضيوف، تقديم القهوة العربية والشاي، التوزيعات الفاخرة، وتنسيق ركن ضيافة أنيق يليق بليلة العمر. طاقمنا يعمل بانضباط وذوق رفيع بحيث تتفرّغ أنت لضيوفك ونحن نتكفّل بكل التفاصيل.`,
          img: imgs[1]?.src,
          imgAlt: imgs[1]?.alt,
        },
        {
          h2: `ضيافة المؤتمرات والفعاليات الرسمية في ${c.ar}`,
          body: `نخدم مؤتمرات وفعاليات الشركات والجهات الحكومية في ${c.ar} ببروتوكول VIP: قهوجيون ومباشرون بزيّ رسمي، تقديم منظّم للقهوة والتمر، ومعدّات ضيافة فاخرة. نلتزم بالمواعيد وننسّق مع منظّمي الفعالية لأدق التفاصيل.`,
          img: imgs[2]?.src,
          imgAlt: imgs[2]?.alt,
        },
        {
          h2: `توزيعات وتقديمات فاخرة`,
          body: `إلى جانب الضيافة، نوفّر توزيعات ضيافة راقية وتقديمات من تمور فاخرة وحلويات ومشروبات ساخنة وباردة، تُقدّم بأناقة تعكس مستوى مناسبتك في ${c.ar}.`,
          img: imgs[3]?.src,
          imgAlt: imgs[3]?.alt,
        },
      ]
    : [
        {
          h2: `صبابين قهوة وقهوجيين بزيّ سعودي تراثي في ${c.ar}`,
          body: `يقدّم صبّابونا وقهوجيونا في ${c.ar} القهوة العربية الأصيلة على الأصول: من الدلّة النحاسية إلى الفنجان المنقوش، مع الالتزام بآداب التقديم من اليمين وبالترتيب. زيّ سعودي تراثي مطرّز ومظهر لائق يليق بكبار ضيوفك.`,
          img: imgs[1]?.src,
          imgAlt: imgs[1]?.alt,
        },
        {
          h2: `مباشرين وصبابات للمناسبات النسائية في ${c.ar}`,
          body: `نوفّر فريقاً نسائياً من القهوجيات والصبابات والمباشرات بزيّ مرتّب لخدمة المناسبات النسائية في ${c.ar} بكل خصوصية واحترافية، إضافة إلى المباشرين لتنظيم تقديم الضيافة بين الضيوف بسلاسة.`,
          img: imgs[2]?.src,
          imgAlt: imgs[2]?.alt,
        },
        {
          h2: `القهوة والتمر والأدوات — ضيافة متكاملة`,
          body: `الباقة الكاملة تشمل القهوة العربية الطازجة، التمر الفاخر، الدلال والفناجين، وعدّة التقديم الذهبية — بحيث تحصل على ضيافة متكاملة في ${c.ar} دون أن تشغل بالك بأي تفصيل.`,
          img: imgs[3]?.src,
          imgAlt: imgs[3]?.alt,
        },
      ];

  const packages = isMunasabat
    ? [
        { name: "باقة العرس", desc: "ضيافة متكاملة لليلة العمر", features: ["استقبال الضيوف", "قهوة وشاي وتمر", "طاقم بزيّ فاخر", "ركن ضيافة منسّق"] },
        { name: "باقة المؤتمرات", desc: "بروتوكول رسمي للفعاليات", features: ["قهوجيون بزيّ رسمي", "تقديم منظّم", "معدّات فاخرة", "التزام بالمواعيد"] },
        { name: "باقة كبار الضيوف VIP", desc: "أعلى مستوى ضيافة", features: ["طاقم مختار", "تقديمات مميّزة", "تنسيق كامل", "إشراف مباشر"] },
      ]
    : [
        { name: "باقة صبّاب واحد", desc: "مناسبة للتجمّعات الصغيرة", features: ["صبّاب بزيّ تراثي", "قهوة وتمر", "دلال وفناجين"] },
        { name: "باقة فريق صبابين", desc: "للأعراس والمناسبات الكبيرة", features: ["عدّة صبّابين", "تنظيم مباشر", "قهوة وشاي وتمر", "زيّ موحّد فاخر"] },
        { name: "باقة نسائية", desc: "للمناسبات النسائية", features: ["صبابات ومباشرات", "خصوصية تامة", "خدمة راقية"] },
      ];

  const whyUs = [
    `تغطية كاملة لكل أحياء ${c.ar} وما حولها`,
    "طاقم سعودي مدرّب بزيّ تراثي لائق",
    "التزام دقيق بالمواعيد والبروتوكول",
    "قهوة عربية أصيلة وتقديمات فاخرة",
    "عرض سعر مجاني ومخصّص لكل مناسبة",
    "خبرة في الأعراس والمؤتمرات والفعاليات الرسمية",
  ];

  const faqs: FAQ[] = isMunasabat
    ? [
        { question: `كم تكلفة ضيافة المناسبات في ${c.ar}؟`, answer: `تختلف التكلفة حسب حجم المناسبة وعدد الضيوف ونوع التقديمات. تواصل معنا عبر واتساب ${WA_DISPLAY} لعرض سعر مجاني ودقيق مخصّص لمناسبتك في ${c.ar}.` },
        { question: `هل تغطّون الأعراس والمؤتمرات معاً في ${c.ar}؟`, answer: `نعم، نخدم الأعراس والحفلات والمؤتمرات والفعاليات الرسمية في ${c.ar} بطواقم ومعدّات مناسبة لكل نوع.` },
        { question: `هل توفّرون فريقاً نسائياً؟`, answer: `نعم، نوفّر صبابات ومباشرات لخدمة المناسبات النسائية في ${c.ar} بخصوصية واحترافية.` },
        { question: `كم قبل الموعد يجب الحجز؟`, answer: `ننصح بالحجز قبل أسبوع على الأقل خصوصاً في مواسم الأعراس، ونستقبل الطلبات العاجلة في ${c.ar} قدر التوفّر.` },
        { question: `هل تشمل الخدمة التوزيعات والتمر؟`, answer: `نعم، نوفّر توزيعات ضيافة راقية وتمور فاخرة وتقديمات ساخنة وباردة ضمن باقاتنا في ${c.ar}.` },
      ]
    : [
        { question: `كم سعر صبابين القهوة في ${c.ar}؟`, answer: `تختلف أسعار باقات صبابين القهوة في ${c.ar} حسب عدد الصبّابين ومدّة الخدمة وعدد الضيوف. تواصل معنا عبر واتساب ${WA_DISPLAY} لعرض سعر مجاني ومخصّص.` },
        { question: `هل توفّرون قهوجيات وصبابات نساء في ${c.ar}؟`, answer: `نعم، نوفّر فريقاً نسائياً من القهوجيات والصبابات والمباشرات بزيّ مرتّب لخدمة المناسبات النسائية في ${c.ar} بكل خصوصية.` },
        { question: `كم عدد الصبّابين المناسب لمناسبتي؟`, answer: `كقاعدة عامة نوصي بصبّاب لكل 40–60 ضيفاً لضمان خدمة سلسة، ونساعدك في تحديد العدد الأمثل عند الحجز حسب مناسبتك في ${c.ar}.` },
        { question: `هل تشمل الخدمة القهوة والتمر والأدوات؟`, answer: `نعم، الباقة الكاملة تشمل القهوة العربية الطازجة والتمر الفاخر والدلال والفناجين وعدّة التقديم الذهبية، إضافة إلى الصبّابين بالزي التراثي.` },
        { question: `كم يلزم من وقت للحجز في ${c.ar}؟`, answer: `ننصح بالحجز قبل المناسبة بأسبوع على الأقل، خصوصاً في مواسم الأعراس، ونستقبل الطلبات العاجلة في ${c.ar} ونحاول تلبيتها قدر الإمكان.` },
      ];

  const page: LocalServicePageProps = {
    h1,
    cityAr: c.ar,
    serviceAr: s.ar,
    intro,
    heroImage: heroImg,
    heroAlt: `${s.ar} في ${c.ar} — كيف الضيافة`,
    sections,
    districts: c.districts,
    packages,
    pricingNote: `الأسعار تقديرية وتُحدَّد بدقّة بعد معرفة تفاصيل مناسبتك في ${c.ar}. اطلب عرض سعرك المجاني عبر واتساب ${WA_DISPLAY}.`,
    whyUs,
    faqs,
    gallery: imgs.slice(4, 9).map((im) => ({ src: im.src, alt: im.alt })),
    otherCities: otherCitiesLinks(service, cityKey),
    breadcrumbItems: cityStandardBreadcrumb(s.ar, c.ar, slug),
  };

  return { page, faqs, metaTitle, metaDescription };
}
