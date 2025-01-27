import {
  type ContractParameters,
  get$Implementations,
} from '@l2beat/discovery-types'
import type { EthereumAddress } from '@l2beat/shared-pure'

export function getAddresses(contract: ContractParameters): EthereumAddress[] {
  return [contract.address, ...get$Implementations(contract.values)]
}
