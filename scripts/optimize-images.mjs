// Generates web-ready images from the originals in src/assets/images.
// Run with `npm run images` whenever photos or logos change.
//   - responsive WebP variants + tiny blur placeholders for every photo
//   - logo variants (full + compact without the tagline) for both colours
//   - favicons, apple-touch-icon and the Open Graph share image in /public
//   - src/assets/images/optimized/manifest.ts (typed imports used by the app)
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const imagesDir = path.join(root, 'src/assets/images')
const photosDir = path.join(imagesDir, 'photos')
const outDir = path.join(imagesDir, 'optimized')
const publicDir = path.join(root, 'public')

const NIGHT = '#0a1730'

// name -> original file in src/assets/images/photos (named after the photo), optionally with a crop region in source pixels
const PHOTOS = {
  'bar-counter': 'bar-counter.jpg',
  // 3:4 detail of the bar: Edison bulbs, pastries and the "IN COFFEE" lettering (keeps the TV out of frame)
  'bar-morning': { file: 'bar-counter.jpg', extract: { left: 0, top: 200, width: 912, height: 1216 } },
  'olive-terrace': 'olive-terrace.jpg',
  'night-exterior': 'night-exterior.jpg',
  'dusk-corner': 'dusk-corner.jpg',
  'evening-drinks': 'evening-drinks.jpg',
  'back-bar': 'back-bar.jpg',
  'pergola-night': 'pergola-night.jpg',
  'coffee-bar': 'coffee-bar.jpg',
  'crepes': 'crepes.jpg',
  'matchday': 'matchday.jpg',
  'drinks': 'drinks.jpg',
  'delivery': 'delivery.jpg',
  'iced-coffee': 'iced-coffee.jpg',
  'white-wine': 'white-wine.jpg',
  // trims the thin gold frame along the left and right edges of the original screenshot
  'freddo-cups': { file: 'freddo-cups.jpeg', extract: { left: 6, top: 0, width: 932, height: 1343 } },
  'club-sandwich': 'club-sandwich.jpeg',
  'banana-crepe': 'banana-crepe.jpeg',
  'waffles': 'waffles.jpeg',
  'waffle-box': 'waffle-box.jpeg',
  'chicken-nuggets': 'chicken-nuggets.jpeg',
}
const PHOTO_WIDTHS = [480, 960, 1600]

const LOGOS = {
  white: 'logos/logo-white.png',
  black: 'logos/logo-black.png',
}

const camel = (s) => s.replace(/-(\w)/g, (_, c) => c.toUpperCase())

async function photoVariants(name, entry) {
  const { file, extract } = typeof entry === 'string' ? { file: entry } : entry
  const source = await sharp(path.join(photosDir, file)).rotate().toBuffer()
  const input = extract ? await sharp(source).extract(extract).toBuffer() : source
  const { width, height } = await sharp(input).metadata()
  const widths = [...new Set(PHOTO_WIDTHS.map((w) => Math.min(w, width)))]
  const variants = []
  for (const w of widths) {
    const out = `${name}-${w}.webp`
    await sharp(input).resize({ width: w }).webp({ quality: 74, effort: 6 }).toFile(path.join(outDir, out))
    variants.push({ file: out, width: w })
  }
  const lqip = await sharp(input).resize({ width: 24 }).webp({ quality: 40 }).toBuffer()
  return { width, height, variants, lqip: `data:image/webp;base64,${lqip.toString('base64')}` }
}

// The logo lockup is: emblem, "Vento" wordmark, then the tagline in its own band at the bottom.
// Find the empty gap above the tagline so the header can use a compact version without it.
async function taglineCutRow(input) {
  const { data, info } = await sharp(input).extractChannel('alpha').raw().toBuffer({ resolveWithObject: true })
  const rowHasInk = (y) => {
    for (let x = 0; x < info.width; x++) if (data[y * info.width + x] > 16) return true
    return false
  }
  let y = info.height - 1
  while (y > 0 && !rowHasInk(y)) y-- // bottom padding
  while (y > 0 && rowHasInk(y)) y-- // tagline band
  const gapBottom = y
  while (y > 0 && !rowHasInk(y)) y-- // gap between wordmark and tagline
  return Math.round((y + gapBottom) / 2)
}

// The emblem sits in the top-centre of the lockup, above the wordmark and away from the dot of the "e".
async function emblemBuffer(input) {
  const meta = await sharp(input).metadata()
  const region = {
    left: Math.round(meta.width * 0.372),
    top: 0,
    width: Math.round(meta.width * 0.31),
    height: Math.round(meta.height * 0.45),
  }
  return trimmed(await sharp(input).extract(region).png().toBuffer())
}

// sharp runs trim() before extract() within one pipeline, so trimming a crop needs a second pass.
const trimmed = (buffer) => sharp(buffer).trim({ threshold: 1 }).png().toBuffer()

