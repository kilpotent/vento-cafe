import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import { useLanguage } from '../i18n/context.ts'
import type { GalleryPhoto } from '../i18n/translations.ts'
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from './Icons.tsx'
import Photo from './Photo.tsx'
import './Gallery.css'

// Food and coffee only: none of the photos already used higher up the page, and no shots of the shop itself.
const PHOTOS: readonly GalleryPhoto[] = [
  'club-sandwich',
  'freddo-cups',
  'banana-crepe',
  'delivery',
  'waffle-box',
  'chicken-nuggets',
  'waffles',
  'evening-drinks',
]

/** Positions in PHOTOS that get a big 2×2 tile (matches the nth-child rules in Gallery.css). */
const BIG_TILES = [0, 6]

/** Keeps each subject in frame inside the cropped grid tiles. */
const FOCUS: Partial<Record<GalleryPhoto, string>> = {
  'club-sandwich': '50% 65%',
  'freddo-cups': '50% 80%',
  'banana-crepe': '50% 45%',
  delivery: '50% 70%',
  'waffle-box': '50% 60%',
  'chicken-nuggets': '50% 70%',
  waffles: '50% 60%',
  'evening-drinks': '40% 55%',
}

export default function Gallery() {
  const { t } = useLanguage()
  const [index, setIndex] = useState<number | null>(null)

  return (
    <section id="gallery" className="section section--cream gallery" aria-labelledby="gallery-title" tabIndex={-1}>
      <div className="container">
        <header className="gallery__head">
          <div>
            <p className="eyebrow" data-reveal>
              {t.gallery.eyebrow}
            </p>
            <h2 id="gallery-title" className="display" data-reveal>
              {t.gallery.title}
            </h2>
          </div>
          <p className="section-head__intro" data-reveal>
            {t.gallery.intro}
          </p>
        </header>

        <ul className="gallery__grid plain-list">
          {PHOTOS.map((name, i) => {
            const { caption } = t.gallery.photos[name]
            return (
              <li key={name} className="gallery__item" data-reveal style={{ '--reveal-delay': i % 4 } as CSSProperties}>
                <button
                  type="button"
                  className="gallery__button"
                  aria-haspopup="dialog"
                  aria-label={t.gallery.open(caption)}
                  onClick={() => setIndex(i)}
                >
                  <Photo
                    name={name}
                    alt=""
                    sizes={BIG_TILES.includes(i) ? '(min-width: 760px) 50vw, 100vw' : '(min-width: 760px) 25vw, 50vw'}
                    position={FOCUS[name]}
                  />
                  <span className="gallery__caption" aria-hidden="true">
                    {caption}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <Lightbox index={index} onChange={setIndex} />
    </section>
  )
}

function Lightbox({ index, onChange }: { index: number | null; onChange: (index: number | null) => void }) {
  const { t } = useLanguage()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const swipeStart = useRef<number | null>(null)
  const isOpen = index !== null

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  const close = () => onChange(null)
  const step = (delta: number) => {
    if (index !== null) onChange((index + delta + PHOTOS.length) % PHOTOS.length)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'ArrowRight') step(1)
    else if (event.key === 'ArrowLeft') step(-1)
    else return
    event.preventDefault()
  }

  const onPointerDown = (event: PointerEvent<HTMLDialogElement>) => {
    swipeStart.current = event.pointerType === 'mouse' ? null : event.clientX
  }

  const onPointerUp = (event: PointerEvent<HTMLDialogElement>) => {
    if (swipeStart.current === null) return
    const distance = event.clientX - swipeStart.current
    swipeStart.current = null
    if (Math.abs(distance) > 50) step(distance < 0 ? 1 : -1)
  }

  const name = index !== null ? PHOTOS[index] : null

  return (
    <dialog
      ref={dialogRef}
      className="lightbox"
      aria-label={t.gallery.dialogLabel}
      onClose={close}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onClick={(event) => {
        // Clicks on the dimmed area around the photo land on the <dialog> itself.
        if (event.target === event.currentTarget) close()
      }}
    >
      {name && index !== null && (
        <>
          <figure className="lightbox__figure">
            <Photo key={name} name={name} alt={t.gallery.photos[name].alt} sizes="92vw" priority className="lightbox__img" />
            <figcaption className="lightbox__caption" aria-live="polite">
              <span>{t.gallery.photos[name].caption}</span>
              <span className="lightbox__count">
                <span aria-hidden="true">
                  {index + 1} / {PHOTOS.length}
                </span>
                <span className="sr-only">{t.gallery.position(index + 1, PHOTOS.length)}</span>
              </span>
            </figcaption>
          </figure>
          <button type="button" className="lightbox__btn lightbox__close" onClick={close}>
            <CloseIcon />
            <span className="sr-only">{t.gallery.close}</span>
          </button>
          <button type="button" className="lightbox__btn lightbox__prev" onClick={() => step(-1)}>
            <ChevronLeftIcon />
            <span className="sr-only">{t.gallery.previous}</span>
          </button>
          <button type="button" className="lightbox__btn lightbox__next" onClick={() => step(1)}>
            <ChevronRightIcon />
            <span className="sr-only">{t.gallery.next}</span>
          </button>
        </>
      )}
    </dialog>
  )
}
