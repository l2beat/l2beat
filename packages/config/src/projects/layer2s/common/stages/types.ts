export type StageBlueprint = Record<
  string,
  {
    name: Stage
    items: Record<
      string,
      {
        positive: string
        negative: string
        negativeMessage?: string
        underReviewMessage?: string
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

export type Stage = 'Stage 0' | 'Stage 1' | 'Stage 2'

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

export type StageConfig =
  | StageNotApplicable
  | StageUnderReview
  | StageConfigured
export type UsableStageConfig = StageUnderReview | StageConfigured

export interface StageConfigured {
  stage: Stage
  missing?: MissingStageRequirements
  message: StageConfiguredMessage | undefined
  summary: StageSummary[]
  notice?: string
}

export interface StageConfiguredMessage {
  type: 'underReview' | 'warning' | undefined
  text: string
}
interface StageUnderReview {
  stage: 'UnderReview'
}

interface StageNotApplicable {
  stage: 'NotApplicable'
}
