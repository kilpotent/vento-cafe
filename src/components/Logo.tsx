import { logos, type Source } from '../assets/images/optimized/manifest.ts'

interface LogoProps {
  /** "white" on dark backgrounds, "black" on light ones */
  tone: 'white' | 'black'
  alt: string
  sizes: string
  className?: string
  priority?: boolean
}

export default function Logo({ tone, alt, sizes, className, priority = false }: LogoProps) {
  const logo = logos[tone]
  const sources: readonly Source[] = logo.sources
  return (
    <img
      className={className}
      src={sources[sources.length - 1][0]}
      srcSet={sources.map(([src, width]) => `${src} ${width}w`).join(', ')}
      sizes={sizes}
      width={logo.width}
      height={logo.height}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
    />
  )
}
