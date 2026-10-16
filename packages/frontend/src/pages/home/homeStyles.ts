/**
 * The home page's type scale: four sizes, far enough apart to read as steps.
 * 13px for labels and small print, 15px for rows and body text, 20px for card
 * titles, 32px for the headline figures. Every card draws from it, so a title,
 * a row or a number looks the same wherever it appears. Weight carries the
 * rest: semibold for titles and figures, medium for rows, regular for print.
 */
export const HOME_TEXT = {
  /** Card titles. */
  title: 'font-semibold text-heading-20 leading-tight tracking-[-0.01em]',
  /** Blocks inside a card, e.g. a ranking. */
  sectionTitle: 'font-semibold text-label-value-15',
  /** Project names and other row labels. */
  row: 'font-medium text-label-value-15',
  /** Values in a row. */
  value: 'font-medium text-label-value-15 tabular-nums',
  /** Descriptions. */
  body: 'text-label-value-15 text-secondary text-pretty leading-normal',
  /** Labels, subtitles and other small print. */
  meta: 'font-normal text-label-value-13 text-secondary',
  /** Headline figures. */
  number:
    'font-semibold text-heading-32 tabular-nums leading-none tracking-[-0.025em]',
} as const

/**
 * How the page marks a text link: a quiet underline in the divider's tone,
 * taking the text's colour on hover (add `hover:` or `group-hover:`
 * `decoration-current`). No chevrons.
 */
export const HOME_UNDERLINE_CLASS =
  'underline decoration-divider underline-offset-[0.3em] transition-colors'

/**
 * A card that is one link (the garden, the mandate): no chevron, the title
 * underlines and the card's drawing answers the hover instead.
 */
export const HOME_BANNER_CLASS = 'group relative block overflow-hidden'
export const HOME_BANNER_TITLE_CLASS =
  'underline-offset-4 group-hover:underline'

/** Every KPI chart on the page, so the Layer 2s, Privacy and Ethereum pairs match. */
export const HOME_CHART_HEIGHT_CLASS = 'h-36'

/** Every list and ranking row on the page, so they all match. */
export const HOME_ROW_CLASS = 'h-10'

/**
 * The lines between those rows: over each row but the first, so a list that
 * wraps its overflow out of view ends on its last visible row, with no line
 * under it.
 */
export const HOME_ROW_LINES_CLASS =
  '[&>li+li]:border-divider [&>li+li]:border-t'

/** Every project, chain and token icon on the page. */
export const HOME_ICON_CLASS = 'size-5 shrink-0 rounded-full'

/** Thumbnails of articles and announcements. */
export const HOME_THUMBNAIL_CLASS =
  'aspect-video w-20 shrink-0 rounded-sm object-cover'

/** The page's one button style; neutral, so it adds no colour. */
export const HOME_BUTTON_CLASS =
  'flex items-center gap-1.5 rounded-md border border-divider px-3 py-1.5 font-medium text-label-value-13 transition-colors hover:bg-surface-secondary'
