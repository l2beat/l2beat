export interface InitMessage {
  type: 'Init'
  initialView: 'tvl' | 'activity'
  days: number
  aggregateTvlEndpoint: string | undefined
  activityEndpoint: string | undefined
  showEthereum: boolean
}

export type Message = InitMessage
