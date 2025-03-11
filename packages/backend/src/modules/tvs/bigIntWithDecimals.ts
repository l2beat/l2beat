import { assert } from '@l2beat/shared-pure'

// all calculations will be done with this precision
const DECIMALS = 18

export type BigIntWithDecimals = bigint

export function BigIntWithDecimals(
  value: bigint,
  decimals: number,
): BigIntWithDecimals {
  assert(decimals >= 0, 'Decimals must be non-negative')

  if (decimals === DECIMALS) {
    return value
  }

  if (decimals > DECIMALS) {
    return value / BigInt(10 ** (decimals - DECIMALS))
  }

  return value * BigInt(10 ** (DECIMALS - decimals))
}

BigIntWithDecimals.fromNumber = function fromNumber(
  value: number,
): BigIntWithDecimals {
  return BigInt(Math.round(value * 10 ** DECIMALS))
}

BigIntWithDecimals.toNumber = function toNumber(
  value: BigIntWithDecimals,
): number {
  return Number(value) / 10 ** DECIMALS
}

BigIntWithDecimals.multiply = function multiply(
  a: BigIntWithDecimals,
  b: BigIntWithDecimals,
): BigIntWithDecimals {
  return (a * b) / BigInt(10 ** DECIMALS)
}

BigIntWithDecimals.MAX = BigInt(2n ** 256n)
