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

export type ChecklistTemplate<T extends StageBlueprint> = {
  [K in keyof T]: {
    [L in keyof T[K]['items']]: boolean | null | [boolean, string]
  }
}

export interface StageSummary {
  stage: string
  requirements: {
    satisfied: boolean
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
