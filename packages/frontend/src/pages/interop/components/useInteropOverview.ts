import { useQuery } from '@tanstack/react-query'
import { useTRPC } from '~/trpc/React'
import { useChainSetSelection } from './chain-selector/ChainSetSelectionContext'
import { useInteropDataset } from './InteropOverviewContext'

export function useInteropOverview(selection?: {
  from: string[]
  to: string[]
}) {
  const trpc = useTRPC()
  const dataset = useInteropDataset()
  const { selectedChains } = useChainSetSelection()
  const input = selection ?? { from: selectedChains, to: selectedChains }

  const intentQuery = useQuery({
    ...trpc.interop.intentBridges.queryOptions(input),
    enabled: dataset === 'intentBridges',
  })
  const frameworkQuery = useQuery({
    ...trpc.interop.tokenFrameworks.queryOptions(input),
    enabled: dataset === 'tokenFrameworks',
  })

  return dataset === 'intentBridges' ? intentQuery : frameworkQuery
}
