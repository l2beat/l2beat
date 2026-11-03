/**
 * The chain a project page shows: the requested one when the project is
 * tracked on it, otherwise the primary chain, which is the first tracked one.
 */
export function resolvePrivacyChain(
  trackedOn: string[],
  requested: string | undefined,
): string {
  const primary = trackedOn[0]
  if (primary === undefined) {
    throw new Error('Privacy project tracked on no chain')
  }
  return requested !== undefined && trackedOn.includes(requested)
    ? requested
    : primary
}

/** The project page URL for a chain: the bare URL on the primary chain. */
export function getPrivacyProjectChainHref(
  slug: string,
  trackedOn: string[],
  chain: string,
): string {
  const href = `/privacy/projects/${slug}`
  return chain === trackedOn[0] ? href : `${href}?chain=${chain}`
}
