import { type Bytes, EthereumAddress } from '@l2beat/shared-pure'

export function bytes32ToAddress(bytes32: Bytes): EthereumAddress {
  return EthereumAddress(bytes32.slice(12, 32).toString())
}
