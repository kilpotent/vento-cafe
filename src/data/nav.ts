/** In-page sections reachable from the navigation, in page order. */
export const SECTIONS = ['story', 'drinks', 'menu', 'gallery', 'hours', 'contact'] as const
export type SectionId = (typeof SECTIONS)[number]

/** Sections watched for scroll-spy; "top" (the hero) clears the highlight. */
export const SPY_TARGETS: readonly string[] = ['top', ...SECTIONS]
