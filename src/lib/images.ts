/**
 * Centralized image path constants for the Keif Al-Diafa website.
 * All images are served locally from public/images/.
 *
 * Sources:
 *   - https://github.com/moain2026/img (High-res hero images 3168px)
 *   - https://github.com/moain2026/allimg (Offerings category images)
 *   - https://github.com/moain2026/img_kef_updated (235 service/event images)
 *
 * Structure:
 *   hero/              → 2 high-res images (desktop + mobile)
 *   hot-drinks/        → 7 images (hot beverages)
 *   cold-drinks/       → 8 images (cold beverages)
 *   dates/             → 12 images (premium dates)
 *   sweets/            → 6 images (desserts)
 *   pastry/            → 5 images (pastries)
 *   serving-equipment/ → 10 images (serving equipment)
 *   events/            → 82 images (all Event photos)
 *   weddings/          → 18 images (all Wedding photos)
 *   distributions/     → 5 images
 *   equipment/         → 21 images
 *   partners/          → 36 logos
 *   services/male/hosts/{hizam,dagla,dagla-janbiya,sideriya,makkawi}
 *   services/male/{safarjia,sawas,souqiya}
 *   services/female/
 *   services/artistic/{artist,folkband,heritage-tent,counter,photo-booth,buffet,mobile-table}
 */

// ═══════════════════════════════════════════════════════════════
// HERO IMAGES (High-res 3168px from moain2026/img)
// ═══════════════════════════════════════════════════════════════
export const HERO_IMAGES = {
  desktop: "/images/hero/hero-desktop.webp",
  mobile: "/images/hero/hero-mobile.webp",
};

// ═══════════════════════════════════════════════════════════════
// OFFERINGS — HOT DRINKS (7 images from moain2026/allimg)
// ═══════════════════════════════════════════════════════════════
export const HOT_DRINKS_IMAGES = {
  sahlab: "/images/hot-drinks/sahlab.webp",
  redTea: "/images/hot-drinks/red-tea.webp",
  greenTea: "/images/hot-drinks/green-tea.webp",
  karakTea: "/images/hot-drinks/karak-tea.webp",
  gingerPineapple: "/images/hot-drinks/ginger-pineapple.webp",
  turkishCoffee: "/images/hot-drinks/turkish-coffee.webp",
  cappuccino: "/images/hot-drinks/cappuccino.webp",
};

// ═══════════════════════════════════════════════════════════════
// OFFERINGS — COLD DRINKS (8 images, kept from original)
// ═══════════════════════════════════════════════════════════════
export const COLD_DRINKS_IMAGES = {
  freshJuice: "/images/cold-drinks/fresh-juice.webp",
  mojito: "/images/cold-drinks/mojito.webp",
  arakSous: "/images/cold-drinks/arak-sous.webp",
  karkade: "/images/cold-drinks/karkade.webp",
  tamarind: "/images/cold-drinks/tamarind.webp",
  sobia: "/images/cold-drinks/sobia.webp",
  smoothie: "/images/cold-drinks/smoothie.webp",
  icedLatte: "/images/cold-drinks/iced-latte.webp",
};

// ═══════════════════════════════════════════════════════════════
// OFFERINGS — DATES (12 images from moain2026/allimg)
// ═══════════════════════════════════════════════════════════════
export const DATES_IMAGES = {
  datesAssorted: "/images/dates/dates-assorted.webp",
  khalasSesame: "/images/dates/khalas-sesame-tahini.webp",
  khalasStuffed: "/images/dates/khalas-stuffed.webp",
  sukariStuffed: "/images/dates/sukari-stuffed.webp",
  stuffedDates2: "/images/dates/stuffed-dates-2.webp",
  stuffedDates3: "/images/dates/stuffed-dates-3.webp",
  stuffedDates5: "/images/dates/stuffed-dates-5.webp",
  stuffedDates: "/images/dates/stuffed-dates.webp",
  datesPlain: "/images/dates/dates-plain.webp",
  palmKhalasStuffed: "/images/dates/palm-khalas-stuffed.webp",
  palmSukari: "/images/dates/palm-sukari.webp",
  palmSukariStuffed: "/images/dates/palm-sukari-stuffed.webp",
};

