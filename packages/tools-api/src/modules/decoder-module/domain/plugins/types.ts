import type { Address, Chain, TokenConfig } from '../../../../config/types'
import type { DecodedCall, Value } from '../DecodedResult'

export interface NestedCall {
  to?: Address
  data: Value
}

export type Plugin = (
  call: DecodedCall,
  chain: Chain,
  to: Address | undefined,
  tokens: TokenConfig,
  chains: Chain[],
) => NestedCall[] | false
