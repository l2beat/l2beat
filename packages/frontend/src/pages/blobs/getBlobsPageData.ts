import { assert, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getDaProjectValidators } from '~/server/features/data-availability/project/utils/getDaProjectValidators'
import { getDaTvsProjectIds } from '~/server/features/data-availability/summary/getDaTvsProjectIds'
import { getThroughputInForce } from '~/server/features/data-availability/throughput/utils/getThroughputInForce'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { toChartProject } from '~/utils/project/toChartProject'
import type { EthereumSummary } from './components/EthereumSummaryCard'

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
  ])
  assert(ethereum, 'Ethereum DA layer not found')

  const currentThroughput = getThroughputInForce(
    ethereum.daLayer.throughput ?? [],
    UnixTime.now(),
  )
  const ethereumSummary: EthereumSummary = {
    name: ethereum.name,
    iconUrl: manifest.getUrl(`/icons/${ethereum.slug}.png`),
    validators: await getDaProjectValidators(
      ethereum.id,
      ethereum.daLayer.validators,
    ),
    durationStorage: ethereum.daLayer.pruningWindow,
    maxThroughputPerSecond:
      currentThroughput && currentThroughput.size !== 'NO_CAP'
        ? currentThroughput.size / currentThroughput.frequency
        : undefined,
  }

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
        ethereumSummary,
        tvsProjectIds: getDaTvsProjectIds(
          daLayers,
          daBridges,
          customDaProjects,
          scalingProjects,
        ),
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
