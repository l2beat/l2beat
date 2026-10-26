/**
 * The home page's type scale: four sizes, far enough apart to read as steps.
 * 13px for labels and small print, 15px for rows and body text, 20px for card
 * titles, 32px for the headline figures. Every card draws from it, so a title,
 * a row or a number looks the same wherever it appears. Weight carries the
 * rest: semibold for titles and figures, medium for rows, regular for print.
 * Line heights are whole, even pixels, so boxes land on the pixel grid and
 * icons centre on text exactly.
 */
export const HOME_TEXT = {
  /** Card titles. */
  title: 'font-semibold text-heading-20 leading-6 tracking-[-0.01em]',
  /** Blocks inside a card, e.g. a ranking. */
  sectionTitle: 'font-semibold text-label-value-15',
  /** Project names and other row labels. */
  row: 'font-medium text-label-value-15',
  /** Values in a row. */
  value: 'font-medium text-label-value-15 tabular-nums',
  /** Descriptions. */
  body: 'text-label-value-15 text-secondary text-pretty leading-5.5',
  /** Labels and other small print. */
  meta: 'font-normal text-label-value-13 text-secondary',
  /**
   * Beside a card title, e.g. "Last 24h". A 16px line, so the title and the
   * subtitle wrapped under it make an even height.
   */
  subtitle: 'font-normal text-label-value-13 text-secondary leading-4',
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
 * underlines and the card's drawing answers the hover instead. Less padded
 * than the cards under it, so the banners stay a strip above the data.
 */
export const HOME_BANNER_CLASS = 'group relative block overflow-hidden md:py-5'
export const HOME_BANNER_TITLE_CLASS =
  'underline-offset-4 group-hover:underline'

/**
 * Every KPI chart on the page, so the Layer 2s, Privacy and Ethereum pairs
 * match; shorter where the KPIs stack as rows and each chart is wide.
 */
export const HOME_CHART_HEIGHT_CLASS = 'h-36 kpi-rows:h-28'

/** Every list and ranking row on the page, so they all match. */
export const HOME_ROW_CLASS = 'h-10'

/**
 * The lines between those rows: over each row but the first, so a list that
 * wraps its overflow out of view ends on its last visible row, with no line
 * under it. Drawn as an inset shadow, not a border, so every row keeps its
 * full 40px and its contents centre on whole pixels.
 */
export const HOME_ROW_LINES_CLASS =
  '[&>li+li]:shadow-[inset_0_1px_0_var(--divider)]'

/** Every project, chain and token icon on the page. */
export const HOME_ICON_CLASS = 'size-5 shrink-0 rounded-full'

/** Thumbnails of articles and announcements. */
export const HOME_THUMBNAIL_CLASS =
  'aspect-video w-20 shrink-0 rounded-sm object-cover'

/** The page's one button style; neutral, so it adds no colour. */
export const HOME_BUTTON_CLASS =
  'flex items-center gap-1.5 rounded-md border border-divider px-3 py-1.5 font-medium text-label-value-13 leading-4 transition-colors hover:bg-surface-secondary'
