// The café's menu, transcribed from the printed menu (photos in src/assets/images/menu/).
// Prices are in euros. Edit them here: the Menu section renders straight from this file.
// Text is { el, en }; tx('Espresso') uses the same text in both languages (brand and Italian names).

/** Greek and English versions of a piece of menu text. */
export interface Text {
  el: string
  en: string
}

export interface MenuItem {
  name: Text
  /** Ingredients, flavours or choices, shown under the name. */
  details?: Text
  /** One price, or two for single / double. */
  price: number | readonly [number, number]
}

/** Something added on top ("+0.50 honey"). Without a price it comes at no extra charge. */
export interface AddOn {
  name: Text
  details?: Text
  price?: number
}

/** Build your own: a plain base plus toppings priced one by one. */
export interface Builder {
  title: Text
  base: { name: Text; price: number }
  groups: readonly { title: Text; items: readonly AddOn[] }[]
}

export interface MenuCategory {
  id: string
  title: Text
  /** The hand-lettered line next to the heading on the printed menu (English in both languages). */
  tagline?: string
  items?: readonly MenuItem[]
  note?: Text
  builder?: Builder
  extras?: readonly AddOn[]
}

export type MenuTabId = 'coffee' | 'soft-drinks' | 'sweets' | 'food' | 'bar'

export interface MenuTab {
  id: MenuTabId
  label: Text
  categories: readonly MenuCategory[]
}

const tx = (el: string, en = el): Text => ({ el, en })

const SINGLE_DOUBLE = tx('μονό / διπλό', 'single / double')
const HOT_ICED = tx('ζεστή / κρύα', 'hot / iced')
const QUADRUPLE = tx('τετραπλή δόση', 'quadruple shot')
const ALCOHOL_FREE = tx('χωρίς αλκοόλ', 'alcohol-free')
const CLUB_FILLING = tx('τυρί, μαρούλι, ντομάτα, σως', 'cheese, lettuce, tomato, sauce')
const EXTRA_CHARGE = tx('Κάθε επιπλέον υλικό χρεώνεται ξεχωριστά.', 'Extra ingredients are charged separately.')
const WATER: AddOn = { name: tx('Νερό', 'Water'), price: 0.5 }

// Toppings shared by sweet crepes and waffles

const CREPE_BASE = { name: tx('Φύλλο κρέπας', 'Plain crepe'), price: 2.5 }

const SPREADS = {
  title: tx('Πραλίνες', 'Spreads'),
  items: [
    { name: tx('Φουντουκιού', 'Hazelnut'), price: 1 },
    { name: tx('Λευκή', 'White chocolate'), price: 1 },
    { name: tx('Bueno'), price: 1.2 },
    { name: tx('Lila Pause'), price: 1 },
    { name: tx('Lotus'), price: 1.2 },
  ],
}

const BISCUITS = {
  title: tx('Μπισκότα', 'Biscuits'),
  items: [
    { name: tx('Πτι μπερ', 'Petit beurre'), price: 0.8 },
    { name: tx('Oreo'), price: 0.8 },
  ],
}

const fruit = (wildCherry: number) => ({
  title: tx('Φρούτα', 'Fruit'),
  items: [
    { name: tx('Μπανάνα', 'Banana'), price: 0.9 },
    { name: tx('Αγριοκέρασο', 'Wild cherry'), price: wildCherry },
    { name: tx('Amarena', 'Amarena cherry'), price: 1 },
  ],
})

const NUTS = {
  title: tx('Ξηροί καρποί', 'Nuts'),
  items: [
    { name: tx('Τριμμένο καρύδι', 'Crushed walnut'), price: 1 },
    { name: tx('Τριμμένο φουντούκι', 'Crushed hazelnut'), price: 1 },
    { name: tx('Τριμμένο αμύγδαλο', 'Crushed almond'), price: 1 },
    { name: tx('Ινδική καρύδα', 'Grated coconut'), price: 1 },
  ],
}

const SPRINKLES = {
  title: tx('Τρούφες', 'Sprinkles'),
  items: [
    { name: tx('Σοκολάτα', 'Chocolate'), price: 1 },
    { name: tx('Πολύχρωμη', 'Rainbow'), price: 1 },
  ],
}

