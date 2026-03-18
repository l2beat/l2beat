import type { KnownInteropBridgeType } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import type { InteropGraphFlowsData } from '~/server/features/scaling/interop/getInteropGraphFlows'
import type { InteropChainWithIcon } from '../chain-selector/types'
import { BackgroundRoads } from './BackgroundRoads'
import { ChainBubble } from './ChainBubble'
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
}

export function ChainFlowGraphSvg({
  data,
  interopChains,
  selectedChains,
  selectChain,
  type,
  width,
  height,
}: Props) {
  const chainIds = interopChains.map((c) => c.id)
  const chainMap = new Map(interopChains.map((c) => [c.id, c]))

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
          />
        )
      })}
    </svg>
  )
}
