import type { Project } from '@l2beat/config'
import { manifest } from '~/utils/Manifest'
import { TOKEN_PLACEHOLDER_ICON_URL } from '~/utils/tokenPlaceholderIconUrl'

export interface InteropProtocolDisplay {
  name: string
  /** Undefined when the project was removed from config: it has no page to link to. */
  slug: string | undefined
  iconUrl: string
}

/**
 * Historical snapshots keep transfer records of projects that were later
 * removed from config (e.g. squid, across-v3). They still carry real volume,
 * so we label them instead of dropping them, which would understate totals,
 * or asserting, which would fail the whole request.
 */
export function getInteropProtocolDisplay(
  id: string,
  interopProjects: Project<'interopConfig'>[],
): InteropProtocolDisplay {
  const project = interopProjects.find((p) => p.id === id)
  if (!project) {
    return {
      name: `Unknown (${id})`,
      slug: undefined,
      iconUrl: TOKEN_PLACEHOLDER_ICON_URL,
    }
  }
  return {
    name: project.interopConfig.name ?? project.name,
    slug: project.slug,
    iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
  }
}
