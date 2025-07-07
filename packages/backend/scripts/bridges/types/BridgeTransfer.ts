export interface BridgeTransfer {
  protocol: string
  source: string
  destination: string
  token: string
  amount: string
  sender?: string
  receiver?: string
  txHash?: string
  id?: string
}
