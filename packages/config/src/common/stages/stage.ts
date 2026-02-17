import { assertUnreachable, UnixTime } from '@l2beat/shared-pure'
import type {
  MissingStageDetails,
  Stage,
  StageConfigured,
  StageConfiguredMessage,
  StageDowngrade,
  StageSummary,
} from '../../types'

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

export type UpcomingStageRequirements = Partial<
  Record<
    string,
    {
      expiresAt: number
      items: string[]
    }
  >
>

type ChecklistValue =
  | Satisfied
  | null
  | {
      satisfied: Satisfied
      message: string
      mode: 'append' | 'replace'
    }

export type ChecklistTemplate<T extends StageBlueprint> = {
  [K in keyof T]: {
    [L in keyof T[K]['items']]: ChecklistValue
  } & (T[K] extends { principle: unknown }
    ? {
        principle: ChecklistValue
      }
    : // biome-ignore lint/complexity/noBannedTypes: it's needed
      {})
}

export function createGetStage<T extends StageBlueprint>(
  blueprint: T,
  upcoming?: UpcomingStageRequirements,
): (checklist: ChecklistTemplate<T>) => StageConfigured {
  return function getStage(checklist) {
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

      const upcomingStage = upcoming?.[stage]
      const upcomingCountdownExpired = upcomingStage
        ? upcomingStage.expiresAt < UnixTime.now()
        : true
      const upcomingItems = new Set<string>(upcomingStage?.items ?? [])
      const pendingReasons: string[] = []

      // Loop through stage requirements
      for (const [key, blueprintItem] of Object.entries(blueprintStage.items)) {
        const requirement = evaluate(blueprintItem, checklist[stage][key])
        if (!requirement || requirement.isOmitted) {
          continue
        }

        const isUpcoming = upcomingItems.has(key)

        // Add to output
        summaryStage.requirements.push({
          satisfied: requirement.satisfied,
          description: requirement.description,
          ...(isUpcoming && !upcomingCountdownExpired
            ? { upcoming: true }
            : {}),
        })

        if (isUpcoming) {
          if (requirement.satisfied !== true) {
            if (upcomingCountdownExpired) {
              // Treat as regular requirement
              if (blueprintStage.name !== 'Stage 0') {
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
            } else {
              pendingReasons.push(requirement.description)
            }
          }
          continue
        }

        // Add to missing
        if (
          requirement.satisfied !== true &&
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
          requirement.message &&
          blueprintStage.name === 'Stage 0'
        ) {
          if (message !== undefined) {
            throw new Error('We are currently not handling multiple messages')
          }
          const type =
            requirement.satisfied === 'UnderReview' ? 'underReview' : 'warning'
          message = { type, text: requirement.message }
        }
      }

      if (principle && principle.satisfied !== true) {
        if (missing && missing.nextStage === blueprintStage.name) {
          missing.principle = principle.description
        }

        if (!missing) {
          missing = {
            nextStage: blueprintStage.name,
            requirements: [],
            principle: principle.description,
          }
        }
      }

      if (
        upcomingStage &&
        !upcomingCountdownExpired &&
        pendingReasons.length > 0 &&
        !missing
      ) {
        downgradePending = {
          expiresAt: upcomingStage.expiresAt,
          reasons: pendingReasons,
          toStage: highestStageReached,
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
  blueprint: BlueprintItem,
  value: ChecklistValue,
) {
  const baseDescription =
    satisfied === 'UnderReview' || satisfied
      ? blueprint.positive
      : blueprint.negative

  if (isObject(value)) {
    switch (value.mode) {
      case 'append':
        return `${baseDescription} ${value.message}`
      case 'replace':
        return value.message
      default:
        assertUnreachable(value.mode)
    }
  }

  return baseDescription
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

export function isSatisfied(value: ChecklistValue): Satisfied | null {
  if (value === null) return null

  if (
    value === 'UnderReview' ||
    (isObject(value) && value.satisfied === 'UnderReview')
  )
    return 'UnderReview'

  return value === true || (isObject(value) && value.satisfied)
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
