export interface Transfer {
  id: string
  app: string

  originChain: string
  originTx: string
  originTimestamp: number
  originToken?: string
  originAmount?: bigint

  destinationChain: string
  destinationTx: string
  destinationTimestamp: number
  destinationToken?: string
  destinationAmount?: bigint

  token: string
  amount: number
  valueUsd: number
}
