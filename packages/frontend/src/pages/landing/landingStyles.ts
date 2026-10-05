/** The landing page's buttons: one outline, one solid. Both one height. */
export const LANDING_BUTTON_CLASS = {
  outline:
    'inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-md border border-divider px-4 font-medium text-label-value-14 transition-colors hover:bg-surface-secondary',
  solid:
    'inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-md bg-primary px-4 font-medium text-label-value-14 text-primary-invert transition-opacity hover:opacity-85',
} as const

/** One content width for every section, with the gutter the home page uses. */
export const LANDING_CONTAINER_CLASS =
  'mx-auto w-full max-w-[1200px] px-4 md:px-6'

/** Section labels: small caps, spaced, secondary. */
export const LANDING_SECTION_LABEL_CLASS =
  'font-semibold text-label-value-12 text-secondary uppercase tracking-[0.08em]'
