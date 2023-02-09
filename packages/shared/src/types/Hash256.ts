export interface Hash256 extends String {
  _Hash256Brand: string
}

export function Hash256(value: string) {
  if (!/^0x[\da-f]{64}$/.test(value)) {
    throw new TypeError('Invalid Hash256')
  }
  return value as unknown as Hash256
}

Hash256.random = function random() {
  const digit = () => '0123456789abcdef'[Math.floor(Math.random() * 16)]
  return Hash256('0x' + Array.from({ length: 64 }).map(digit).join(''))
}
