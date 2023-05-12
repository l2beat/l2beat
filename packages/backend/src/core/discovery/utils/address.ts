import { Bytes, EthereumAddress } from '@l2beat/common'

export function bytes32ToAddress(bytes32: Bytes) {
  return EthereumAddress(bytes32.slice(12, 32).toString())
}
