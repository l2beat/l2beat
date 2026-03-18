import type { KnownInteropBridgeType } from '@l2beat/shared-pure'
import { useCallback, useMemo, useState } from 'react'
import type { InteropGraphFlowsData } from '~/server/features/scaling/interop/getInteropGraphFlows'
import type { InteropChainWithIcon } from '../chain-selector/types'
import { BackgroundRoads } from './BackgroundRoads'
import { ChainBubble } from './ChainBubble'
import type { ChainTooltipData } from './ChainTooltip'
import { computeGraphLayout } from './computeGraphLayout'
import { ConnectionPaths } from './ConnectionPaths'
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
  const chainIds = interopChains.map((c) => c.id)
  const chainMap = useMemo(
    () => new Map(interopChains.map((c) => [c.id, c])),
    [interopChains],
  )

  const layout = useMemo(
    () => computeGraphLayout(chainIds, data.chainVolumes, width, height),
    [chainIds, data.chainVolumes, width, height],
  )

  const netFlowMap = useMemo(() => {
    const map = new Map<string, number>()
    for (const cv of data.chainVolumes) {
      map.set(cv.chainId, cv.netFlow)
    }
    return map
  }, [data.chainVolumes])

  // Precompute per-chain volume in/out and top routes
  const chainStatsMap = useMemo(() => {
    const stats = new Map<
      string,
      {
        volumeIn: number
        volumeOut: number
        connectedChains: Set<string>
        routesIn: { chainId: string; volume: number }[]
        routesOut: { chainId: string; volume: number }[]
      }
    >()

    for (const id of chainIds) {
      stats.set(id, {
        volumeIn: 0,
        volumeOut: 0,
        connectedChains: new Set(),
        routesIn: [],
        routesOut: [],
      })
    }

    for (const flow of data.flows) {
      const srcStats = stats.get(flow.srcChain)
      const dstStats = stats.get(flow.dstChain)
      if (srcStats) {
        srcStats.volumeOut += flow.volume
        srcStats.connectedChains.add(flow.dstChain)
        srcStats.routesOut.push({
          chainId: flow.dstChain,
          volume: flow.volume,
        })
      }
      if (dstStats) {
        dstStats.volumeIn += flow.volume
        dstStats.connectedChains.add(flow.srcChain)
        dstStats.routesIn.push({
          chainId: flow.srcChain,
          volume: flow.volume,
        })
      }
    }

    // Sort routes by volume
    for (const s of stats.values()) {
      s.routesIn.sort((a, b) => b.volume - a.volume)
      s.routesOut.sort((a, b) => b.volume - a.volume)
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

      // Build top routes: interleave out and in, sorted by volume
      const allRoutes: ChainTooltipData['topRoutes'] = []
      for (const r of stats.routesOut) {
        const c = chainMap.get(r.chainId)
        if (c) allRoutes.push({ direction: 'out', chain: c, volume: r.volume })
      }
      for (const r of stats.routesIn) {
        const c = chainMap.get(r.chainId)
        if (c) allRoutes.push({ direction: 'in', chain: c, volume: r.volume })
      }
      allRoutes.sort((a, b) => b.volume - a.volume)

      onHoverChain(
        {
          chain,
          volumeIn: stats.volumeIn,
          volumeOut: stats.volumeOut,
          netFlow: netFlowMap.get(chainId) ?? 0,
          connectedChains: stats.connectedChains.size,
          topRoutes: allRoutes.slice(0, TOP_ROUTES_COUNT),
        },
        nodeLayout.x,
        nodeLayout.y,
      )
    },
    [chainStatsMap, chainMap, layout, netFlowMap, onHoverChain],
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
      return
    }
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
      />
      <ConnectionPaths
        flows={data.flows}
        layout={layout}
        chainIds={chainIds}
        centerX={centerX}
        centerY={centerY}
        maxVolume={maxVolume}
        selectedChainIds={selectedChainIds}
        hoveredChainId={hoveredChainId}
      />
      <ParticleLayer
        flows={data.flows}
        layout={layout}
        chainIds={chainIds}
        centerX={centerX}
        centerY={centerY}
        maxVolume={maxVolume}
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
            netFlow={netFlowMap.get(chainId) ?? 0}
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
