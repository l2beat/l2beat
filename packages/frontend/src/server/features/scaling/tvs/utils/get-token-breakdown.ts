import type { ValueRecord } from '@l2beat/database'

export function getTokenBreakdown(values: ValueRecord[]) {
  return values.reduce(
    (acc, curr) => {
      acc.total +=
        Number(curr.native) + Number(curr.canonical) + Number(curr.external)
      acc.ether += Number(curr.ether)
      acc.stablecoin += Number(curr.stablecoin)
      acc.associated +=
        Number(curr.nativeAssociated) +
        Number(curr.canonicalAssociated) +
        Number(curr.externalAssociated)
      return acc
    },
    {
      total: 0,
      associated: 0,
      ether: 0,
      stablecoin: 0,
    },
  )
}
