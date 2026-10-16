import { useRef, useState, type KeyboardEvent } from 'react'
import { MENU, type AddOn, type Builder, type MenuCategory, type MenuItem, type MenuTabId } from '../data/menu.ts'
import { useLanguage } from '../i18n/context.ts'
import type { Lang } from '../i18n/translations.ts'
import { BeerIcon, CoffeeIcon, SodaIcon, UtensilsIcon, WaffleIcon } from './Icons.tsx'
import './Menu.css'

/** On phones the tabs that aren't selected show only their icon, so all five fit on one row. */
const TAB_ICONS = {
  coffee: CoffeeIcon,
  'soft-drinks': SodaIcon,
  sweets: WaffleIcon,
  food: UtensilsIcon,
  bar: BeerIcon,
} satisfies Record<MenuTabId, typeof CoffeeIcon>

const PRICE_FORMAT: Record<Lang, Intl.NumberFormat> = {
  el: new Intl.NumberFormat('el-GR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  en: new Intl.NumberFormat('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
}

/** Arrow keys, Home and End move between tabs (WAI-ARIA tabs pattern, automatic activation). */
const TAB_KEYS: Record<string, (index: number) => number> = {
  ArrowRight: (index) => (index + 1) % MENU.length,
  ArrowLeft: (index) => (index - 1 + MENU.length) % MENU.length,
  Home: () => 0,
  End: () => MENU.length - 1,
}

function usePrices() {
  const { t, lang } = useLanguage()
  const format = (price: number) => (price === 0 ? t.menu.free : PRICE_FORMAT[lang].format(price))
  return {
    price: (price: MenuItem['price']) => (typeof price === 'number' ? format(price) : price.map(format).join(' / ')),
    addOn: (price: AddOn['price']) => (price === undefined ? '+' : price === 0 ? format(price) : `+${format(price)}`),
  }
}

const itemKey = (item: MenuItem | AddOn) => `${item.name.en}|${item.details?.en ?? ''}`

export default function Menu() {
  const { t, lang } = useLanguage()
  const [active, setActive] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])

  const onTabKeyDown = (event: KeyboardEvent) => {
    const move = TAB_KEYS[event.key]
    if (!move) return
    event.preventDefault()
    const next = move(active)
    setActive(next)
    tabs.current[next]?.focus()
  }

  return (
    <section id="menu" className="section section--cream menu" aria-labelledby="menu-title" tabIndex={-1}>
      <div className="container">
        <header className="section-head section-head--center">
          <p className="eyebrow" data-reveal>
            {t.menu.eyebrow}
          </p>
          <h2 id="menu-title" className="display" data-reveal>
            {t.menu.title}
          </h2>
          <p className="section-head__intro" data-reveal>
            {t.menu.intro}
          </p>
        </header>

        {/* A folder: the tabs sit on the board and the active one joins it. */}
        <div className="menu__folder" data-reveal>
          <div className="menu__tabs" role="tablist" aria-label={t.menu.tabs} onKeyDown={onTabKeyDown}>
            {MENU.map((tab, index) => {
              const TabIcon = TAB_ICONS[tab.id]
              return (
                <button
                  key={tab.id}
                  ref={(element) => {
                    tabs.current[index] = element
                  }}
                  type="button"
                  role="tab"
                  id={`menu-tab-${tab.id}`}
                  className="menu__tab"
                  aria-selected={index === active}
                  aria-controls={`menu-panel-${tab.id}`}
                  tabIndex={index === active ? 0 : -1}
                  onClick={() => setActive(index)}
                >
                  <TabIcon className="menu__tab-icon" />
                  <span className="menu__tab-label">{tab.label[lang]}</span>
                </button>
              )
            })}
          </div>

          <div className="menu__board">
            {MENU.map((tab, index) => (
              <div
                key={tab.id}
                role="tabpanel"
                id={`menu-panel-${tab.id}`}
                className="menu__panel"
                aria-labelledby={`menu-tab-${tab.id}`}
                tabIndex={0}
                hidden={index !== active}
              >
                {tab.categories.map((category) => (
                  <Category key={category.id} category={category} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Category({ category }: { category: MenuCategory }) {
  const { lang } = useLanguage()
  const titleId = `menu-${category.id}`
  return (
    <section className="menu-category" aria-labelledby={titleId}>
      <header className="menu-category__head">
        <h3 id={titleId} className="menu-category__title">
          {category.title[lang]}
        </h3>
        <span className="menu-category__rule" aria-hidden="true" />
        {category.tagline && (
          <p className="menu-category__tagline" lang="en">
            {category.tagline}
          </p>
        )}
      </header>
      {category.items && <Items items={category.items} />}
      {category.note && <p className="menu-category__note">{category.note[lang]}</p>}
      {category.builder && <BuildYourOwn builder={category.builder} />}
      {category.extras && <Extras extras={category.extras} />}
    </section>
  )
}

function Items({ items }: { items: readonly MenuItem[] }) {
  const { lang } = useLanguage()
  const { price } = usePrices()
  return (
    <ul className="menu-list plain-list">
      {items.map((item) => (
        <li key={itemKey(item)} className="menu-item">
          <span className="menu-item__name">{item.name[lang]}</span>
          <span className="menu-item__dots" aria-hidden="true" />
          <span className="menu-item__price">{price(item.price)}</span>
          {item.details && <span className="menu-item__details">{item.details[lang]}</span>}
        </li>
      ))}
    </ul>
  )
}

function BuildYourOwn({ builder }: { builder: Builder }) {
  const { lang } = useLanguage()
  const { price, addOn } = usePrices()
  return (
    <div className="menu-builder">
      <div className="menu-builder__head">
        <h4 className="menu-builder__title">{builder.title[lang]}</h4>
        <p className="menu-builder__base">
          {builder.base.name[lang]}
          <span className="menu-builder__base-price">{price(builder.base.price)}</span>
        </p>
      </div>
      <div className="menu-builder__groups">
        {builder.groups.map((group) => (
          <div key={group.title.en} className="menu-builder__group">
            <h5 className="menu-builder__group-title">{group.title[lang]}</h5>
            <ul className="plain-list">
              {group.items.map((item) => (
                <li key={itemKey(item)} className="menu-addon">
                  <span>{item.name[lang]}</span>
                  <span className="menu-addon__price">{addOn(item.price)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

function Extras({ extras }: { extras: readonly AddOn[] }) {
  const { lang } = useLanguage()
  const { addOn } = usePrices()
  return (
    <ul className="menu-extras plain-list">
      {extras.map((extra) => (
        <li key={itemKey(extra)}>
          <span className="menu-extras__price">{addOn(extra.price)}</span>
          <span>
            {extra.name[lang]}
            {extra.details && <span className="menu-extras__details"> ({extra.details[lang]})</span>}
          </span>
        </li>
      ))}
    </ul>
  )
}
