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
    let lastStage: Stage = 'Stage 0'
    let missing: MissingStageRequirements | undefined = undefined
    let showWarning = false
    const warnings: string[] = []
    const summary: StageSummary[] = []

    for (const [blueprintStageKey, blueprintStage] of Object.entries(
      blueprint,
    )) {
      const checklistStage = checklist[blueprintStageKey]
      const summaryStage: StageSummary = {
        stage: blueprintStage.name,
        requirements: [],
      }
      summary.push(summaryStage)

      for (const [blueprintItemKey, blueprintItem] of Object.entries(
        blueprintStage.items,
      )) {
        const checklistItem = checklistStage[blueprintItemKey]

        const [satisfied, description, warning] = normalizeKeyChecklist(
          blueprintItem,
          checklistItem,
        )

        if (satisfied !== null) {
          summaryStage.requirements.push({ satisfied, description })
        }

        if (
          (satisfied === false || satisfied === 'UnderReview') &&
          blueprintStage.name === 'Stage 0'
        ) {
          if (warning) warnings.push(warning)
          showWarning = true
          continue
        }

        if (satisfied === false || satisfied === 'UnderReview') {
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

    return {
      stage: lastStage,
      missing,
      summary,
      showWarning,
      warnings,
    }
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
