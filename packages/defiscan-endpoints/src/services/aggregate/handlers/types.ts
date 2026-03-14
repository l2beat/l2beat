import type { EthereumAddress } from '@l2beat/shared-pure'
import type { AggregateResponse } from '../../../types/api'

export interface AggregateHandler {
  name: string
  fetch(contractAddress: EthereumAddress, chain: string): Promise<AggregateResponse>
}
