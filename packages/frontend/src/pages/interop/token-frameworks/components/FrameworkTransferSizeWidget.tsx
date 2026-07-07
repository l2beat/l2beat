import { useQuery } from '@tanstack/react-query'
import { useTRPC } from '~/trpc/React'
import { InteropTransferSizeCard } from '../../components/InteropTransferSizeCard'
import { useTokenFrameworksSelectedChains } from '../utils/TokenFrameworksSelectedChainsContext'

export function FrameworkTransferSizeWidget() {
  const trpc = useTRPC()
  const { selectedChains } = useTokenFrameworksSelectedChains()
  const { data, isLoading } = useQuery(
    trpc.interop.tokenFrameworks.queryOptions({
      from: selectedChains,
      to: selectedChains,
    }),
  )

  return (
    <InteropTransferSizeCard
      data={data?.transferSizeChartData}
      isLoading={isLoading}
    />
  )
}
