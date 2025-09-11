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
import { getLowestSyncedUntil } from '../../scaling/liveness/getScalingLivenessEntries'
import type {
  LivenessAnomaly,
  LivenessResponse,
} from '../../scaling/liveness/types'
import { getHasTrackedContractChanged } from '../../scaling/liveness/utils/getHasTrackedContractChanged'
import { getLivenessSyncWarning } from '../../scaling/liveness/utils/isLivenessSynced'
import { getIsProjectVerified } from '../../utils/getIsProjectVerified'
import { type CommonDaEntry, getCommonDaEntry } from '../getCommonDaEntry'
import { getDaProjectsTvs, pickTvsForProjects } from '../utils/getDaProjectsTvs'
import { getDaUsers } from '../utils/getDaUsers'

export async function getDaLivenessEntries(): Promise<
  TabbedDaEntries<DaLivenessEntry>
> {
  const [layers, bridges] = await Promise.all([
    ps.getProjects({
      select: ['daLayer', 'statuses'],
      whereNot: ['archivedAt'],
    }),
    ps.getProjects({
      select: ['daBridge', 'statuses', 'trackedTxsConfig'],
      optional: ['livenessInfo'],
    }),
  ])

  const uniqueProjectsInUse = getDaUsers(layers, bridges, [])

  const [projectsChangeReport, liveness, tvsPerProject] = await Promise.all([
    getProjectsChangeReport(),
    getLiveness(),
    getDaProjectsTvs(uniqueProjectsInUse),
  ])

  const getTvs = pickTvsForProjects(tvsPerProject)

  const layerEntries = layers
    .filter((project) => project.id !== ProjectId.ETHEREUM)
    .map((project) =>
      getDaLivenessEntry(
        project,
        bridges.filter((x) => x.daBridge.daLayer === project.id),
        getTvs,
        projectsChangeReport,
        liveness,
      ),
    )
    .filter((x) => x !== undefined)

  return groupByDaTabs(layerEntries.sort((a, b) => b.tvs - a.tvs))
}

export interface DaLivenessEntry extends CommonDaEntry {
  tvs: number
  bridges: DaBridgeLivenessEntry[]
}

export interface DaBridgeLivenessEntry
  extends Omit<CommonDaEntry, 'id' | 'tab' | 'icon' | 'backgroundColor'> {
  relayerType: TableReadyValue | undefined
  validationType: (TableReadyValue & { zkCatalogId?: ProjectId }) | undefined
  data: LivenessResponse[string]['proofSubmissions'] & {
    warning: string | undefined
    isSynced: boolean
  }
  anomalies: LivenessAnomaly[]
  explanation: string | undefined
  hasTrackedContractsChanged: boolean
  tvs: number
}

function getDaLivenessEntry(
  layer: Project<'daLayer' | 'statuses'>,
  bridges: Project<
    'daBridge' | 'statuses' | 'trackedTxsConfig',
    'livenessInfo'
  >[],
  getTvs: (projects: ProjectId[]) => { latest: number; sevenDaysAgo: number },
  projectsChangeReport: ProjectsChangeReport,
  liveness: LivenessResponse,
): DaLivenessEntry | undefined {
  const daBridges = bridges
    .map((b): DaBridgeLivenessEntry | undefined => {
      const bridgeLiveness = liveness[b.id]
      const proofSubmissions = bridgeLiveness?.proofSubmissions
      if (!bridgeLiveness || !proofSubmissions) return undefined

      const hasTrackedContractsChanged = getHasTrackedContractChanged(
        b,
        projectsChangeReport.projects[b.id],
      )

      const lowestSyncedUntil = getLowestSyncedUntil(bridgeLiveness)
      const syncWarning = getLivenessSyncWarning(lowestSyncedUntil)

      return {
        name: b.daBridge.name,
        slug: b.slug,
        href: `/data-availability/projects/${layer.slug}/${b.slug}#da-bridge-liveness`,
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
          syncWarning,
          ongoingAnomaly: bridgeLiveness.anomalies.some(
            (a) => a.end === undefined,
          ),
        },
        relayerType: b.daBridge.relayerType,
        validationType: b.daBridge.validationType,
        data: {
          ...proofSubmissions,
          warning: b.livenessInfo?.warnings?.proofSubmissions,
          isSynced: !syncWarning,
        },
        anomalies: bridgeLiveness.anomalies,
        explanation: b.livenessInfo?.explanation,
        hasTrackedContractsChanged,
        tvs: getTvs(b.daBridge.usedIn.map((project) => project.id)).latest,
      }
    })
    .filter((x) => x !== undefined)

  if (daBridges.length === 0) {
    return undefined
  }

  const tvs = getTvs(
    layer.daLayer.usedWithoutBridgeIn
      .concat(bridges.flatMap((p) => p.daBridge.usedIn))
      .map((x) => x.id),
  ).latest

  return {
    ...getCommonDaEntry({ project: layer, href: daBridges[0]?.href }),
    bridges: daBridges,
    tvs,
  }
}
