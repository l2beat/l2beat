import { getChainProjectPath } from '~/pages/chain/paths'
import { manifest } from '~/utils/Manifest'
import type { selectChainProjects } from '../../chains/getChainProjects'
import type { SearchBarProjectEntry } from '../types'

type ChainProject = ReturnType<typeof selectChainProjects>[number]

export function getSearchBarChainEntry(
  chain: ChainProject,
): SearchBarProjectEntry {
  return {
    type: 'project',
    id: chain.slug,
    name: chain.name,
    iconUrl: manifest.getUrl(`/icons/${chain.iconSlug ?? chain.id}.png`),
    href: getChainProjectPath(chain.slug),
    category: 'interop',
    kind: 'chain',
    tags: [...new Set([chain.slug, chain.name, chain.display])],
  }
}
