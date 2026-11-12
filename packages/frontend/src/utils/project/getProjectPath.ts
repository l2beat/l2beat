/**
 * Every project's page, whichever sections it is in. The one place that knows
 * the URL: with `:slug` it is the route's pattern.
 */
export function getProjectPath(slug: string): `/projects/${string}` {
  return `/projects/${slug}`
}

export function getProjectTvsBreakdownPath(slug: string) {
  return `${getProjectPath(slug)}/tvs-breakdown` as const
}

/** The social preview image of a project's page, made by `pnpm og-images`. */
export function getProjectOgImagePath(slug: string) {
  return `/meta-images/projects/${slug}/opengraph-image.png`
}
