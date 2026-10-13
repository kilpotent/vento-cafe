import type { CSSProperties } from 'react'
import { photos, type PhotoName, type Source } from '../assets/images/optimized/manifest.ts'

interface PhotoProps {
  name: PhotoName
  alt: string
  /** Rendered width of the slot, for choosing the right file from the srcset */
  sizes: string
  className?: string
  /** object-position, to keep the subject in frame when the photo is cropped */
  position?: string
  /** Above the fold: load eagerly with high priority */
  priority?: boolean
}

export default function Photo({ name, alt, sizes, className = '', position, priority = false }: PhotoProps) {
  const photo = photos[name]
  const sources: readonly Source[] = photo.sources
  const style: CSSProperties = {
    backgroundImage: `url("${photo.lqip}")`,
    objectPosition: position,
    backgroundPosition: position,
  }
  return (
    <img
      className={`photo ${className}`}
      src={sources[Math.min(1, sources.length - 1)][0]}
      srcSet={sources.map(([src, width]) => `${src} ${width}w`).join(', ')}
      sizes={sizes}
      width={photo.width}
      height={photo.height}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      style={style}
    />
  )
}
