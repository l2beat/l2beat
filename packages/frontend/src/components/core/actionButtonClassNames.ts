import { cn } from '~/utils/cn'

const ACTION_BUTTON_FOCUS =
  'ring-brand ring-offset-1 ring-offset-background focus-visible:outline-none focus-visible:ring-2'

/** A primary action: the brand pink, like the selected state of toggles. */
export const ACTION_BUTTON_CLASS = cn(
  'inline-flex h-8 w-fit items-center justify-center gap-1.5 whitespace-nowrap rounded-md bg-brand px-3 font-medium text-label-value-13 text-white leading-4 transition-colors hover:bg-brand/90',
  ACTION_BUTTON_FOCUS,
)

/**
 * A primary action in a project page section. On phones it spans the
 * section, where a pink block that wide would outweigh the content, so it is
 * an outline there and a fill from md.
 */
export const SECTION_ACTION_BUTTON_CLASS = cn(
  'flex w-full items-center justify-center whitespace-nowrap rounded-md border border-brand p-3 font-medium text-label-value-13 text-primary leading-4 transition-colors hover:bg-brand/10',
  'md:h-8 md:w-fit md:border-0 md:bg-brand md:px-3 md:py-0 md:text-white md:hover:bg-brand/90',
  ACTION_BUTTON_FOCUS,
)
