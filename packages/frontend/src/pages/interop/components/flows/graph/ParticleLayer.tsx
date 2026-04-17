import { INTEROP_PAIR_SEPARATOR } from '~/server/features/scaling/interop/consts'
import type {
  ChainData,
  Flow,
} from '~/server/features/scaling/interop/getInteropFlows'
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
 * To render a fractional count (e.g. 2.5), we ceil to 3 DOM circles,
 * each cycling with period `3/R` (= 3/2.5 × travelDuration). Each
 * particle travels the path for `travelDuration`, then stays hidden
 * for the remainder of the cycle. This way the visible density is
 * exactly 2.5 on average and the emission rate is exactly R/s —
 * two flows with slightly different volumes are always visually distinct.
 */
export function ParticleLayer({
  flows,
  chainData,
  layout,
  interopChains,
  centerX,
  centerY,
  isSmallScreen,
}: Props) {
  const { highlightedChains, selectedChains } = useInteropFlows()
  const particleRadius = isSmallScreen ? 1.5 : 2

  const { flowsParticles } = useScaledParticleCounts(
    selectedChains,
    chainData,
    flows,
  )

  return (
    <g pointerEvents="none" aria-hidden="true">
      {flows.map((flow) => {
        const src = layout.get(flow.srcChain)
        const dst = layout.get(flow.dstChain)
        if (!src || !dst) return null

        const particles = flowsParticles.get(
          `${flow.srcChain}${INTEROP_PAIR_SEPARATOR}${flow.dstChain}`,
        )
        if (!particles || particles.exactCount <= 0) return null

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

        const { exactCount, travelDuration } = particles

        // ceil → DOM element count; stretch cycleDuration so emission rate is exact
        const count = Math.max(1, Math.ceil(exactCount))
        const cycleDuration = (count / exactCount) * travelDuration
        const particleInterval = cycleDuration / count
        const initialOffset = Math.random() * particleInterval

        // fraction of each cycle spent traveling (rest is idle / hidden)
        const t = exactCount / count

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
