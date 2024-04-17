import {
  ActivityApiChart,
  ActivityApiCharts,
  L2CostsApiChart,
  L2CostsProjectApiCharts,
  UnixTime,
} from '@l2beat/shared-pure'

import { formatNumber, formatTimestamp } from '../../../../utils'
import { getTransactionCount } from '../../../../utils/activity/getTransactionCount'
import { getCostsSum } from '../../../../utils/costs/getCostsSum'
import { formatCurrency } from '../../../../utils/format'
import { CostsData, CostsDataBreakdown, CostsDataDetails } from '../types'

export function getCostsData(
  l2CostsChart: L2CostsProjectApiCharts,
  activityChart: ActivityApiCharts | undefined,
): CostsData {
  return {
    last24h: getDataDetails(l2CostsChart.daily, activityChart?.daily, 1),
    last7d: getDataDetails(l2CostsChart.daily, activityChart?.daily, 7),
    last30d: getDataDetails(l2CostsChart.daily, activityChart?.daily, 30),
    last90d: getDataDetails(l2CostsChart.daily, activityChart?.daily, 90),
    last180d: getDataDetails(l2CostsChart.daily, activityChart?.daily, 180),
    syncStatus: {
      displaySyncedUntil: formatTimestamp(l2CostsChart.syncedUntil.toNumber(), {
        mode: 'datetime',
        longMonthName: true,
      }),
      isSynced: isSynced(l2CostsChart.syncedUntil),
    },
  }
}

function isSynced(syncedUntil: UnixTime) {
  return UnixTime.now().add(-1, 'days').add(-1, 'hours').lte(syncedUntil)
}

function getDataDetails(
  costsChart: L2CostsApiChart,
  activityChart: ActivityApiChart | undefined,
  days: number,
): CostsDataDetails {
  const txCount = activityChart
    ? getTransactionCount(activityChart?.data, 'project', days)
    : undefined

  const totalData = {
    ethCost: getCostsSum(costsChart.data, 'totalEth', days),
    usdCost: getCostsSum(costsChart.data, 'totalUsd', days),
    gas: getCostsSum(costsChart.data, 'totalGas', days),
  }

  const blobsData = {
    ethCost: getCostsSum(costsChart.data, 'blobsEth', days),
    usdCost: getCostsSum(costsChart.data, 'blobsUsd', days),
    gas: getCostsSum(costsChart.data, 'blobsGas', days),
  }
  const isBlobsDataEmpty =
    blobsData.ethCost === 0 && blobsData.usdCost === 0 && blobsData.gas === 0

  const calldataData = {
    ethCost: getCostsSum(costsChart.data, 'calldataEth', days),
    usdCost: getCostsSum(costsChart.data, 'calldataUsd', days),
    gas: getCostsSum(costsChart.data, 'calldataGas', days),
  }

  const computeData = {
    ethCost: getCostsSum(costsChart.data, 'computeEth', days),
    usdCost: getCostsSum(costsChart.data, 'computeUsd', days),
    gas: getCostsSum(costsChart.data, 'computeGas', days),
  }

  const overheadData = {
    ethCost: getCostsSum(costsChart.data, 'overheadEth', days),
    usdCost: getCostsSum(costsChart.data, 'overheadUsd', days),
    gas: getCostsSum(costsChart.data, 'overheadGas', days),
  }

  return {
    total: getCostsDataBreakdown(totalData, txCount),
    blobs: isBlobsDataEmpty
      ? undefined
      : getCostsDataBreakdown(blobsData, txCount),
    calldata: getCostsDataBreakdown(calldataData, txCount),
    compute: getCostsDataBreakdown(computeData, txCount),
    overhead: getCostsDataBreakdown(overheadData, txCount),
    txCount: txCount
      ? {
          value: txCount,
          displayValue: formatNumber(txCount),
        }
      : undefined,
  }
}

function getCostsDataBreakdown(
  data: {
    ethCost: number
    usdCost: number
    gas: number
  },
  txCount: number | undefined,
): CostsDataBreakdown {
  return {
    ethCost: {
      displayValue: formatCurrency(data.ethCost, 'eth'),
      value: data.ethCost,
      perL2Tx: txCount
        ? {
            value: data.ethCost / txCount,
            displayValue: formatCurrency(data.ethCost / txCount, 'eth', {
              decimals: 6,
            }),
          }
        : undefined,
    },
    usdCost: {
      displayValue: formatCurrency(data.usdCost, 'usd'),
      value: data.usdCost,
      perL2Tx: txCount
        ? {
            value: data.usdCost / txCount,
            displayValue: formatCurrency(data.usdCost / txCount, 'usd', {
              decimals: 4,
            }),
          }
        : undefined,
    },
    gas: {
      displayValue: formatNumber(data.gas),
      value: data.gas,
      perL2Tx: txCount
        ? {
            value: data.gas / txCount,
            displayValue: formatNumber(data.gas / txCount),
          }
        : undefined,
    },
  }
}
