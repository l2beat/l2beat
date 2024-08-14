import { type ValueRecord } from '@l2beat/database'

export function sumValuesPerSource(
  values: ValueRecord[],
  forTotal?: boolean,
): {
  external: bigint
  canonical: bigint
  native: bigint
} {
  return values.reduce(
    (acc, curr) => {
      acc.canonical += forTotal ? curr.canonicalForTotal : curr.canonical
      acc.external += forTotal ? curr.externalForTotal : curr.external
      acc.native += forTotal ? curr.nativeForTotal : curr.native
      return acc
    },
    { canonical: 0n, external: 0n, native: 0n },
  )
}
