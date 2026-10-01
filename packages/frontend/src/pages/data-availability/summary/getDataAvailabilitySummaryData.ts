import { assert, ProjectId } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getDaFlowsProjects } from '~/server/features/data-availability/flows/getDaFlowsProjects'
import { getDaProjectValidators } from '~/server/features/data-availability/project/utils/getDaProjectValidators'
import { getDaSummaryEntries } from '~/server/features/data-availability/summary/getDaSummaryEntries'
import { getDaTvsProjectIds } from '~/server/features/data-availability/summary/getDaTvsProjectIds'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { toChartProject } from '~/utils/project/toChartProject'
import type { EthereumSummary } from './components/EthereumSummaryCard'

export async function getDataAvailabilitySummaryData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const [
    appLayoutProps,
    { publicSystems },
    daFlows,
    ethereum,
    projectsWithColors,
  ] = await Promise.all([
    getAppLayoutProps(),
    getDaSummaryEntries(),
    getDaFlowsProjects(ProjectId.ETHEREUM),
    ps.getProject({
      id: ProjectId.ETHEREUM,
      select: ['daLayer'],
      optional: ['milestones'],
    }),
    ps.getProjects({ select: ['colors'] }),
  ])
  const ethereumEntry = publicSystems.find((s) => s.id === ProjectId.ETHEREUM)
  assert(ethereum && ethereumEntry, 'Ethereum DA layer not found')

  const latestThroughput = ethereum.daLayer.throughput
    ?.toSorted((a, b) => a.sinceTimestamp - b.sinceTimestamp)
    .at(-1)
  const ethereumSummary: EthereumSummary = {
    name: ethereum.name,
    iconUrl: manifest.getUrl(`/icons/${ethereum.slug}.png`),
    href: ethereumEntry.href,
    validators: await getDaProjectValidators(
      ethereum.id,
      ethereum.daLayer.validators,
    ),
    durationStorage: ethereum.daLayer.pruningWindow,
    maxThroughputPerSecond:
      latestThroughput && latestThroughput.size !== 'NO_CAP'
        ? latestThroughput.size / latestThroughput.frequency
        : undefined,
  }

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Blobs - L2BEAT',
        description:
          'See how much data L2s post to Ethereum blobs, against the blob target, and the value they secure.',
        url,
        openGraph: {
          image: '/meta-images/data-availability/summary/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'DataAvailabilitySummaryPage',
      props: {
        ...appLayoutProps,
        ethereumSummary,
        tvsProjectIds: getDaTvsProjectIds(publicSystems),
        throughput: {
          project: toChartProject(ethereum),
          configuredThroughputs: ethereum.daLayer.throughput ?? [],
          milestones: ethereum.milestones ?? [],
          // the per-project chart keys its series by project name
          customColors: Object.fromEntries(
            projectsWithColors.map((p) => [p.name, p.colors.primary.light]),
          ),
          detailsHref: `${ethereumEntry.href}#throughput`,
        },
        daFlows,
      },
    },
  }
}
