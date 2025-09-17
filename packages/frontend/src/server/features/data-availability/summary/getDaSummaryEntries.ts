import type {
  DaChallengeMechanism,
  Project,
  TableReadyValue,
  UsedInProject,
} from '@l2beat/config'
import { assert, ProjectId } from '@l2beat/shared-pure'
import type { UsedInProjectWithIcon } from '~/components/ProjectsUsedIn'
import type { RosetteValue } from '~/components/rosette/types'
import type { TabbedDaEntries } from '~/pages/data-availability/utils/groupByDaTabs'
import { groupByDaTabs } from '~/pages/data-availability/utils/groupByDaTabs'
import {
  mapBridgeRisksToRosetteValues,
  mapLayerRisksToRosetteValues,
} from '~/pages/data-availability/utils/MapRisksToRosetteValues'
import { ps } from '~/server/projects'
import {
  getProjectsChangeReport,
  type ProjectsChangeReport,
} from '../../projects-change-report/getProjectsChangeReport'
import { getLiveness } from '../../scaling/liveness/getLiveness'
import type { LivenessResponse } from '../../scaling/liveness/types'
import { getIsProjectVerified } from '../../utils/getIsProjectVerified'
import { getProjectIcon } from '../../utils/getProjectIcon'
import {
  type CommonDaEntry,
  getCommonDacDaEntry,
  getCommonDaEntry,
} from '../getCommonDaEntry'
import { getDaLayerRisks } from '../utils/getDaLayerRisks'
import { getDaProjectsEconomicSecurity } from '../utils/getDaProjectsEconomicSecurity'
import { getDaProjectsTvs, pickTvsForProjects } from '../utils/getDaProjectsTvs'
import { getDaUsers } from '../utils/getDaUsers'

export async function getDaSummaryEntries(): Promise<
  TabbedDaEntries<DaSummaryEntry>
> {
  const [layers, bridges, dacs] = await Promise.all([
    ps.getProjects({
      select: ['daLayer', 'statuses'],
      whereNot: ['archivedAt'],
    }),
    ps.getProjects({ select: ['daBridge', 'statuses'] }),
    ps.getProjects({
      select: ['customDa', 'statuses'],
      whereNot: ['archivedAt'],
    }),
  ])

  const uniqueProjectsInUse = getDaUsers(layers, bridges, dacs)
  const [economicSecurity, tvsPerProject, projectsChangeReport, liveness] =
    await Promise.all([
      getDaProjectsEconomicSecurity(),
      getDaProjectsTvs(uniqueProjectsInUse),
      getProjectsChangeReport(),
      getLiveness(),
    ])
  const getTvs = pickTvsForProjects(tvsPerProject)

  const layerEntries = layers.map((project) =>
    project.id === ProjectId.ETHEREUM
      ? getEthereumEntry(
          project,
          bridges.filter((x) => x.daBridge.daLayer === project.id),
          economicSecurity[project.id],
          getTvs,
        )
      : getDaSummaryEntry(
          project,
          bridges.filter((x) => x.daBridge.daLayer === project.id),
          economicSecurity[project.id],
          getTvs,
          projectsChangeReport,
          liveness,
        ),
  )
  const dacEntries = dacs.map((dac) => getDacEntry(dac, getTvs))

  return groupByDaTabs(
    [...layerEntries, ...dacEntries].sort(
      (a, b) => b.tvs.latest - a.tvs.latest,
    ),
  )
}

export interface DaSummaryEntry extends CommonDaEntry {
  economicSecurity: number | undefined
  risks: RosetteValue[]
  fallback: TableReadyValue | undefined
  challengeMechanism: DaChallengeMechanism | undefined
  tvs: {
    latest: number
    sevenDaysAgo: number
  }
  bridges: DaBridgeSummaryEntry[]
}

export interface DaBridgeSummaryEntry
  extends Omit<CommonDaEntry, 'id' | 'tab' | 'icon' | 'backgroundColor'> {
  tvs: {
    latest: number
    sevenDaysAgo: number
  }
  risks: RosetteValue[]
  usedIn: UsedInProjectWithIcon[]
  dacInfo:
    | {
        memberCount: number
        requiredMembers: number
        membersArePublic: boolean
      }
    | undefined
}

