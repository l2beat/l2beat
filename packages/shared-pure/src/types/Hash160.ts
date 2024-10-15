export type Hash160 = string & {
  _Hash160Brand: string
}

export function Hash160(value: string) {
  if (!/^0x[\da-f]{40}$/.test(value)) {
    throw new TypeError('Invalid Hash160')
  }
  return value as unknown as Hash160
}

Hash160.random = function random() {
  const digit = () => '0123456789abcdef'[Math.floor(Math.random() * 16)]
  return Hash160('0x' + Array.from({ length: 40 }).map(digit).join(''))
}
