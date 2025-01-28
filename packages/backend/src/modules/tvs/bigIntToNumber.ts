import { assert } from '@l2beat/shared-pure'

export function bigIntToNumber(value: string, decimals: number): number {
  assert(decimals === 0 || decimals >= 2, 'Decimals must be at least 2')

  if (decimals === 0) {
    return Number(BigInt(value))
  }

  return Number(BigInt(value) / 10n ** BigInt(decimals - 2)) / 100
}
