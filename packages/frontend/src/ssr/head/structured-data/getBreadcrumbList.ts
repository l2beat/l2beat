import compact from 'lodash/compact'
import { toProductionUrl } from '~/consts/productionOrigin'
import type { StructuredData } from './StructuredData'

export function getBreadcrumbList(
  path: string,
  name: string | undefined,
  parents: Breadcrumb[] = [],
): StructuredData | undefined {
  const trail = getTrail(path, name, parents)
  if (!trail) return undefined

  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: toProductionUrl(crumb.path),
    })),
  }
}

export interface Breadcrumb {
  name: string
  path: string
}

const HOME: Breadcrumb = { name: 'Home', path: '/' }

// Keyed by the first path segment. Only sections with a landing page are
// listed, so every crumb links to a page that renders. The nav groups differ:
// they lack Publications and Governance, and Ecosystems has no landing page.
const SECTIONS: Record<string, Breadcrumb> = {
  layer2s: { name: 'Layer 2s', path: '/layer2s/summary' },
  interop: { name: 'Interop', path: '/interop/summary' },
  privacy: { name: 'Privacy', path: '/privacy/summary' },
  defi: { name: 'DeFi', path: '/defi/summary' },
  'zk-catalog': { name: 'ZK Catalog', path: '/zk-catalog' },
  publications: { name: 'Publications', path: '/publications' },
  governance: { name: 'Governance', path: '/governance' },
}

function getTrail(
  path: string,
  name: string | undefined,
  parents: Breadcrumb[],
): Breadcrumb[] | undefined {
  if (path === HOME.path) return undefined

  const section = SECTIONS[path.split('/')[1] ?? '']
  if (section?.path === path) return [HOME, section]
  // Without a name the last crumb could not say which page it is.
  if (!name) return undefined

  return compact([HOME, section, ...parents, { name, path }])
}
