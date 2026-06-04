import type {
  Project,
  ProjectInclusionDelayChart,
  TableReadyValue,
} from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'
import type { ProjectChanges } from '~/server/features/projects-change-report/getProjectsChangeReport'
import { getProjectsChangeReport } from '~/server/features/projects-change-report/getProjectsChangeReport'
import type { CommonScalingEntry } from '~/server/features/scaling/getCommonScalingEntry'
import { getCommonScalingEntry } from '~/server/features/scaling/getCommonScalingEntry'
import { ps } from '~/server/projects'
import {
  type InclusionDelayCurve,
  prepareInclusionDelayCurve,
} from '~/utils/project/technology/inclusion-delay/calculateInclusionDelay'

const DECENTRALIZED_SEQUENCER_SET_VALUE = 'Decentralized Sequencer Set'

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
  inclusionDelay: InclusionDelayCurve | undefined
}

export async function getScalingSequencingEntries() {
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
    .filter(isSequencingProject)
    .map((project) =>
      getScalingSequencingEntry(
        project,
        projectsChangeReport.getChanges(project.id),
      ),
    )
    .filter(notUndefined)
    .sort((a, b) => a.name.localeCompare(b.name))
}

function isSequencingProject(project: ScalingSequencingProject) {
  return (
    project.scalingRisks.self.sequencerFailure.value ===
      DECENTRALIZED_SEQUENCER_SET_VALUE &&
    project.scalingTechnology.sequencing?.sequencerSetSpec !== undefined
  )
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
    inclusionDelay: sequencing.inclusionDelayChart
      ? prepareInclusionDelayCurve(sequencing.inclusionDelayChart)
      : undefined,
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
