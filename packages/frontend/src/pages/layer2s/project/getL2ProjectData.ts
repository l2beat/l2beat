import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getL2ProjectEntry } from '~/server/features/layer2s/project/getL2ProjectEntry'
import { getPrivacyProjectDetails } from '~/server/features/privacy/getPrivacyProjectDetails'
import { getPrivacySummary } from '~/server/features/privacy/project/getPrivacyProjectEntry'
import { getProjectSections } from '~/server/features/projects/getProjectSections'
import { getProjectVersionLinks } from '~/server/features/projects/getProjectVersionLinks'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import { getScalingMetadataDescription } from '~/ssr/head/projectMetaDescriptions'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import {
  getProjectOgImagePath,
  getProjectPath,
} from '~/utils/project/getProjectPath'
import { getL2ProjectStructuredData } from './getL2ProjectStructuredData'
import { renderL2ProjectMarkdown } from './renderL2ProjectMarkdown'

export async function getL2ProjectData(
  req: Request<{ slug: string }, unknown, unknown, { update?: string }>,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData | undefined> {
  const data = await getCachedL2ProjectPage(req.params.slug, manifest, cache)
  if (!data) return undefined

  const { privacy, ...props } = data.props
  const selectedUpdateId = req.query.update
  return {
    head: data.head,
    ssr: privacy
      ? {
          page: 'L2PrivacyProjectPage',
          props: { ...props, privacy, selectedUpdateId },
        }
      : { page: 'L2ProjectPage', props: { ...props, selectedUpdateId } },
  }
}

/** The markdown alternate of the page, built from the same cached entry as the HTML. */
export async function getL2ProjectMarkdown(
  slug: string,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<string | undefined> {
  const data = await getCachedL2ProjectPage(slug, manifest, cache)
  return data && renderL2ProjectMarkdown(data.props.projectEntry)
}

function getCachedL2ProjectPage(
  slug: string,
  manifest: Manifest,
  cache: InMemoryCache,
) {
  return cache.get(
    {
      key: ['layer2s', 'projects', slug],
      ttl: 5 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    () => loadL2ProjectPage(manifest, slug),
  )
}

async function loadL2ProjectPage(manifest: Manifest, slug: string) {
  const helpers = getSsrHelpers()
  const project = await ps.getProject({
    slug,
    select: [
      'display',
      'statuses',
      'scalingInfo',
      'scalingRisks',
      'scalingStage',
      'scalingTechnology',
      'tvsInfo',
    ],
    optional: [
      'contracts',
      'permissions',
      'chainConfig',
      'scalingDa',
      'livenessInfo',
      'livenessConfig',
      'customDa',
      'archivedAt',
      'milestones',
      'upgradesAndGovernance',
      'trackedTxsConfig',
      'tvsConfig',
      'discoveryInfo',
      'discoveryUpdates',
      'daTrackingConfig',
      'costsInfo',
      'activityConfig',
      'garden',
      'ossificationHistory',
      'privacyInfo',
    ],
  })
  if (!project) return undefined

  // A scaling project that is also a privacy protocol.
  const privacy = project.privacyInfo
    ? await getPrivacyProjectDetails(slug)
    : undefined
  const [appLayoutProps, projectEntry, projectSections, versionLinks] =
    await Promise.all([
      getAppLayoutProps(),
      getL2ProjectEntry(project, helpers, privacy),
      getProjectSections(slug),
      getProjectVersionLinks(slug),
    ])
  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        name: project.name,
        description: getScalingMetadataDescription({
          name: project.name,
          category: project.scalingInfo.type,
          stage: projectEntry.stageConfig.stage,
          hostChain: projectEntry.header.hostChain,
          tvs: projectEntry.header.tvs?.breakdown?.total,
          description: project.display.description,
        }),
        // Derived from the slug, not the request URL: the cache entry is
        // shared by every request for the project, including the .md one.
        url: getProjectPath(project.slug),
        openGraph: {
          image: getProjectOgImagePath(project.slug),
        },
        structuredData: (page) => [
          getL2ProjectStructuredData(page, {
            name: project.name,
            slug: project.slug,
            archivedAt: project.archivedAt,
            hasTvsApi: project.tvsConfig !== undefined,
            hasActivityApi: project.activityConfig !== undefined,
          }),
        ],
      }),
    },
    props: {
      ...appLayoutProps,
      projectEntry,
      privacy: privacy && getPrivacySummary(privacy),
      projectSections,
      versionLinks,
      queryState: helpers.dehydrate(),
    },
  }
}
