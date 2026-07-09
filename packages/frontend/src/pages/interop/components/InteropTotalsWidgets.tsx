import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import {
  type InteropDataset,
  useInteropDataset,
} from './InteropOverviewContext'
import { InteropTotalCard } from './InteropTotalCard'
import { useInteropOverview } from './useInteropOverview'

const DESCRIPTION: Record<InteropDataset, string> = {
  intentBridges: 'Across all intent bridges',
  tokenFrameworks: 'Across all frameworks',
}

export function InteropTotalVolumeWidget({
  mobile,
  className,
}: {
  mobile?: boolean
  className?: string
}) {
  const dataset = useInteropDataset()
  const { data, isLoading } = useInteropOverview()
  const totalVolume = data
    ? 'activity' in data
      ? data.activity.totalVolume
      : data.frameworkDominance.volume.total
    : undefined

  return (
    <InteropTotalCard
      title="Total volume"
      value={
        totalVolume !== undefined ? formatCurrency(totalVolume, 'usd') : ''
      }
      isLoading={isLoading}
      description={DESCRIPTION[dataset]}
      className={className}
      mobile={mobile}
    />
  )
}

export function InteropTotalTransfersWidget({
  mobile,
  className,
}: {
  mobile?: boolean
  className?: string
}) {
  const dataset = useInteropDataset()
  const { data, isLoading } = useInteropOverview()
  const totalTransfers = data
    ? 'activity' in data
      ? data.activity.totalTransferCount
      : data.frameworkDominance.transfers.total
    : undefined

  return (
    <InteropTotalCard
      title="Total transfers"
      value={totalTransfers !== undefined ? formatInteger(totalTransfers) : ''}
      isLoading={isLoading}
      description={DESCRIPTION[dataset]}
      className={className}
      mobile={mobile}
    />
  )
}
