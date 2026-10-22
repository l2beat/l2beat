import { assert, ProjectId } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { ETHEREUM_PROJECT_PATH } from '~/pages/ethereum/paths'
import { getBlobPosters } from '~/server/features/data-availability/live-blobs/getBlobPosters'
import { getDaTvsProjectIds } from '~/server/features/data-availability/summary/getDaTvsProjectIds'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { toChartProject } from '~/utils/project/toChartProject'

export async function getBlobsPageData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const [
    appLayoutProps,
    daLayers,
    daBridges,
    customDaProjects,
    scalingProjects,
    ethereum,
    projectsWithColors,
    blobPosters,
  ] = await Promise.all([
    getAppLayoutProps(),
    ps.getProjects({ select: ['daLayer'], whereNot: ['archivedAt'] }),
    ps.getProjects({ select: ['daBridge'] }),
    ps.getProjects({ select: ['customDa'], whereNot: ['archivedAt'] }),
    ps.getProjects({ select: ['scalingInfo'] }),
    ps.getProject({
      id: ProjectId.ETHEREUM,
      select: ['daLayer'],
      optional: ['milestones'],
    }),
    ps.getProjects({ select: ['colors'] }),
    getBlobPosters(),
  ])
  assert(ethereum, 'Ethereum DA layer not found')

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        name: 'Blobs',
        description:
          'See how much data L2s post to Ethereum blobs, against the blob target, and the value they secure.',
        url,
        openGraph: {
          image: '/meta-images/blobs/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'BlobsPage',
      props: {
        ...appLayoutProps,
        ethereum: {
          href: ETHEREUM_PROJECT_PATH,
          iconUrl: manifest.getUrl(`/icons/${ethereum.slug}.png`),
        },
        tvsProjectIds: getDaTvsProjectIds(
          daLayers,
          daBridges,
          customDaProjects,
          scalingProjects,
        ),
        blobPosters,
        throughput: {
          project: toChartProject(ethereum),
          configuredThroughputs: ethereum.daLayer.throughput ?? [],
          milestones: ethereum.milestones ?? [],
          // the per-project chart keys its series by project name
          customColors: Object.fromEntries(
            projectsWithColors.map((p) => [p.name, p.colors.primary.light]),
          ),
        },
      },
    },
  }
}