// ═══════════════════════════════════════════════════════════════
// OFFERINGS — SWEETS (6 original + 5 new luxury dessert buffet photos)
// ═══════════════════════════════════════════════════════════════
export const SWEETS_IMAGES = {
  pancake: "/images/sweets/pancake.webp",
  baklava: "/images/sweets/baklava.webp",
  patchiChocolate: "/images/sweets/patchi-chocolate.webp",
  bostaniChocolate: "/images/sweets/bostani-chocolate.webp",
  chocolateCroissant: "/images/sweets/chocolate-croissant.webp",
  kunafa: "/images/sweets/kunafa.webp",
  // New (Phase E2): luxury dessert buffet photos for hero/showcase use
  dessertBuffetShooters: "/images/sweets/saudi-luxury-dessert-buffet-mini-cakes-shooters.webp",
  fruitBaklavaPlatter: "/images/sweets/saudi-fruit-platter-baklava-pistachio-dessert.webp",
  dessertStationMousse: "/images/sweets/saudi-luxury-dessert-station-fruit-mousse-cups.webp",
  pannaCottaBuffet: "/images/sweets/saudi-elegant-dessert-buffet-panna-cotta-shooters.webp",
  freshFruitDessertStation: "/images/sweets/saudi-luxury-dessert-station-fresh-fruit-mix.webp",
  // New (client-supplied real photos, optimised to WebP): luxury dessert buffet shots
  chocolateMousseBasbousaBuffet: "/images/sweets/saudi-luxury-dessert-buffet-chocolate-mousse-basbousa.webp",
  baklavaKunafaFruitPlatter: "/images/sweets/saudi-traditional-baklava-kunafa-pistachio-fruit-platter.webp",
  mangoPannaCottaRedVelvetStation: "/images/sweets/saudi-elegant-dessert-station-mango-panna-cotta-red-velvet.webp",
};

// ═══════════════════════════════════════════════════════════════
// OFFERINGS — PASTRY (5 images from moain2026/allimg)
// ═══════════════════════════════════════════════════════════════
export const PASTRY_IMAGES = {
  samosa: "/images/pastry/samosa.webp",
  fruitPie: "/images/pastry/fruit-pie.webp",
  arabicPastry: "/images/pastry/arabic-pastry.webp",
  assortedPastry: "/images/pastry/assorted-pastry.webp",
  appetizers: "/images/pastry/appetizers.webp",
};

// ═══════════════════════════════════════════════════════════════
// OFFERINGS — SNACKS (10 unique high-quality images, Saudi SEO-named)
// Each snack type has its own professional photo (1100px webp, ~80-135KB)
// ═══════════════════════════════════════════════════════════════
export const SNACKS_IMAGES = {
  miniPizza: "/images/snacks/saudi-mini-margherita-pizza-luxury-catering-finger-food.webp",
  nachos: "/images/snacks/saudi-loaded-nachos-cheese-jalapeno-vip-snacks.webp",
  potatoWedges: "/images/snacks/saudi-crispy-golden-potato-wedges-rosemary-catering.webp",
  springRoll: "/images/snacks/saudi-crispy-spring-rolls-sweet-chili-luxury-snacks.webp",
  chickenPops: "/images/snacks/saudi-crispy-chicken-popcorn-bites-honey-mustard.webp",
  croquette: "/images/snacks/saudi-golden-potato-cheese-croquettes-luxury-catering.webp",
  fingerFood: "/images/snacks/saudi-gourmet-finger-food-assortment-canapes-vip.webp",
  miniBurger: "/images/snacks/saudi-mini-beef-sliders-cheese-luxury-catering.webp",
  cheeseStick: "/images/snacks/saudi-crispy-mozzarella-cheese-sticks-marinara-snacks.webp",
  bruschetta: "/images/snacks/saudi-italian-bruschetta-tomato-basil-luxury-appetizer.webp",
};

// ═══════════════════════════════════════════════════════════════
// OFFERINGS — SANDWICHES (7 unique source images, one per product)
// Visually matched to closest sandwich type based on filling/bread
// ═══════════════════════════════════════════════════════════════
export const SANDWICHES_IMAGES = {
  grilledChicken: "/images/sandwiches/saudi-catering-grilled-chicken-sandwich-lettuce-cheese.webp",
  turkeySandwich: "/images/sandwiches/saudi-catering-turkey-sandwich-soft-roll-tomato.webp",
  tunaSandwich: "/images/sandwiches/saudi-catering-tuna-sandwich-sesame-bun.webp",
  clubSandwich: "/images/sandwiches/saudi-catering-tuna-salad-sandwich-long-roll.webp",
  grilledHalloumi: "/images/sandwiches/saudi-catering-chicken-cheese-sandwich-long-roll.webp",
  coldCuts: "/images/sandwiches/saudi-catering-turkey-cheese-tomato-long-sandwich.webp",
  smokedSalmon: "/images/sandwiches/saudi-catering-smoked-turkey-cheese-tomato-sandwich.webp",
};

