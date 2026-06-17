import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'

interface ChainFlowTotals {
  totalVolume: number
  inflow: number
  outflow: number
  netFlow: number
  transfersIn: number
  transfersOut: number
}

export function getChainFlowStatItems(
  chainData: ChainFlowTotals,
): { label: string; value: string }[] {
  const totalTransfers = chainData.transfersIn + chainData.transfersOut
  const avgTransferValue =
    totalTransfers > 0 ? chainData.totalVolume / totalTransfers : 0

  return [
    {
      label: 'Total volume',
      value: formatCurrency(chainData.totalVolume, 'usd'),
    },
    { label: 'Volume in', value: formatCurrency(chainData.inflow, 'usd') },
    { label: 'Volume out', value: formatCurrency(chainData.outflow, 'usd') },
    { label: 'Net flow', value: formatCurrency(chainData.netFlow, 'usd') },
    { label: 'Total transfers', value: formatInteger(totalTransfers) },
    { label: 'Transfers in', value: formatInteger(chainData.transfersIn) },
    { label: 'Transfers out', value: formatInteger(chainData.transfersOut) },
    {
      label: 'Avg. transfer value',
      value: formatCurrency(avgTransferValue, 'usd'),
    },
  ]
}
