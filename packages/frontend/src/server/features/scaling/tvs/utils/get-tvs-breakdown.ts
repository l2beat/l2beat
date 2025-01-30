import type { ValueRecord } from '@l2beat/database'

export function getTvsBreakdown(values: ValueRecord[]) {
  return values.reduce(
    (acc, curr) => {
      acc.native += Number(curr.native)
      acc.canonical += Number(curr.canonical)
      acc.external += Number(curr.external)
      acc.associated.native += Number(curr.nativeAssociated)
      acc.associated.canonical += Number(curr.canonicalAssociated)
      acc.associated.external += Number(curr.externalAssociated)
      acc.ether += Number(curr.ether)
      acc.stablecoin += Number(curr.stablecoin)
      return acc
    },
    {
      native: 0,
      canonical: 0,
      external: 0,
      associated: {
        native: 0,
        canonical: 0,
        external: 0,
      },
      ether: 0,
      stablecoin: 0,
    },
  )
}
