import {
  ChecklistTemplate,
  MissingStageRequirements,
  StageBlueprint,
  StageConfig,
  StageSummary,
} from './types'

export function createGetStage<T extends StageBlueprint>(
  blueprint: T,
): (checklist: ChecklistTemplate<T>) => StageConfig {
  return function getStage(checklist) {
    let lastStage: string | undefined = undefined
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
  stageKeyChecklist: boolean | [boolean, string] | null,
): [boolean | null, string] {
  const satisfied = isSatisfied(stageKeyChecklist)

  let description = satisfied
    ? stageKeyBlueprint.positive
    : stageKeyBlueprint.negative

  if (Array.isArray(stageKeyChecklist)) {
    description += ' ' + stageKeyChecklist[1]
  }

  return [satisfied, description]
}

function isSatisfied(stageKeyChecklist: boolean | [boolean, string] | null) {
  if (stageKeyChecklist === null) return null

  return (
    stageKeyChecklist === true ||
    (Array.isArray(stageKeyChecklist) && stageKeyChecklist[0])
  )
}
