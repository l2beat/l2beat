import { L2CostsApiChartPoint, UnixTime } from '@l2beat/shared-pure'

import { DetailedTransaction } from '../l2-costs/types/DetailedTransaction'

export function addToMap(
  map: Map<number, L2CostsApiChartPoint>,
  toStartOf: 'hour' | 'day',
  tx: DetailedTransaction,
) {
  const key = tx.timestamp.toStartOf(toStartOf).toNumber()
  const currentRecord = map.get(key)
  if (currentRecord) {
    let currentBlobGas: number | null = null
    let currentBlobCost: number | null = null
    let currentBlobUsd: number | null = null
    if (tx.type === 3) {
      currentBlobGas = !currentRecord[13]
        ? tx.blobGasUsed
        : currentRecord[13] + tx.blobGasUsed
      currentBlobCost = !currentRecord[14]
        ? tx.blobGasCost
        : currentRecord[14] + tx.blobGasCost
      currentBlobUsd = !currentRecord[15]
        ? tx.blobGasCostUsd
        : currentRecord[15] + tx.blobGasCostUsd
    }
    map.set(key, [
      currentRecord[0],
      (currentRecord[1] += tx.totalGas),
      (currentRecord[2] += tx.totalGasCost),
      (currentRecord[3] += tx.totalGasCostUsd),
      (currentRecord[4] += tx.overheadGasUsed),
      (currentRecord[5] += tx.totalOverheadGasCost),
      (currentRecord[6] += tx.totalOverheadGasCostUsd),
      (currentRecord[7] += tx.calldataGasUsed),
      (currentRecord[8] += tx.calldataGasCost),
      (currentRecord[9] += tx.calldataGasCostUsd),
      (currentRecord[10] += tx.computeGasUsed),
      (currentRecord[11] += tx.computeGasCost),
      (currentRecord[12] += tx.computeGasCostUsd),
      currentBlobGas,
      currentBlobCost,
      currentBlobUsd,
    ])
  } else {
    let currentBlobGas: number | null = null
    let currentBlobCost: number | null = null
    let currentBlobUsd: number | null = null
    if (tx.type === 3) {
      currentBlobGas = tx.blobGasUsed
      currentBlobCost = tx.blobGasCost
      currentBlobUsd = tx.blobGasCostUsd
    }
    map.set(key, [
      new UnixTime(key),
      tx.totalGas,
      tx.totalGasCost,
      tx.totalGasCostUsd,
      tx.overheadGasUsed,
      tx.totalOverheadGasCost,
      tx.totalOverheadGasCostUsd,
      tx.calldataGasUsed,
      tx.calldataGasCost,
      tx.calldataGasCostUsd,
      tx.computeGasUsed,
      tx.computeGasCost,
      tx.computeGasCostUsd,
      currentBlobGas,
      currentBlobCost,
      currentBlobUsd,
    ])
  }
}
