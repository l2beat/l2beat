import { formatCurrency, formatInteger } from '@l2beat/shared-pure'
import { getChainFlowDerivedStats } from '../utils/flowStats'

interface ChainFlowTotals {
  totalVolume: number
  inflow: number
  outflow: number
  netFlow: number
  transfersIn: number
  transfersOut: number
  tokenCount: number
}

export function getChainFlowStatItems(
  chainData: ChainFlowTotals,
): { label: string; value: string; valueClassName?: string }[] {
  const { totalTransfers, avgTransferValue } =
    getChainFlowDerivedStats(chainData)

  return [
    {
      label: 'Total volume',
      value: formatCurrency(chainData.totalVolume, 'usd'),
    },
    { label: 'Volume in', value: formatCurrency(chainData.inflow, 'usd') },
    { label: 'Volume out', value: formatCurrency(chainData.outflow, 'usd') },
    // Signed like the graph's chain labels: a true minus, an explicit plus.
    {
      label: 'Net flow',
      // Coloured like the graph and home: green in, red out, neutral at zero.
      valueClassName:
        chainData.netFlow > 0
          ? 'text-positive'
          : chainData.netFlow < 0
            ? 'text-negative'
            : undefined,
      value: `${chainData.netFlow > 0 ? '+' : ''}${formatCurrency(chainData.netFlow, 'usd').replace('-', '\u2212')}`,
    },
    { label: 'Total transfers', value: formatInteger(totalTransfers) },
    { label: 'Unique tokens', value: formatInteger(chainData.tokenCount) },
    { label: 'Transfers in', value: formatInteger(chainData.transfersIn) },
    { label: 'Transfers out', value: formatInteger(chainData.transfersOut) },
    {
      label: 'Avg. transfer value',
      value: formatCurrency(avgTransferValue, 'usd'),
    },
  ]
}
