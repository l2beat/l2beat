export const getStage = createGetStage({
  stage0: {
    name: 'Stage 0',
    keys: {
      callsItselfRollup: {
        positive: 'The project calls itself a rollup',
        negative: "The project doesn't call itself a rollup",
      },
    },
  },
  stage1: {
    name: 'Stage 1',
    keys: {
      isCouncil8Members: {
        positive: 'The project has at least 8 council members',
        negative: "The project doesn't have 8 council members",
      },
    },
  },
})

export type StageChecklist<T extends StageBlueprint> = {
  [K in keyof T]: {
    [L in keyof T[K]['keys']]: boolean | null | [boolean, string]
  }
}

export interface StageBlueprint {
  [key: string]: {
    name: string
    keys: {
      [key: string]: {
        positive: string
        negative: string
      }
    }
  }
}

export interface StageConfig {
  stage: string
  missing?: {
    nextStage: string
    requirements: string[]
  }
  summary?: {
    stage: string
    requirements: { satisfied: boolean; description: string }[]
  }[]
}

export function createGetStage<T extends StageBlueprint>(
  blueprint: T,
): (checklist: StageChecklist<T>) => StageConfig {
  return function getStage(checklist) {
    let lastStage = 'No stage'
    let missing: StageConfig['missing'] = undefined

    for (const [key, stageBlueprint] of Object.entries(blueprint)) {
      const stageChecklist = checklist[key]

      for (const [key, stageKeyBlueprint] of Object.entries(
        stageBlueprint.keys,
      )) {
        const stageKeyChecklist = stageChecklist[key]

        const isSatisfied =
          stageKeyChecklist === true ||
          stageKeyChecklist === null ||
          (Array.isArray(stageKeyChecklist) && stageKeyChecklist[0] === true)

        let description = isSatisfied
          ? stageKeyBlueprint.positive
          : stageKeyBlueprint.negative
        if (Array.isArray(stageKeyChecklist)) {
          description += ' ' + stageKeyChecklist[1]
        }

        if (!isSatisfied) {
          if (missing === undefined) {
            missing = { nextStage: stageBlueprint.name, requirements: [] }
          }
          missing.requirements.push(description)
        }
      }
      if (missing !== undefined) {
        break
      }
      lastStage = stageBlueprint.name
    }

    return { stage: lastStage, missing }
  }
}
