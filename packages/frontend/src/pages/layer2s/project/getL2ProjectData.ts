import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getL2ProjectEntry } from '~/server/features/layer2s/project/getL2ProjectEntry'
import { getPrivacyProjectDetails } from '~/server/features/privacy/getPrivacyProjectDetails'
import { getPrivacyProjectEntry } from '~/server/features/privacy/project/getPrivacyProjectEntry'
import { getProjectSections } from '~/server/features/projects/getProjectSections'
import { getProjectVersionLinks } from '~/server/features/projects/getProjectVersionLinks'
import { mergeProjectSections } from '~/server/features/projects/mergeProjectSections'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import { getScalingMetadataDescription } from '~/ssr/head/projectMetaDescriptions'
import type { RenderData } from '~/ssr/types'
import type { SsrHelpers } from '~/trpc/server'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import { getL2ProjectStructuredData } from './getL2ProjectStructuredData'
import { renderL2ProjectMarkdown } from './renderL2ProjectMarkdown'

export async function getL2ProjectData(
  req: Request<{ slug: string }, unknown, unknown, { update?: string }>,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData | undefined> {
  const data = await getCachedL2ProjectPage(req.params.slug, manifest, cache)
  if (!data) return undefined

  return {
    head: data.head,
    ssr: {
      page: 'L2ProjectPage',
      props: {
        ...data.props,
        selectedUpdateId: req.query.update,
      },
    },
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
      'trackedTxsConfig',
      'tvsConfig',
      'colors',
      'ecosystemColors',
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

  const [appLayoutProps, projectEntry, projectSections, versionLinks, privacy] =
    await Promise.all([
      getAppLayoutProps(),
      getL2ProjectEntry(project, helpers),
      getProjectSections(slug),
      getProjectVersionLinks(slug),
      project.privacyInfo ? getPrivacyEntry(slug, helpers) : undefined,
    ])
  if (privacy) {
    projectEntry.sections = mergeProjectSections(
      projectEntry.sections,
      privacy.sections,
      {
        insertAfterId: 'risk-summary',
        // The same TVS config as Value Secured. TODO: decide which to show.
        drop: ['privacy-tvl'],
        // TODO: one risk summary for the merged page.
        relabel: {
          'risk-summary': {
            base: 'Scaling risk summary',
            other: {
              id: 'privacy-risk-summary',
              title: 'Privacy risk summary',
            },
          },
        },
      },
    )
    for (const section of projectEntry.sections) {
      // Links to the privacy page's Value Locked land on Value Secured.
      if (section.type === 'L2TvsSection') {
        section.props.aliasIds = ['privacy-tvl']
      }
    }
  }
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
        url: `/projects/${project.slug}`,
        openGraph: {
          image: `/meta-images/layer2s/projects/${project.slug}/opengraph-image.png`,
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
      // Only what its summary card reads: its sections are in projectEntry.
      privacyEntry: privacy && {
        ...privacy,
        sections: privacy.sections.filter(
          (section) => section.type === 'PrivacyAdversariesSection',
        ),
      },
      projectSections,
      versionLinks,
      queryState: helpers.dehydrate(),
    },
  }
}

/** The privacy page of a scaling project that is also a privacy protocol. */
async function getPrivacyEntry(slug: string, helpers: SsrHelpers) {
  const details = await getPrivacyProjectDetails(slug)
  return details && getPrivacyProjectEntry(details, helpers)
}
