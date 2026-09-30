import { ProjectId } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getDaFlowsProjects } from '~/server/features/data-availability/flows/getDaFlowsProjects'
import { getDaSummaryEntries } from '~/server/features/data-availability/summary/getDaSummaryEntries'
import { getDaTvsProjectIds } from '~/server/features/data-availability/summary/getDaTvsProjectIds'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { toChartProject } from '~/utils/project/toChartProject'

export async function getDataAvailabilitySummaryData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const [appLayoutProps, { publicSystems }, daFlows, ethereum] =
    await Promise.all([
      getAppLayoutProps(),
      getDaSummaryEntries(),
      getDaFlowsProjects(ProjectId.ETHEREUM),
      ps.getProject({
        id: ProjectId.ETHEREUM,
        select: ['daLayer'],
        optional: ['milestones'],
      }),
    ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Data Availability Summary - L2BEAT',
        description:
          'Get an overview of the data availability solutions powering Ethereum scaling projects.',
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
        ethereum: publicSystems.find((s) => s.id === ProjectId.ETHEREUM),
        tvsProjectIds: getDaTvsProjectIds(publicSystems),
        throughput: ethereum && {
          project: toChartProject(ethereum),
          configuredThroughputs: ethereum.daLayer.throughput ?? [],
          milestones: ethereum.milestones ?? [],
        },
        daFlows,
      },
    },
  }
}