// ═══════════════════════════════════════════════════════════════
// OFFERINGS — FRUITS (10 unique source images, one per product)
// Real, copyright-safe photos (Pexels / Wikimedia / PICRYL / Pixnio /
// Freerange / Public-Domain). Optimised to WebP (~1200px wide, <250KB).
// ═══════════════════════════════════════════════════════════════
export const FRUITS_IMAGES = {
  strawberry: "/images/fruits/saudi-fresh-strawberries-luxury-hospitality-fruit.webp",
  grapes: "/images/fruits/saudi-red-green-grapes-premium-catering-fruit.webp",
  mango: "/images/fruits/saudi-fresh-mango-cubes-luxury-hospitality-fruit.webp",
  pineapple: "/images/fruits/saudi-fresh-pineapple-slices-premium-catering-fruit.webp",
  kiwi: "/images/fruits/saudi-fresh-sliced-kiwi-luxury-hospitality-fruit.webp",
  mixedBerries: "/images/fruits/saudi-mixed-berries-bowl-premium-catering-fruit.webp",
  watermelon: "/images/fruits/saudi-carved-watermelon-vip-event-fruit-display.webp",
  figs: "/images/fruits/saudi-fresh-figs-luxury-hospitality-fruit.webp",
  pomegranate: "/images/fruits/saudi-fresh-pomegranate-premium-catering-fruit.webp",
};

// ═══════════════════════════════════════════════════════════════
// OFFERINGS — NUTS (10 NOIX premium nut products — top picks from 17)
// All photos are NOIX-branded premium nut/granola products
// (cinnamon nuts, salted caramel, zaatar, granola mixes, etc.)
// ═══════════════════════════════════════════════════════════════
export const NUTS_IMAGES = {
  premiumMix: "/images/nuts/saudi-super-q-granola-mixed-nuts-oats-luxury.webp",
  roastedHazelnut: "/images/nuts/saudi-roasted-hazelnut-zaatar-nuts-noix-premium.webp",
  roastedAlmonds: "/images/nuts/saudi-cinnamon-roasted-nuts-noix-premium-luxury.webp",
  royalCashew: "/images/nuts/saudi-cinnamon-nuts-noix-luxury-hospitality-display.webp",
  pistachio: "/images/nuts/saudi-zaatar-granola-noix-luxury-arabian-flavor.webp",
  walnut: "/images/nuts/saudi-noix-fine-food-chocolate-butter-granola-trio.webp",
  pineNuts: "/images/nuts/saudi-noix-luxury-granola-zaatar-cinnamon-nuts-range.webp",
  macadamia: "/images/nuts/saudi-salted-caramel-nuts-noix-luxury-premium.webp",
  roastedPecan: "/images/nuts/saudi-salted-caramel-granola-noix-premium.webp",
  saltedPeanuts: "/images/nuts/saudi-noix-granola-premium-mixed-nuts-collage.webp",
};

// ═══════════════════════════════════════════════════════════════
// OFFERINGS — SERVING EQUIPMENT (10 images from moain2026/allimg)
// ═══════════════════════════════════════════════════════════════
export const SERVING_EQUIPMENT_IMAGES = {
  coffeeCups: "/images/serving-equipment/coffee-cups.webp",
  coffeeDallah: "/images/serving-equipment/coffee-dallah.webp",
  goldenDallah: "/images/serving-equipment/golden-dallah.webp",
  coffeeFinjan: "/images/serving-equipment/coffee-finjan.webp",
  glassCup: "/images/serving-equipment/glass-cup.webp",
  coffeeGlass: "/images/serving-equipment/coffee-glass.webp",
  teaCup: "/images/serving-equipment/tea-cup.webp",
  whiteTeaCup: "/images/serving-equipment/white-tea-cup.webp",
  glassTeaCup: "/images/serving-equipment/glass-tea-cup.webp",
  coffeeMug: "/images/serving-equipment/coffee-mug.webp",
};

