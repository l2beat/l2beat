export type StageBlueprint = Record<
  string,
  {
    name: Stage
    items: Record<
      string,
      {
        positive: string
        negative: string
      }
    >
  }
>

export type Satisfied = boolean | 'UnderReview'

export type ChecklistValue = Satisfied | null | [Satisfied, string]

export type ChecklistTemplate<T extends StageBlueprint> = {
  [K in keyof T]: {
    [L in keyof T[K]['items']]: ChecklistValue
  }
}

// TODO: maybe it shouldn't be undefined
export type Stage = 'Stage 0' | 'Stage 1' | 'Stage 2' | undefined

export interface StageSummary {
  stage: Stage
  requirements: {
    satisfied: Satisfied
    description: string
  }[]
}

export interface MissingStageRequirements {
  nextStage: Stage
  requirements: string[]
}

export type StageConfig = StageUnderReview | StageConfigured

export interface StageConfigured {
  stage: Stage
  missing?: MissingStageRequirements
  summary: StageSummary[]
}

interface StageUnderReview {
  stage: 'UnderReview'
}
