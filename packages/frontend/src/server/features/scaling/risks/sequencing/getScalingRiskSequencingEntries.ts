import type {
  Project,
  ProjectInclusionDelayChart,
  ProjectTechnologyChoice,
  TableReadyValue,
} from '@l2beat/config'
import { assert, notUndefined, ProjectId } from '@l2beat/shared-pure'
import type { ProjectChanges } from '~/server/features/projects-change-report/getProjectsChangeReport'
import { getProjectsChangeReport } from '~/server/features/projects-change-report/getProjectsChangeReport'
import type { CommonScalingEntry } from '~/server/features/scaling/getCommonScalingEntry'
import { getCommonScalingEntry } from '~/server/features/scaling/getCommonScalingEntry'
import type { CommonProjectEntry } from '~/server/features/utils/getCommonProjectEntry'
import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
import type {
  InclusionDelayChartDataPoint,
  InclusionDelayEntityMarker,
} from '~/utils/project/technology/inclusion-delay/calculateInclusionDelay'
import {
  getInclusionDelayData,
  mergeInclusionDelaySeries,
} from '~/utils/project/technology/inclusion-delay/calculateInclusionDelay'

type ScalingRiskSequencingProject = Project<
  'statuses' | 'scalingInfo' | 'scalingRisks' | 'display' | 'scalingTechnology',
  'contracts'
>

type EthereumSequencingProject = Project<'display' | 'scalingTechnology'>

export interface ScalingRiskSequencingEntry extends CommonProjectEntry {
  sequencerCount: TableReadyValue | undefined
  stakeDistributionSnapshotDate: string | undefined
  blockProductionAccess: TableReadyValue | undefined
  entryPolicy: TableReadyValue | undefined
  blockTime: TableReadyValue | undefined
  rotation: TableReadyValue | undefined
  blockProduction: TableReadyValue | undefined
  deterministicCrGadget: TableReadyValue | undefined
  additionalCrGadgets: TableReadyValue | undefined
}

export interface ScalingRiskCentralizedSequencingEntry
  extends CommonScalingEntry {
  trustedPreconfirmation: TableReadyValue
  trustedOrdering: TableReadyValue
  sequencer: TableReadyValue
  realtimeCensorshipResistance: TableReadyValue
  forcedInclusion: TableReadyValue
  inclusionDelay: TableReadyValue
  inclusionMechanics: TableReadyValue
  exitDelay: TableReadyValue
  exitEconomics: TableReadyValue
}

export interface InclusionDelayComparisonSeries {
  key: string
  label: string
  type: 'project' | 'ethereum'
}

export interface InclusionDelayComparison {
  data: InclusionDelayChartDataPoint[]
  series: InclusionDelayComparisonSeries[]
  entityMarkers: InclusionDelayComparisonEntityMarker[]
  maxCensorFraction: number
}

export interface InclusionDelayComparisonEntityMarker
  extends InclusionDelayEntityMarker {
  seriesKey: string
}

export interface ScalingRiskSequencingPageData {
  decentralizedEntries: ScalingRiskSequencingEntry[]
  centralizedEntries: ScalingRiskCentralizedSequencingEntry[]
  inclusionDelayComparison: InclusionDelayComparison | undefined
}

export async function getScalingRiskSequencingEntries(): Promise<ScalingRiskSequencingPageData> {
  const [projectsChangeReport, projects, ethereum] = await Promise.all([
    getProjectsChangeReport(),
    ps.getProjects({
      select: [
        'statuses',
        'scalingInfo',
        'scalingRisks',
        'display',
        'scalingTechnology',
      ],
      optional: ['contracts'],
      where: ['scalingInfo'],
      whereNot: ['archivedAt'],
    }),
    ps.getProject({
      id: ProjectId.ETHEREUM,
      select: ['display', 'scalingTechnology'],
    }),
  ])

  assert(ethereum, 'Ethereum sequencing configuration not found')
  const ethereumEntry = getEthereumSequencingEntry(ethereum)
  assert(ethereumEntry, 'Ethereum sequencer set specification not found')

  const decentralizedEntries = [
    ethereumEntry,
    ...projects
      .map((project) =>
        getScalingRiskSequencingEntry(
          project,
          projectsChangeReport.getChanges(project.id),
        ),
      )
      .filter(notUndefined)
      .sort((a, b) => a.name.localeCompare(b.name)),
  ]

  const centralizedEntries = projects
    .map((project) =>
      getScalingRiskCentralizedSequencingEntry(
        project,
        projectsChangeReport.getChanges(project.id),
      ),
    )
    .filter(notUndefined)
    .sort((a, b) => a.name.localeCompare(b.name))

  return {
    decentralizedEntries,
    centralizedEntries,
    inclusionDelayComparison: getInclusionDelayComparison(projects, ethereum),
  }
}