// ═══════════════════════════════════════════════════════════════
// EVENT IMAGES (82 photos)
// ═══════════════════════════════════════════════════════════════
export const EVENT_IMAGES = [
  "/images/events/saudi-event-vip-reception-luxury-catering-majlis-traditional-attire.webp",
  "/images/events/ksa-event-qahwa-service-hospitality-staff-arabic-coffee-ceremony.webp",
  "/images/events/formal-reception-indoor-event-saudi-hosts-luxury-catering.webp",
  "/images/events/official-ceremony-saudi-hosts-traditional-attire-vip-reception.webp",
  "/images/events/majlis-qahwa-service-saudi-event-camel-decor.webp",
  "/images/events/saudi-event-vip-arabic-coffee-ceremony-camel-decor-indoor.webp",
  "/images/events/corporate-event-hospitality-staff-formal-reception-saudi-hosts.webp",
  "/images/events/conference-catering-saudi-hosts-vip-reception-dallah-albaraka.webp",
  "/images/events/ksa-event-qahwa-service-corporate-event-tawkeel.webp",
  "/images/events/luxury-catering-arabic-coffee-ceremony-gala-dinner-indoor.webp",
  "/images/events/saudi-event-qahwa-service-hospitality-staff-exhibition-booth.webp",
  "/images/events/ksa-event-arabic-coffee-ceremony-masked-host-exhibition.webp",
  "/images/events/indoor-event-traditional-attire-ceremonial-coffee-female-guest.webp",
  "/images/events/conference-catering-hospitality-staff-medical-college-exhibition.webp",
  "/images/events/official-ceremony-hospitality-staff-umm-al-qura-exhibition.webp",
  "/images/events/corporate-event-qahwa-service-luxury-catering-basma-emaar.webp",
  "/images/events/luxury-catering-saudi-hosts-glory-of-luxury-indoor-event.webp",
  "/images/events/ksa-event-vip-reception-arabic-coffee-flyadeal-corporate.webp",
  "/images/events/government-event-hospitality-staff-ceremonial-coffee-ministry-transport.webp",
  "/images/events/saudi-event-luxury-catering-hospitality-staff-saja-exhibition.webp",
  "/images/events/saudi-event-vip-reception-bolt-exhibition-qahwa-service.webp",
  "/images/events/ksa-event-corporate-event-takween-al-watan-ceremonial-coffee.webp",
  "/images/events/exhibition-saudi-hosts-amak-minerals-arabic-coffee-ceremony.webp",
  "/images/events/jeddah-event-formal-reception-private-aviation-qahwa-service.webp",
  "/images/events/corporate-event-vip-reception-dallah-albaraka-ceremonial-coffee.webp",
  "/images/events/government-event-official-ceremony-madinah-municipality-arabic-coffee.webp",
  "/images/events/ksa-event-exhibition-hafil-pink-luxury-catering.webp",
  "/images/events/vip-reception-corporate-event-aljar-marina-qahwa-service.webp",
  "/images/events/exhibition-saudi-event-nayifat-financing-ceremonial-coffee.webp",
  "/images/events/indoor-event-saudi-hosts-bisht-qahwa-service-traditional.webp",
  "/images/events/saudi-event-vip-reception-aviation-booth-arabic-coffee-ceremony.webp",
  "/images/events/corporate-event-formal-reception-umm-al-qura-university-saudi-hosts.webp",
  "/images/events/exhibition-hospitality-rawahil-al-mashaer-arabic-coffee-ceremony.webp",
  "/images/events/indoor-event-exhibition-york-booth-qahwa-service.webp",
  "/images/events/conference-catering-saudi-electricity-company-dates-tray-luxury.webp",
  "/images/events/corporate-event-vip-suzuki-showroom-arabic-coffee-ceremony.webp",
  "/images/events/formal-reception-hospitality-staff-york-arabic-coffee-ceremony.webp",
  "/images/events/majlis-traditional-attire-dates-tower-ceremonial-coffee-display.webp",
  "/images/events/government-event-official-ceremony-saudi-electricity-luxury-catering.webp",
  "/images/events/corporate-event-indoor-cybersecurity-awareness-ceremonial-coffee.webp",
  "/images/events/saudi-event-vip-reception-makkah-halal-forum-coffee-lounge.webp",
  "/images/events/corporate-event-saudi-host-qahwa-office-reception-traditional.webp",
  "/images/events/qahwa-service-bon-cafe-arabic-coffee-ceremony-corporate.webp",
  "/images/events/formal-reception-saudi-hosts-al-amjaad-office-traditional.webp",
  "/images/events/luxury-catering-foot-locker-sneaker-host-ceremonial.webp",
  "/images/events/official-ceremony-grand-opening-saudi-hosts-red-backdrop.webp",
  "/images/events/exhibition-vip-reception-foot-locker-coffee-kiosk.webp",
  "/images/events/government-event-official-ceremony-saudi-hosts-grand-opening.webp",
  "/images/events/indoor-event-new-balance-foot-locker-coffee-booth.webp",
  "/images/events/vip-reception-luxury-catering-menswear-boutique-host.webp",
  "/images/events/saudi-event-vip-reception-suzuki-exhibition-arabic-coffee.webp",
  "/images/events/saudi-event-vip-reception-luxury-retail-traditional-attire.webp",
  "/images/events/saudi-event-corporate-al-safir-masked-hospitality.webp",
  "/images/events/ksa-event-exhibition-luxury-catering-food-booth-dates-tray.webp",
  "/images/events/riyadh-event-vip-reception-alinma-booth-ceremonial-coffee.webp",
  "/images/events/saudi-event-conference-catering-bci-counter-ceremonial-coffee.webp",
  "/images/events/jeddah-event-marble-hall-osus-alinsha-vip-reception.webp",
  "/images/events/outdoor-event-nahda-park-arabic-coffee-formal-reception.webp",
  "/images/events/indoor-event-luxury-catering-ceremonial-coffee-exhibition-reception.webp",
  "/images/events/gala-dinner-vip-reception-royal-protocol-marble-luxury.webp",
  "/images/events/saudi-event-hifawa-vip-traditional-attire-qahwa-service.webp",
  "/images/events/ksa-event-exhibition-dallah-albarka-dates-tray-ceremonial.webp",
  "/images/events/corporate-event-almana-medical-group-arabic-coffee-ceremony.webp",
  "/images/events/expo-jimny-ksa-club-saudi-hosts-gift-presentation.webp",
  "/images/events/government-event-ministry-of-media-official-ceremony.webp",
  "/images/events/hotel-event-dallah-taibah-luxury-catering-qahwa-service.webp",
  "/images/events/corporate-event-dallah-hajj-transport-ceremonial-coffee.webp",
  "/images/events/exhibition-alrifadah-pilgrims-services-arabic-coffee-ceremony.webp",
  "/images/events/marble-hall-makkah-hotel-towers-saudi-hosts-dates-tray.webp",
  "/images/events/ksa-event-official-ceremony-turkish-pilgrims-office-luxury.webp",
  "/images/events/saudi-event-vip-reception-arabic-coffee-masked-host-exhibition.webp",
  "/images/events/saudi-event-formal-reception-makkah-themed-exhibition.webp",
  "/images/events/saudi-event-conference-catering-dareen-travel-agency-indoor.webp",
  "/images/events/ksa-event-exhibition-hospitality-staff-hajj-conference.webp",
  "/images/events/saudi-hosts-ceremonial-coffee-expo-makkah-hotel-booth.webp",
  "/images/events/vip-reception-luxury-catering-millennium-hotels-golden-dallah.webp",
  "/images/events/corporate-event-exhibition-makkiyoon-traditional-attire-qahwa.webp",
  "/images/events/outdoor-event-tourism-booth-expo-saudi-host-coffee-set.webp",
  "/images/events/formal-reception-government-event-majad-booth-arabic-coffee.webp",
  "/images/events/exhibition-hospitality-staff-almadina-hotel-resorts-saudi-event.webp",
  "/images/events/royal-protocol-vip-reception-makkah-hotel-towers-majlis.webp",
  "/images/events/ksa-event-luxury-catering-mcdc-conference-ceremonial-coffee.webp",
];

