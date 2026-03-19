import type { KnownInteropBridgeType } from '@l2beat/shared-pure'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { useResizeObserver } from '~/hooks/useResizeObserver'
import { api } from '~/trpc/React'
import type { InteropSelection } from '../../utils/types'
import type { InteropChainWithIcon } from '../chain-selector/types'
import { ChainFlowGraphSvg } from './ChainFlowGraphSvg'
import { ChainTooltip, type ChainTooltipData } from './ChainTooltip'

interface Props {
  interopChains: InteropChainWithIcon[]
  selectedChains: InteropSelection
  selectChain: (type: 'from' | 'to', chainId: string | null) => void
  type: KnownInteropBridgeType | undefined
}

interface TooltipState {
  data: ChainTooltipData
  mouseX: number
  mouseY: number
}

export function ChainFlowGraph({
  interopChains,
  selectedChains,
  selectChain,
  type,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const { width, height } = useResizeObserver({ ref: containerRef })
  const { data, isLoading } = api.interop.graphFlows.useQuery()
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
      setTooltip((prev) => {
        if (!prev) return null
        return { ...prev, mouseX: mouseRef.current.x, mouseY: mouseRef.current.y }
      })
    }
    container.addEventListener('mousemove', onMouseMove)
    return () => container.removeEventListener('mousemove', onMouseMove)
  }, [])

  const onHoverChain = useCallback(
    (tooltipData: ChainTooltipData | null) => {
      if (!tooltipData) {
        setTooltip(null)
      } else {
        setTooltip({
          data: tooltipData,
          mouseX: mouseRef.current.x,
          mouseY: mouseRef.current.y,
        })
      }
    },
    [],
  )

  return (
    <div className="flex w-full grow flex-col items-center justify-center gap-6 bg-surface-primary p-6 md:rounded-lg">
      <h2 className="text-balance text-center text-brand text-heading-32">
        Select a pair of chains
      </h2>
      <div
        ref={containerRef}
        className="relative h-[400px] w-full md:h-[580px] lg:h-[700px]"
      >
        {isLoading || !data || !width || !height ? (
          <Skeleton className="h-full w-full rounded-lg" />
        ) : (
          <>
            <ChainFlowGraphSvg
              data={data}
              interopChains={interopChains}
              selectedChains={selectedChains}
              selectChain={selectChain}
              type={type}
              width={width}
              height={height}
              onHoverChain={onHoverChain}
            />
            {tooltip && (
              <ChainTooltip
                data={tooltip.data}
                mouseX={tooltip.mouseX}
                mouseY={tooltip.mouseY}
                containerWidth={width}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
