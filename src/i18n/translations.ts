import type { PhotoName } from "../assets/images/optimized/manifest.ts";
import type { PhoneKind } from "../data/site.ts";
import { DAY_NAMES } from "./days.ts";

export const LANGS = ["el", "en"] as const;
export type Lang = (typeof LANGS)[number];
export const isLang = (value: unknown): value is Lang =>
  LANGS.includes(value as Lang);

/** Photos shown in the gallery (the hero's "bar-morning" crop is a detail of "bar-counter"). */
export type GalleryPhoto = Exclude<PhotoName, "bar-morning">;
interface PhotoText {
  caption: string;
  alt: string;
}

const joinList = (items: readonly string[], and: string) =>
  items.length < 2
    ? items.join("")
    : `${items.slice(0, -1).join(", ")} ${and} ${items[items.length - 1]}`;
const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

const enDays = DAY_NAMES.en;
const elDays = DAY_NAMES.el;

// Eyebrow labels are written in capitals by hand: CSS uppercasing keeps the Greek accents,
// which Greek typography drops in all-caps text.
const en = {
  meta: {
    title: "Vento Café Lamia — In Coffee We Trust",
    description:
      "Vento Café in Lamia since 2011: coffee, koulouri, cocktails and sports nights. Open every day from early morning until late evening, with delivery Monday to Saturday.",
  },
  a11y: {
    skip: "Skip to content",
    language: "Language",
    mainNav: "Main navigation",
    menu: "Menu",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    home: "Vento Café — back to top",
    newTab: "(opens in a new tab)",
    quickActions: "Quick actions",
  },
  nav: {
    story: "Story",
    drinks: "Coffee & Drinks",
    menu: "Menu",
    gallery: "Gallery",
    hours: "Hours",
    contact: "Contact",
    call: "Call",
    directions: "Directions",
  },
  days: enDays.long as readonly string[],
  daysShort: enDays.short as readonly string[],
  when: (daysAhead: number, day: number, time: string) =>
    daysAhead === 0
      ? `today at ${time}`
      : daysAhead === 1
        ? `tomorrow at ${time}`
        : `${enDays.on[day]} at ${time}`,
  status: {
    open: "Open now",
    closed: "Closed now",
    closesMidnight: "closes at 00:00",
    closesAt: (time: string) => `closes at ${time}`,
    closesIn: (minutes: number) => `closes in ${minutes} min`,
    opens: (when: string) => `opens ${when}`,
  },
  phoneKinds: { landline: "Landline", mobile: "Mobile" } satisfies Record<
    PhoneKind,
    string
  >,
  hero: {
    eyebrow: "LAMIA · SINCE 2011",
    logoAlt: "Vento Café — In Coffee We Trust",
    lead: "The first coffee of the day. The last drink of the night.",
    sub: "Open every day from early morning until late evening.",
    call: "Call us",
    directions: "Get directions",
    badge: "IN COFFEE WE TRUST · SINCE 2011 · ",
    mainPhotoAlt:
      "The counter at Vento: Edison bulbs hanging on ropes, pastries and koulouri, and the turquoise bar lettered “In Coffee We”",
    accentPhotoAlt:
      "A pink long drink in a cut-crystal glass and a dessert in a coupe on a silver tray",
    scroll: "Discover",
  },
  marquee: [
    "Espresso",
    "Freddo espresso",
    "Freddo cappuccino",
    "Cappuccino",
    "Koulouri",
    "Croissants",
    "Cocktails",
    "Sports nights",
    "In Coffee We Trust",
  ],
  story: {
    eyebrow: "OUR STORY",
    title: "Coffee first. Everything else after.",
    body: [
      "Since 2011, Vento has been a meeting point for those who appreciate great coffee and good company. Guided by our philosophy, “in coffee we trust”, we’ve become part of everyday life in Lamia, sharing in the little moments and the big memories alike.",
      "From the first espresso of the early morning to a refreshing freddo with friends and cocktails that set the mood for the evening, every moment at Vento has its own place.",
      "With a welcoming atmosphere, a spacious terrace to enjoy at any time of day, and the perfect setting to catch all the big sporting moments, Vento is more than just a place to grab a coffee.",
      "It’s where the day begins, friends come together, and moments are made worth coming back for.",
      "Vento. Where it all starts with a great coffee.",
    ],
    stats: {
      years: "years in Lamia",
      daysOpen: (count: number): string =>
        count === 7 ? "open every day" : "days a week",
      firstCoffee: (days: string) => `first coffee (${days})`,
      delivery: "delivery hours",
    },
    photoAlt:
      "Friends at terrace tables in the evening, beside a tree wrapped in string lights and planters of pink and red flowers",
    insetAlt:
      "Vento at night: the lit terrace and bar on the ground floor of a corner building",
  },
  drinks: {
    eyebrow: "COFFEE & DRINKS",
    title: "From the first espresso to the last cocktail.",
    intro: "Vento changes pace with the day — never its character.",
    from: (time: string) => `From ${time}`,
    until: (time: string, midnight: boolean) =>
      midnight ? "Until late evening" : `Until ${time}`,
    moments: {
      morning: {
        label: "Morning",
        title: "The morning ritual",
        text: "Espresso, cappuccino and freddo made just right, with koulouri, croissants and something sweet from the counter. In a hurry? We deliver, too.",
        tags: ["Espresso", "Freddo", "Cappuccino", "Koulouri"],
        alt: "Vento’s bar with hanging Edison bulbs, pastries on the counter and shelves of bottles behind",
      },
      afternoon: {
        label: "Afternoon",
        title: "Your afternoon coffee spot",
        text: "A long coffee with friends under the trees, something cold in the shade and the game on the screens — the kind of afternoon that drifts into evening.",
        tags: ["Freddo cappuccino", "Soft drinks", "Live sports"],
        alt: "Vento’s corner terrace at dusk, full of people under trees lit from below",
      },
      evening: {
        label: "Evening",
        title: "When the lights come on",
        text: "The bar takes over: cocktails, long drinks, a well-stocked back bar and good company until closing.",
        tags: ["Cocktails", "Long drinks", "Spirits"],
        alt: "Back-bar shelves lined with spirits in low evening light",
      },
    },
  },
  menu: {
    eyebrow: "MENU",
    title: "Something for every hour.",
    intro:
      "Coffee, soft drinks, crepes and waffles, snacks, beer and cocktails. All prices are in euros.",
    tabs: "Menu sections",
    free: "free",
  },
  gallery: {
    eyebrow: "GALLERY",
    title: "A glimpse of Vento",
    intro: "Inside and out, morning to night. Tap a photo to see it larger.",
    dialogLabel: "Photo gallery",
    open: (caption: string) => `View larger: ${caption}`,
    close: "Close",
    previous: "Previous photo",
    next: "Next photo",
    position: (index: number, total: number) => `Photo ${index} of ${total}`,
    photos: {
      "bar-counter": {
        caption: "Our turquoise bar — in coffee we trust.",
        alt: "Turquoise geometric-patterned bar lettered “In Coffee We Trust”, with Edison bulbs hanging on ropes and pastries on the counter",
      },
      "olive-terrace": {
        caption: "Evenings on the terrace, under the lit trees.",
        alt: "People chatting at terrace tables beside a tree wrapped in string lights, with planters of pink and red flowers in front",
      },
      "evening-drinks": {
        caption: "Cocktails and something sweet to end the day.",
        alt: "A pink long drink in a cut-crystal glass and a dessert in a coupe on a silver tray",
      },
      "back-bar": {
        caption: "A well-stocked back bar.",
        alt: "Shelves of spirits — gin, vodka, rum and whisky — lit from behind the bar",
      },
      "night-exterior": {
        caption: "Our corner after dark.",
        alt: "Vento at night: the lit terrace and bar on the ground floor of a corner building under a deep blue sky",
      },
      "dusk-corner": {
        caption: "Dusk on the terrace.",
        alt: "The corner building at dusk, with the Vento awning and a full wooden deck under uplit trees",
      },
      "pergola-night": {
        caption: "Full tables, good company.",
        alt: "A busy night under a covered terrace with climbing plants, lamp posts and flower planters",
      },
      "coffee-bar": {
        caption: "Where every coffee begins.",
        alt: "The coffee station: an espresso machine, stacks of cups and takeaway cups on the counter, and the Johann Jacobs Professional crest on a teal wall under a single Edison bulb",
      },
      crepes: {
        caption: "Crepes and waffles for a sweet tooth.",
        alt: "From above: a waffle drizzled with milk and white chocolate and topped with cookie crumbs, beside a folded crepe with chocolate and crushed biscuit",
      },
      matchday: {
        caption: "Match night on the big screen.",
        alt: "A full room watching a football match on the large projector screen, under hanging plants and Edison bulbs on ropes",
      },
      drinks: {
        caption: "A glass of wine and something to nibble.",
        alt: "A glass of white wine and a small teal bowl of mixed nuts on a wooden table, with the bar lights blurred behind",
      },
      delivery: {
        caption: "Your morning coffee, on its way.",
        alt: "Vento takeaway coffees with domed lids in a wooden cup holder on a delivery scooter",
      },
      "iced-coffee": {
        caption: "Iced coffee in the shade of the trees.",
        alt: "Two iced coffees with straws in Jacobs glasses, one black and one topped with milk foam, on a terrace table under a tree on a sunny day",
      },
      "white-wine": {
        caption: "White wine for two.",
        alt: "Two glasses of white wine on a dark table, with the bar’s lights and shelves blurred behind",
      },
    } satisfies Record<GalleryPhoto, PhotoText>,
  },
  hours: {
    eyebrow: "HOURS & DELIVERY",
    title: "Open every day.",
    intro:
      "Early mornings, late nights — and delivery from morning to evening.",
    tableCaption: "Opening and delivery hours by day",
    day: "Day",
    cafe: "Café",
    delivery: "Delivery",
    today: "Today",
    closed: "Closed",
    noDelivery: "No delivery",
    localTime: "Time in Lamia",
    legend: { cafe: "Café open", delivery: "Delivery", now: "Now" },
    dialLabel: (
      day: string,
      cafe: string | null,
      delivery: string | null,
      now: string,
    ) =>
      `${day}: café ${cafe ?? "closed"}${delivery ? `, delivery ${delivery}` : ", no delivery"}. Time in Lamia: ${now}.`,
    timezone: "All times are Greek local time.",
  },
  delivery: {
    eyebrow: "DELIVERY",
    title: "Your first coffee, delivered.",
    text: "Call us and we’ll bring your coffee — and something to go with it — straight to you.",
    openNow: (until: string) => `Delivery open now · until ${until}`,
    next: (when: string) => `Next delivery: ${when}`,
    unavailable: "Delivery is currently unavailable.",
    closedOn: (days: readonly number[]) =>
      `No delivery ${joinList(
        days.map((day) => enDays.on[day]),
        "or",
      )}.`,
  },
  contact: {
    eyebrow: "CONTACT",
    title: "Come by and say hello.",
    address: "Address",
    phones: "Phone",
    hours: "Hours",
    directions: "Get directions",
    openMaps: "View on Google Maps",
    mapTitle: "Map showing Vento Café in Lamia",
    facebook: "Follow us on Facebook",
    instagram: "Follow us on Instagram",
  },
  footer: {
    tagline: "Coffee, koulouri, cocktails — and good company, since 2011.",
    explore: "Explore",
    hours: "Hours",
    visit: "Visit us",
    rights: (year: number) => `© ${year} Vento Café. All rights reserved.`,
    top: "Back to top",
  },
};