// ═══════════════════════════════════════════════════════════════
// WEDDING IMAGES (18 photos)
// ═══════════════════════════════════════════════════════════════
export const WEDDING_IMAGES = [
  "/images/weddings/saudi-wedding-male-host-coffee-vip-wedding-hall.webp",
  "/images/weddings/saudi-wedding-male-host-dallah-dates-qahwa-station.webp",
  "/images/weddings/arab-wedding-male-host-qahwa-station-vip-wedding.webp",
  "/images/weddings/luxury-wedding-men-section-traditional-uniform-wedding-hall.webp",
  "/images/weddings/saudi-wedding-qahwa-station-dallah-white-thobe.webp",
  "/images/weddings/vip-wedding-traditional-uniform-dallah-wedding-hall.webp",
  "/images/weddings/jeddah-wedding-men-section-traditional-uniform-luxury-wedding.webp",
  "/images/weddings/riyadh-wedding-vip-wedding-hall-male-host.webp",
  "/images/weddings/arab-wedding-men-section-wedding-decoration-qahwa-station.webp",
  "/images/weddings/saudi-wedding-male-host-arabic-coffee-luxury-wedding.webp",
  "/images/weddings/saudi-wedding-men-section-male-host-dallah-traditional.webp",
  "/images/weddings/luxury-wedding-hall-male-hosts-dallah-gift-tray.webp",
  "/images/weddings/saudi-wedding-traditional-uniform-male-hosts-white-thobe.webp",
  "/images/weddings/wedding-coffee-male-host-dallah-tray-white-thobe.webp",
  "/images/weddings/qahwa-station-male-host-dallah-wedding-hall-ceremony.webp",
  "/images/weddings/saudi-wedding-vip-wedding-hall-host-dallah-flag.webp",
  "/images/weddings/luxury-wedding-decoration-male-hosts-traditional-uniform.webp",
  "/images/weddings/arab-wedding-hall-men-section-male-hosts-marble.webp",
];

