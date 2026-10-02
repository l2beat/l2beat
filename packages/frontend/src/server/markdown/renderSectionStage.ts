import type {
  ProjectScalingScopeOfAssessment,
  StageConfigured,
  StageSummary,
} from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import type { StageSectionProps } from '~/components/projects/sections/StageSection'
import {
  APPCHAIN_STAGE_RISK,
  APPCHAIN_STAGES_NOTE,
  STAGES_DISCLAIMER,
  WALKAWAY_TEST,
} from '~/components/projects/sections/sectionCopy'
import { getStageRequirementGroups } from '~/components/projects/sections/stageRequirementGroups'
import { externalLinks } from '~/consts/externalLinks'
import { bulletList, joinBlocks, link, subsection } from './markdown'
import type { SectionContext } from './renderProjectSection'
import { formatUtcDateTime, renderWarnings } from './renderSectionParts'

type StageProps = Omit<StageSectionProps, 'id' | 'title' | 'sectionOrder'>
type Requirement = StageSummary['requirements'][number]

/**
 * The HTML lists upcoming guidelines apart only until the stage changes take
 * effect; afterwards they count like any other requirement.
 */
export function renderStageSection(
  props: StageProps,
  level: number,
  { countdowns }: SectionContext,
) {
  const showUpcomingGuidelines = countdowns.stageChanges >= UnixTime.now()
  const { stageConfig, name } = props
  if (stageConfig.stage === 'UnderReview' || props.isUnderReview) {
    return `${name}'s stage is currently under review.`
  }
  return joinBlocks([
    renderWarnings(props.emergencyWarning),
    describeStage(props, stageConfig),
    renderWalkAway(props.walkAway),
    renderScopeOfAssessment(props.scopeOfAssessment, level),
    renderAdditionalConsiderations(props),
    renderDowngradePending(stageConfig.downgradePending),
    renderWarnings(stageConfig.message?.text),
    ...stageConfig.summary.map((stage) =>
      subsection(
        level,
        stage.stage,
        renderStageRequirements(
          stage,
          stageConfig.stage1PrincipleDescription,
          showUpcomingGuidelines,
        ),
      ),
    ),
    `${link('Learn more about Stages', '/stages')}.`,
    STAGES_DISCLAIMER,
  ])
}

function describeStage(props: StageProps, stageConfig: StageConfigured) {
  const stage = props.isAppchain
    ? `${stageConfig.stage} Appchain`
    : stageConfig.stage
  const notEvenAStage0 =
    props.type === 'Other' && !!stageConfig.missing?.requirements
  return notEvenAStage0
    ? `${props.name} is not even a ${stage} project.`
    : `${props.name} is a ${stage} ${props.type}.`
}

function renderWalkAway(walkAway: StageProps['walkAway']) {
  if (!walkAway) return ''
  const { verdict, explanation } = WALKAWAY_TEST[walkAway]
  return `**${verdict}**: ${explanation}`
}

/** Without it, the stage would read as covering components L2BEAT did not assess. */
function renderScopeOfAssessment(
  scope: ProjectScalingScopeOfAssessment | undefined,
  level: number,
) {
  return subsection(
    level,
    'Scope of assessment',
    joinBlocks([
      subsection(level + 1, 'In scope', bulletList(scope?.inScope ?? [])),
      subsection(
        level + 1,
        'Not in scope',
        bulletList(scope?.notInScope ?? []),
      ),
    ]),
  )
}

/** The HTML qualifies an appchain's stage only next to the additional considerations. */
function renderAdditionalConsiderations(props: StageProps) {
  if (!props.additionalConsiderations) return ''
  return joinBlocks([
    props.isAppchain
      ? `${APPCHAIN_STAGE_RISK.before} **${APPCHAIN_STAGE_RISK.emphasized}** ${APPCHAIN_STAGE_RISK.after}`
      : '',
    props.additionalConsiderations.long,
    props.isAppchain ? `**Note:** ${APPCHAIN_STAGES_NOTE}` : '',
  ])
}

function renderDowngradePending(
  downgradePending: StageConfigured['downgradePending'],
) {
  if (!downgradePending) return ''
  return joinBlocks([
    `**New requirements coming soon** (effective ${formatUtcDateTime(downgradePending.expiresAt)})`,
    'The project will be downgraded to Stage 0 because it does not satisfy upcoming Stage 1 requirements.',
    bulletList(downgradePending.reasons),
    `${link('Learn more about the new requirements', externalLinks.articles.stageOneRequirementsChange)}.`,
  ])
}

/** Status words instead of checkboxes: an unmet requirement is worded as the problem, so an unticked box next to it reads as a double negative. */
function renderStageRequirements(
  stage: StageSummary,
  stage1PrincipleDescription: string | undefined,
  showUpcomingGuidelines: boolean,
) {
  const { upcoming, effective, forLabel } = getStageRequirementGroups(
    stage,
    showUpcomingGuidelines,
  )

  return joinBlocks([
    countRequirements(forLabel),
    stage.principle
      ? joinBlocks([
          '**Principle**',
          bulletList([formatRequirement(stage.principle)]),
          stage1PrincipleDescription ?? '',
          '**Guidelines**',
        ])
      : '',
    bulletList(orderLikeHtml(effective).map(formatRequirement)),
    upcoming.length > 0
      ? joinBlocks([
          '**Upcoming guidelines**',
          bulletList(upcoming.map(formatRequirement)),
        ])
      : '',
  ])
}

/** The label on the collapsed HTML stage row. */
function countRequirements(requirements: Pick<Requirement, 'satisfied'>[]) {
  const missing = requirements.filter((r) => r.satisfied === false).length
  if (missing > 0) {
    return missing === 1
      ? '1 issue needs fixing.'
      : `${missing} issues need fixing.`
  }
  const met = requirements.filter((r) => r.satisfied === true).length
  const underReview = requirements.filter(
    (r) => r.satisfied === 'UnderReview',
  ).length
  const metText = met === 1 ? '1 requirement met' : `${met} requirements met`
  return underReview > 0
    ? `${metText}, ${underReview} under review.`
    : `${metText}.`
}

function orderLikeHtml(requirements: Requirement[]) {
  return [
    ...requirements.filter((r) => r.satisfied === true),
    ...requirements.filter((r) => r.satisfied === 'UnderReview'),
    ...requirements.filter((r) => r.satisfied === false),
  ]
}

/** Config words a met requirement as the goal and an unmet one as the issue, as the HTML ✓ and ✗ rows read. */
function formatRequirement(requirement: {
  satisfied: boolean | 'UnderReview'
  description: string
  upcoming?: boolean
}) {
  const status =
    requirement.satisfied === 'UnderReview'
      ? 'Under review'
      : requirement.satisfied
        ? 'Met'
        : 'Issue'
  const upcoming = requirement.upcoming ? ' (upcoming)' : ''
  return `${status}${upcoming}: ${requirement.description}`
}