function getDaSummaryEntry(
  layer: Project<'daLayer' | 'statuses'>,
  bridges: Project<'daBridge' | 'statuses'>[],
  economicSecurity: number | undefined,
  getTvs: (projectIds: ProjectId[]) => {
    latest: number
    sevenDaysAgo: number
  },
  projectsChangeReport: ProjectsChangeReport,
  liveness: LivenessResponse,
): DaSummaryEntry {
  const daBridges = bridges.map((b): DaBridgeSummaryEntry => {
    const bridgeLiveness = liveness[b.id]
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
          !!layer.statuses.reviewStatus || !!b.statuses.reviewStatus
            ? 'config'
            : projectsChangeReport.getChanges(b.id).impactfulChange
              ? 'impactful-change'
              : undefined,
        ongoingAnomaly: bridgeLiveness?.anomalies.some(
          (a) => a.end === undefined,
        ),
      },
      tvs: getTvs(b.daBridge.usedIn.map((project) => project.id)),
      risks: mapBridgeRisksToRosetteValues(b.daBridge.risks),
      usedIn: b.daBridge.usedIn
        .sort((a, b) => getTvs([b.id]).latest - getTvs([a.id]).latest)
        .map((project) => ({
          ...project,
          icon: getProjectIcon(project.slug),
          url: `/scaling/projects/${project.slug}`,
        })),
      dacInfo: undefined,
    }
  })

  if (layer.daLayer.usedWithoutBridgeIn.length > 0 || bridges.length === 0) {
    daBridges.unshift({
      name: 'No Bridge',
      slug: 'no-bridge',
      href: `/data-availability/projects/${layer.slug}/no-bridge`,
      statuses: {},
      tvs: getTvs(
        layer.daLayer.usedWithoutBridgeIn.map((project) => project.id),
      ),
      risks: mapBridgeRisksToRosetteValues({ isNoBridge: true }),
      usedIn: layer.daLayer.usedWithoutBridgeIn
        .sort((a, b) => getTvs([b.id]).latest - getTvs([a.id]).latest)
        .map((project) => ({
          ...project,
          icon: getProjectIcon(project.slug),
          url: `/scaling/projects/${project.slug}`,
        })),
      dacInfo: undefined,
    })
  }

  daBridges.sort((a, b) => b.tvs.latest - a.tvs.latest)

  const tvs = getTvs(
    layer.daLayer.usedWithoutBridgeIn
      .concat(bridges.flatMap((p) => p.daBridge.usedIn))
      .map((x) => x.id),
  )

  return {
    ...getCommonDaEntry({ project: layer, href: daBridges[0]?.href }),
    economicSecurity,
    risks: mapLayerRisksToRosetteValues(
      getDaLayerRisks(layer.daLayer, tvs.latest, economicSecurity),
    ),
    fallback: undefined,
    challengeMechanism: undefined,
    tvs,
    bridges: daBridges,
  }
}

function getDacEntry(
  project: Project<'customDa' | 'statuses'>,
  getTvs: (projectIds: ProjectId[]) => {
    latest: number
    sevenDaysAgo: number
  },
): DaSummaryEntry {
  const usedIn: UsedInProject[] = [
    {
      id: project.id,
      name: project.name,
      slug: project.slug,
    },
  ]
  const tvs = getTvs([project.id])
  const dacInfo = project.customDa.dac
    ? {
        memberCount: project.customDa.dac.membersCount,
        requiredMembers: project.customDa.dac.requiredMembers,
        membersArePublic:
          !!project.customDa.dac.knownMembers &&
          project.customDa.dac.knownMembers.length > 0,
      }
    : undefined

  const bridgeEntry: DaBridgeSummaryEntry = {
    name: project.customDa.name ?? `${project.name} DAC`,
    slug: project.slug,
    href: `/scaling/projects/${project.slug}`,
    statuses: {},
    tvs,
    risks: mapBridgeRisksToRosetteValues(project.customDa.risks),
    dacInfo,
    usedIn: usedIn.map((project) => ({
      ...project,
      icon: getProjectIcon(project.slug),
      url: `/scaling/projects/${project.slug}`,
    })),
  }

  return {
    ...getCommonDacDaEntry({ project }),
    risks: mapLayerRisksToRosetteValues(getDaLayerRisks(project.customDa)),
    fallback: project.customDa.fallback,
    challengeMechanism: project.customDa.challengeMechanism ?? 'None',
    economicSecurity: undefined,
    tvs,
    bridges: [bridgeEntry],
  }
}

function getEthereumEntry(
  layer: Project<'daLayer' | 'statuses'>,
  bridges: Project<'daBridge' | 'statuses'>[],
  economicSecurity: number | undefined,
  getTvs: (projectIds: ProjectId[]) => {
    latest: number
    sevenDaysAgo: number
  },
): DaSummaryEntry {
  const bridge = bridges[0]
  assert(bridge, 'Ethereum DA layer has no bridges')

  return {
    id: ProjectId.ETHEREUM,
    slug: layer.slug,
    icon: getProjectIcon(layer.slug),
    name: layer.name,
    nameSecondLine: layer.daLayer.type,
    href: `/data-availability/projects/${layer.slug}/${bridge.slug}`,
    backgroundColor: 'blue',
    statuses: {},
    tab: 'public',
    economicSecurity: economicSecurity,
    tvs: getTvs(bridge.daBridge.usedIn.map((usedIn) => usedIn.id)),
    bridges: [
      {
        name: bridge.daBridge.name,
        slug: bridge.slug,
        href: `/data-availability/projects/${layer.slug}/${bridge.slug}`,
        statuses: {},
        tvs: getTvs(bridge.daBridge.usedIn.map((usedIn) => usedIn.id)),
        risks: mapBridgeRisksToRosetteValues(bridge.daBridge.risks),
        dacInfo: undefined,
        usedIn: bridge.daBridge.usedIn
          .sort((a, b) => getTvs([b.id]).latest - getTvs([a.id]).latest)
          .map((project) => ({
            ...project,
            icon: getProjectIcon(project.slug),
            url: `/scaling/projects/${project.slug}`,
          })),
      },
    ],
    challengeMechanism: undefined,
    fallback: undefined,
    risks: mapLayerRisksToRosetteValues(getDaLayerRisks(layer.daLayer)),
  }
}
