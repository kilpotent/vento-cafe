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

const CREPE_BASE = { name: tx('Φύλλο Κρέπας', 'Plain Crepe'), price: 2.5 }

const SPREADS = {
  title: tx('Πραλίνες', 'Spreads'),
  items: [
    { name: tx('Φουντουκιού', 'Hazelnut'), price: 1 },
    { name: tx('Λευκή', 'White Chocolate'), price: 1 },
    { name: tx('Bueno'), price: 1.2 },
    { name: tx('Lila Pause'), price: 1 },
    { name: tx('Lotus'), price: 1.2 },
  ],
}

const BISCUITS = {
  title: tx('Μπισκότα', 'Biscuits'),
  items: [
    { name: tx('Πτι Μπερ', 'Petit Beurre'), price: 0.8 },
    { name: tx('Oreo'), price: 0.8 },
  ],
}

const fruit = (wildCherry: number) => ({
  title: tx('Φρούτα', 'Fruit'),
  items: [
    { name: tx('Μπανάνα', 'Banana'), price: 0.9 },
    { name: tx('Αγριοκέρασο', 'Wild Cherry'), price: wildCherry },
    { name: tx('Amarena', 'Amarena Cherry'), price: 1 },
  ],
})

const NUTS = {
  title: tx('Ξηροί Καρποί', 'Nuts'),
  items: [
    { name: tx('Τριμμένο Καρύδι', 'Crushed Walnut'), price: 1 },
    { name: tx('Τριμμένο Φουντούκι', 'Crushed Hazelnut'), price: 1 },
    { name: tx('Τριμμένο Αμύγδαλο', 'Crushed Almond'), price: 1 },
    { name: tx('Ινδική Καρύδα', 'Grated Coconut'), price: 1 },
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
          { name: tx('Espresso / Espresso Decaf'), price: 2.5 },
          { name: tx('Espresso Stretto'), price: 2.5 },
          { name: tx('Espresso Lungo'), price: 2.5 },
          { name: tx('Espresso Americano'), price: 2.5 },
          { name: tx('Americano Διπλό', 'Double Americano'), price: 2.7 },
          { name: tx('Espresso Διπλό', 'Double Espresso'), price: 2.7 },
          { name: tx('Espresso Macchiato'), details: SINGLE_DOUBLE, price: [2.5, 2.7] },
          {
            name: tx('Espresso con Panna'),
            details: tx('μονό / διπλό, με ή χωρίς σαντιγί', 'single / double, with or without whipped cream'),
            price: [2.5, 2.7],
          },
          { name: tx('Freddo Espresso'), price: 2.5 },
          { name: tx('Freddo Espresso Macchiato'), price: 2.5 },
          { name: tx('Freddo Espresso con Panna'), details: tx('με σαντιγί', 'with whipped cream'), price: 2.5 },
          { name: tx('Freddo Cappuccino'), price: 2.5 },
          { name: tx('Freddo Cappuccino Latte'), price: 2.5 },
          { name: tx('Freddo Espresso / Cappuccino Grande'), details: QUADRUPLE, price: 5 },
          { name: tx('Cappuccino'), details: SINGLE_DOUBLE, price: [2.5, 3] },
          { name: tx('Cappuccino Latte'), price: 3 },
          { name: tx('Cappuccino Grande'), details: QUADRUPLE, price: 6 },
          { name: tx('Ελληνικός', 'Greek Coffee'), details: tx('μονός / διπλός', 'single / double'), price: [2.5, 2.7] },
          { name: tx('Φίλτρου (Γαλλικός)', 'Filter Coffee'), price: 2.5 },
          { name: tx('Στιγμιαίος Nescafé', 'Instant Coffee (Nescafé)'), price: 2.5 },
          { name: tx('Nescafé Frappé'), price: 2.5 },
          { name: tx('Nescafé Frappé Decaf'), price: 2.5 },
          { name: tx('Freddoccino'), price: 3.5 },
          { name: tx('Mochaccino'), details: tx('ζεστό ή κρύο', 'hot or iced'), price: 3.5 },
        ],
      },
    ],
  },
  {
    id: 'food',
    label: tx('Φαγητό', 'Food'),
    categories: [
      {
        id: 'snacks',
        title: tx('Πιάτα & Σνακ', 'Dishes & Snacks'),
        tagline: 'savor every bite',
        items: [
          { name: tx('Κρουασάν Σοκολάτας', 'Chocolate Croissant'), price: 2.5 },
          { name: tx('Σταφιδόψωμο', 'Raisin Bread'), price: 1 },
          { name: tx('Μπάρα Δημητριακών', 'Cereal Bar'), price: 2.5 },
          { name: tx('Μπριός Αλλαντικών', 'Brioche with Cold Cuts'), details: tx('γαλοπούλα ή ζαμπόν', 'turkey or ham'), price: 3 },
          { name: tx('Μπριός Κοτόπουλο', 'Chicken Brioche'), price: 4 },
          { name: tx('Μπριός Κοτομπουκιές', 'Chicken Nugget Brioche'), price: 4 },
          { name: tx('Μπριός Λουκάνικο Φρανκφούρτης', 'Frankfurter Brioche'), price: 4 },
          { name: tx('Τορτίγια Γαλοπούλα', 'Turkey Wrap'), price: 3.5 },
          { name: tx('Τορτίγια Κοτόπουλο', 'Chicken Wrap'), price: 3.8 },
          { name: tx('Κοτομπουκιές, Μερίδα', 'Chicken Nuggets, Portion'), price: 7 },
          { name: tx('Πατάτες, Μερίδα', 'Fries, Portion'), price: 3.5 },
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
        title: tx('Τοστ & Σάντουιτς', 'Toasties & Sandwiches'),
        tagline: 'grab, bite, go.',
        items: [
          { name: tx('Τοστ Τυρί & Γαλοπούλα', 'Cheese & Turkey Toastie'), price: 2.5 },
          { name: tx('Τοστ Τυρί & Ζαμπόν', 'Cheese & Ham Toastie'), price: 2.5 },
          { name: tx('Σάντουιτς Τυρί & Γαλοπούλα', 'Cheese & Turkey Sandwich'), price: 3 },
          { name: tx('Σάντουιτς Τυρί & Ζαμπόν', 'Cheese & Ham Sandwich'), price: 3 },
        ],
      },
      {
        id: 'baguettes',
        title: tx('Μπαγκέτες', 'Baguettes'),
        tagline: 'made fresh daily',
        items: [
          { name: tx('Χωριάτικο Λουκάνικο', 'Village Sausage'), price: 4 },
          {
            name: tx('Φιλέτο Κοτόπουλο', 'Chicken Fillet'),
            details: tx('τυρί, μαρούλι, κίτρινη σως', 'cheese, lettuce, yellow sauce'),
            price: 3.5,
          },
          {
            name: tx('Κοτομπουκιές', 'Chicken Nuggets'),
            details: tx('τυρί, ντομάτα, ροζ σως', 'cheese, tomato, pink sauce'),
            price: 4,
          },
          {
            name: tx('Κοτομπουκιές & Cheddar', 'Chicken Nuggets & Cheddar'),
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
        title: tx('Κλαμπ Σάντουιτς', 'Club Sandwiches'),
        tagline: 'taste every layer',
        items: [
          { name: tx('Γαλοπούλα', 'Turkey'), details: CLUB_FILLING, price: 6 },
          { name: tx('Ζαμπόν', 'Ham'), details: CLUB_FILLING, price: 6 },
          { name: tx('Κοτομπουκιές', 'Chicken Nuggets'), details: CLUB_FILLING, price: 7 },
        ],
      },
      {
        id: 'platters',
        title: tx('Ποικιλίες', 'Sharing Platters'),
        tagline: 'friendship and taste',
        items: [
          { name: tx('Ποικιλία 2 Ατόμων', 'Mixed Platter for 2'), price: 5 },
          { name: tx('Ποικιλία 4 Ατόμων', 'Mixed Platter for 4'), price: 8 },
          { name: tx('Κρύο Πιάτο 2 Ατόμων', 'Cold Plate for 2'), price: 3 },
          { name: tx('Κρύο Πιάτο 4 Ατόμων', 'Cold Plate for 4'), price: 5 },
        ],
      },
    ],
  },
  {
    id: 'sweets',
    label: tx('Κρέπες & Βάφλες', 'Crepes & Waffles'),
    categories: [
      {
        id: 'sweet-crepes',
        title: tx('Γλυκές Κρέπες', 'Sweet Crepes'),
        tagline: 'crepe lovers’ paradise',
        items: [
          {
            name: tx('Πραλίνα Φουντουκιού & Πτι Μπερ', 'Hazelnut Praline & Petit Beurre'),
            details: tx('με τριμμένο μπισκότο πτι μπερ', 'with crushed petit beurre biscuit'),
            price: 4.3,
          },
          { name: tx('Πραλίνα Bueno, Μπισκότο Oreo & Μπανάνα', 'Bueno Praline, Oreo Biscuit & Banana'), price: 4.5 },
          {
            name: tx('Κρέπα Vento', 'Vento Crepe'),
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
                { name: tx('Πουράκια Caprice', 'Caprice Wafer Rolls'), price: 0.9 },
                { name: tx('Σοκολάτα Lacta', 'Lacta Chocolate'), price: 0.9 },
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
          { name: tx('Σοκολάτα με Πραλίνα Φουντουκιού', 'Chocolate Hazelnut Praline'), price: 5 },
          {
            name: tx('Σοκολάτα με Πραλίνα Φουντουκιού, Τριμμένο Oreo & Μπανάνα', 'Chocolate Hazelnut Praline, Crushed Oreo & Banana'),
            price: 6.7,
          },
        ],
        note: EXTRA_CHARGE,
        builder: {
          title: tx('Φτιάξτε τη δική σας βάφλα', 'Build your own waffle'),
          // The printed waffle page lists "Φύλλο κρέπας 2.50" here, copied from the crepe page.
          base: { name: tx('Βάφλα', 'Plain Waffle'), price: 2.5 },
          groups: [
            SPREADS,
            BISCUITS,
            fruit(1.8),
            NUTS,
            SPRINKLES,
            {
              title: tx('Παγωτό', 'Ice Cream'),
              items: [{ name: tx('Βανίλια, Φράουλα, Σοκολάτα', 'Vanilla, Strawberry, Chocolate'), price: 2 }],
            },
          ],
        },
      },
      {
        id: 'savoury-crepes',
        title: tx('Αλμυρές Κρέπες', 'Savoury Crepes'),
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
                { name: tx('Mix Τυριών', 'Cheese Mix'), price: 2.5 },
              ],
            },
            {
              title: tx('Κρεατικά', 'Meat'),
              items: [
                { name: tx('Κοτόπουλο Βραστό', 'Boiled Chicken'), price: 1.2 },
                { name: tx('Κοτόπουλο Φιλέτο ή Ψίχα', 'Chicken Fillet or Breast'), price: 1.4 },
                { name: tx('Κοτομπουκιές', 'Chicken Nuggets'), price: 1.4 },
                { name: tx('Λουκάνικο Χωριάτικο', 'Village Sausage'), price: 1.4 },
                { name: tx('Λουκάνικο Φρανκφούρτης', 'Frankfurter'), price: 1.4 },
              ],
            },
            {
              title: tx('Αλλαντικά', 'Cold Cuts'),
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
                { name: tx('Ροζ Σως', 'Pink Sauce'), price: 0.9 },
                { name: tx('Κίτρινη Σως', 'Yellow Sauce'), price: 0.9 },
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
                { name: tx('Πατάτες Τηγανητές', 'French Fries'), price: 0.9 },
                { name: tx('Πατάτες Sticks', 'Potato Sticks'), price: 0.8 },
              ],
            },
          ],
        },
      },
    ],
  },
  {
    id: 'soft-drinks',
    label: tx('Αναψυκτικά & Σοκολάτες', 'Soft Drinks & Chocolate'),
    categories: [
      {
        id: 'refreshments',
        title: tx('Αναψυκτικά & Χυμοί', 'Soft Drinks & Juices'),
        tagline: 'treat yourself today',
        items: [
          { name: tx('Coca-Cola'), details: tx('κανονική / zero', 'regular / zero'), price: 2.5 },
          { name: tx('Έψα Πορτοκαλάδα', 'Epsa Orangeade'), details: tx('με ή χωρίς ανθρακικό', 'sparkling or still'), price: 2.5 },
          { name: tx('Έψα Λεμονάδα', 'Epsa Lemonade'), price: 2.5 },
          { name: tx('Έψα Βυσσινάδα', 'Epsa Sour Cherry'), price: 2.5 },
          { name: tx('7Up / Sprite'), price: 2.5 },
          { name: tx('Σουρωτή', 'Souroti Sparkling Water'), price: 2.5 },
          {
            name: tx('Lipton Ice Tea'),
            details: tx('λεμόνι / ροδάκινο / πράσινο (0%)', 'lemon / peach / green (0%)'),
            price: 2.5,
          },
          { name: tx('Ήβη Σόδα', 'Ivi Soda Water'), price: 2.5 },
          { name: tx('3 Cents Grapefruit'), price: 4 },
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
          { name: tx('Ήβη Τόνικ', 'Ivi Tonic Water'), price: 2.5 },
          {
            name: tx('Amita'),
            details: tx('ανάμεικτος, μπανάνα, βύσσινο, πορτοκάλι', 'mixed fruit, banana, sour cherry, orange'),
            price: 2.5,
          },
          { name: tx('Amita Motion'), price: 3 },
          { name: tx('Φυσικός Χυμός Πορτοκάλι', 'Fresh Orange Juice'), price: 3 },
          { name: tx('Φυσικός Χυμός Ανάμεικτος', 'Fresh Mixed Juice'), price: 3.5 },
          { name: tx('Φυσικός Χυμός Ρόδι', 'Fresh Pomegranate Juice'), price: 3.5 },
        ],
      },
      {
        id: 'chocolates',
        title: tx('Σοκολάτες & Τσάι', 'Chocolate & Tea'),
        items: [
          { name: tx('Κακάο', 'Cocoa'), price: 2.5 },
          { name: tx('Σοκολάτα', 'Chocolate'), details: HOT_ICED, price: 3 },
          { name: tx('Σοκολάτα Viennois', 'Chocolate Viennois'), details: HOT_ICED, price: 3.5 },
          { name: tx('Σοκολάτα Lacta', 'Lacta Chocolate'), price: 3 },
          { name: tx('Σοκολάτα Caramel Toffee', 'Caramel Toffee Chocolate'), price: 4 },
          { name: tx('Σοκολάτα Waffle', 'Waffle Chocolate'), price: 4 },
          { name: tx('Σοκολάτα Φυστικοβούτυρο & Μπανάνα', 'Peanut Butter & Banana Chocolate'), price: 4 },
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
    id: 'bar',
    label: tx('Μπύρες & Ποτά', 'Beer, Wine & Spirits'),
    categories: [
      {
        id: 'beers',
        title: tx('Μπύρες', 'Beers'),
        tagline: 'cold beer awaits',
        items: [
          { name: tx('Eza Βαρέλι', 'Eza Draught'), price: 3 },
          { name: tx('Eza Lager / Pilsner'), price: 3.5 },
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
            name: tx('Κρασί Λευκό, Ροζέ ή Κόκκινο', 'White, Rosé or Red Wine'),
            details: tx('ποτήρι, ξηρό ή ημίγλυκο', 'by the glass, dry or medium-sweet'),
            price: 5,
          },
          { name: tx('Σαγκριά', 'Sangria'), price: 5 },
          { name: tx('Moscato d’Asti'), price: 5 },
        ],
      },
      {
        id: 'spirits',
        title: tx('Ποτά & Απεριτίφ', 'Spirits & Aperitifs'),
        tagline: 'drink and enjoy',
        items: [
          { name: tx('Ποτό Απλό', 'Standard Drink'), price: 6 },
          { name: tx('Ποτό Σπέσιαλ', 'Premium Drink'), price: 8 },
          { name: tx('Aperol Spritz'), details: tx('με κλασική σόδα', 'with classic soda'), price: 6 },
          { name: tx('Aperol Spritz'), details: tx('με σόδα grapefruit', 'with grapefruit soda'), price: 7 },
          {
            name: tx('Τσίπουρο / Ούζο', 'Tsipouro / Ouzo'),
            details: tx('τσίπουρο με ή χωρίς γλυκάνισο', 'tsipouro with or without anise'),
            price: 2.5,
          },
        ],
      },
    ],
  },
]
