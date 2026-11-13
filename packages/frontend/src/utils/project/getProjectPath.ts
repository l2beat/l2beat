/**
 * Every project's page, whichever sections it is in. The one place that knows
 * the URL: with `:slug` it is the route's pattern.
 */
export function getProjectPath(slug: string): `/projects/${string}` {
  return `/projects/${slug}`
}

/**
 * Where project pages were before they moved to `/projects/{slug}`: the old
 * URLs redirect, and what a browser stored under them is read as the new one.
 */
export const OLD_PROJECT_PATH_PREFIXES = {
  layer2s: '/layer2s/projects',
  privacy: '/privacy/projects',
  defi: '/defi/projects',
  interop: '/interop/protocols',
  zkCatalog: '/zk-catalog',
} as const

export function getProjectTvsBreakdownPath(slug: string) {
  return `${getProjectPath(slug)}/tvs-breakdown` as const
}

/** The social preview image of a project's page, made by `pnpm og-images`. */
export function getProjectOgImagePath(slug: string) {
  return `/meta-images/projects/${slug}/opengraph-image.png`
}
