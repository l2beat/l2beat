import { UnixTime } from '@l2beat/shared-pure'
import { useEffect } from 'react'
import type { Flow } from '~/server/features/scaling/interop/getInteropFlows'
import type { InteropChainWithIcon } from '../../chain-selector/types'
import { BASE_DURATION_S, DOLLARS_PER_PARTICLE } from '../consts'
import { useInteropFlows } from '../utils/InteropFlowsContext'
import type { FlowsGraphLayout } from './utils/computeGraphLayout'
import { getChainColor } from './utils/getChainColor'
import {
  BIDIRECTIONAL_OFFSET,
  getConnectionPath,
} from './utils/getConnectionPath'
import { getScaledParticleCounts } from './utils/getScaledParticleCounts'

interface Props {
  flows: Flow[]
  layout: FlowsGraphLayout
  interopChains: InteropChainWithIcon[]
  centerX: number
  centerY: number
  isSmallScreen: boolean
}

/**
 * Renders animated dots flowing along each connection path.
 * Particles move at a constant speed across the graph: the longest visible
 * flow takes BASE_DURATION_S, and shorter flows take proportionally less time
 * (based on the straight-line src→dst distance, which closely approximates
 * the mildly-curved bezier path).
 *
 * Particle emission rate is exact (no rounding):
 *   volume in 24h → $/second → particles/second (R)
 *   → on-screen count = R × travelDuration (fractional)
 *
 * Counts are scaled in two stages:
 *   1. local scale so the largest flow stays within the per-flow ceiling
 *   2. global scale so the overall graph stays within the total ceiling
 *
 * To render a fractional count (e.g. 2.5), we ceil to 3 DOM circles,
 * each cycling with period `3/R` (= 3/2.5 × travelDuration). Each
 * particle travels the path for `travelDuration`, then stays hidden
 * for the remainder of the cycle. This way the visible density is
 * exactly 2.5 on average and the emission rate is exactly R/s —
 * two flows with slightly different volumes are always visually distinct.
 */
export function ParticleLayer({
  flows,
  layout,
  interopChains,
  centerX,
  centerY,
  isSmallScreen,
}: Props) {
  const { highlightedChains, setDollarsPerParticle } = useInteropFlows()
  const particleRadius = isSmallScreen ? 1.5 : 2
  const filteredFlows = flows.filter((flow) => flow.volume > 0)

  // Precompute straight-line distances for constant-speed scaling
  const distances = filteredFlows.map((flow) => {
    const src = layout.get(flow.srcChain)
    const dst = layout.get(flow.dstChain)
    if (!src || !dst) return 0
    const dx = dst.x - src.x
    const dy = dst.y - src.y
    return Math.sqrt(dx * dx + dy * dy)
  })

  // Constant speed: the longest path takes BASE_DURATION_S, shorter paths take less
  const maxDistance = Math.max(...distances, 1)
  const travelDurations = distances.map(
    (d) => (d / maxDistance) * BASE_DURATION_S,
  )

  // Compute the exact fractional on-screen particle count per flow
  const exactCounts = filteredFlows.map((flow, i) => {
    const volumePerSecond = flow.volume / UnixTime.DAY
    const particlesPerSecond = volumePerSecond / DOLLARS_PER_PARTICLE
    return particlesPerSecond * (travelDurations[i] ?? 0)
  })

  const { counts: scaledCounts, dollarsPerParticle } =
    getScaledParticleCounts(exactCounts)

  useEffect(() => {
    setDollarsPerParticle(dollarsPerParticle)
  }, [dollarsPerParticle, setDollarsPerParticle])

  return (
    <g pointerEvents="none" aria-hidden="true">
      {filteredFlows.map((flow, flowIndex) => {
        const src = layout.get(flow.srcChain)
        const dst = layout.get(flow.dstChain)
        if (!src || !dst) return null

        const path = getConnectionPath(
          src,
          dst,
          centerX,
          centerY,
          BIDIRECTIONAL_OFFSET,
        )
        const color = getChainColor(interopChains, flow.srcChain)

        const highlighted =
          highlightedChains.length === 0 ||
          highlightedChains.every(
            (chain) => chain === flow.srcChain || chain === flow.dstChain,
          )

        const groupOpacity = highlighted ? 1 : 0.15

        const travelDuration = travelDurations[flowIndex] ?? BASE_DURATION_S
        const exact = scaledCounts[flowIndex] ?? 0

        if (exact <= 0) return null

        // ceil → DOM element count; stretch cycleDuration so emission rate is exact
        const count = Math.max(1, Math.ceil(exact))
        const cycleDuration = (count / exact) * travelDuration
        const particleInterval = cycleDuration / count
        const initialOffset = Math.random() * particleInterval

        // fraction of each cycle spent traveling (rest is idle / hidden)
        const t = exact / count

        return (
          <g key={`${flow.srcChain}-${flow.dstChain}`} opacity={groupOpacity}>
            {Array.from({ length: count }, (_, i) => {
              const begin = `${initialOffset + i * particleInterval}s`

              return (
                <circle key={i} r={particleRadius} fill={color} opacity={0}>
                  <animateMotion
                    path={path}
                    dur={`${cycleDuration}s`}
                    keyPoints="0;1;1"
                    keyTimes={`0;${t};1`}
                    calcMode="linear"
                    begin={begin}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    dur={`${cycleDuration}s`}
                    begin={begin}
                    calcMode="discrete"
                    values={'0.8;0'}
                    keyTimes={`0;${t}`}
                    repeatCount="indefinite"
                  />
                </circle>
              )
            })}
          </g>
        )
      })}
    </g>
  )
}
