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
): (checklist: ChecklistTemplate<T>) => StageConfigured {
  return function getStage(checklist) {
    let lastStage: Stage | undefined = undefined
    let missing: MissingStageRequirements | undefined = undefined
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

        const [satisfied, description] = normalizeKeyChecklist(
          blueprintItem,
          checklistItem,
        )

        if (satisfied !== null) {
          summaryStage.requirements.push({ satisfied, description })
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

      if (missing === undefined) {
        lastStage = blueprintStage.name
      }
    }

    return { stage: lastStage, missing, summary }
  }
}

function normalizeKeyChecklist(
  stageKeyBlueprint: { positive: string; negative: string },
  stageKeyChecklist: ChecklistValue,
): [Satisfied | null, string] {
  const satisfied = isSatisfied(stageKeyChecklist)

  const description = getDescription(
    satisfied,
    stageKeyBlueprint,
    stageKeyChecklist,
  )

  return [satisfied, description]
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
