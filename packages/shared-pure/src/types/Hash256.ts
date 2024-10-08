export type Hash256 = string & {
  _Hash256Brand: string
}

Hash256.ZERO = Hash256('0x' + '0'.repeat(64))

export function Hash256(value: string): Hash256 {
  if (!/^0x[\da-f]{64}$/.test(value)) {
    throw new TypeError('Invalid Hash256')
  }
  return value as unknown as Hash256
}

Hash256.check = function check(value: string) {
  try {
    return Hash256(value).toString() === value
  } catch {
    return false
  }
}

Hash256.random = function random() {
  const digit = (): string | undefined =>
    '0123456789abcdef'[Math.floor(Math.random() * 16)]
  return Hash256('0x' + Array.from({ length: 64 }).map(digit).join(''))
}
