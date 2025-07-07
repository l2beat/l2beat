export interface BridgeTransfer {
  /** Name of the protocol used to bridge token. See protocols.ts for possible values. */
  protocol: string
  /** Source chain of the transfer */
  source: string
  /** Destination chain of the transfer */
  destination: string
  /** Address of a token that has been transferred */
  token: string
  /** Amount of the token transferred, denominated in basic unit of this token (without decimals calculation). */
  amount: string
  /** Address of the sender */
  sender?: string
  /** Address of the receiver */
  receiver?: string
  /** Hash of a transaction in which transfer took place */
  txHash?: string
  /** Custom id used (by given protocol) to identify other part of the transfer. */
  id?: string
}