async function squareIcon(emblem, size, { background, padding }) {
  const inner = Math.round(size * (1 - padding * 2))
  const resized = await sharp(emblem).resize({ width: inner, height: inner, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer()
  return sharp({ create: { width: size, height: size, channels: 4, background: background ?? { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: resized, gravity: 'center' }])
    .png()
}

async function main() {
  await fs.rm(outDir, { recursive: true, force: true })
  await fs.mkdir(outDir, { recursive: true })

  const photoEntries = {}
  for (const [name, entry] of Object.entries(PHOTOS)) {
    photoEntries[name] = await photoVariants(name, entry)
    console.log(`photo  ${name.padEnd(16)} ${photoEntries[name].variants.map((v) => v.width).join(', ')}`)
  }

  const logoEntries = {}
  for (const [tone, file] of Object.entries(LOGOS)) {
    const input = path.join(imagesDir, file)
    const meta = await sharp(input).metadata()
    const full = []
    for (const w of [600, 1200]) {
      const out = `logo-${tone}-${w}.webp`
      await sharp(input).resize({ width: w }).webp({ quality: 92, alphaQuality: 100, effort: 6 }).toFile(path.join(outDir, out))
      full.push({ file: out, width: w })
    }
    const cut = await taglineCutRow(input)
    const compactFile = `logo-${tone}-compact.webp`
    const compactBuf = await trimmed(await sharp(input).extract({ left: 0, top: 0, width: meta.width, height: cut }).png().toBuffer())
    const compactMeta = await sharp(compactBuf).metadata()
    await sharp(compactBuf).resize({ width: 560 }).webp({ quality: 92, alphaQuality: 100, effort: 6 }).toFile(path.join(outDir, compactFile))
    logoEntries[tone] = {
      width: meta.width,
      height: meta.height,
      full,
      compact: { file: compactFile, width: compactMeta.width, height: compactMeta.height },
    }
    console.log(`logo   ${tone.padEnd(16)} full + compact (cut at row ${cut})`)
  }

  // Emblem: decorative mark + favicons + share image
  const emblem = await emblemBuffer(path.join(imagesDir, LOGOS.black))
  const emblemMeta = await sharp(emblem).metadata()
  await sharp(emblem).resize({ width: 320 }).webp({ quality: 92, alphaQuality: 100 }).toFile(path.join(outDir, 'emblem.webp'))

  const night = { r: 10, g: 23, b: 48, alpha: 1 }
  await (await squareIcon(emblem, 32, { padding: 0.02 })).toFile(path.join(publicDir, 'favicon-32.png'))
  await (await squareIcon(emblem, 192, { padding: 0.04 })).toFile(path.join(publicDir, 'icon-192.png'))
  await (await squareIcon(emblem, 512, { background: night, padding: 0.16 })).toFile(path.join(publicDir, 'icon-512.png'))
  await (await squareIcon(emblem, 180, { background: night, padding: 0.16 })).toFile(path.join(publicDir, 'apple-touch-icon.png'))

  const ogLogo = await sharp(path.join(imagesDir, LOGOS.white)).resize({ width: 700 }).png().toBuffer()
  await sharp({ create: { width: 1200, height: 630, channels: 4, background: NIGHT } })
    .composite([{ input: ogLogo, gravity: 'center' }])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(path.join(publicDir, 'og-image.jpg'))
  console.log(`emblem ${emblemMeta.width}x${emblemMeta.height} -> favicons, apple-touch-icon, og-image`)

  // Typed manifest
  const lines = [
    '// AUTO-GENERATED by scripts/optimize-images.mjs (npm run images). Do not edit by hand.',
    '',
  ]
  const imports = []
  const photoObj = []
  for (const [name, p] of Object.entries(photoEntries)) {
    const srcs = p.variants.map((v) => {
      const id = camel(`${name}-${v.width}`)
      imports.push(`import ${id} from './${v.file}'`)
      return `[${id}, ${v.width}]`
    })
    photoObj.push(
      `  '${name}': {\n    width: ${p.width},\n    height: ${p.height},\n    lqip: '${p.lqip}',\n    sources: [${srcs.join(', ')}],\n  },`,
    )
  }
  const logoObj = []
  for (const [tone, l] of Object.entries(logoEntries)) {
    const srcs = l.full.map((v) => {
      const id = camel(`logo-${tone}-${v.width}`)
      imports.push(`import ${id} from './${v.file}'`)
      return `[${id}, ${v.width}]`
    })
    const compactId = camel(`logo-${tone}-compact`)
    imports.push(`import ${compactId} from './${l.compact.file}'`)
    logoObj.push(
      `  ${tone}: {\n    width: ${l.width},\n    height: ${l.height},\n    sources: [${srcs.join(', ')}],\n    compact: { src: ${compactId}, width: ${l.compact.width}, height: ${l.compact.height} },\n  },`,
    )
  }
  imports.push(`import emblemSrc from './emblem.webp'`)
  lines.push(...imports, '')
  lines.push('export type Source = readonly [src: string, width: number]', '')
  lines.push(`export const photos = {\n${photoObj.join('\n')}\n} satisfies Record<string, { width: number; height: number; lqip: string; sources: readonly Source[] }>`, '')
  lines.push('export type PhotoName = keyof typeof photos', '')
  lines.push(`export const logos = {\n${logoObj.join('\n')}\n} as const`, '')
  lines.push(`export const emblem = { src: emblemSrc, width: ${emblemMeta.width}, height: ${emblemMeta.height} } as const`, '')
  await fs.writeFile(path.join(outDir, 'manifest.ts'), lines.join('\n'))
  console.log('wrote src/assets/images/optimized/manifest.ts')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
