import type {
  DaChallengeMechanism,
  Project,
  TableReadyValue,
  UsedInProject,
} from '@l2beat/config'
import { assert, ProjectId } from '@l2beat/shared-pure'
import type { TabbedDaEntries } from '~/app/(side-nav)/data-availability/_utils/group-by-da-tabs'
import { groupByDaTabs } from '~/app/(side-nav)/data-availability/_utils/group-by-da-tabs'
import {
  mapBridgeRisksToRosetteValues,
  mapLayerRisksToRosetteValues,
} from '~/app/(side-nav)/data-availability/_utils/map-risks-to-rosette-values'
import { type RosetteValue } from '~/components/rosette/types'
import { ps } from '~/server/projects'
import {
  type CommonDaEntry,
  getCommonDaEntry,
  getCommonDacDaEntry,
} from '../get-common-da-entry'
import { getDaLayerRisks } from '../utils/get-da-layer-risks'
import { getDaProjectsEconomicSecurity } from '../utils/get-da-projects-economic-security'
import {
  getDaProjectsTvs,
  pickTvsForProjects,
} from '../utils/get-da-projects-tvs'
import { getDaUsers } from '../utils/get-da-users'

export async function getDaSummaryEntries(): Promise<
  TabbedDaEntries<DaSummaryEntry>
> {
  const [layers, bridges, dacs] = await Promise.all([
    ps.getProjects({ select: ['daLayer', 'statuses'] }),
    ps.getProjects({ select: ['daBridge', 'statuses'] }),
    ps.getProjects({ select: ['customDa', 'statuses'] }),
  ])

  const uniqueProjectsInUse = getDaUsers(layers, bridges, dacs)
  const [economicSecurity, tvsPerProject] = await Promise.all([
    getDaProjectsEconomicSecurity(),
    getDaProjectsTvs(uniqueProjectsInUse),
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
  extends Omit<CommonDaEntry, 'id' | 'tab'> {
  tvs: {
    latest: number
    sevenDaysAgo: number
  }
  risks: {
    values: RosetteValue[]
    isNoBridge: boolean
  }
  usedIn: UsedInProject[]
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
): DaSummaryEntry {
  const daBridges = bridges.map(
    (b): DaBridgeSummaryEntry => ({
      name: b.daBridge.name,
      slug: b.slug,
      href: `/data-availability/projects/${layer.slug}/${b.slug}`,
      statuses: {
        verificationWarning: b.statuses.isUnverified,
        underReview:
          layer.statuses.isUnderReview || b.statuses.isUnderReview
            ? 'config'
            : undefined,
      },
      tvs: getTvs(b.daBridge.usedIn.map((project) => project.id)),
      risks: {
        isNoBridge: !!b.daBridge.risks.isNoBridge,
        values: mapBridgeRisksToRosetteValues(b.daBridge.risks),
      },
      usedIn: b.daBridge.usedIn.sort(
        (a, b) => getTvs([b.id]).latest - getTvs([a.id]).latest,
      ),
      dacInfo: undefined,
    }),
  )

  if (layer.daLayer.usedWithoutBridgeIn.length > 0) {
    daBridges.unshift({
      name: 'No Bridge',
      slug: 'no-bridge',
      href: `/data-availability/projects/${layer.slug}/no-bridge`,
      statuses: {},
      tvs: getTvs(
        layer.daLayer.usedWithoutBridgeIn.map((project) => project.id),
      ),
      risks: {
        isNoBridge: true,
        values: mapBridgeRisksToRosetteValues({ isNoBridge: true }),
      },
      usedIn: layer.daLayer.usedWithoutBridgeIn.sort(
        (a, b) => getTvs([b.id]).latest - getTvs([a.id]).latest,
      ),
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
    risks: {
      isNoBridge: !!project.customDa.risks.isNoBridge,
      values: mapBridgeRisksToRosetteValues(project.customDa.risks),
    },
    dacInfo,
    usedIn,
  }

  return {
    ...getCommonDacDaEntry({ project }),
    risks: mapLayerRisksToRosetteValues(project.customDa.risks),
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
    name: layer.name,
    nameSecondLine: layer.daLayer.type,
    href: `/data-availability/projects/${layer.slug}/${bridge.slug}`,
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
        risks: {
          values: mapBridgeRisksToRosetteValues(bridge.daBridge.risks),
          isNoBridge: false,
        },
        dacInfo: undefined,
        usedIn: bridge.daBridge.usedIn,
      },
    ],
    challengeMechanism: undefined,
    fallback: undefined,
    risks: mapLayerRisksToRosetteValues(layer.daLayer.risks),
  }
}
