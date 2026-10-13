// Business details: the single source of truth for the UI, the opening-hours logic and the
// structured data / no-JS fallback that vite.config.ts injects into index.html.
// Keep this file free of browser APIs: the Vite config imports it in Node.

/** Minutes after midnight. `close` may go past 1440 for times after midnight (e.g. 26 * 60 = 02:00). */
export interface Interval {
  open: number
  close: number
}

/** One entry per weekday, Monday first. `null` = closed / no service that day. */
export type WeekSchedule = readonly [
  Interval | null,
  Interval | null,
  Interval | null,
  Interval | null,
  Interval | null,
  Interval | null,
  Interval | null,
]

const at = (hours: number, minutes = 0) => hours * 60 + minutes

const weekday: Interval = { open: at(5), close: at(24) }
const sunday: Interval = { open: at(6), close: at(24) }
const delivery: Interval = { open: at(6), close: at(9) }

export const HOURS = {
  //       Mon      Tue      Wed      Thu      Fri      Sat      Sun
  cafe: [weekday, weekday, weekday, weekday, weekday, weekday, sunday],
  delivery: [delivery, delivery, delivery, delivery, delivery, delivery, null],
} satisfies Record<string, WeekSchedule>

export const SITE = {
  name: 'Vento Café',
  slogan: 'In Coffee We Trust',
  foundedYear: 2011,
  timeZone: 'Europe/Athens',
  phones: [
    { kind: 'landline', display: '2231 036514', international: '+30 2231 036514', tel: '+302231036514' },
    { kind: 'mobile', display: '697 265 8895', international: '+30 697 265 8895', tel: '+306972658895' },
  ],
  address: {
    street: { el: 'Κισσάβου & Ι. Γιαννιτσιώτη', en: 'Kissavou & I. Giannitsioti' },
    landmark: { el: 'πίσω από τα Jumbo', en: 'behind the Jumbo store' },
    city: { el: 'Λαμία', en: 'Lamia' },
    region: { el: 'Φθιώτιδα', en: 'Fthiotida' },
    country: { el: 'Ελλάδα', en: 'Greece' },
    postalCode: '351 33',
    countryCode: 'GR',
  },
  geo: { lat: 38.8926333, lng: 22.4433725 },
  google: {
    placeId: 'ChIJx4KUz6VaXxMRkg44PuhGfw8',
    featureId: '0x135f5aa5cf9482c7:0xf7f46e83e380e92',
  },
  facebook: 'https://www.facebook.com/ventocafelamias/',
} as const

export type PhoneKind = (typeof SITE.phones)[number]['kind']

export const MAPS = {
  place: `https://www.google.com/maps/place//data=!4m2!3m1!1s${SITE.google.featureId}`,
  directions:
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${SITE.name}, ${SITE.address.city.el}`)}` +
    `&destination_place_id=${SITE.google.placeId}`,
  /** Keyless Google Maps embed centred on the café's place card. */
  embed: (lang: 'el' | 'en') =>
    'https://www.google.com/maps/embed?pb=' +
    `!1m18!1m12!1m3!1d1400!2d${SITE.geo.lng}!3d${SITE.geo.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1` +
    `!3m3!1m2!1s${encodeURIComponent(SITE.google.featureId)}!2s${encodeURIComponent(SITE.name)}` +
    `!5e0!3m2!1s${lang}!2sgr!4v1759600000000!5m2!1s${lang}!2sgr`,
}
