import { validateAddress } from '@mradomski/tinyerc55'

const ALLOWED_CHARS = '0123456789abcdef'

export type EthereumAddress = string & {
  _EthereumAddressBrand: string
}

export function EthereumAddress(value: string): EthereumAddress {
  const result = validateAddress(value)
  if (!result.valid) {
    throw new TypeError('Invalid EthereumAddress')
  }

  return result.address as unknown as EthereumAddress
}

EthereumAddress.check = function check(value: string) {
  try {
    return EthereumAddress(value).toString() === value
  } catch {
    return false
  }
}

EthereumAddress.checkIgnoringCase = function checkIgnoringCase(value: string) {
  try {
    return EthereumAddress(value).toLowerCase() === value.toLowerCase()
  } catch {
    return false
  }
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
  const withoutPrefix = value.slice(2)

  for (const char of withoutPrefix) {
    if (!ALLOWED_CHARS.includes(char.toLowerCase())) {
      throw new TypeError('Invalid EthereumAddress')
    }
  }

  const padded = withoutPrefix.padStart(40, '0')
  return EthereumAddress('0x' + padded)
}

EthereumAddress.ZERO = EthereumAddress.from('0x0')
