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
  STAGE_DOWNGRADE_PENDING,
  STAGES_DISCLAIMER,
  WALKAWAY_TEST,
} from '~/components/projects/sections/sectionCopy'
import {
  getStageRequirementGroups,
  isBelowStage0,
  issuesToFixText,
  requirementsMetText,
} from '~/components/projects/sections/stageRequirementGroups'
import { externalLinks } from '~/consts/externalLinks'
import { bulletList, joinBlocks, link, note, subsection } from './markdown'
import type { SectionContext } from './renderProjectSection'
import { formatUtcDateTime, renderWarnings } from './renderSectionParts'

type StageProps = Omit<StageSectionProps, 'id' | 'title' | 'sectionOrder'>

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
  return isBelowStage0(props.type, stageConfig)
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
    props.isAppchain ? note(APPCHAIN_STAGES_NOTE) : '',
  ])
}

function renderDowngradePending(
  downgradePending: StageConfigured['downgradePending'],
) {
  if (!downgradePending) return ''
  return joinBlocks([
    `**${STAGE_DOWNGRADE_PENDING.title}** (effective ${formatUtcDateTime(downgradePending.expiresAt)})`,
    `${STAGE_DOWNGRADE_PENDING.before} ${STAGE_DOWNGRADE_PENDING.stage} ${STAGE_DOWNGRADE_PENDING.after}`,
    bulletList(downgradePending.reasons),
    `${link(STAGE_DOWNGRADE_PENDING.learnMore, externalLinks.articles.stageOneRequirementsChange)}.`,
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
    bulletList(
      [...effective.met, ...effective.underReview, ...effective.missing].map(
        formatRequirement,
      ),
    ),
    upcoming.length > 0
      ? joinBlocks([
          '**Upcoming guidelines**',
          bulletList(upcoming.map(formatRequirement)),
        ])
      : '',
  ])
}

/** The label on the collapsed HTML stage row. */
function countRequirements({
  met,
  underReview,
  missing,
}: ReturnType<typeof getStageRequirementGroups>['forLabel']) {
  if (missing.length > 0) return `${issuesToFixText(missing.length)}.`
  const metText = requirementsMetText(met.length)
  return underReview.length > 0
    ? `${metText}, ${underReview.length} under review.`
    : `${metText}.`
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
