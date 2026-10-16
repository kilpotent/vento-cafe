// schema.org structured data and a no-JavaScript fallback, both generated from site.ts and
// injected into index.html by the plugin in vite.config.ts. Runs in Node: no browser APIs.
import { DAY_NAMES } from '../i18n/days.ts'
import { formatDays, formatInterval, formatTime, groupDays } from '../lib/hours.ts'
import { HOURS, MAPS, SITE } from './site.ts'

const SCHEMA_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export function structuredData() {
  const { address } = SITE
  return {
    '@context': 'https://schema.org',
    '@type': 'CafeOrCoffeeShop',
    name: SITE.name,
    slogan: SITE.slogan,
    foundingDate: String(SITE.foundedYear),
    telephone: SITE.phones.map((phone) => phone.international),
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.street.el,
      addressLocality: address.city.el,
      addressRegion: address.region.el,
      postalCode: address.postalCode,
      addressCountry: address.countryCode,
    },
    geo: { '@type': 'GeoCoordinates', latitude: SITE.geo.lat, longitude: SITE.geo.lng },
    hasMap: MAPS.place,
    sameAs: [SITE.facebook, SITE.instagram],
    servesCuisine: ['Coffee', 'Crepes', 'Sandwiches'],
    openingHoursSpecification: groupDays(HOURS.cafe).flatMap(({ days, interval }) =>
      interval
        ? [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: days.map((day) => SCHEMA_DAYS[day]),
              opens: formatTime(interval.open),
              closes: formatTime(interval.close),
            },
          ]
        : [],
    ),
  }
}

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function scheduleLine(schedule: typeof HOURS.cafe | typeof HOURS.delivery, lang: 'el' | 'en') {
  return groupDays(schedule)
    .filter((group) => group.interval)
    .map((group) => `${formatDays(group.days, DAY_NAMES[lang].long, ' – ')} ${formatInterval(group.interval!)}`)
    .join(' · ')
}

/** Essential details for visitors and crawlers without JavaScript. */
export function noscriptHtml(): string {
  const { address } = SITE
  const phones = SITE.phones.map((phone) => `<a href="tel:${phone.tel}">${escapeHtml(phone.display)}</a>`).join(' · ')
  const rows = [
    ['Διεύθυνση / Address', `${address.street.el}, ${address.postalCode} ${address.city.el} (${address.landmark.el})`],
    ['Ωράριο', scheduleLine(HOURS.cafe, 'el')],
    ['Hours', scheduleLine(HOURS.cafe, 'en')],
    ['Delivery', `${scheduleLine(HOURS.delivery, 'el')} / ${scheduleLine(HOURS.delivery, 'en')}`],
  ]
  return [
    '<div style="font-family:system-ui,sans-serif;max-width:42rem;margin:3rem auto;padding:0 1.25rem;line-height:1.6">',
    `<h1>${escapeHtml(SITE.name)} — ${escapeHtml(SITE.slogan)}</h1>`,
    `<p>Λαμία, από το ${SITE.foundedYear} · Lamia, since ${SITE.foundedYear}</p>`,
    ...rows.map(([label, value]) => `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`),
    `<p><strong>Τηλέφωνα / Phone:</strong> ${phones}</p>`,
    `<p><a href="${escapeHtml(MAPS.directions)}">Google Maps</a> · <a href="${escapeHtml(SITE.facebook)}">Facebook</a> · <a href="${escapeHtml(SITE.instagram)}">Instagram</a></p>`,
    '</div>',
  ].join('')
}
