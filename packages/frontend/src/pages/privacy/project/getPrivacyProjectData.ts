import type { InMemoryCache } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { ProjectLink } from '~/components/projects/links/types'
import type { BadgeWithParams } from '~/components/projects/ProjectBadge'
import type { PermissionsSectionProps } from '~/components/projects/sections/permissions/PermissionsSection'
import { getPrivacySnapshot } from '~/server/features/privacy/getPrivacySnapshot'
import type { PrivacyAssetSnapshot } from '~/server/features/privacy/types'
import type { ProjectsChangeReport } from '~/server/features/projects-change-report/getProjectsChangeReport'
import { getMetadata } from '~/ssr/head/getMetadata'
import { getProjectMetadataDescription } from '~/ssr/head/getProjectMetadataDescription'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getContractUtils } from '~/utils/project/contracts-and-permissions/getContractUtils'
import { getPermissionsSection } from '~/utils/project/contracts-and-permissions/getPermissionsSection'
import { getBadgeWithParams } from '~/utils/project/getBadgeWithParams'
import { getProjectLinks } from '~/utils/project/getProjectLinks'

export interface PrivacyProjectEntry {
  id: string
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
    description: string
  }
  permissionsSection:
    | Omit<PermissionsSectionProps, 'id' | 'title' | 'sectionOrder'>
    | undefined
  summary: {
    totalValueSecuredUsd: number
    deposits: {
      total: number
      last7d: number
      last30d: number
    }
  }
  unpricedAssets: string[]
  isUnderReview: boolean
  warnings: {
    yellow?: string
    red?: string
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

export async function getPrivacyProjectData(
  manifest: Manifest,
  slug: string,
  url: string,
  cache: InMemoryCache,
): Promise<RenderData | undefined> {
  const [appLayoutProps, snapshot, contractUtils] = await Promise.all([
    getAppLayoutProps(),
    getPrivacySnapshot(cache),
    getContractUtils(),
  ])

  const project = snapshot.projects.find((project) => project.slug === slug)
  if (!project) {
    return undefined
  }

  const permissionsSection = getPermissionsSection(
    {
      id: project.id,
      permissions: project.permissions,
      isUnderReview: !!project.statuses.reviewStatus,
    },
    contractUtils,
    EMPTY_PROJECTS_CHANGE_REPORT,
  )

  const projectEntry: PrivacyProjectEntry = {
    id: project.id,
    slug: project.slug,
    name: project.name,
    shortName: project.shortName,
    icon: manifest.getUrl(`/icons/${project.slug}.png`),
    description: project.display.description,
    badges: project.display.badges.flatMap((badge) => {
      const badgeWithParams = getBadgeWithParams(badge)
      return badgeWithParams ? [badgeWithParams] : []
    }),
    projectLinks: getProjectLinks(project.display.links),
    discoveryHref: `https://disco.l2beat.com/ui/p/${project.id}`,
    discoUi: {
      href: `https://disco.l2beat.com/ui/p/${project.id}`,
      images: {
        desktop: manifest.getUrl('/images/disco-ui-desktop.png'),
        mobile: manifest.getUrl('/images/disco-ui-mobile.png'),
      },
    },
    assets: project.assets,
    trustedSetup: {
      name: project.trustedSetup.name,
      risk: project.trustedSetup.risk,
      description: project.trustedSetup.longDescription,
    },
    permissionsSection,
    summary: {
      totalValueSecuredUsd: project.summary.totalValueSecuredUsd,
      deposits: project.summary.deposits,
    },
    unpricedAssets: project.unpricedAssets,
    isUnderReview: !!project.statuses.reviewStatus,
    warnings: {
      yellow: project.statuses.yellowWarning,
      red: project.statuses.redWarning,
      emergency: project.statuses.emergencyWarning,
    },
  }

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: `${project.name} - Privacy Dashboard - L2BEAT`,
        description: getProjectMetadataDescription({
          name: project.name,
          display: {
            description: project.display.description,
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
      },
    },
  }
}
