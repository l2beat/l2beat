export type StageBlueprint = Record<
  string,
  {
    name: string
    items: Record<
      string,
      {
        positive: string
        negative: string
      }
    >
  }
>

export type ChecklistValue = boolean | null | [boolean | 'UnderReview', string]

export type ChecklistTemplate<T extends StageBlueprint> = {
  [K in keyof T]: {
    [L in keyof T[K]['items']]: ChecklistValue
  }
}

export interface StageSummary {
  stage: string
  requirements: {
    satisfied: boolean | 'UnderReview'
    description: string
  }[]
}

export interface MissingStageRequirements {
  nextStage: string
  requirements: string[]
}

export interface StageConfig {
  stage: string | undefined
  missing?: MissingStageRequirements
  summary: StageSummary[]
}
