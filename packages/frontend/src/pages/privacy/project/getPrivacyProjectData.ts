import type { ProjectRedWarning } from '@l2beat/config'
import type { InMemoryCache, ProjectId } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { ProjectLink } from '~/components/projects/links/types'
import type { BadgeWithParams } from '~/components/projects/ProjectBadge'
import type { ContractsSectionProps } from '~/components/projects/sections/contracts/ContractsSection'
import type { PermissionsSectionProps } from '~/components/projects/sections/permissions/PermissionsSection'
import { getPrivacyProjectDetails } from '~/server/features/privacy/getPrivacyProjectDetails'
import type { PrivacyAssetSnapshot } from '~/server/features/privacy/types'
import type { ProjectsChangeReport } from '~/server/features/projects-change-report/getProjectsChangeReport'
import type { SevenDayTvsBreakdown } from '~/server/features/scaling/tvs/get7dTvsBreakdown'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import { getProjectMetadataDescription } from '~/ssr/head/getProjectMetadataDescription'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import { getContractsSection } from '~/utils/project/contracts-and-permissions/getContractsSection'
import { getContractUtils } from '~/utils/project/contracts-and-permissions/getContractUtils'
import { getPermissionsSection } from '~/utils/project/contracts-and-permissions/getPermissionsSection'
import { getBadgeWithParams } from '~/utils/project/getBadgeWithParams'
import { getProjectLinks } from '~/utils/project/getProjectLinks'
import { optionToRange } from '~/utils/range/range'

export interface PrivacyProjectEntry {
  id: ProjectId
  slug: string
  name: string
  shortName?: string
  icon: string
  description: string
  badges: BadgeWithParams[]
  projectLinks: ProjectLink[]
  discoveryHref: string
  discoUi: {
    href: string
    images: {
      desktop: string
      mobile: string
    }
  }
  assets: PrivacyAssetSnapshot[]
  trustedSetup: {
    name: string
    risk: 'green' | 'yellow' | 'red' | 'N/A'
    longDescription: string
  }
  riskSummary?: string
  upgradesAndGovernance?: string
  permissionsSection:
    | Omit<PermissionsSectionProps, 'id' | 'title' | 'sectionOrder'>
    | undefined
  contractsSection:
    | Omit<ContractsSectionProps, 'id' | 'title' | 'sectionOrder' | 'discoUi'>
    | undefined
  summary: {
    totalValueSecuredUsd: number
    deposits: {
      total: number
      last7d: number
      last30d: number
    }
  }
  isUnderReview: boolean
  warnings: {
    yellow?: string
    red?: ProjectRedWarning
    emergency?: string
  }
}

const EMPTY_PROJECTS_CHANGE_REPORT: ProjectsChangeReport = {
  projects: {},
  getChanges: () => ({
    impactfulChange: false,
    becameVerifiedContracts: {},
  }),
  hasImplementationChanged: () => false,
  hasHighSeverityFieldChanged: () => false,
  hasUltimateUpgraderChanged: () => false,
  getBecameVerifiedContracts: () => ({}),
}

const EMPTY_TVS_BREAKDOWN: SevenDayTvsBreakdown = {
  total: 0,
  projects: {},
}

export async function getPrivacyProjectData(
  manifest: Manifest,
  slug: string,
  url: string,
  cache: InMemoryCache,
): Promise<RenderData | undefined> {
  const helpers = getSsrHelpers()
  const defaultChartRange = optionToRange('1y')
  const [
    appLayoutProps,
    details,
    contractUtils,
    allProjectsWithContracts,
    zkCatalogProjects,
  ] = await Promise.all([
    getAppLayoutProps(),
    cache.get(
      {
        key: ['privacy', 'project', slug],
        ttl: 60,
        staleWhileRevalidate: 5 * 60,
      },
      () => getPrivacyProjectDetails(slug),
    ),
    getContractUtils(),
    ps.getProjects({
      select: ['contracts'],
    }),
    ps.getProjects({
      select: ['zkCatalogInfo'],
    }),
  ])

  if (!details) {
    return undefined
  }

  await helpers.privacy.projectChart.prefetch({
    projectId: details.id,
    range: defaultChartRange,
  })

  const permissionsSection = getPermissionsSection(
    {
      id: details.id,
      permissions: details.permissions,
      isUnderReview: !!details.statuses.reviewStatus,
    },
    contractUtils,
    EMPTY_PROJECTS_CHANGE_REPORT,
  )

  const contractsSection = getContractsSection(
    {
      id: details.id,
      slug: details.slug,
      contracts: details.contracts,
      isVerified: true,
      isUnderReview: !!details.statuses.reviewStatus,
    },
    contractUtils,
    EMPTY_PROJECTS_CHANGE_REPORT,
    zkCatalogProjects,
    allProjectsWithContracts,
    EMPTY_TVS_BREAKDOWN,
  )

  const projectEntry: PrivacyProjectEntry = {
    id: details.id,
    slug: details.slug,
    name: details.name,
    shortName: details.shortName,
    icon: manifest.getUrl(`/icons/${details.slug}.png`),
    description: details.display.description,
    badges: details.display.badges.flatMap((badge) => {
      const badgeWithParams = getBadgeWithParams(badge)
      return badgeWithParams ? [badgeWithParams] : []
    }),
    projectLinks: getProjectLinks(details.display.links),
    discoveryHref: `https://disco.l2beat.com/ui/p/${details.id}`,
    discoUi: {
      href: `https://disco.l2beat.com/ui/p/${details.id}`,
      images: {
        desktop: manifest.getUrl('/images/disco-ui-desktop.png'),
        mobile: manifest.getUrl('/images/disco-ui-mobile.png'),
      },
    },
    assets: details.assets,
    trustedSetup: {
      name: details.trustedSetup.name,
      risk: details.trustedSetup.risk,
      longDescription: details.trustedSetup.longDescription,
    },
    riskSummary: details.riskSummary,
    upgradesAndGovernance: details.upgradesAndGovernance,
    permissionsSection,
    contractsSection,
    summary: {
      totalValueSecuredUsd: details.summary.totalValueSecuredUsd,
      deposits: {
        total: details.summary.deposits.total,
        last7d: details.summary.deposits.last7d,
        last30d: details.summary.deposits.last30d,
      },
    },
    isUnderReview: !!details.statuses.reviewStatus,
    warnings: {
      yellow: details.statuses.yellowWarning,
      red: details.statuses.redWarning,
      emergency: details.statuses.emergencyWarning,
    },
  }

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: `${details.name} - Privacy Dashboard - L2BEAT`,
        description: getProjectMetadataDescription({
          name: details.name,
          display: {
            description: details.display.description,
          },
        }),
        url,
        openGraph: {
          image: '/meta-images/data-availability/summary/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'PrivacyProjectPage',
      props: {
        ...appLayoutProps,
        entry: projectEntry,
        defaultChartRange,
        queryState: helpers.dehydrate(),
      },
    },
  }
}
