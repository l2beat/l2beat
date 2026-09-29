import { useId } from 'react'
import { INTEROP_PAIR_SEPARATOR } from '~/server/features/layer2s/interop/consts'
import { BubbleHolesClip } from './BubbleHolesClip'
import type {
  FlowsGraphFlow,
  FlowsGraphNode,
  FlowsGraphNodeData,
} from './types'
import type { FlowsGraphLayout } from './utils/computeGraphLayout'
import { useFlowsGraph } from './utils/FlowsGraphContext'
import { getBurstSchedule } from './utils/getBurstSchedule'
import { getChainColor } from './utils/getChainColor'
import {
  BIDIRECTIONAL_OFFSET,
  getConnectionPath,
} from './utils/getConnectionPath'
import type { ParticleScale } from './utils/particleScale'
import { useScaledParticleCounts } from './utils/useScaledParticleCounts'

interface Props {
  flows: FlowsGraphFlow[]
  chainData: FlowsGraphNodeData[]
  visibleChainIds: string[]
  layout: FlowsGraphLayout
  interopChains: FlowsGraphNode[]
  centerX: number
  centerY: number
  isSmallScreen: boolean
  baseDollarsPerParticle?: number
  particleScale?: ParticleScale
  centerChainId?: string
  timeScale?: number
}

/**
 * Renders animated dots flowing along each connection path.
 * Particles move at a constant speed across the graph: the longest visible
 * flow takes BASE_DURATION_S, and shorter flows take proportionally less time
 * (based on the straight-line src→dst distance, which closely approximates
 * the mildly-curved bezier path).
 *
 * To render a fractional count (e.g. 2.5), we ceil to 3 DOM circles,
 * each cycling with period `3/R` (= 3/2.5 × travelDuration). Each
 * particle travels the path for `travelDuration`, then stays hidden
 * for the remainder of the cycle. This way the visible density is
 * exactly 2.5 on average and the emission rate is exactly R/s —
 * two flows with slightly different volumes are always visually distinct.
 *
 * A flow that says how much it moves at once sends its particles off in
 * bursts of that size. The emission rate stays the same, so the gap between
 * bursts grows with their size.
 *
 * Only <animateMotion> is used — no SMIL animation of a CSS property such as
 * opacity. Those are applied through style per element per sample, and when
 * the graph sits inside a CSS size container (the home card) every one of
 * those style updates forces a layout, so hundreds of particles meant
 * thousands of layouts per frame. Instead, particles are hidden by position:
 * the path is relative to the source and the flow group is translated there,
 * so a particle that hasn't started yet sits at the source bubble's center
 * and an idle one holds at the path end, the destination bubble's center.
 * The whole layer is clipped to everything outside the bubble discs, so
 * those parked particles never paint (icons with transparent middles would
 * otherwise show them).
 */
export function ParticleLayer({
  flows,
  chainData,
  visibleChainIds,
  layout,
  interopChains,
  centerX,
  centerY,
  isSmallScreen,
  baseDollarsPerParticle,
  particleScale,
  centerChainId,
  timeScale,
}: Props) {
  const { highlightedChains } = useFlowsGraph()
  const particleRadius = isSmallScreen ? 1.5 : 2
  const clipId = `particles-clip-${useId().replace(/\W/g, '')}`

  const { flowsParticles, valuePerParticle } = useScaledParticleCounts(
    visibleChainIds,
    chainData,
    flows,
    baseDollarsPerParticle,
    { centerChainId, scale: particleScale, timeScale },
  )

  return (
    <g pointerEvents="none" aria-hidden="true" clipPath={`url(#${clipId})`}>
      <BubbleHolesClip
        id={clipId}
        chainIds={visibleChainIds}
        layout={layout}
        centerChainId={centerChainId}
      />
      {flows.map((flow) => {
        const src = layout.get(flow.srcChain)
        const dst = layout.get(flow.dstChain)
        if (!src || !dst) return null

        const particles = flowsParticles.get(
          `${flow.srcChain}${INTEROP_PAIR_SEPARATOR}${flow.dstChain}`,
        )
        if (!particles || particles.exactCount <= 0) return null

        const path = getConnectionPath(
          { ...src, x: 0, y: 0 },
          { ...dst, x: dst.x - src.x, y: dst.y - src.y },
          centerX - src.x,
          centerY - src.y,
          // Spokes of a hub carry one direction only, so they stay straight
          centerChainId ? 0 : BIDIRECTIONAL_OFFSET,
        )
        const color = getChainColor(interopChains, flow.srcChain)

        const highlighted = highlightedChains.every(
          (chain) => chain === flow.srcChain || chain === flow.dstChain,
        )

        const groupOpacity = highlighted ? 1 : 0.15

        const { exactCount, travelDuration } = particles

        const burstSize =
          flow.burstVolume && valuePerParticle
            ? flow.burstVolume / valuePerParticle
            : 1
        const { begins, cycleDuration, travelShare } = getBurstSchedule(
          exactCount,
          travelDuration,
          burstSize,
          // Flows start out of step, or they would all pulse together
          Math.random(),
        )

        return (
          <g
            key={`${flow.srcChain}-${flow.dstChain}`}
            opacity={groupOpacity}
            transform={`translate(${src.x} ${src.y})`}
          >
            {begins.map((begin, i) => (
              // Positive delay, so particles emerge from the source one by
              // one over the first cycle instead of appearing mid-path.
              <circle key={i} r={particleRadius} fill={color} opacity={0.8}>
                <animateMotion
                  path={path}
                  dur={`${cycleDuration}s`}
                  keyPoints="0;1;1"
                  keyTimes={`0;${travelShare};1`}
                  calcMode="linear"
                  begin={`${begin}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </g>
        )
      })}
    </g>
  )
}
