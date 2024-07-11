import {
  get$Implementations,
  type ContractParameters,
} from '@l2beat/discovery-types'
import { EthereumAddress } from '@l2beat/shared-pure'

export function getAddresses(contract: ContractParameters): EthereumAddress[] {
  return [contract.address, ...get$Implementations(contract.values)]
}