// ═══════════════════════════════════════════════════════════════
// DISTRIBUTION IMAGES (5 photos)
// ═══════════════════════════════════════════════════════════════
export const DISTRIBUTION_IMAGES = [
  "/images/distributions/saudi-luxury-palm-date-sweets-distribution.webp",
  "/images/distributions/ksa-dates-arabic-sweets-gahwa-distribution.webp",
  "/images/distributions/saudi-vip-majlis-dates-gahwa-hospitality.webp",
  "/images/distributions/riyadh-luxury-hospitality-gift-tray-qahwa-ceremony.webp",
  "/images/distributions/jeddah-vip-dates-dessert-gahwa-gift-tray.webp",
];

// ═══════════════════════════════════════════════════════════════
// SERVICES — SAFARJIA
// ═══════════════════════════════════════════════════════════════
export const SAFARJIA_IMAGES = {
  mainBg: "/images/services/safarjia/safarjia-main-bg.webp",
  safarji1: "/images/services/safarjia/safarji-1.webp",
  safarji2: "/images/services/safarjia/safarji-2.webp",
  safarji3: "/images/services/safarjia/safarji-3.webp",
  safarji4: "/images/services/safarjia/safarji-4.webp",
};

// ═══════════════════════════════════════════════════════════════
// SERVICES — SAWAS
// ═══════════════════════════════════════════════════════════════
export const SAWAS_IMAGES = {
  mainBg: "/images/services/sawas/sawas-main.webp",
  style1: "/images/services/sawas/sawas-style-1.webp",
  style2: "/images/services/sawas/sawas-style-2.webp",
  style3: "/images/services/sawas/sawas-style-3.webp",
  style4: "/images/services/sawas/sawas-style-4.webp",
};

// ═══════════════════════════════════════════════════════════════
// SERVICES — FEMALE SERVICES
// ═══════════════════════════════════════════════════════════════
export const FEMALE_SERVICES_IMAGES = {
  mainBg: "/images/services/female-services/female-main-bg.webp",
  female1: "/images/services/female-services/female-1.webp",
  female2: "/images/services/female-services/female-2.webp",
  female3: "/images/services/female-services/female-3.webp",
  female4: "/images/services/female-services/female-4.webp",
  female5: "/images/services/female-services/female-5.webp",
  female6: "/images/services/female-services/female-6.webp",
  female7: "/images/services/female-services/female-7.webp",
  female8: "/images/services/female-services/female-8.webp",
};

// ═══════════════════════════════════════════════════════════════
// SERVICES — MALE
// ═══════════════════════════════════════════════════════════════
export const SERVICES_MALE = {
  hosts: {
    hizam: Array.from({ length: 2 }, (_, i) => `/images/services/male/hosts/hizam/hizam-${i + 1}.webp`),
    dagla: Array.from({ length: 6 }, (_, i) => `/images/services/male/hosts/dagla/dagla-${i + 1}.webp`),
    daglaJanbiya: Array.from({ length: 2 }, (_, i) => `/images/services/male/hosts/dagla-janbiya/dagla-janbiya-${i + 1}.webp`),
    sideriya: Array.from({ length: 3 }, (_, i) => `/images/services/male/hosts/sideriya/sideriya-${i + 1}.webp`),
    makkawi: Array.from({ length: 2 }, (_, i) => `/images/services/male/hosts/makkawi/makkawi-${i + 1}.webp`),
    // Convenience: first image of dagla for thumbnails
    main: "/images/services/male/hosts/dagla/dagla-1.webp",
  },
  safarjia: Array.from({ length: 6 }, (_, i) => `/images/services/male/safarjia/safarjia-${i + 1}.webp`),
  sawas: Array.from({ length: 5 }, (_, i) => `/images/services/male/sawas/sawas-${i + 1}.webp`),
  souqiya: Array.from({ length: 8 }, (_, i) => `/images/services/male/souqiya/souqiya-${i + 1}.webp`),
  souqiyaMain: "/images/services/male/souqiya/souqiya-1.webp",
};

