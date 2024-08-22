export function is0xString(value: string): value is `0x${string}` {
  return value.length % 2 === 0 && /0x[a-f0-9]*/i.test(value)
}
