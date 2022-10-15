export interface InitMessage {
  type: 'InitMessage'
  initialView: 'tvl' | 'activity'
  days: number
  tvlEndpoint: string | undefined
  activityEndpoint: string | undefined
}

export type Message = InitMessage
