import type {
  Project,
  ProjectInclusionDelayChart,
  ProjectSequencerSetSpec,
  TableReadyValue,
} from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'
import type { ProjectChanges } from '~/server/features/projects-change-report/getProjectsChangeReport'
import { getProjectsChangeReport } from '~/server/features/projects-change-report/getProjectsChangeReport'
import type { CommonScalingEntry } from '~/server/features/scaling/getCommonScalingEntry'
import { getCommonScalingEntry } from '~/server/features/scaling/getCommonScalingEntry'
import { ps } from '~/server/projects'
import {
  type InclusionDelayChartProps,
  prepareInclusionDelay,
} from '~/utils/project/technology/inclusion-delay/calculateInclusionDelay'

export const DECENTRALIZED_SEQUENCER_SET_VALUE = 'Decentralized Sequencer Set'

type DecentralizedSequencingProjectLike = {
  scalingRisks: {
    self: {
      sequencerFailure: {
        value: string
      }
    }
  }
  scalingTechnology: {
    sequencing?: {
      sequencerSetSpec?: ProjectSequencerSetSpec
    }
  }
}

export interface ScalingDecentralizedSequencingEntry
  extends CommonScalingEntry {
  sequencingHref: string
  sequencerCount: TableReadyValue | undefined
  blockProductionAccess: TableReadyValue | undefined
  entryPolicy: TableReadyValue | undefined
  timing: TableReadyValue | undefined
  blockProduction: TableReadyValue | undefined
  deterministicCrGadget: TableReadyValue | undefined
  additionalCrGadgets: TableReadyValue | undefined
  inclusionDelay: InclusionDelayChartProps | undefined
}

export async function getScalingDecentralizedSequencingEntries() {
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

  return projects
    .filter(isDecentralizedSequencingProject)
    .map((project) =>
      getScalingDecentralizedSequencingEntry(
        project,
        projectsChangeReport.getChanges(project.id),
      ),
    )
    .filter(notUndefined)
    .sort((a, b) => a.name.localeCompare(b.name))
}

export function isDecentralizedSequencingProject(
  project: DecentralizedSequencingProjectLike,
) {
  return (
    project.scalingRisks.self.sequencerFailure.value ===
      DECENTRALIZED_SEQUENCER_SET_VALUE &&
    project.scalingTechnology.sequencing?.sequencerSetSpec !== undefined
  )
}

function getScalingDecentralizedSequencingEntry(
  project: Project<
    | 'statuses'
    | 'scalingInfo'
    | 'scalingRisks'
    | 'display'
    | 'scalingTechnology',
    'contracts'
  >,
  changes: ProjectChanges,
): ScalingDecentralizedSequencingEntry | undefined {
  const sequencing = project.scalingTechnology.sequencing
  const spec = sequencing?.sequencerSetSpec
  if (!sequencing || !spec) {
    return undefined
  }

  return {
    ...getCommonScalingEntry({ project, changes }),
    sequencingHref: `/scaling/projects/${project.slug}#sequencing`,
    sequencerCount: spec.sequencerCount,
    blockProductionAccess: spec.blockProductionAccess,
    entryPolicy: getEntryPolicy(spec),
    timing: getTiming(spec),
    blockProduction: getBlockProduction(sequencing.inclusionDelayChart),
    deterministicCrGadget: spec.deterministicCrGadget,
    additionalCrGadgets: spec.additionalCrGadgets,
    inclusionDelay: sequencing.inclusionDelayChart
      ? prepareInclusionDelay(sequencing.inclusionDelayChart)
      : undefined,
  }
}

export function getBlockProduction(
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

export function getEntryPolicy(
  spec: ProjectSequencerSetSpec,
): TableReadyValue | undefined {
  const stake = spec.stakePerValidator
  const rateLimit = spec.rateLimit

  if (!stake) {
    return rateLimit
  }

  return {
    ...stake,
    secondLine: rateLimit?.value,
    description: joinDescriptions(stake.description, rateLimit?.description),
    sentiment: stake.sentiment ?? rateLimit?.sentiment,
  }
}

export function getTiming(
  spec: ProjectSequencerSetSpec,
): TableReadyValue | undefined {
  const slotTime = spec.slotTime
  const epochTime = spec.epochTime

  if (!slotTime) {
    return epochTime
  }

  return {
    ...slotTime,
    secondLine: epochTime?.value,
    description: joinDescriptions(slotTime.description, epochTime?.description),
    sentiment: slotTime.sentiment ?? epochTime?.sentiment,
  }
}

function joinDescriptions(
  first: string | undefined,
  second: string | undefined,
) {
  return [first, second].filter(notUndefined).join('\n\n') || undefined
}
