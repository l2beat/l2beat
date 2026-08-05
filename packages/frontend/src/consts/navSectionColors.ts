/**
 * Per-section accent colors, keyed by the `match` of the corresponding
 * {@link import('~/components/nav/types').NavGroup}. Shared by the home stats
 * tiles and the side nav so the two never drift apart.
 */
export interface NavSectionColor {
  /** Includes the paint property, since some icons are stroked and some filled. */
  iconClassName: string
  /**
   * The same paint, applied from the wrapper to an already-built icon element.
   * Spelled out rather than derived, because Tailwind only sees literal classes.
   */
  svgClassName: string
  bgClassName: string
}

export const navSectionColors = {
  home: {
    iconClassName: 'stroke-brand',
    svgClassName: '[&>svg]:stroke-brand',
    bgClassName: 'bg-brand/10',
  },
  scaling: {
    iconClassName: 'stroke-pink-100',
    svgClassName: '[&>svg]:stroke-pink-100',
    bgClassName: 'bg-pink-100/10',
  },
  interop: {
    iconClassName: 'stroke-orange-500',
    svgClassName: '[&>svg]:stroke-orange-500',
    bgClassName: 'bg-orange-500/10',
  },
  privacy: {
    iconClassName: 'stroke-green-450',
    svgClassName: '[&>svg]:stroke-green-450',
    bgClassName: 'bg-green-450/10',
  },
  'data-availability': {
    iconClassName: 'fill-blue-500',
    svgClassName: '[&>svg]:fill-blue-500',
    bgClassName: 'bg-blue-500/10',
  },
  'zk-catalog': {
    iconClassName: 'stroke-purple-500',
    svgClassName: '[&>svg]:stroke-purple-500',
    bgClassName: 'bg-purple-500/10',
  },
  ecosystems: {
    iconClassName: 'stroke-teal-500',
    svgClassName: '[&>svg]:stroke-teal-500',
    bgClassName: 'bg-teal-500/10',
  },
} satisfies Record<string, NavSectionColor>

export function getNavSectionColor(match: string): NavSectionColor | undefined {
  return (navSectionColors as Record<string, NavSectionColor | undefined>)[
    match
  ]
}
