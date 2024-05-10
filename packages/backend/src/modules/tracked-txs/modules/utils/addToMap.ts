import { L2CostsApiChartPoint, UnixTime } from '@l2beat/shared-pure'
import { AggregatedL2CostsRecord } from '../l2-costs/repositories/AggregatedL2CostsRepository'

// Amount of gas required for a basic tx
const OVERHEAD = 21_000

export function addToMap(
  map: Map<number, L2CostsApiChartPoint>,
  toStartOf: 'hour' | 'day',
  record: AggregatedL2CostsRecord,
) {
  const key = record.timestamp.toStartOf(toStartOf).toNumber()
  const currentRecord = map.get(key)

  if (currentRecord) {
    let currentBlobGas: number | null = currentRecord[13]
    let currentBlobGasEth: number | null = currentRecord[14]
    let currentBlobGasUsd: number | null = currentRecord[15]

    if (currentBlobGas === null) {
      currentBlobGas = record.blobsGas
    } else if (record.blobsGas) {
      currentBlobGas += record.blobsGas
    }

    if (currentBlobGasEth === null) {
      currentBlobGasEth = record.blobsGasEth
    } else if (record.blobsGasEth) {
      currentBlobGasEth += record.blobsGasEth
    }

    if (currentBlobGasUsd === null) {
      currentBlobGasUsd = record.blobsGasUsd
    } else if (record.blobsGasUsd) {
      currentBlobGasUsd += record.blobsGasUsd
    }

    map.set(key, [
      currentRecord[0],
      (currentRecord[1] += record.totalGas),
      (currentRecord[2] += record.totalGasEth),
      (currentRecord[3] += record.totalGasUsd),
      (currentRecord[4] += OVERHEAD),
      (currentRecord[5] += record.overheadGasEth),
      (currentRecord[6] += record.overheadGasUsd),
      (currentRecord[7] += record.calldataGas),
      (currentRecord[8] += record.calldataGasEth),
      (currentRecord[9] += record.calldataGasUsd),
      (currentRecord[10] += record.computeGas),
      (currentRecord[11] += record.computeGasEth),
      (currentRecord[12] += record.computeGasUsd),
      currentBlobGas,
      currentBlobGasEth,
      currentBlobGasUsd,
    ])
  } else {
    map.set(key, [
      new UnixTime(key),
      record.totalGas,
      record.totalGasEth,
      record.totalGasUsd,
      OVERHEAD,
      record.overheadGasEth,
      record.overheadGasUsd,
      record.calldataGas,
      record.calldataGasEth,
      record.calldataGasUsd,
      record.computeGas,
      record.computeGasEth,
      record.computeGasUsd,
      record.blobsGas,
      record.blobsGasEth,
      record.blobsGasUsd,
    ])
  }
}
