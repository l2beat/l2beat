import type {
  Project,
  ProjectInclusionDelayChart,
  TableReadyValue,
} from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'
import type { InclusionDelayChartDataPoint } from '~/components/projects/sections/sequencing/InclusionDelayChart'
import type { ProjectChanges } from '~/server/features/projects-change-report/getProjectsChangeReport'
import { getProjectsChangeReport } from '~/server/features/projects-change-report/getProjectsChangeReport'
import type { CommonScalingEntry } from '~/server/features/scaling/getCommonScalingEntry'
import { getCommonScalingEntry } from '~/server/features/scaling/getCommonScalingEntry'
import { ps } from '~/server/projects'
import { prepareInclusionDelayCurve } from '~/utils/project/technology/inclusion-delay/calculateInclusionDelay'

type ScalingSequencingProject = Project<
  'statuses' | 'scalingInfo' | 'scalingRisks' | 'display' | 'scalingTechnology',
  'contracts'
>

export interface ScalingSequencingEntry extends CommonScalingEntry {
  sequencerCount: TableReadyValue | undefined
  blockProductionAccess: TableReadyValue | undefined
  entryPolicy: TableReadyValue | undefined
  timing: TableReadyValue | undefined
  blockProduction: TableReadyValue | undefined
  deterministicCrGadget: TableReadyValue | undefined
  additionalCrGadgets: TableReadyValue | undefined
}

export interface InclusionDelayComparisonSeries {
  key: string
  label: string
  type: 'project' | 'ethereum'
}

export interface InclusionDelayComparison {
  data: InclusionDelayChartDataPoint[]
  series: InclusionDelayComparisonSeries[]
  maxCensorFraction: number
}

export interface ScalingSequencingPageData {
  entries: ScalingSequencingEntry[]
  inclusionDelayComparison: InclusionDelayComparison | undefined
}

export async function getScalingSequencingEntries(): Promise<ScalingSequencingPageData> {
  const [projectsChangeReport, projects] = await Promise.all([
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
  ])

  const entries = projects
    .map((project) =>
      getScalingSequencingEntry(
        project,
        projectsChangeReport.getChanges(project.id),
      ),
    )
    .filter(notUndefined)
    .sort((a, b) => a.name.localeCompare(b.name))

  return {
    entries,
    inclusionDelayComparison: getInclusionDelayComparison(projects),
  }
}

const ETHEREUM_SERIES_KEY = 'ethereum'

function getInclusionDelayComparison(
  projects: ScalingSequencingProject[],
): InclusionDelayComparison | undefined {
  const curves = projects
    .map((project) => {
      const sequencing = project.scalingTechnology.sequencing
      if (!sequencing?.sequencerSetSpec || !sequencing.inclusionDelayChart) {
        return undefined
      }
      return {
        slug: project.slug,
        name: project.name,
        curve: prepareInclusionDelayCurve(sequencing.inclusionDelayChart),
      }
    })
    .filter(notUndefined)
    .sort((a, b) => a.name.localeCompare(b.name))

  if (curves.length === 0) {
    return undefined
  }

  const points = new Map<number, InclusionDelayChartDataPoint>()
  for (const { slug, curve } of curves) {
    for (const point of curve.chartData) {
      const existing = points.get(point.censoringFraction) ?? {
        timestamp: point.censoringFraction,
        censoringFraction: point.censoringFraction,
      }
      existing[slug] = point.projectDelayDays
      // The Ethereum baseline is a pure function of the censoring fraction
      // (shared T99 target, 12s slots), so it is identical across projects and
      // only needs to be filled once per fraction.
      existing[ETHEREUM_SERIES_KEY] ??= point.ethereumDelayDays
      points.set(point.censoringFraction, existing)
    }
  }

  const data = [...points.values()].sort(
    (a, b) => a.censoringFraction - b.censoringFraction,
  )

  const series: InclusionDelayComparisonSeries[] = [
    ...curves.map(({ slug, name }) => ({
      key: slug,
      label: name,
      type: 'project' as const,
    })),
    { key: ETHEREUM_SERIES_KEY, label: 'Ethereum', type: 'ethereum' as const },
  ]

  const maxCensorFraction = Math.max(
    ...curves.map(({ curve }) => curve.maxCensorFraction),
    0,
  )

  return { data, series, maxCensorFraction }
}

function getScalingSequencingEntry(
  project: ScalingSequencingProject,
  changes: ProjectChanges,
): ScalingSequencingEntry | undefined {
  const sequencing = project.scalingTechnology.sequencing
  const spec = sequencing?.sequencerSetSpec
  if (!sequencing || !spec) {
    return undefined
  }

  return {
    ...getCommonScalingEntry({ project, changes }),
    sequencerCount: spec.sequencerCount,
    blockProductionAccess: spec.blockProductionAccess,
    entryPolicy: withSecondLine(spec.stakePerValidator, spec.rateLimit),
    timing: withSecondLine(spec.slotTime, spec.epochTime),
    blockProduction: getBlockProduction(sequencing.inclusionDelayChart),
    deterministicCrGadget: spec.deterministicCrGadget,
    additionalCrGadgets: spec.additionalCrGadgets,
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
      'A single proposer is randomly selected for each slot from the proof-of-stake validator set.',
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
