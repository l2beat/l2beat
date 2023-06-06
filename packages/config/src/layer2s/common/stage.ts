export const getStage = createGetStage({
  stage0: {
    name: 'Stage 0',
    items: {
      callsItselfRollup: {
        positive: 'The project calls itself a rollup',
        negative: "The project doesn't call itself a rollup",
      },
    },
  },
  stage1: {
    name: 'Stage 1',
    items: {
      isCouncil8Members: {
        positive: 'The project has at least 8 council members',
        negative: "The project doesn't have 8 council members",
      },
    },
  },
})

export type StageChecklist<T extends StageBlueprint> = {
  [K in keyof T]: {
    [L in keyof T[K]['items']]: boolean | null | [boolean, string]
  }
}

export interface StageBlueprint {
  [key: string]: {
    name: string
    items: {
      [key: string]: {
        positive: string
        negative: string
      }
    }
  }
}

export interface StageSummary {
  stage: string
  requirements: {
    satisfied: boolean
    description: string
  }[]
}

interface MissingStageRequirements {
  nextStage: string
  requirements: string[]
}

export interface StageConfig {
  stage: string | undefined
  missing?: MissingStageRequirements
  summary: StageSummary[]
}

export function createGetStage<T extends StageBlueprint>(
  blueprint: T,
): (checklist: StageChecklist<T>) => StageConfig {
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

        summaryStage.requirements.push({ satisfied, description })

        if (!satisfied) {
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

function isSatisfied(stageKeyChecklist: boolean | [boolean, string] | null) {
  return (
    stageKeyChecklist === true ||
    stageKeyChecklist === null ||
    (Array.isArray(stageKeyChecklist) && stageKeyChecklist[0] === true)
  )
}

function normalizeKeyChecklist(
  stageKeyBlueprint: { positive: string; negative: string },
  stageKeyChecklist: boolean | [boolean, string] | null,
): [boolean, string] {
  const satisfied = isSatisfied(stageKeyChecklist)

  let description = satisfied
    ? stageKeyBlueprint.positive
    : stageKeyBlueprint.negative

  if (Array.isArray(stageKeyChecklist)) {
    description += ' ' + stageKeyChecklist[1]
  }

  return [satisfied, description]
}