export const MENU: readonly MenuTab[] = [
  {
    id: 'coffee',
    label: tx('Καφές', 'Coffee'),
    categories: [
      {
        id: 'coffees',
        title: tx('Καφέδες', 'Coffees'),
        tagline: 'in coffee we trust',
        items: [
          { name: tx('Espresso / espresso decaf'), price: 2.5 },
          { name: tx('Espresso stretto'), price: 2.5 },
          { name: tx('Espresso lungo'), price: 2.5 },
          { name: tx('Espresso americano'), price: 2.5 },
          { name: tx('Americano διπλό', 'Double americano'), price: 2.7 },
          { name: tx('Espresso διπλό', 'Double espresso'), price: 2.7 },
          { name: tx('Espresso macchiato'), details: SINGLE_DOUBLE, price: [2.5, 2.7] },
          {
            name: tx('Espresso con panna'),
            details: tx('μονό / διπλό, με ή χωρίς σαντιγί', 'single / double, with or without whipped cream'),
            price: [2.5, 2.7],
          },
          { name: tx('Freddo espresso'), price: 2.5 },
          { name: tx('Freddo espresso macchiato'), price: 2.5 },
          { name: tx('Freddo espresso con panna'), details: tx('με σαντιγί', 'with whipped cream'), price: 2.5 },
          { name: tx('Freddo cappuccino'), price: 2.5 },
          { name: tx('Freddo cappuccino latte'), price: 2.5 },
          { name: tx('Freddo espresso / cappuccino grande'), details: QUADRUPLE, price: 5 },
          { name: tx('Cappuccino'), details: SINGLE_DOUBLE, price: [2.5, 3] },
          { name: tx('Cappuccino latte'), price: 3 },
          { name: tx('Cappuccino grande'), details: QUADRUPLE, price: 6 },
          { name: tx('Ελληνικός', 'Greek coffee'), details: tx('μονός / διπλός', 'single / double'), price: [2.5, 2.7] },
          { name: tx('Φίλτρου (γαλλικός)', 'Filter coffee'), price: 2.5 },
          { name: tx('Στιγμιαίος Nescafé', 'Instant coffee (Nescafé)'), price: 2.5 },
          { name: tx('Nescafé frappé'), price: 2.5 },
          { name: tx('Nescafé frappé decaf'), price: 2.5 },
          { name: tx('Freddoccino'), price: 3.5 },
          { name: tx('Mochaccino'), details: tx('ζεστό ή κρύο', 'hot or iced'), price: 3.5 },
        ],
      },
    ],
  },
  {
    id: 'soft-drinks',
    label: tx('Αναψυκτικά & σοκολάτες', 'Soft drinks & chocolate'),
    categories: [
      {
        id: 'refreshments',
        title: tx('Αναψυκτικά & χυμοί', 'Soft drinks & juices'),
        tagline: 'treat yourself today',
        items: [
          { name: tx('Coca-Cola'), details: tx('κανονική / zero', 'regular / zero'), price: 2.5 },
          { name: tx('Έψα πορτοκαλάδα', 'Epsa orangeade'), details: tx('με ή χωρίς ανθρακικό', 'sparkling or still'), price: 2.5 },
          { name: tx('Έψα λεμονάδα', 'Epsa lemonade'), price: 2.5 },
          { name: tx('Έψα βυσσινάδα', 'Epsa sour cherry'), price: 2.5 },
          { name: tx('7Up / Sprite'), price: 2.5 },
          { name: tx('Σουρωτή', 'Souroti sparkling water'), price: 2.5 },
          {
            name: tx('Lipton Ice Tea'),
            details: tx('λεμόνι / ροδάκινο / πράσινο (0%)', 'lemon / peach / green (0%)'),
            price: 2.5,
          },
          { name: tx('Ήβη σόδα', 'Ivi soda water'), price: 2.5 },
          { name: tx('3 Cents grapefruit'), price: 4 },
          {
            name: tx('Giagia Mas'),
            details: tx(
              'λεμονάδα κλασική, pink λεμονάδα, πανδαισία, κερασάδα, ροδακινάδα — με ή χωρίς ζάχαρη',
              'classic lemonade, pink lemonade, Pandaisia, cherryade, peach soda — with or without sugar',
            ),
            price: 4,
          },
          { name: tx('Red Bull'), price: 3.5 },
          { name: tx('Monster'), price: 3.5 },
          { name: tx('Ήβη τόνικ', 'Ivi tonic water'), price: 2.5 },
          {
            name: tx('Amita'),
            details: tx('ανάμεικτος, μπανάνα, βύσσινο, πορτοκάλι', 'mixed fruit, banana, sour cherry, orange'),
            price: 2.5,
          },
          { name: tx('Amita Motion'), price: 3 },
          { name: tx('Φυσικός χυμός πορτοκάλι', 'Fresh orange juice'), price: 3 },
          { name: tx('Φυσικός χυμός ανάμεικτος', 'Fresh mixed juice'), price: 3.5 },
          { name: tx('Φυσικός χυμός ρόδι', 'Fresh pomegranate juice'), price: 3.5 },
        ],
      },
      {
        id: 'chocolates',
        title: tx('Σοκολάτες & τσάι', 'Chocolate & tea'),
        items: [
          { name: tx('Κακάο', 'Cocoa'), price: 2.5 },
          { name: tx('Σοκολάτα', 'Chocolate'), details: HOT_ICED, price: 3 },
          { name: tx('Σοκολάτα viennois', 'Chocolate viennois'), details: HOT_ICED, price: 3.5 },
          { name: tx('Σοκολάτα Lacta', 'Lacta chocolate'), price: 3 },
          { name: tx('Σοκολάτα caramel toffee', 'Caramel toffee chocolate'), price: 4 },
          { name: tx('Σοκολάτα waffle', 'Waffle chocolate'), price: 4 },
          { name: tx('Σοκολάτα φυστικοβούτυρο & μπανάνα', 'Peanut butter & banana chocolate'), price: 4 },
          { name: tx('Τσάι', 'Tea'), details: tx('ζεστό / κρύο', 'hot / iced'), price: 2.5 },
        ],
        extras: [
          {
            name: tx('Σιρόπι', 'Syrup'),
            details: tx(
              'φουντούκι, καραμέλα, φράουλα, βανίλια, κανέλα, μπανάνα, μπισκότο',
              'hazelnut, caramel, strawberry, vanilla, cinnamon, banana, biscuit',
            ),
            price: 0.5,
          },
          { name: tx('Σαντιγί στη ζεστή ή κρύα σοκολάτα', 'Whipped cream on hot or iced chocolate'), price: 0.5 },
          { name: tx('Μέλι', 'Honey'), price: 0.5 },
          WATER,
        ],
      },
    ],
  },
  {
    id: 'sweets',
    label: tx('Κρέπες & βάφλες', 'Crepes & waffles'),
    categories: [
      {
        id: 'sweet-crepes',
        title: tx('Γλυκές κρέπες', 'Sweet crepes'),
        tagline: 'crepe lovers’ paradise',
        items: [
          {
            name: tx('Πραλίνα φουντουκιού & πτι μπερ', 'Hazelnut praline & petit beurre'),
            details: tx('με τριμμένο μπισκότο πτι μπερ', 'with crushed petit beurre biscuit'),
            price: 4.3,
          },
          { name: tx('Πραλίνα Bueno, μπισκότο Oreo & μπανάνα', 'Bueno praline, Oreo biscuit & banana'), price: 4.5 },
          {
            name: tx('Κρέπα Vento', 'Vento crepe'),
            details: tx(
              'ανάμεικτη πραλίνα φουντουκιού και λευκή, πουράκια Caprice, πολύχρωμη τρούφα',
              'hazelnut and white praline, Caprice wafer rolls, rainbow sprinkles',
            ),
            price: 5,
          },
        ],
        builder: {
          title: tx('Φτιάξτε τη δική σας γλυκιά κρέπα', 'Build your own sweet crepe'),
          base: CREPE_BASE,
          groups: [
            SPREADS,
            BISCUITS,
            fruit(1),
            NUTS,
            SPRINKLES,
            {
              title: tx('Γλυκά', 'Sweets'),
              items: [
                { name: tx('Πουράκια Caprice', 'Caprice wafer rolls'), price: 0.9 },
                { name: tx('Σοκολάτα Lacta', 'Lacta chocolate'), price: 0.9 },
                { name: tx('Kinder Bueno'), price: 0.9 },
                { name: tx('Lila Pause'), price: 0.9 },
                { name: tx('KitKat'), price: 0.9 },
                { name: tx('3Bit'), price: 0.9 },
                { name: tx('Maltesers'), price: 0.9 },
              ],
            },
          ],
        },
        extras: [
          { name: tx('Σιρόπια: καραμέλα, σοκολάτα & βύσσινο', 'Syrups: caramel, chocolate & sour cherry') },
          { name: tx('Μπάλα παγωτό', 'Scoop of ice cream'), price: 2 },
        ],
      },
      {
        id: 'waffles',
        title: tx('Βάφλες', 'Waffles'),
        tagline: 'warm waffle bliss',
        items: [
          { name: tx('Σοκολάτα με πραλίνα φουντουκιού', 'Chocolate hazelnut praline'), price: 5 },
          {
            name: tx('Σοκολάτα με πραλίνα φουντουκιού, τριμμένο Oreo & μπανάνα', 'Chocolate hazelnut praline, crushed Oreo & banana'),
            price: 6.7,
          },
        ],
        note: EXTRA_CHARGE,
        builder: {
          title: tx('Φτιάξτε τη δική σας βάφλα', 'Build your own waffle'),
          // The printed waffle page lists "Φύλλο κρέπας 2.50" here, copied from the crepe page.
          base: { name: tx('Βάφλα', 'Plain waffle'), price: 2.5 },
          groups: [
            SPREADS,
            BISCUITS,
            fruit(1.8),
            NUTS,
            SPRINKLES,
            {
              title: tx('Παγωτό', 'Ice cream'),
              items: [{ name: tx('Βανίλια, φράουλα, σοκολάτα', 'Vanilla, strawberry, chocolate'), price: 2 }],
            },
          ],
        },
      },
      {
        id: 'savoury-crepes',
        title: tx('Αλμυρές κρέπες', 'Savoury crepes'),
        tagline: 'made to satisfy',
        builder: {
          title: tx('Φτιάξτε τη δική σας αλμυρή κρέπα', 'Build your own savoury crepe'),
          base: CREPE_BASE,
          groups: [
            {
              title: tx('Τυριά', 'Cheese'),
              items: [
                { name: tx('Gouda'), price: 1 },
                { name: tx('Mozzarella'), price: 1 },
                { name: tx('Cheddar'), price: 1 },
                { name: tx('Φέτα', 'Feta'), price: 1 },
                { name: tx('Παρμεζάνα', 'Parmesan'), price: 1.3 },
                { name: tx('Ανθότυρο', 'Anthotyro'), price: 0.7 },
                { name: tx('Mix τυριών', 'Cheese mix'), price: 2.5 },
              ],
            },
            {
              title: tx('Κρεατικά', 'Meat'),
              items: [
                { name: tx('Κοτόπουλο βραστό', 'Boiled chicken'), price: 1.2 },
                { name: tx('Κοτόπουλο φιλέτο ή ψίχα', 'Chicken fillet or breast'), price: 1.4 },
                { name: tx('Κοτομπουκιές', 'Chicken nuggets'), price: 1.4 },
                { name: tx('Λουκάνικο χωριάτικο', 'Village sausage'), price: 1.4 },
                { name: tx('Λουκάνικο Φρανκφούρτης', 'Frankfurter'), price: 1.4 },
              ],
            },
            {
              title: tx('Αλλαντικά', 'Cold cuts'),
              items: [
                { name: tx('Γαλοπούλα', 'Turkey'), price: 0.9 },
                { name: tx('Ζαμπόν', 'Ham'), price: 0.9 },
                { name: tx('Μπέικον', 'Bacon'), price: 1 },
              ],
            },
            {
              title: tx('Λαχανικά', 'Vegetables'),
              items: [
                { name: tx('Ντομάτα', 'Tomato'), price: 0.8 },
                { name: tx('Πιπεριά', 'Pepper'), price: 0.8 },
                { name: tx('Ελιές', 'Olives'), price: 0.5 },
                { name: tx('Καλαμπόκι', 'Sweetcorn'), price: 0.8 },
                { name: tx('Μανιτάρια', 'Mushrooms'), price: 0.8 },
                { name: tx('Μαρούλι', 'Lettuce'), price: 0.8 },
              ],
            },
            {
              title: tx('Σως', 'Sauces'),
              items: [
                { name: tx('Κέτσαπ', 'Ketchup'), price: 0 },
                { name: tx('Μουστάρδα', 'Mustard'), price: 0 },
                { name: tx('Μαγιονέζα', 'Mayonnaise'), price: 0.6 },
                { name: tx('Ροζ σως', 'Pink sauce'), price: 0.9 },
                { name: tx('Κίτρινη σως', 'Yellow sauce'), price: 0.9 },
                { name: tx('Ουγγαρέζα', 'Ungareza'), price: 0.9 },
                { name: tx('Τυροσαλάτα', 'Tyrosalata'), price: 0.9 },
                { name: tx('Τυροκαυτερή', 'Tirokafteri'), price: 0.9 },
                { name: tx('Κοπανιστή', 'Kopanisti'), price: 0.8 },
                { name: tx('BBQ'), price: 0.9 },
                { name: tx('Φιλαδέλφεια', 'Philadelphia'), price: 1 },
              ],
            },
            {
              title: tx('Πατάτες', 'Potatoes'),
              items: [
                { name: tx('Πατάτες τηγανητές', 'French fries'), price: 0.9 },
                { name: tx('Πατάτες sticks', 'Potato sticks'), price: 0.8 },
              ],
            },
          ],
        },
      },
    ],
  },
  {
    id: 'food',
    label: tx('Φαγητό', 'Food'),
    categories: [
      {
        id: 'snacks',
        title: tx('Πιάτα & σνακ', 'Dishes & snacks'),
        tagline: 'savor every bite',
        items: [
          { name: tx('Κρουασάν σοκολάτας', 'Chocolate croissant'), price: 2.5 },
          { name: tx('Σταφιδόψωμο', 'Raisin bread'), price: 1 },
          { name: tx('Μπάρα δημητριακών', 'Cereal bar'), price: 2.5 },
          { name: tx('Μπριός αλλαντικών', 'Brioche with cold cuts'), details: tx('γαλοπούλα ή ζαμπόν', 'turkey or ham'), price: 3 },
          { name: tx('Μπριός κοτόπουλο', 'Chicken brioche'), price: 4 },
          { name: tx('Μπριός κοτομπουκιές', 'Chicken nugget brioche'), price: 4 },
          { name: tx('Μπριός λουκάνικο Φρανκφούρτης', 'Frankfurter brioche'), price: 4 },
          { name: tx('Τορτίγια γαλοπούλα', 'Turkey wrap'), price: 3.5 },
          { name: tx('Τορτίγια κοτόπουλο', 'Chicken wrap'), price: 3.8 },
          { name: tx('Κοτομπουκιές, μερίδα', 'Chicken nuggets, portion'), price: 7 },
          { name: tx('Πατάτες, μερίδα', 'Fries, portion'), price: 3.5 },
        ],
        note: EXTRA_CHARGE,
        extras: [
          {
            name: tx('Ντιπάκι σως', 'Dip'),
            details: tx('ροζ, κίτρινη, μαγιονέζα', 'pink sauce, yellow sauce, mayonnaise'),
            price: 0.5,
          },
        ],
      },
      {
        id: 'toasties',
        title: tx('Τοστ & σάντουιτς', 'Toasties & sandwiches'),
        tagline: 'grab, bite, go.',
        items: [
          { name: tx('Τοστ τυρί & γαλοπούλα', 'Cheese & turkey toastie'), price: 2.5 },
          { name: tx('Τοστ τυρί & ζαμπόν', 'Cheese & ham toastie'), price: 2.5 },
          { name: tx('Σάντουιτς τυρί & γαλοπούλα', 'Cheese & turkey sandwich'), price: 3 },
          { name: tx('Σάντουιτς τυρί & ζαμπόν', 'Cheese & ham sandwich'), price: 3 },
        ],
      },
      {
        id: 'baguettes',
        title: tx('Μπαγκέτες', 'Baguettes'),
        tagline: 'made fresh daily',
        items: [
          { name: tx('Χωριάτικο λουκάνικο', 'Village sausage'), price: 4 },
          {
            name: tx('Φιλέτο κοτόπουλο', 'Chicken fillet'),
            details: tx('τυρί, μαρούλι, κίτρινη σως', 'cheese, lettuce, yellow sauce'),
            price: 3.5,
          },
          {
            name: tx('Κοτομπουκιές', 'Chicken nuggets'),
            details: tx('τυρί, ντομάτα, ροζ σως', 'cheese, tomato, pink sauce'),
            price: 4,
          },
          {
            name: tx('Κοτομπουκιές & cheddar', 'Chicken nuggets & cheddar'),
            details: tx('μαρούλι, κίτρινη σως', 'lettuce, yellow sauce'),
            price: 3.5,
          },
          {
            name: tx('Μεσογειακή', 'Mediterranean'),
            details: tx('ανθότυρο, μαγιονέζα, ντομάτα, ελιές', 'anthotyro cheese, mayonnaise, tomato, olives'),
            price: 3.5,
          },
        ],
      },
      {
        id: 'club',
        title: tx('Κλαμπ σάντουιτς', 'Club sandwiches'),
        tagline: 'taste every layer',
        items: [
          { name: tx('Γαλοπούλα', 'Turkey'), details: CLUB_FILLING, price: 6 },
          { name: tx('Ζαμπόν', 'Ham'), details: CLUB_FILLING, price: 6 },
          { name: tx('Κοτομπουκιές', 'Chicken nuggets'), details: CLUB_FILLING, price: 7 },
        ],
      },
      {
        id: 'platters',
        title: tx('Ποικιλίες', 'Sharing platters'),
        tagline: 'friendship and taste',
        items: [
          { name: tx('Ποικιλία 2 ατόμων', 'Mixed platter for 2'), price: 5 },
          { name: tx('Ποικιλία 4 ατόμων', 'Mixed platter for 4'), price: 8 },
          { name: tx('Κρύο πιάτο 2 ατόμων', 'Cold plate for 2'), price: 3 },
          { name: tx('Κρύο πιάτο 4 ατόμων', 'Cold plate for 4'), price: 5 },
        ],
      },
    ],
  },
  {
    id: 'bar',
    label: tx('Μπύρες & ποτά', 'Beer, wine & cocktails'),
    categories: [
      {
        id: 'beers',
        title: tx('Μπύρες', 'Beers'),
        tagline: 'cold beer awaits',
        items: [
          { name: tx('Eza βαρέλι', 'Eza draught'), price: 3 },
          { name: tx('Eza lager / pilsner'), price: 3.5 },
          { name: tx('Άλφα', 'Alfa'), price: 3 },
          { name: tx('Kaiser'), price: 3.5 },
          { name: tx('Fischer'), price: 4 },
          { name: tx('Heineken'), price: 3.5 },
          { name: tx('Πειραϊκή', 'Piraiki'), price: 3.5 },
          { name: tx('Cretan Kings'), price: 3.5 },
          { name: tx('Mamos'), price: 4 },
          { name: tx('Pill’s'), details: tx('με λεμόνι, χωρίς αλκοόλ', 'with lemon, alcohol-free'), price: 3 },
          { name: tx('Fix Άνευ', 'Fix Anef'), details: ALCOHOL_FREE, price: 3.5 },
        ],
        extras: [WATER],
      },
      {
        id: 'wines',
        title: tx('Κρασιά', 'Wines'),
        tagline: 'raise your glass',
        items: [
          {
            name: tx('Κρασί λευκό, ροζέ ή κόκκινο', 'White, rosé or red wine'),
            details: tx('ποτήρι, ξηρό ή ημίγλυκο', 'by the glass, dry or medium-sweet'),
            price: 5,
          },
          { name: tx('Σαγκριά', 'Sangria'), price: 5 },
          { name: tx('Moscato d’Asti'), price: 5 },
        ],
      },
      {
        id: 'cocktails',
        title: tx('Ποτά & κοκτέιλ', 'Drinks & cocktails'),
        tagline: 'drink and enjoy',
        items: [
          { name: tx('Ποτό απλό', 'Standard drink'), price: 6 },
          { name: tx('Ποτό σπέσιαλ', 'Premium drink'), price: 8 },
          { name: tx('Aperol Spritz'), details: tx('με κλασική σόδα', 'with classic soda'), price: 6 },
          { name: tx('Aperol Spritz'), details: tx('με σόδα grapefruit', 'with grapefruit soda'), price: 7 },
          {
            name: tx('Τσίπουρο / ούζο', 'Tsipouro / ouzo'),
            details: tx('τσίπουρο με ή χωρίς γλυκάνισο', 'tsipouro with or without anise'),
            price: 2.5,
          },
        ],
      },
    ],
  },
]
