import {
  assert,
  L2CostsApiChart,
  L2CostsApiChartPoint,
} from '@l2beat/shared-pure'

export type ChartPointType = Exclude<
  L2CostsApiChart['types'][number],
  'timestamp'
>

const typeToIndex = {
  totalGas: 1,
  totalEth: 2,
  totalUsd: 3,
  overheadGas: 4,
  overheadEth: 5,
  overheadUsd: 6,
  calldataGas: 7,
  calldataEth: 8,
  calldataUsd: 9,
  computeGas: 10,
  computeEth: 11,
  computeUsd: 12,
  blobsGas: 13,
  blobsEth: 14,
  blobsUsd: 15,
} as const

export function getCostsSum(
  data: L2CostsApiChartPoint[],
  type: ChartPointType,
  days: number,
): number {
  assert(days >= 1, 'Days must be at least 1')

  const dataIndex = typeToIndex[type]
  const lastDays = data.slice(-days)

  return lastDays
    .map((d) => d[dataIndex])
    .reduce<number>((prev, curr) => {
      if (!curr) {
        return prev
      }
      if (prev === null) {
        return 0
      }
      return prev + curr
    }, 0)
}