export type Dictionary = typeof en;

const el: Dictionary = {
  meta: {
    title: "Vento Café Λαμία — In Coffee We Trust",
    description:
      "Το Vento Café στη Λαμία, από το 2011: καφές, κουλούρι, κοκτέιλ και αθλητικές βραδιές. Ανοιχτά κάθε μέρα από νωρίς το πρωί ως το βράδυ, με delivery Δευτέρα έως Σάββατο.",
  },
  a11y: {
    skip: "Μετάβαση στο περιεχόμενο",
    language: "Γλώσσα",
    mainNav: "Κύρια πλοήγηση",
    menu: "Μενού",
    openMenu: "Άνοιγμα μενού",
    closeMenu: "Κλείσιμο μενού",
    home: "Vento Café — επιστροφή στην αρχή",
    newTab: "(ανοίγει σε νέα καρτέλα)",
    quickActions: "Γρήγορες ενέργειες",
  },
  nav: {
    story: "Ιστορία",
    drinks: "Καφές & Ποτό",
    menu: "Κατάλογος",
    gallery: "Γκαλερί",
    hours: "Ωράριο",
    contact: "Επικοινωνία",
    call: "Κλήση",
    directions: "Οδηγίες",
  },
  days: elDays.long,
  daysShort: elDays.short,
  when: (daysAhead, day, time) =>
    daysAhead === 0
      ? `σήμερα στις ${time}`
      : daysAhead === 1
        ? `αύριο στις ${time}`
        : `${elDays.on[day]} στις ${time}`,
  status: {
    open: "Ανοιχτά τώρα",
    closed: "Κλειστά τώρα",
    closesMidnight: "κλείνει στις 00:00",
    closesAt: (time) => `κλείνει στις ${time}`,
    closesIn: (minutes) =>
      `κλείνει σε ${minutes} ${minutes === 1 ? "λεπτό" : "λεπτά"}`,
    opens: (when) => `ανοίγει ${when}`,
  },
  phoneKinds: { landline: "Σταθερό", mobile: "Κινητό" },
  hero: {
    eyebrow: "ΛΑΜΙΑ · ΑΠΟ ΤΟ 2011",
    logoAlt: "Vento Café — In Coffee We Trust",
    lead: "Ο πρώτος καφές της μέρας. Το τελευταίο ποτό της βραδιάς.",
    sub: "Ανοιχτά κάθε μέρα από νωρίς το πρωί έως αργά το βράδυ.",
    call: "Καλέστε μας",
    directions: "Οδηγίες",
    badge: "IN COFFEE WE TRUST · ΑΠΟ ΤΟ 2011 · ",
    mainPhotoAlt:
      "Ο πάγκος του Vento: λάμπες Edison κρεμασμένες σε σχοινιά, αρτοσκευάσματα και κουλούρια, και το τιρκουάζ μπαρ με τη φράση «In Coffee We»",
    accentPhotoAlt:
      "Ροζ long drink σε σκαλιστό κρυστάλλινο ποτήρι και γλυκό σε κολονάτο ποτήρι, πάνω σε ασημένιο δίσκο",
    scroll: "Ανακαλύψτε",
  },
  marquee: [
    "Espresso",
    "Freddo espresso",
    "Freddo cappuccino",
    "Cappuccino",
    "Κουλούρι",
    "Κρουασάν",
    "Κοκτέιλ",
    "Αθλητικές βραδιές",
    "In Coffee We Trust",
  ],
  story: {
    eyebrow: "Η ΙΣΤΟΡΙΑ ΜΑΣ",
    title: "Πρώτα ο καφές. Όλα τα άλλα μετά.",
    body: [
      "Από το 2011, το Vento αποτελεί σημείο συνάντησης για όσους αγαπούν τον καλό καφέ και τις όμορφες στιγμές. Με οδηγό τη φιλοσοφία μας “in coffee we trust”, γίναμε μέρος της καθημερινότητας της Λαμίας, συνοδεύοντας τις μικρές και μεγάλες στιγμές της ημέρας.",
      "Από τον πρώτο espresso νωρίς το πρωί, μέχρι τον αγαπημένο freddo με την παρέα και τα cocktails που δίνουν τον δικό τους ρυθμό στη βραδιά, στο Vento κάθε στιγμή έχει τη δική της θέση.",
      "Με έναν χώρο που συνδυάζει την άνεση με τη ζωντάνια, μια φιλόξενη βεράντα για κάθε ώρα της ημέρας και την ιδανική ατμόσφαιρα για να απολαύσεις τους μεγάλους αθλητικούς αγώνες, το Vento είναι κάτι περισσότερο από μια στάση για καφέ.",
      "Είναι το μέρος όπου ξεκινά η μέρα, συναντιούνται οι παρέες και δημιουργούνται στιγμές που θέλεις να ξαναζήσεις.",
      "Vento. Εκεί που όλα ξεκινούν με έναν καλό καφέ.",
    ],
    stats: {
      years: "χρόνια στη Λαμία",
      daysOpen: (count) =>
        count === 7 ? "ανοιχτά κάθε μέρα" : "μέρες την εβδομάδα",
      firstCoffee: (days) => `ο πρώτος καφές (${days})`,
      delivery: "ώρες delivery",
    },
    photoAlt:
      "Παρέες στα τραπέζια της βεράντας το βράδυ, δίπλα σε δέντρο τυλιγμένο με φωτάκια και ζαρντινιέρες με ροζ και κόκκινα λουλούδια",
    insetAlt:
      "Το Vento τη νύχτα: η φωτισμένη βεράντα και το μπαρ στο ισόγειο γωνιακού κτιρίου",
  },
  drinks: {
    eyebrow: "ΚΑΦΕΣ & ΠΟΤΟ",
    title: "Από τον πρώτο espresso ως το τελευταίο κοκτέιλ.",
    intro: "Το Vento αλλάζει ρυθμό μαζί με τη μέρα — ποτέ όμως χαρακτήρα.",
    from: (time) => `Από τις ${time}`,
    until: (time, midnight) => (midnight ? "Ως το βράδυ" : `Ως τις ${time}`),
    moments: {
      morning: {
        label: "Πρωί",
        title: "Η πρωινή ιεροτελεστία",
        text: "Espresso, cappuccino και freddo όπως πρέπει, με κουλούρι, κρουασάν και κάτι γλυκό από τον πάγκο. Βιάζεστε; Έχουμε και delivery.",
        tags: ["Espresso", "Freddo", "Cappuccino", "Κουλούρι"],
        alt: "Το μπαρ του Vento με κρεμαστές λάμπες Edison, αρτοσκευάσματα στον πάγκο και ράφια με μπουκάλια στο βάθος",
      },
      afternoon: {
        label: "Απόγευμα",
        title: "Το απογευματινό σας στέκι",
        text: "Ένας χαλαρός καφές με την παρέα κάτω από τα δέντρα, κάτι δροσερό στη σκιά και ο αγώνας στις οθόνες — από εκείνα τα απογεύματα που κρατάνε ως το βράδυ.",
        tags: ["Freddo cappuccino", "Αναψυκτικά", "Αθλητικές μεταδόσεις"],
        alt: "Η γωνιακή βεράντα του Vento το σούρουπο, γεμάτη κόσμο κάτω από δέντρα φωτισμένα από κάτω",
      },
      evening: {
        label: "Βράδυ",
        title: "Όταν ανάβουν τα φώτα",
        text: "Τον λόγο έχει το μπαρ: κοκτέιλ, long drinks, πλούσια κάβα και καλή παρέα ως το κλείσιμο.",
        tags: ["Κοκτέιλ", "Long drinks", "Αποστάγματα"],
        alt: "Ράφια γεμάτα αποστάγματα πίσω από το μπαρ, σε χαμηλό βραδινό φωτισμό",
      },
    },
  },
  menu: {
    eyebrow: "ΚΑΤΑΛΟΓΟΣ",
    title: "Κάτι για κάθε ώρα.",
    intro:
      "Καφές, αναψυκτικά, κρέπες και βάφλες, σνακ, μπύρες και κοκτέιλ. Όλες οι τιμές είναι σε ευρώ.",
    tabs: "Ενότητες καταλόγου",
    free: "δωρεάν",
  },
  gallery: {
    eyebrow: "ΓΚΑΛΕΡΙ",
    title: "Μια ματιά στο Vento",
    intro:
      "Μέσα κι έξω, από το πρωί ως το βράδυ. Πατήστε σε μια φωτογραφία για να τη δείτε σε μεγάλο μέγεθος.",
    dialogLabel: "Συλλογή φωτογραφιών",
    open: (caption) => `Μεγέθυνση: ${caption}`,
    close: "Κλείσιμο",
    previous: "Προηγούμενη φωτογραφία",
    next: "Επόμενη φωτογραφία",
    position: (index, total) => `Φωτογραφία ${index} από ${total}`,
    photos: {
      "bar-counter": {
        caption: "Ο τιρκουάζ πάγκος μας — in coffee we trust.",
        alt: "Τιρκουάζ πάγκος με γεωμετρικό μοτίβο και τη φράση «In Coffee We Trust», με λάμπες Edison κρεμασμένες σε σχοινιά και αρτοσκευάσματα στον πάγκο",
      },
      "olive-terrace": {
        caption: "Βραδιές στη βεράντα, κάτω από τα φωτισμένα δέντρα.",
        alt: "Παρέες στα τραπέζια της βεράντας δίπλα σε δέντρο τυλιγμένο με φωτάκια, με ζαρντινιέρες με ροζ και κόκκινα λουλούδια μπροστά",
      },
      "evening-drinks": {
        caption: "Κοκτέιλ και κάτι γλυκό για το κλείσιμο της μέρας.",
        alt: "Ροζ long drink σε σκαλιστό κρυστάλλινο ποτήρι και γλυκό σε κολονάτο ποτήρι, πάνω σε ασημένιο δίσκο",
      },
      "back-bar": {
        caption: "Μια κάβα για κάθε γούστο.",
        alt: "Ράφια με αποστάγματα — τζιν, βότκα, ρούμι και ουίσκι — φωτισμένα πίσω από το μπαρ",
      },
      "night-exterior": {
        caption: "Η γωνιά μας όταν πέφτει η νύχτα.",
        alt: "Το Vento τη νύχτα: η φωτισμένη βεράντα και το μπαρ στο ισόγειο γωνιακού κτιρίου, κάτω από βαθύ μπλε ουρανό",
      },
      "dusk-corner": {
        caption: "Σούρουπο στη βεράντα.",
        alt: "Το γωνιακό κτίριο το σούρουπο, με την τέντα του Vento και γεμάτη ξύλινη εξέδρα κάτω από φωτισμένα δέντρα",
      },
      "pergola-night": {
        caption: "Γεμάτα τραπέζια, καλή παρέα.",
        alt: "Γεμάτη βραδιά κάτω από στεγασμένη βεράντα με αναρριχώμενα φυτά, φανοστάτες και ζαρντινιέρες",
      },
      "coffee-bar": {
        caption: "Εδώ ξεκινά κάθε καφές.",
        alt: "Η γωνιά του καφέ: μηχανή espresso, στοίβες από φλιτζάνια και ποτήρια για πακέτο στον πάγκο, και το έμβλημα Johann Jacobs Professional σε πετρόλ τοίχο κάτω από μια λάμπα Edison",
      },
      crepes: {
        caption: "Κρέπες και βάφλες για τους λάτρεις του γλυκού.",
        alt: "Από ψηλά: βάφλα με σοκολάτα γάλακτος, λευκή σοκολάτα και τριμμένο μπισκότο, δίπλα σε διπλωμένη κρέπα με σοκολάτα και θρυμματισμένο μπισκότο",
      },
      matchday: {
        caption: "Βραδιά αγώνα στη μεγάλη οθόνη.",
        alt: "Γεμάτη αίθουσα παρακολουθεί ποδοσφαιρικό αγώνα στη μεγάλη οθόνη του προτζέκτορα, κάτω από κρεμαστά φυτά και λάμπες Edison σε σχοινιά",
      },
      drinks: {
        caption: "Ένα ποτήρι κρασί και κάτι να τσιμπήσετε.",
        alt: "Ποτήρι λευκό κρασί και πετρόλ μπολάκι με ξηρούς καρπούς σε ξύλινο τραπέζι, με τα φώτα του μπαρ θολά στο βάθος",
      },
      delivery: {
        caption: "Ο πρωινός σας καφές, καθ’ οδόν.",
        alt: "Καφέδες σε ποτήρια Vento με θολωτά καπάκια, σε ξύλινη θήκη πάνω σε μηχανάκι delivery",
      },
      "iced-coffee": {
        caption: "Παγωμένος καφές στη σκιά των δέντρων.",
        alt: "Δύο παγωμένοι καφέδες με καλαμάκι σε ποτήρια Jacobs, ο ένας σκέτος κι ο άλλος με αφρόγαλα, σε τραπέζι της βεράντας κάτω από δέντρο μια ηλιόλουστη μέρα",
      },
      "white-wine": {
        caption: "Λευκό κρασί για δύο.",
        alt: "Δύο ποτήρια λευκό κρασί σε σκούρο τραπέζι, με τα φώτα και τα ράφια του μπαρ θολά στο βάθος",
      },
    },
  },
  hours: {
    eyebrow: "ΩΡΑΡΙΟ & DELIVERY",
    title: "Ανοιχτά κάθε μέρα.",
    intro:
      "Νωρίς το πρωί, αργά το βράδυ — και delivery από το πρωί ως το βράδυ.",
    tableCaption: "Ωράριο λειτουργίας και delivery ανά ημέρα",
    day: "Ημέρα",
    cafe: "Κατάστημα",
    delivery: "Delivery",
    today: "Σήμερα",
    closed: "Κλειστά",
    noDelivery: "Χωρίς delivery",
    localTime: "Ώρα Λαμίας",
    legend: { cafe: "Ανοιχτά", delivery: "Delivery", now: "Τώρα" },
    dialLabel: (day, cafe, delivery, now) =>
      `${day}: κατάστημα ${cafe ?? "κλειστό"}${delivery ? `, delivery ${delivery}` : ", χωρίς delivery"}. Ώρα Λαμίας: ${now}.`,
    timezone: "Όλες οι ώρες είναι ώρα Ελλάδας.",
  },
  delivery: {
    eyebrow: "DELIVERY",
    title: "Ο πρώτος σας καφές, στην πόρτα σας.",
    text: "Πάρτε μας τηλέφωνο και σας φέρνουμε τον καφέ σας — και κάτι για να τον συνοδέψει.",
    openNow: (until) => `Το delivery είναι ανοιχτό τώρα · ως τις ${until}`,
    next: (when) => `Επόμενο delivery: ${when}`,
    unavailable: "Το delivery δεν είναι διαθέσιμο αυτή τη στιγμή.",
    closedOn: (days) =>
      capitalize(
        `${joinList(
          days.map((day) => elDays.on[day]),
          "και",
        )} δεν έχουμε delivery.`,
      ),
  },
  contact: {
    eyebrow: "ΕΠΙΚΟΙΝΩΝΙΑ",
    title: "Περάστε να τα πούμε από κοντά.",
    address: "Διεύθυνση",
    phones: "Τηλέφωνα",
    hours: "Ωράριο",
    directions: "Οδηγίες",
    openMaps: "Δείτε μας στο Google Maps",
    mapTitle: "Χάρτης με την τοποθεσία του Vento Café στη Λαμία",
    facebook: "Ακολουθήστε μας στο Facebook",
    instagram: "Ακολουθήστε μας στο Instagram",
  },
  footer: {
    tagline: "Καφές, κουλούρι, κοκτέιλ — και καλή παρέα, από το 2011.",
    explore: "Πλοήγηση",
    hours: "Ωράριο",
    visit: "Βρείτε μας",
    rights: (year) => `© ${year} Vento Café. Με επιφύλαξη παντός δικαιώματος.`,
    top: "Επιστροφή στην αρχή",
  },
};

export const dictionaries: Record<Lang, Dictionary> = { el, en };
