import type { ValueRecord } from '@l2beat/database'

export interface SumValuesPerSourceOptions {
  forTotal: boolean
  excludeAssociatedTokens: boolean
}

export function sumValuesPerSource(
  values: ValueRecord[],
  options: SumValuesPerSourceOptions,
): {
  external: bigint
  canonical: bigint
  native: bigint
} {
  return values.reduce(
    (acc, curr) => {
      acc.canonical += getValue(curr, 'canonical', options)
      acc.external += getValue(curr, 'external', options)
      acc.native += getValue(curr, 'native', options)
      return acc
    },
    { canonical: 0n, external: 0n, native: 0n },
  )
}

function getValue(
  value: ValueRecord,
  keyPrefix: 'canonical' | 'external' | 'native',
  options: SumValuesPerSourceOptions,
): bigint {
  const key = `${keyPrefix}${options.forTotal ? 'ForTotal' : ''}` as const
  let result = value[key]
  if (options.excludeAssociatedTokens) {
    const associatedKey = `${keyPrefix}Associated${
      options.forTotal ? 'ForTotal' : ''
    }` as const
    result -= value[associatedKey]
  }
  return result
}
