import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { InteropTotalCard } from './InteropTotalCard'

export function InteropTotalVolumeWidget({
  totalVolume,
  isLoading,
  description,
  mobile,
  className,
}: {
  totalVolume: number | undefined
  isLoading: boolean
  description: string
  mobile?: boolean
  className?: string
}) {
  return (
    <InteropTotalCard
      title="Total volume"
      value={
        totalVolume !== undefined ? formatCurrency(totalVolume, 'usd') : ''
      }
      isLoading={isLoading}
      description={description}
      className={className}
      mobile={mobile}
    />
  )
}

export function InteropTotalTransfersWidget({
  totalTransfers,
  isLoading,
  description,
  mobile,
  className,
}: {
  totalTransfers: number | undefined
  isLoading: boolean
  description: string
  mobile?: boolean
  className?: string
}) {
  return (
    <InteropTotalCard
      title="Total transfers"
      value={totalTransfers !== undefined ? formatInteger(totalTransfers) : ''}
      isLoading={isLoading}
      description={description}
      className={className}
      mobile={mobile}
    />
  )
}
