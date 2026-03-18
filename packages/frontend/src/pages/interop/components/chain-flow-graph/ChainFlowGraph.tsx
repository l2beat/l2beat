import type { KnownInteropBridgeType } from '@l2beat/shared-pure'
import { useRef } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { useResizeObserver } from '~/hooks/useResizeObserver'
import { api } from '~/trpc/React'
import type { InteropSelection } from '../../utils/types'
import type { InteropChainWithIcon } from '../chain-selector/types'
import { ChainFlowGraphSvg } from './ChainFlowGraphSvg'

interface Props {
  interopChains: InteropChainWithIcon[]
  selectedChains: InteropSelection
  selectChain: (type: 'from' | 'to', chainId: string | null) => void
  type: KnownInteropBridgeType | undefined
}

export function ChainFlowGraph({
  interopChains,
  selectedChains,
  selectChain,
  type,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { width, height } = useResizeObserver({ ref: containerRef })
  const { data, isLoading } = api.interop.graphFlows.useQuery()

  return (
    <div className="flex w-full grow flex-col items-center justify-center gap-6 bg-surface-primary p-6 md:rounded-lg">
      <h2 className="text-balance text-center text-brand text-heading-32">
        Select a pair of chains
      </h2>
      <div
        ref={containerRef}
        className="h-[400px] w-full md:h-[580px] lg:h-[700px]"
      >
        {isLoading || !data || !width || !height ? (
          <Skeleton className="h-full w-full rounded-lg" />
        ) : (
          <ChainFlowGraphSvg
            data={data}
            interopChains={interopChains}
            selectedChains={selectedChains}
            selectChain={selectChain}
            type={type}
            width={width}
            height={height}
          />
        )}
      </div>
    </div>
  )
}
