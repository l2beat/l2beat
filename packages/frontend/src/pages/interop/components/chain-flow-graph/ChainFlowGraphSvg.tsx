import type { KnownInteropBridgeType } from '@l2beat/shared-pure'
import { useCallback, useMemo, useState } from 'react'
import type { InteropGraphFlowsData } from '~/server/features/scaling/interop/getInteropGraphFlows'
import type { InteropChainWithIcon } from '../chain-selector/types'
import { BackgroundRoads } from './BackgroundRoads'
import { ChainBubble } from './ChainBubble'
import type { ChainTooltipData } from './ChainTooltip'
import { computeGraphLayout } from './computeGraphLayout'
import { ParticleLayer } from './ParticleLayer'

interface Props {
  data: InteropGraphFlowsData
  interopChains: InteropChainWithIcon[]
  selectedChains: { from: string[]; to: string[] }
  selectChain: (type: 'from' | 'to', chainId: string | null) => void
  type: KnownInteropBridgeType | undefined
  width: number
  height: number
  onHoverChain: (data: ChainTooltipData | null, x: number, y: number) => void
}

const TOP_ROUTES_COUNT = 5

export function ChainFlowGraphSvg({
  data,
  interopChains,
  selectedChains,
  selectChain,
  type,
  width,
  height,
  onHoverChain,
}: Props) {
  const chainIds = useMemo(
    () => interopChains.map((c) => c.id),
    [interopChains],
  )
  const chainMap = useMemo(
    () => new Map(interopChains.map((c) => [c.id, c])),
    [interopChains],
  )

  const layout = useMemo(
    () => computeGraphLayout(chainIds, data.chainVolumes, width, height),
    [chainIds, data.chainVolumes, width, height],
  )

  /**
   * Per-chain aggregated stats derived from the flows list.
   * Used for the tooltip and the net flow labels on each bubble.
   */
  const chainStatsMap = useMemo(() => {
    const stats = new Map<
      string,
      {
        volumeIn: number
        volumeOut: number
        connectedChains: Set<string>
        routes: { direction: 'in' | 'out'; chainId: string; volume: number }[]
      }
    >()

    for (const id of chainIds) {
      stats.set(id, {
        volumeIn: 0,
        volumeOut: 0,
        connectedChains: new Set(),
        routes: [],
      })
    }

    for (const flow of data.flows) {
      const srcStats = stats.get(flow.srcChain)
      const dstStats = stats.get(flow.dstChain)
      if (srcStats) {
        srcStats.volumeOut += flow.volume
        srcStats.connectedChains.add(flow.dstChain)
        srcStats.routes.push({
          direction: 'out',
          chainId: flow.dstChain,
          volume: flow.volume,
        })
      }
      if (dstStats) {
        dstStats.volumeIn += flow.volume
        dstStats.connectedChains.add(flow.srcChain)
        dstStats.routes.push({
          direction: 'in',
          chainId: flow.srcChain,
          volume: flow.volume,
        })
      }
    }

    for (const s of stats.values()) {
      s.routes.sort((a, b) => b.volume - a.volume)
    }

    return stats
  }, [chainIds, data.flows])

  const maxVolume = Math.max(...data.flows.map((f) => f.volume), 1)
  const centerX = width / 2
  const centerY = height / 2

  const firstSelectedChainId =
    selectedChains.from.length === 1 ? selectedChains.from[0] : undefined
  const secondSelectedChainId =
    selectedChains.to.length === 1 ? selectedChains.to[0] : undefined

  const selectedChainIds = new Set<string>()
  if (firstSelectedChainId) selectedChainIds.add(firstSelectedChainId)
  if (secondSelectedChainId) selectedChainIds.add(secondSelectedChainId)

  const [hoveredChainId, setHoveredChainId] = useState<string | null>(null)

  const handleMouseEnter = useCallback(
    (chainId: string) => {
      setHoveredChainId(chainId)

      const stats = chainStatsMap.get(chainId)
      const chain = chainMap.get(chainId)
      const nodeLayout = layout.get(chainId)
      if (!stats || !chain || !nodeLayout) return

      onHoverChain(
        {
          chain,
          volumeIn: stats.volumeIn,
          volumeOut: stats.volumeOut,
          netFlow: stats.volumeIn - stats.volumeOut,
          connectedChains: stats.connectedChains.size,
          topRoutes: stats.routes.slice(0, TOP_ROUTES_COUNT).flatMap((r) => {
            const c = chainMap.get(r.chainId)
            if (!c) return []
            return [{ ...r, chain: c }]
          }),
        },
        nodeLayout.x,
        nodeLayout.y,
      )
    },
    [chainStatsMap, chainMap, layout, onHoverChain],
  )

  const handleMouseLeave = useCallback(() => {
    setHoveredChainId(null)
    onHoverChain(null, 0, 0)
  }, [onHoverChain])

  function toggleChain(chainId: string) {
    if (!firstSelectedChainId) {
      selectChain('from', chainId)
      return
    }
    if (firstSelectedChainId === chainId) {
      selectChain('from', null)
      return
    }
    if (!secondSelectedChainId) {
      selectChain('to', chainId)
    }
  }

  function getNetFlow(chainId: string): number {
    const stats = chainStatsMap.get(chainId)
    return stats ? stats.volumeIn - stats.volumeOut : 0
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
    >
      <BackgroundRoads
        chainIds={chainIds}
        layout={layout}
        centerX={centerX}
        centerY={centerY}
        hoveredChainId={hoveredChainId}
      />
      <ParticleLayer
        flows={data.flows}
        layout={layout}
        chainIds={chainIds}
        centerX={centerX}
        centerY={centerY}
        maxVolume={maxVolume}
        hoveredChainId={hoveredChainId}
      />
      {chainIds.map((chainId) => {
        const chain = chainMap.get(chainId)
        const nodeLayout = layout.get(chainId)
        if (!chain || !nodeLayout) return null

        return (
          <ChainBubble
            key={chainId}
            chain={chain}
            layout={nodeLayout}
            selected={selectedChainIds.has(chainId)}
            netFlow={getNetFlow(chainId)}
            firstSelectedChainId={firstSelectedChainId}
            type={type}
            onClick={() => toggleChain(chainId)}
            onMouseEnter={() => handleMouseEnter(chainId)}
            onMouseLeave={handleMouseLeave}
          />
        )
      })}
    </svg>
  )
}
