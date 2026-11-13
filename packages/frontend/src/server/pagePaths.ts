import { UnixTime } from '@l2beat/shared-pure'
import { RENAME_ANNOUNCEMENT_PATH } from '~/consts/siteName'
import { getCollection } from '~/content/getCollection'
import { env } from '~/env'
import {
  GARDEN_PATH,
  INTEGRATE_CROPS_PATH,
  SUBMIT_PROTOCOL_PATH,
} from '~/pages/garden/paths'
import {
  getProjectPath,
  getProjectTvsBreakdownPath,
} from '~/utils/project/getProjectPath'
import {
  PROJECT_PAGE_FIELDS,
  selectProjectPages,
} from './features/projects/getProjectPage'
import { ps } from './projects'

type PagePath = `/${string}`

export interface Page {
  path: PagePath
  /**
   * Only for pages with a real publication date. Project pages change for many
   * reasons that leave no record (config edits, daily TVS and activity), so
   * dating them by discovery updates would under-report and get the field
   * ignored by crawlers.
   */
  lastModified?: UnixTime
}

export const STATIC_PAGE_PATHS = [
  '/',
  '/layer2s/summary',
  '/layer2s/activity',
  '/layer2s/risk',
  '/layer2s/risk/state-validation',
  '/layer2s/risk/data-availability',
  '/layer2s/risk/sequencing',
  '/layer2s/tvs',
  '/layer2s/liveness',
  '/layer2s/costs',
  '/layer2s/archived',
  '/interop/summary',
  '/interop/non-minting',
  '/interop/lock-and-mint',
  '/interop/burn-and-mint',
  '/interop/token-frameworks',
  '/interop/intent-bridges',
  '/privacy/summary',
  '/privacy/archived',
  '/zk-catalog',
  '/governance',
  '/governance/ethereum-connect',
  '/native-rollups',
  '/faq',
  '/about-us',
  RENAME_ANNOUNCEMENT_PATH,
  '/brand-kit',
  '/changelog',
  '/donate',
  '/glossary',
  '/multisig-report',
  '/terms-of-service',
  '/stages',
  '/publications',
] as const satisfies PagePath[]

export async function getPages(): Promise<Page[]> {
  const paths: PagePath[] = [...STATIC_PAGE_PATHS, '/layer2s/compare']
  if (env.CLIENT_SIDE_DEFI_ENABLED) {
    paths.push('/defi/liquid-staking')
  }
  if (env.CLIENT_SIDE_TOKENS_PAGE) {
    paths.push('/tokens')
  }
  if (env.CLIENT_SIDE_BLOBS_PAGE) {
    paths.push('/blobs')
  }
  if (env.CLIENT_SIDE_OSSIFICATION_ENABLED) {
    paths.push('/ossification')
  }
  paths.push('/mandate')
  if (env.CLIENT_SIDE_GARDEN_ENABLED) {
    paths.push(GARDEN_PATH, SUBMIT_PROTOCOL_PATH, INTEGRATE_CROPS_PATH)
  }
  return [...paths.map((path) => ({ path })), ...(await getDynamicPages())]
}

async function getDynamicPages(): Promise<Page[]> {
  const projects = await ps.getProjects({
    optional: [...PROJECT_PAGE_FIELDS, 'tvsConfig', 'archivedAt'],
  })

  const pages: Page[] = []
  for (const page of selectProjectPages(projects)) {
    const { project } = page
    // Archived scaling and privacy projects keep their page but leave the
    // sitemap, unless another section still lists them.
    const listed = page.listed.filter(
      (section) =>
        !project?.archivedAt ||
        (section !== 'layer2s' && section !== 'privacy'),
    )
    if (listed.length === 0) continue
    pages.push({ path: getProjectPath(page.slug) })
    if (listed.includes('layer2s') && project?.tvsConfig) {
      pages.push({ path: getProjectTvsBreakdownPath(page.slug) })
    }
  }

  const publications = [
    ...getCollection('governance-publications'),
    ...getCollection('monthly-updates'),
  ]
  for (const entry of publications) {
    pages.push({
      path: `/publications/${entry.id}`,
      lastModified: UnixTime.fromDate(entry.data.publishedOn),
    })
  }

  return pages
}
