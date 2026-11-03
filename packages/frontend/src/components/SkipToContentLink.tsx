export const MAIN_CONTENT_ID = 'main-content'

/**
 * The first stop on Tab, so keyboard users can jump past the nav. Hidden until
 * focused, so the page looks the same for everyone else.
 */
export function SkipToContentLink() {
  return (
    <a
      href={`#${MAIN_CONTENT_ID}`}
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[1000] focus:rounded-md focus:bg-surface-primary focus:px-4 focus:py-2 focus:font-medium focus:text-primary focus:text-sm focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand"
    >
      Skip to content
    </a>
  )
}