// ═══════════════════════════════════════════════════════════════
// SERVICES — FEMALE
// ═══════════════════════════════════════════════════════════════


export const SERVICES_FEMALE_EXTENDED = {
  hostesses: Array.from({ length: 2 }, (_, i) => `/images/services/female/hostesses/hostess-${i + 1}.webp`),
  safarjiat: Array.from({ length: 2 }, (_, i) => `/images/services/female/safarjiat/safarjia-f-${i + 1}.webp`),
  cleaning: Array.from({ length: 2 }, (_, i) => `/images/services/female/cleaning/cleaning-f-${i + 1}.webp`),
};

// ═══════════════════════════════════════════════════════════════
// SERVICES — ARTISTIC
// ═══════════════════════════════════════════════════════════════
export const SERVICES_ARTISTIC = {
  artist: Array.from({ length: 11 }, (_, i) => `/images/services/artistic/artist/artist-${i + 1}.webp`),
  folkband: Array.from({ length: 2 }, (_, i) => `/images/services/artistic/folkband/folkband-${i + 1}.webp`),
  heritageTent: Array.from({ length: 4 }, (_, i) => `/images/services/artistic/heritage-tent/tent-${i + 1}.webp`),
  counter: Array.from({ length: 2 }, (_, i) => `/images/services/artistic/counter/counter-${i + 1}.webp`),
  photoBooth: Array.from({ length: 6 }, (_, i) => `/images/services/artistic/photo-booth/photo-booth-${i + 1}.webp`),
  buffet: Array.from({ length: 3 }, (_, i) => `/images/services/artistic/buffet/buffet-${i + 1}.webp`),
  mobileTable: Array.from({ length: 6 }, (_, i) => `/images/services/artistic/mobile-table/table-${i + 1}.webp`),
};

// ═══════════════════════════════════════════════════════════════
// EQUIPMENT IMAGES (21 photos)
// ═══════════════════════════════════════════════════════════════
export const EQUIPMENT_IMAGES = [
  "/images/equipment/saudi-luxury-ornate-tea-glass-golden-silver-hospitality.webp",
  "/images/equipment/saudi-arabic-coffee-emblem-handled-mug-golden-hospitality.webp",
  "/images/equipment/luxury-clear-ribbed-glass-cup-saucer-hospitality.webp",
  "/images/equipment/saudi-silver-dallah-serveware-luxury-hospitality.webp",
  "/images/equipment/luxury-clear-stemmed-goblet-glass-hospitality.webp",
  "/images/equipment/saudi-golden-striped-tea-cup-saucer-hospitality.webp",
  "/images/equipment/luxury-faceted-tea-cup-transparent-hospitality.webp",
  "/images/equipment/saudi-clear-cup-saucer-golden-stripes-hospitality.webp",
  "/images/equipment/royal-golden-dallah-coffee-pot-saudi-hospitality.webp",
  "/images/equipment/saudi-luxury-gold-rimmed-emblem-coffee-pot.webp",
  "/images/equipment/saudi-luxury-silver-dallah-arabic-coffee-equipment.webp",
  "/images/equipment/arabic-coffee-gahwa-ornate-glass-cup-set-equipment.webp",
  "/images/equipment/saudi-traditional-ribbed-glass-tea-cup-set.webp",
  "/images/equipment/luxury-saudi-white-coffee-cup-saucer.webp",
  "/images/equipment/saudi-gold-palm-gahwa-cups-set.webp",
  "/images/equipment/vip-saudi-golden-dallah-dates-table.webp",
  "/images/equipment/royal-saudi-gold-qahwa-dates-service.webp",
  "/images/equipment/jeddah-luxury-ornate-tea-cup-saucer.webp",
  "/images/equipment/saudi-hospitality-glass-tea-set-equipment.webp",
  "/images/equipment/traditional-saudi-clear-glass-qahwa-cup.webp",
  "/images/equipment/saudi-luxury-hospitality-white-porcelain-cup-saucer.webp",
  "/images/equipment/saudi-arabic-coffee-vip-golden-cup-stand-majlis.webp",
  "/images/equipment/ksa-luxury-qahwa-golden-glass-cup-stand-majlis.webp",
  "/images/equipment/saudi-vip-hospitality-golden-coffee-cup-stand-event.webp",
  "/images/equipment/riyadh-luxury-arabic-coffee-glass-cup-dessert-table.webp",
  "/images/equipment/ksa-golden-buffet-tray-glass-cups-hospitality.webp",
  "/images/equipment/jeddah-vip-majlis-golden-arabic-coffee-stand.webp",
  "/images/equipment/saudi-ceremonial-golden-tray-white-cups-hospitality.webp",
];

