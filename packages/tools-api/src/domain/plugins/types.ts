import type { Address, Chain, TokenConfig } from '../../config/types'
import type { DecodedCall, Value } from '../DecodedResult'

export interface NestedCall {
  to?: Address
  data: Value
}

export type Plugin = (
  call: DecodedCall,
  to: Address | undefined,
  chain: Chain,
  tokens: TokenConfig,
) => NestedCall[] | false
