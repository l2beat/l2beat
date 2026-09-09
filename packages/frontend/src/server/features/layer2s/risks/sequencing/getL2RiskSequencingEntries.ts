import type {
  Project,
  ProjectCentralizedSequencingSpec,
  ProjectInclusionDelayChart,
  ProjectInclusionDelayChartStakeDistribution,
  ProjectSequencerSetSpec,
  TableReadyValue,
} from '@l2beat/config'
import { assert, notUndefined, ProjectId } from '@l2beat/shared-pure'
import { getCommonL2Entry } from '~/server/features/layer2s/getCommonL2Entry'
import type { ProjectChanges } from '~/server/features/projects-change-report/getProjectsChangeReport'
import { getProjectsChangeReport } from '~/server/features/projects-change-report/getProjectsChangeReport'
import type { CommonProjectEntry } from '~/server/features/utils/getCommonProjectEntry'
import { getEthereumCommonEntry } from '~/server/features/utils/getEthereumCommonEntry'
import { ps } from '~/server/projects'
import type {
  InclusionDelayChartDataPoint,
  InclusionDelayEntityMarker,
} from '~/utils/project/technology/inclusion-delay/calculateInclusionDelay'
import {
  getInclusionDelayData,
  mergeInclusionDelaySeries,
} from '~/utils/project/technology/inclusion-delay/calculateInclusionDelay'

type L2RiskSequencingProject = Project<
  'statuses' | 'scalingInfo' | 'scalingRisks' | 'display' | 'scalingTechnology',
  'contracts'
>

export interface L2RiskSequencingEntry extends CommonProjectEntry {
  sequencerCount: TableReadyValue | undefined
  stakeDistributionDate:
    | Pick<ProjectInclusionDelayChartStakeDistribution, 'dateType' | 'date'>
    | undefined
  blockProductionAccess: TableReadyValue | undefined
  entryPolicy: TableReadyValue | undefined
  blockTime: TableReadyValue | undefined
  rotation: TableReadyValue | undefined
  blockProduction: TableReadyValue | undefined
  deterministicCrGadget: TableReadyValue | undefined
  additionalCrGadgets: TableReadyValue | undefined
}

export interface L2RiskCentralizedSequencingEntry
  extends CommonProjectEntry,
    Omit<ProjectCentralizedSequencingSpec, 'type'> {}

export interface InclusionDelayComparisonSeries {
  key: string
  label: string
  type: 'project' | 'ethereum'
}

export interface InclusionDelayComparisonEntityMarker
  extends InclusionDelayEntityMarker {
  seriesKey: string
}

export interface InclusionDelayComparison {
  data: InclusionDelayChartDataPoint[]
  series: InclusionDelayComparisonSeries[]
  entityMarkers: InclusionDelayComparisonEntityMarker[]
  maxCensorFraction: number
}

export interface L2RiskSequencingPageData {
  decentralizedEntries: L2RiskSequencingEntry[]
  centralizedEntries: L2RiskCentralizedSequencingEntry[]
  inclusionDelayComparison: InclusionDelayComparison | undefined
}

export async function getL2RiskSequencingEntries(): Promise<L2RiskSequencingPageData> {
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

  // Ethereum is the baseline row and the baseline chart series. Its config is
  // always populated, so a missing spec or chart is a config error.
  assert(ethereum, 'Ethereum sequencing configuration not found')
  const ethereumSpec = ethereum.scalingTechnology.sequencing?.sequencingSpec
  assert(
    ethereumSpec?.type === 'sequencer-set' && ethereumSpec.inclusionDelayChart,
    'Ethereum sequencer set specification with inclusion delay chart not found',
  )

  const decentralizedEntries: L2RiskSequencingEntry[] = [
    {
      ...getEthereumCommonEntry({
        description: ethereum.display.description,
      }),
      ...getSequencingValues(ethereumSpec),
    },
    ...projects
      .map((project) =>
        getL2RiskSequencingEntry(
          project,
          projectsChangeReport.getChanges(project.id),
        ),
      )
      .filter(notUndefined)
      .sort((a, b) => a.name.localeCompare(b.name)),
  ]

  const centralizedEntries = projects
    .map((project) =>
      getL2RiskCentralizedSequencingEntry(
        project,
        projectsChangeReport.getChanges(project.id),
      ),
    )
    .filter(notUndefined)
    .sort((a, b) => a.name.localeCompare(b.name))

  return {
    decentralizedEntries,
    centralizedEntries,
    inclusionDelayComparison: getInclusionDelayComparison(
      projects,
      ethereumSpec.inclusionDelayChart,
    ),
  }
}