// ═══════════════════════════════════════════════════════════════
// CONVENIENCE SHORTCUTS — for quick access in components
// ═══════════════════════════════════════════════════════════════

/** Primary hero image (desktop) */
export const HERO_IMG = HERO_IMAGES.desktop;

/** Hero mobile image */
export const HERO_MOBILE_IMG = HERO_IMAGES.mobile;

/** Coffee / Safarjia */
export const COFFEE_IMG = SERVICES_MALE.safarjia[0];

/** Catering / Events */
export const CATERING_IMG = EVENT_IMAGES[2];

/** Tea / Offerings */
export const TEA_IMG = DISTRIBUTION_IMAGES[0];

/** Event photo */
export const EVENT_IMG = EVENT_IMAGES[0];

/** Waiter / Male hosts */
export const WAITER_IMG = SERVICES_MALE.hosts.main;

/** Equipment */
export const EQUIP_IMG = EQUIPMENT_IMAGES[0];

/** Gala / Large event */
export const GALA_IMG = EVENT_IMAGES[5];

/** Hotel / Hospitality */
export const HOTEL_IMG = EVENT_IMAGES[10];

/** Dates / Sweets */
export const DATES_IMG = DISTRIBUTION_IMAGES[1];

/** Food / General */
export const FOOD_IMG = DISTRIBUTION_IMAGES[2];

/** Portfolio showcase */
export const PORTFOLIO_IMG = EVENT_IMAGES[7];

/** Kitchen / Behind scenes */
export const KITCHEN_IMG = EQUIPMENT_IMAGES[5];

/** Team member placeholder */
export const TEAM_IMG = SERVICES_MALE.hosts.dagla[1];

/** Conference img */
export const CONF_IMG = EVENT_IMAGES[12];

// ═══════════════════════════════════════════════════════════════
// SERVICE-SPECIFIC IMAGES
// ═══════════════════════════════════════════════════════════════
export const SERVICE_IMAGES = {
  maleWaiter: SERVICES_MALE.hosts.main,
  zamzam: SERVICES_MALE.souqiyaMain,
  butler: SERVICES_MALE.safarjia[2],
  sawas: SAWAS_IMAGES.mainBg,
  hostess: FEMALE_SERVICES_IMAGES.mainBg,
  calligrapher: SERVICES_ARTISTIC.artist[0],
  artist: SERVICES_ARTISTIC.artist[1],
  folkband: SERVICES_ARTISTIC.folkband[0],
  heritageTent: SERVICES_ARTISTIC.heritageTent[0],
  counter: SERVICES_ARTISTIC.counter[0],
  photoBooth: SERVICES_ARTISTIC.photoBooth[0],
  buffet: SERVICES_ARTISTIC.buffet[0],
  mobileTable: SERVICES_ARTISTIC.mobileTable[0],
};

// ═══════════════════════════════════════════════════════════════
// OUTFIT IMAGES (for service detail modals)
// ═══════════════════════════════════════════════════════════════
export const OUTFIT_IMAGES = {
  hizam: SERVICES_MALE.hosts.hizam[0],
  dagla: SERVICES_MALE.hosts.dagla[0],
  daglaJanbiya: SERVICES_MALE.hosts.daglaJanbiya[0],
  sideriya: SERVICES_MALE.hosts.sideriya[0],
  makkawi: SERVICES_MALE.hosts.makkawi[0],
  souqiya: SERVICES_MALE.souqiya[0],
  female: FEMALE_SERVICES_IMAGES.mainBg,
  safarjia: SAFARJIA_IMAGES.mainBg,
  sawas: SAWAS_IMAGES.mainBg,
};
