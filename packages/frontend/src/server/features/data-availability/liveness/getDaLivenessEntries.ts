import type { Project, TableReadyValue } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import type { TabbedDaEntries } from '~/pages/data-availability/utils/groupByDaTabs'
import { groupByDaTabs } from '~/pages/data-availability/utils/groupByDaTabs'
import { ps } from '~/server/projects'
import {
  getProjectsChangeReport,
  type ProjectsChangeReport,
} from '../../projects-change-report/getProjectsChangeReport'
import { getLiveness } from '../../scaling/liveness/getLiveness'
import type {
  LivenessAnomaly,
  LivenessResponse,
} from '../../scaling/liveness/types'
import { getIsProjectVerified } from '../../utils/getIsProjectVerified'
import { type CommonDaEntry, getCommonDaEntry } from '../getCommonDaEntry'

export async function getDaLivenessEntries(): Promise<
  TabbedDaEntries<DaLivenessEntry>
> {
  const [layers, bridges, projectsChangeReport, liveness] = await Promise.all([
    ps.getProjects({
      select: ['daLayer', 'statuses'],
      whereNot: ['archivedAt'],
    }),
    ps.getProjects({
      select: ['daBridge', 'statuses', 'trackedTxsConfig'],
      optional: ['livenessInfo'],
    }),
    getProjectsChangeReport(),
    getLiveness(),
  ])

  const layerEntries = layers
    .filter((project) => project.id !== ProjectId.ETHEREUM)
    .map((project) =>
      getDaLivenessEntry(
        project,
        bridges.filter((x) => x.daBridge.daLayer === project.id),
        projectsChangeReport,
        liveness,
      ),
    )
    .filter((x) => x !== undefined)

  return groupByDaTabs(layerEntries)
}

export interface DaLivenessEntry extends CommonDaEntry {
  bridges: DaBridgeLivenessEntry[]
}

export interface DaBridgeLivenessEntry
  extends Omit<CommonDaEntry, 'id' | 'tab' | 'icon' | 'backgroundColor'> {
  relayerType: TableReadyValue | undefined
  validationType: (TableReadyValue & { zkCatalogId?: ProjectId }) | undefined
  data: LivenessResponse[string]['proofSubmissions']
  anomalies: LivenessAnomaly[]
  explanation: string | undefined
}

function getDaLivenessEntry(
  layer: Project<'daLayer' | 'statuses'>,
  bridges: Project<
    'daBridge' | 'statuses' | 'trackedTxsConfig',
    'livenessInfo'
  >[],
  projectsChangeReport: ProjectsChangeReport,
  liveness: LivenessResponse,
): DaLivenessEntry | undefined {
  if (bridges.length === 0) {
    return undefined
  }

  const daBridges = bridges
    .map((b): DaBridgeLivenessEntry | undefined => {
      const bridgeLiveness = liveness[b.id]
      if (!bridgeLiveness) return undefined

      return {
        name: b.daBridge.name,
        slug: b.slug,
        href: `/data-availability/projects/${layer.slug}/${b.slug}`,
        statuses: {
          verificationWarning: !getIsProjectVerified(
            b.statuses.unverifiedContracts,
            projectsChangeReport.getChanges(b.id),
          ),
          underReview:
            layer.statuses.reviewStatus || b.statuses.reviewStatus
              ? 'config'
              : projectsChangeReport.getChanges(b.id).impactfulChange
                ? 'impactful-change'
                : undefined,
        },
        relayerType: b.daBridge.relayerType,
        validationType: b.daBridge.validationType,
        data: bridgeLiveness.proofSubmissions,
        anomalies: bridgeLiveness.anomalies,
        explanation: b.livenessInfo?.explanation,
      }
    })
    .filter((x) => x !== undefined)

  return {
    ...getCommonDaEntry({ project: layer, href: daBridges[0]?.href }),
    bridges: daBridges,
  }
}
