import console from 'console'

import {
  ChecklistTemplate,
  ChecklistValue,
  MissingStageRequirements,
  Satisfied,
  Stage,
  StageBlueprint,
  StageConfigured,
  StageSummary,
} from './types'

export function createGetStage<T extends StageBlueprint>(
  blueprint: T,
  debug?: boolean,
): (checklist: ChecklistTemplate<T>) => StageConfigured {
  return function getStage(checklist) {
    let lastStage: Stage = 'Stage 0'
    let missing: MissingStageRequirements | undefined = undefined
    const warnings: string[] = []
    const summary: StageSummary[] = []

    for (const [key, blueprintStage] of Object.entries(blueprint)) {
      const checklistStage = checklist[key]
      const summaryStage: StageSummary = {
        stage: blueprintStage.name,
        requirements: [],
      }
      summary.push(summaryStage)

      for (const [key, blueprintItem] of Object.entries(blueprintStage.items)) {
        const checklistItem = checklistStage[key]

        const [satisfied, description, warning] = normalizeKeyChecklist(
          blueprintItem,
          checklistItem,
        )
        if (debug) {
          console.log(key, satisfied, description, warning)
        }
        if (satisfied !== null) {
          summaryStage.requirements.push({ satisfied, description })
        }

        if (!satisfied && satisfied !== null && warning) {
          warnings.push(warning)
          continue
        }

        if (!satisfied && satisfied !== null) {
          if (missing === undefined) {
            missing = { nextStage: blueprintStage.name, requirements: [] }
          }
          if (missing.nextStage === blueprintStage.name) {
            missing.requirements.push(description)
          }
        }
      }

      if (missing === undefined && warnings.length === 0) {
        lastStage = blueprintStage.name
      }
    }
    if (debug) {
      console.log({ stage: lastStage, missing, summary, warnings })
    }
    return { stage: lastStage, missing, summary, warnings }
  }
}

function normalizeKeyChecklist(
  stageKeyBlueprint: { positive: string; negative: string },
  stageKeyChecklist: ChecklistValue,
): [Satisfied | null, string, string | undefined] {
  const satisfied = isSatisfied(stageKeyChecklist)

  const description = getDescription(
    satisfied,
    stageKeyBlueprint,
    stageKeyChecklist,
  )

  const warning = getWarning(satisfied, stageKeyBlueprint)

  return [satisfied, description, warning]
}

function getDescription(
  satisfied: Satisfied | null,
  stageKeyBlueprint: { positive: string; negative: string },
  stageKeyChecklist: ChecklistValue,
) {
  if (Array.isArray(stageKeyChecklist)) {
    return stageKeyChecklist[1]
  }

  return satisfied === 'UnderReview' || satisfied
    ? stageKeyBlueprint.positive
    : stageKeyBlueprint.negative
}

function getWarning(
  satisfied: Satisfied | null,
  stageKeyBlueprint: { positive: string; warning?: string; negative: string },
) {
  return satisfied === false ? stageKeyBlueprint.warning : undefined
}

function isSatisfied(stageKeyChecklist: ChecklistValue): Satisfied | null {
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
