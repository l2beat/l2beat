import { type ValueRecord } from '@l2beat/database'

export function getTvlBreakdown(values: ValueRecord[]) {
  return values.reduce(
    (acc, curr) => {
      acc.total += curr.native + curr.canonical + curr.external
      acc.ether += curr.ether
      acc.stablecoin += curr.stablecoin
      acc.associated +=
        curr.nativeAssociated +
        curr.canonicalAssociated +
        curr.externalAssociated
      return acc
    },
    {
      total: 0n,
      associated: 0n,
      ether: 0n,
      stablecoin: 0n,
    },
  )
}
