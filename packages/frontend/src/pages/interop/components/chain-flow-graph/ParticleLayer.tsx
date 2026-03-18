import type { ChainNodeLayout } from './computeGraphLayout'
import { getConnectionPath } from './ConnectionPaths'
import { getChainColorBright } from './getChainColor'

interface Flow {
  srcChain: string
  dstChain: string
  volume: number
}

interface Props {
  flows: Flow[]
  layout: Map<string, ChainNodeLayout>
  chainIds: string[]
  centerX: number
  centerY: number
  maxVolume: number
}

const MAX_TOTAL_PARTICLES = 150
const MIN_PARTICLES_PER_FLOW = 1
const MAX_PARTICLES_PER_FLOW = 15
const DURATION_S = 3

export function ParticleLayer({
  flows,
  layout,
  chainIds,
  centerX,
  centerY,
  maxVolume,
}: Props) {
  const threshold = maxVolume * 0.001
  const visibleFlows = flows.filter((f) => f.volume >= threshold)

  // Particle count proportional to volume ratio
  const rawCounts = visibleFlows.map((flow) => {
    const ratio = flow.volume / maxVolume
    return Math.round(
      MIN_PARTICLES_PER_FLOW +
        (MAX_PARTICLES_PER_FLOW - MIN_PARTICLES_PER_FLOW) * ratio,
    )
  })

  // Scale down if total exceeds cap
  const totalRaw = rawCounts.reduce((sum, c) => sum + c, 0)
  const scale =
    totalRaw > MAX_TOTAL_PARTICLES ? MAX_TOTAL_PARTICLES / totalRaw : 1

  return (
    <g>
      {visibleFlows.map((flow, flowIndex) => {
        const src = layout.get(flow.srcChain)
        const dst = layout.get(flow.dstChain)
        if (!src || !dst) return null

        const path = getConnectionPath(src, dst, centerX, centerY)
        const particleCount = Math.max(
          1,
          Math.round((rawCounts[flowIndex] ?? 1) * scale),
        )
        const chainIndex = chainIds.indexOf(flow.srcChain)
        const color = getChainColorBright(chainIndex, chainIds.length)

        return Array.from({ length: particleCount }, (_, i) => {
          const staggerOffset = (i / particleCount) * DURATION_S

          return (
            <circle
              key={`${flow.srcChain}-${flow.dstChain}-${i}`}
              r="2"
              fill={color}
              opacity={0.8}
            >
              <animateMotion
                path={path}
                dur={`${DURATION_S}s`}
                begin={`${staggerOffset}s`}
                repeatCount="indefinite"
              />
            </circle>
          )
        })
      })}
    </g>
  )
}
