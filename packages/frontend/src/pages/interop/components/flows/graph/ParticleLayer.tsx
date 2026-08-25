import { useId } from 'react'
import { INTEROP_PAIR_SEPARATOR } from '~/server/features/layer2s/interop/consts'
import type {
  ChainData,
  Flow,
} from '~/server/features/layer2s/interop/getInteropFlows'
import type { InteropChainWithIcon } from '../../chain-selector/types'
import { useInteropFlows } from '../utils/InteropFlowsContext'
import type { FlowsGraphLayout } from './utils/computeGraphLayout'
import { getChainColor } from './utils/getChainColor'
import {
  BIDIRECTIONAL_OFFSET,
  getConnectionPath,
} from './utils/getConnectionPath'
import { useScaledParticleCounts } from './utils/useScaledParticleCounts'

interface Props {
  flows: Flow[]
  chainData: ChainData[]
  visibleChainIds: string[]
  layout: FlowsGraphLayout
  interopChains: InteropChainWithIcon[]
  centerX: number
  centerY: number
  isSmallScreen: boolean
  baseDollarsPerParticle?: number
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
}: Props) {
  const { highlightedChains } = useInteropFlows()
  const particleRadius = isSmallScreen ? 1.5 : 2
  const clipId = `particles-clip-${useId().replace(/\W/g, '')}`

  // This exists to hide dots below the project bubbles
  const bubbleHoles = visibleChainIds
    .map((id) => layout.get(id))
    .filter((node) => node !== undefined)
    .map(
      ({ x, y, radius: r }) =>
        `M ${x - r} ${y} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0 Z`,
    )
    .join(' ')
  const clipPathD = `M -1e4 -1e4 H 1e4 V 1e4 H -1e4 Z ${bubbleHoles}`

  const { flowsParticles } = useScaledParticleCounts(
    visibleChainIds,
    chainData,
    flows,
    baseDollarsPerParticle,
  )

  return (
    <g pointerEvents="none" aria-hidden="true" clipPath={`url(#${clipId})`}>
      <defs>
        <clipPath id={clipId}>
          <path d={clipPathD} clipRule="evenodd" />
        </clipPath>
      </defs>
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
          BIDIRECTIONAL_OFFSET,
        )
        const color = getChainColor(interopChains, flow.srcChain)

        const highlighted =
          highlightedChains.length === 0 ||
          highlightedChains.every(
            (chain) => chain === flow.srcChain || chain === flow.dstChain,
          )

        const groupOpacity = highlighted ? 1 : 0.15

        const { exactCount, travelDuration } = particles

        // ceil → DOM element count; stretch cycleDuration so emission rate is exact
        const count = Math.max(1, Math.ceil(exactCount))
        const cycleDuration = (count / exactCount) * travelDuration
        const particleInterval = cycleDuration / count
        const initialOffset = Math.random() * particleInterval

        // fraction of each cycle spent traveling (rest is parked at the end)
        const t = exactCount / count

        return (
          <g
            key={`${flow.srcChain}-${flow.dstChain}`}
            opacity={groupOpacity}
            transform={`translate(${src.x} ${src.y})`}
          >
            {Array.from({ length: count }, (_, i) => {
              // Positive delay, so particles emerge from the source one by
              // one over the first cycle instead of appearing mid-path.
              const begin = `${initialOffset + i * particleInterval}s`

              return (
                <circle key={i} r={particleRadius} fill={color} opacity={0.8}>
                  <animateMotion
                    path={path}
                    dur={`${cycleDuration}s`}
                    keyPoints="0;1;1"
                    keyTimes={`0;${t};1`}
                    calcMode="linear"
                    begin={begin}
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