interface InclusionDelaySeriesInput extends InclusionDelayComparisonSeries {
  chart: ProjectInclusionDelayChart
}

function getInclusionDelayComparison(
  projects: L2RiskSequencingProject[],
  ethereumChart: ProjectInclusionDelayChart,
): InclusionDelayComparison | undefined {
  const projectInputs = projects
    .map((project): InclusionDelaySeriesInput | undefined => {
      const spec = project.scalingTechnology.sequencing?.sequencingSpec
      if (spec?.type !== 'sequencer-set' || !spec.inclusionDelayChart) {
        return undefined
      }
      return {
        key: project.slug,
        label: project.name,
        type: 'project',
        chart: spec.inclusionDelayChart,
      }
    })
    .filter(notUndefined)
    .sort((a, b) => a.label.localeCompare(b.label))

  if (projectInputs.length === 0) {
    return undefined
  }

  const inputs: InclusionDelaySeriesInput[] = [
    {
      key: 'ethereum',
      label: 'Ethereum',
      type: 'ethereum',
      chart: ethereumChart,
    },
    ...projectInputs,
  ]
  const computed = inputs.map((input) => ({
    ...input,
    delay: getInclusionDelayData(input.chart),
  }))

  return {
    data: mergeInclusionDelaySeries(
      computed.map(({ key, delay }) => ({ key, points: delay.projectPoints })),
    ),
    series: computed.map(({ key, label, type }) => ({ key, label, type })),
    entityMarkers: computed.flatMap(({ key, delay }) =>
      delay.entityMarkers.map((marker) => ({
        ...marker,
        id: `${key}-${marker.id}`,
        seriesKey: key,
      })),
    ),
    maxCensorFraction: Math.max(
      ...computed.map(({ chart }) => chart.maxCensorFraction),
    ),
  }
}

function getL2RiskSequencingEntry(
  project: L2RiskSequencingProject,
  changes: ProjectChanges,
): L2RiskSequencingEntry | undefined {
  const spec = project.scalingTechnology.sequencing?.sequencingSpec
  if (spec?.type !== 'sequencer-set') {
    return undefined
  }

  return {
    ...getCommonL2Entry({ project, changes }),
    ...getSequencingValues(spec),
  }
}

type SequencingValues = Omit<L2RiskSequencingEntry, keyof CommonProjectEntry>

function getSequencingValues(spec: ProjectSequencerSetSpec): SequencingValues {
  const stakeDistribution = spec.inclusionDelayChart?.stakeDistribution

  return {
    sequencerCount: spec.sequencerCount,
    stakeDistributionDate: stakeDistribution && {
      dateType: stakeDistribution.dateType,
      date: stakeDistribution.date,
    },
    blockProductionAccess: spec.blockProductionAccess,
    entryPolicy: withSecondLine(spec.stakePerValidator, spec.rateLimit),
    blockTime: spec.blockTime,
    rotation: withSecondLine(
      spec.proposerRotationTime,
      spec.committeeRotationTime,
    ),
    blockProduction: getBlockProduction(spec.inclusionDelayChart),
    deterministicCrGadget: spec.deterministicCrGadget,
    additionalCrGadgets: spec.additionalCrGadgets,
  }
}

function getL2RiskCentralizedSequencingEntry(
  project: L2RiskSequencingProject,
  changes: ProjectChanges,
): L2RiskCentralizedSequencingEntry | undefined {
  const sequencing = project.scalingTechnology.sequencing
  if (sequencing?.sequencingSpec?.type !== 'centralized') {
    return undefined
  }
  const { type: _, ...spec } = sequencing.sequencingSpec

  return {
    ...getCommonL2Entry({ project, changes }),
    ...spec,
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
