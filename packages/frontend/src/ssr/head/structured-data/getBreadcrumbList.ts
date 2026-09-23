import {
  type StructuredData,
  toProductionUrl,
  withSchemaOrgContext,
} from './StructuredData'

export interface Breadcrumb {
  name: string
  path: string
}

export interface PageBreadcrumb {
  /** Defaults to the page title without the " - L2BEAT" suffix. */
  name?: string
  /** Pages between the section and this one, e.g. the project of a subpage. */
  parents?: Breadcrumb[]
}

const HOME: Breadcrumb = { name: 'Home', path: '/' }

// Keyed by the first path segment. Only sections with a landing page are
// listed, so every crumb links to a page that renders.
const SECTIONS: Record<string, Breadcrumb> = {
  layer2s: { name: 'Scaling', path: '/layer2s/summary' },
  interop: { name: 'Interop', path: '/interop/summary' },
  privacy: { name: 'Privacy', path: '/privacy/summary' },
  defi: { name: 'DeFi', path: '/defi/summary' },
  'data-availability': {
    name: 'Data Availability',
    path: '/data-availability/summary',
  },
  'zk-catalog': { name: 'ZK Catalog', path: '/zk-catalog' },
  publications: { name: 'Publications', path: '/publications' },
  governance: { name: 'Governance', path: '/governance' },
}

export function getBreadcrumbList(
  path: string,
  title: string | undefined,
  page: PageBreadcrumb = {},
): StructuredData | undefined {
  const trail = getTrail(path, page.name ?? getNameFromTitle(title), page)
  // A single crumb is just the home page, which has nothing above it.
  if (!trail || trail.length < 2) return undefined

  return withSchemaOrgContext({
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: toProductionUrl(crumb.path),
    })),
  })
}

function getTrail(
  path: string,
  name: string | undefined,
  page: PageBreadcrumb,
): Breadcrumb[] | undefined {
  if (path === HOME.path) return [HOME]

  const section = SECTIONS[path.split('/')[1] ?? '']
  if (section?.path === path) return [HOME, section]
  // Without a name the last crumb could not say which page it is.
  if (!name) return undefined

  return [
    HOME,
    ...(section ? [section] : []),
    ...(page.parents ?? []),
    { name, path },
  ]
}

function getNameFromTitle(title: string | undefined) {
  return title?.replace(/ - L2BEAT$/, '')
}
