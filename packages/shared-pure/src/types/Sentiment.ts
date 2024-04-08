export type Sentiment = 'bad' | 'warning' | 'good' | 'neutral' | 'UnderReview'

export type ValueWithSentiment<T, S extends string = Sentiment> = {
  sentiment: S
  description?: string
} & (T extends unknown[]
  ? {
      values: T
    }
  : {
      value: T
    })

type WarningSentiment = 'bad' | 'warning'
export type WarningValueWithSentiment = ValueWithSentiment<
  string,
  WarningSentiment
>
