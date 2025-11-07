import type { Branded } from './branded.js'
import { EthereumAddress } from './EthereumAddress.js'

export type Address32 = Branded<string, 'Address32'>

export function Address32(value: string) {
  if (/^0x[a-f0-9]{64}$/.test(value) || value === 'native') {
    return value as Address32
  }
  throw new Error('Invalid Bytes32Address')
}

Address32.fromOrUndefined = function fromOrUndefined(
  value: string | undefined,
) {
  if (!value) {
    return undefined
  }
  try {
    return Address32.from(value)
  } catch {
    return undefined
  }
}

Address32.from = function from(value: string | EthereumAddress) {
  if (value === 'native') {
    return value as Address32
  }
  if (/^0x[a-f0-9]*$/i.test(value) && value.length <= 66) {
    return ('0x' + value.slice(2).toLowerCase().padStart(64, '0')) as Address32
  }
  throw new Error('Cannot create Bytes32Address')
}

Address32.cropToEthereumAddress = function cropToEthereumAddress(
  value: Address32,
) {
  return EthereumAddress(`0x${value.slice(-40)}`)
}

Address32.ZERO = Address32.from('0x')
Address32.NATIVE = Address32('native')