const ETHEREUM_SERIES_KEY = 'ethereum'

function getInclusionDelayComparison(
  projects: ScalingRiskSequencingProject[],
  ethereum: EthereumSequencingProject,
): InclusionDelayComparison | undefined {
  const projectDelays = projects
    .map((project) => {
      const sequencing = project.scalingTechnology.sequencing
      const chart = sequencing?.inclusionDelayChart
      if (sequencing?.sequencingSpec?.type !== 'sequencer-set' || !chart) {
        return undefined
      }
      const inclusionDelay = getInclusionDelayData(chart)
      return {
        slug: project.slug,
        name: project.name,
        points: inclusionDelay.projectPoints,
        entityMarkers: inclusionDelay.entityLegendEntries.filter(hasDelay),
        maxCensorFraction: chart.maxCensorFraction,
      }
    })
    .filter(notUndefined)
    .sort((a, b) => a.name.localeCompare(b.name))

  const ethereumChart =
    ethereum.scalingTechnology.sequencing?.inclusionDelayChart
  if (projectDelays.length === 0 || !ethereumChart) {
    return undefined
  }

  const maxCensorFraction = Math.max(
    ...projectDelays.map((delay) => delay.maxCensorFraction),
    ethereumChart.maxCensorFraction,
  )
  const ethereumDelay = getInclusionDelayData(ethereumChart)
  const ethereumPoints = ethereumDelay.projectPoints

  const data = mergeInclusionDelaySeries([
    ...projectDelays.map((delay) => ({
      key: delay.slug,
      points: delay.points,
    })),
    { key: ETHEREUM_SERIES_KEY, points: ethereumPoints },
  ])

  const series: InclusionDelayComparisonSeries[] = [
    ...projectDelays.map((delay) => ({
      key: delay.slug,
      label: delay.name,
      type: 'project' as const,
    })),
    { key: ETHEREUM_SERIES_KEY, label: 'Ethereum', type: 'ethereum' as const },
  ]

  const entityMarkers: InclusionDelayComparisonEntityMarker[] = [
    ...projectDelays.flatMap((delay) =>
      delay.entityMarkers.map((marker) => ({
        ...marker,
        id: `${delay.slug}-${marker.id}`,
        seriesKey: delay.slug,
      })),
    ),
    ...ethereumDelay.entityLegendEntries.filter(hasDelay).map((marker) => ({
      ...marker,
      id: `${ETHEREUM_SERIES_KEY}-${marker.id}`,
      seriesKey: ETHEREUM_SERIES_KEY,
    })),
  ]

  return { data, series, entityMarkers, maxCensorFraction }
}

function hasDelay<T extends { delayDays: number | null }>(
  marker: T,
): marker is T & InclusionDelayEntityMarker {
  return marker.delayDays !== null
}

function getScalingRiskSequencingEntry(
  project: ScalingRiskSequencingProject,
  changes: ProjectChanges,
): ScalingRiskSequencingEntry | undefined {
  const sequencing = project.scalingTechnology.sequencing
  const values = getSequencingValues(sequencing)
  if (!values) return undefined

  return {
    ...getCommonScalingEntry({ project, changes }),
    ...values,
  }
}

function getEthereumSequencingEntry(
  project: EthereumSequencingProject,
): ScalingRiskSequencingEntry | undefined {
  const values = getSequencingValues(project.scalingTechnology.sequencing)
  if (!values) return undefined

  return {
    id: project.id,
    slug: project.slug,
    icon: manifest.getUrl('/icons/ethereum.png'),
    name: project.name,
    shortName: project.shortName,
    backgroundColor: 'blue',
    statuses: undefined,
    description: project.display.description,
    ...values,
  }
}

