import { UnixTime } from '@l2beat/shared-pure'
import { PROJECT_COUNTDOWNS } from '../../../../common'
import type {
  MissingStageDetails,
  Stage,
  StageConfigured,
  StageConfiguredMessage,
  StageDowngrade,
  StageSummary,
} from '../../../../types'

type Satisfied = boolean | 'UnderReview'

interface BlueprintItem {
  positive: string
  negative: string
  negativeMessage?: string
  underReviewMessage?: string
}

type StageBlueprint = Record<
  string,
  {
    name: Stage
    principle?: BlueprintItem
    items: Record<string, BlueprintItem>
  }
>

type ChecklistValue = Satisfied | null | [Satisfied, string]

export type ChecklistTemplate<T extends StageBlueprint> = {
  [K in keyof T]: {
    [L in keyof T[K]['items']]: ChecklistValue
  } & (T[K] extends { principle: unknown }
    ? {
        principle: ChecklistValue
      }
    : // biome-ignore lint/complexity/noBannedTypes: <explanation>
      {})
}

export function createGetStage<T extends StageBlueprint>(
  blueprint: T,
): (checklist: ChecklistTemplate<T>) => StageConfigured {
  return function getStage(checklist) {
    const countdownExpired = PROJECT_COUNTDOWNS.stageChanges.lt(UnixTime.now())
    const summary: StageSummary[] = []
    let highestStageReached: Stage = 'Stage 0'
    let missing: MissingStageDetails | undefined
    let message: StageConfiguredMessage | undefined
    let downgradePending: StageDowngrade | undefined

    // Loop through stages
    for (const [stage, blueprintStage] of Object.entries(blueprint)) {
      const principle = evaluate(
        blueprintStage.principle,
        checklist[stage].principle,
      )

      const summaryStage: StageSummary = {
        stage: blueprintStage.name,
        requirements: [],
        principle: principle
          ? {
              satisfied: principle.satisfied ?? false,
              description: principle.description,
            }
          : undefined,
      }

      // Loop through stage requirements
      for (const [key, blueprintItem] of Object.entries(blueprintStage.items)) {
        const requirement = evaluate(blueprintItem, checklist[stage][key])
        if (!requirement || requirement.isOmitted) {
          continue
        }

        // Add to output
        summaryStage.requirements.push({
          satisfied: requirement.satisfied,
          description: requirement.description,
        })

        // Add to missing
        if (
          requirement.satisfied !== true &&
          // Stage 0 is special. Even if you are failing you get it
          blueprintStage.name !== 'Stage 0'
        ) {
          if (missing === undefined) {
            missing = {
              nextStage: blueprintStage.name,
              requirements: [],
              principle: undefined,
            }
          }
          if (missing.nextStage === blueprintStage.name) {
            missing.requirements.push(requirement.description)
          }
        }

        // Raise warning or under review message
        if (
          requirement.satisfied !== true &&
          // Stage 0 is special. Even if you are failing you get it so we need to warn
          blueprintStage.name === 'Stage 0' &&
          requirement.message
        ) {
          if (message !== undefined) {
            throw new Error('We are currently not handling multiple messages')
          }
          message = {
            type:
              requirement.satisfied === 'UnderReview'
                ? 'underReview'
                : 'warning',
            text: requirement.message,
          }
          continue
        }
      }

      if (principle && principle.satisfied !== true) {
        if (missing && missing.nextStage === blueprintStage.name) {
          missing.principle = principle.description
        }

        if (!missing && countdownExpired) {
          missing = {
            nextStage: blueprintStage.name,
            requirements: [],
            principle: principle.description,
          }
        }

        if (!missing && !countdownExpired) {
          downgradePending = {
            expiresAt: PROJECT_COUNTDOWNS.stageChanges.toNumber(),
            reason: principle.description,
            toStage: highestStageReached,
          }
        }
      }

      if (missing === undefined) {
        highestStageReached = blueprintStage.name
      }
      summary.push(summaryStage)
    }

    return {
      stage: highestStageReached,
      downgradePending,
      missing,
      summary,
      message,
    }
  }
}

function evaluate(
  blueprint: BlueprintItem | undefined,
  value: ChecklistValue | undefined,
):
  | {
      satisfied: Satisfied
      isOmitted: boolean
      description: string
      message: string | undefined
    }
  | undefined {
  if (blueprint === undefined || value === undefined) {
    return
  }
  const satisfied = isSatisfied(value)
  const description = getDescription(satisfied, blueprint, value)
  const message = getMessage(satisfied, blueprint)
  return {
    satisfied: satisfied !== null ? satisfied : false,
    isOmitted: satisfied === null,
    description,
    message,
  }
}

function getDescription(
  satisfied: Satisfied | null,
  stageKeyBlueprint: BlueprintItem,
  stageKeyChecklist: ChecklistValue,
) {
  if (Array.isArray(stageKeyChecklist)) {
    return stageKeyChecklist[1]
  }

  return satisfied === 'UnderReview' || satisfied
    ? stageKeyBlueprint.positive
    : stageKeyBlueprint.negative
}

function getMessage(
  satisfied: Satisfied | null,
  stageKeyBlueprint: {
    positive: string
    warningMessage?: string
    underReviewMessage?: string
    negative: string
  },
) {
  if (satisfied === null || satisfied === true) return undefined

  if (satisfied === 'UnderReview') {
    return stageKeyBlueprint.underReviewMessage
  }

  return stageKeyBlueprint.warningMessage
}

export function isSatisfied(
  stageKeyChecklist: ChecklistValue,
): Satisfied | null {
  if (stageKeyChecklist === null) return null

  if (
    stageKeyChecklist === 'UnderReview' ||
    (Array.isArray(stageKeyChecklist) && stageKeyChecklist[0] === 'UnderReview')
  )
    return 'UnderReview'

  return (
    stageKeyChecklist === true ||
    (Array.isArray(stageKeyChecklist) && stageKeyChecklist[0])
  )
}
