import { validateAddress } from '@mradomski/tinyerc55'

const ALLOWED_CHARS = '0123456789abcdef'

export type EthereumAddress = string & {
  _EthereumAddressBrand: string
}

export function EthereumAddress(value: string): EthereumAddress {
  const parsed = EthereumAddress.tryParse(value)
  if (parsed === undefined) {
    throw new TypeError('Invalid EthereumAddress')
  }

  return parsed
}

// For callers that ask "is this an address?" about values that are usually not
// one. Throwing that answer makes the common path pay for a stack capture.
EthereumAddress.tryParse = function tryParse(
  value: string,
): EthereumAddress | undefined {
  const result = validateAddress(value)
  if (!result.valid) {
    return undefined
  }

  return result.address as unknown as EthereumAddress
}

EthereumAddress.check = function check(value: string) {
  return EthereumAddress.tryParse(value) === value
}

EthereumAddress.checkIgnoringCase = function checkIgnoringCase(value: string) {
  return EthereumAddress.tryParse(value)?.toLowerCase() === value.toLowerCase()
}

EthereumAddress.isBefore = function isBefore(
  a: EthereumAddress,
  b: EthereumAddress,
) {
  return a.toLowerCase() < b.toLowerCase()
}

EthereumAddress.inOrder = function inOrder(
  a: EthereumAddress,
  b: EthereumAddress,
): [EthereumAddress, EthereumAddress] {
  return EthereumAddress.isBefore(a, b) ? [a, b] : [b, a]
}

EthereumAddress.random = function random() {
  const digit = (): string | undefined =>
    ALLOWED_CHARS[Math.floor(Math.random() * 16)]
  return EthereumAddress('0x' + Array.from({ length: 40 }).map(digit).join(''))
}

EthereumAddress.unsafe = function unsafe(address: string) {
  return address as unknown as EthereumAddress
}

EthereumAddress.from = function from(value: string) {
  const padded = value.slice(2).padStart(40, '0')
  return EthereumAddress('0x' + padded)
}

EthereumAddress.ZERO = EthereumAddress.from('0x0')