type SequencingValues = Pick<
  ScalingRiskSequencingEntry,
  | 'sequencerCount'
  | 'stakeDistributionSnapshotDate'
  | 'blockProductionAccess'
  | 'entryPolicy'
  | 'blockTime'
  | 'rotation'
  | 'blockProduction'
  | 'deterministicCrGadget'
  | 'additionalCrGadgets'
>

function getSequencingValues(
  sequencing: ProjectTechnologyChoice | undefined,
): SequencingValues | undefined {
  if (sequencing?.sequencingSpec?.type !== 'sequencer-set') return undefined
  const spec = sequencing.sequencingSpec

  return {
    sequencerCount: spec.sequencerCount,
    stakeDistributionSnapshotDate:
      sequencing.inclusionDelayChart?.stakeDistribution?.snapshotDate,
    blockProductionAccess: spec.blockProductionAccess,
    entryPolicy: withSecondLine(spec.stakePerValidator, spec.rateLimit),
    blockTime: spec.blockTime,
    rotation: withSecondLine(
      spec.proposerRotationTime,
      spec.committeeRotationTime,
    ),
    blockProduction: getBlockProduction(sequencing.inclusionDelayChart),
    deterministicCrGadget: spec.deterministicCrGadget,
    additionalCrGadgets: spec.additionalCrGadgets,
  }
}

function getScalingRiskCentralizedSequencingEntry(
  project: ScalingRiskSequencingProject,
  changes: ProjectChanges,
): ScalingRiskCentralizedSequencingEntry | undefined {
  const sequencing = project.scalingTechnology.sequencing
  if (sequencing?.sequencingSpec?.type !== 'centralized') {
    return undefined
  }
  const spec = sequencing.sequencingSpec

  return {
    ...getCommonScalingEntry({ project, changes }),
    trustedPreconfirmation: spec.trustedPreconfirmation,
    trustedOrdering: spec.trustedOrdering,
    sequencer: spec.sequencer,
    realtimeCensorshipResistance: spec.realtimeCensorshipResistance,
    forcedInclusion: spec.forcedInclusion,
    inclusionDelay: spec.inclusionDelay,
    inclusionMechanics: spec.inclusionMechanics,
    exitDelay: spec.exitDelay,
    exitEconomics: spec.exitEconomics,
  }
}

function getBlockProduction(
  chart: ProjectInclusionDelayChart | undefined,
): TableReadyValue | undefined {
  if (!chart) {
    return undefined
  }

  if (chart.type === 'committeelike') {
    return {
      value: 'Sampled committees',
      secondLine: `${chart.committeeSize} members`,
      description:
        'A committee is randomly sampled from the sequencer set for an epoch. A block is accepted only if >2/3 of committee members attest to it.',
      sentiment: 'good',
    }
  }

  if (chart.type === 'spanlike') {
    return {
      value: 'Span producers',
      secondLine: `${chart.spanBlocks.toLocaleString('en-US')} blocks`,
      description:
        'Block production rights are delegated for multi-block spans, so selective censorship by a single entity lasts for a whole span.',
      sentiment: 'warning',
    }
  }

  return {
    value: 'Single proposer rotation',
    secondLine: `${chart.slotSeconds}s slots`,
    description:
      'A single proposer is selected for each slot from the proof-of-stake validator set. The proposer controls the final payload choice and can order transactions locally or through a builder.',
    sentiment: 'good',
  }
}

function withSecondLine(
  value: TableReadyValue | undefined,
  secondLine: TableReadyValue | undefined,
): TableReadyValue | undefined {
  if (!value) {
    return secondLine
  }

  return {
    ...value,
    secondLine: secondLine?.value,
    description: joinDescriptions(value.description, secondLine?.description),
    sentiment: value.sentiment ?? secondLine?.sentiment,
  }
}

function joinDescriptions(
  first: string | undefined,
  second: string | undefined,
) {
  return [first, second].filter(notUndefined).join('\n\n') || undefined
}
