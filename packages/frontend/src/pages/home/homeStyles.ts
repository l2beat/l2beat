/**
 * The home page's small type and icon scale. Every card draws from it, so a
 * title, a row or a number looks the same wherever it appears.
 */
export const HOME_TEXT = {
  /** Card titles. */
  title: 'font-bold text-heading-20 leading-tight',
  /** Blocks inside a card, e.g. a ranking. */
  sectionTitle: 'font-bold text-label-value-14',
  /** Project names and other row labels. */
  row: 'font-bold text-label-value-14',
  /** Values in a row. */
  value: 'font-semibold text-label-value-14 tabular-nums',
  /** Descriptions. */
  body: 'text-label-value-14 text-secondary leading-snug',
  /** Labels, subtitles and other small print. */
  meta: 'font-medium text-label-value-12 text-secondary',
  /** Headline numbers. */
  number: 'font-bold text-heading-24 tabular-nums leading-tight',
  /** Numbers that support a headline. */
  smallNumber: 'font-bold text-heading-18 tabular-nums leading-tight',
} as const

/** Every KPI chart on the page, so the Layer 2s, Privacy and Ethereum pairs match. */
export const HOME_CHART_HEIGHT_CLASS = 'h-36'

/** Every project, chain and token icon on the page. */
export const HOME_ICON_CLASS = 'size-5 shrink-0 rounded-full'

/** Thumbnails of articles and announcements. */
export const HOME_THUMBNAIL_CLASS =
  'aspect-video w-16 shrink-0 rounded-sm object-cover'

/** The page's one button style; neutral, so it adds no colour. */
export const HOME_BUTTON_CLASS =
  'flex items-center gap-1.5 rounded-md border border-divider px-3 py-1.5 font-bold text-label-value-13 transition-colors hover:bg-surface-secondary'
