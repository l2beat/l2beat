import { useId } from 'react'
import { useCssSupports } from '~/hooks/useCssSupports'
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
 * Motion is CSS (offset-path + offset-distance), not SMIL <animateMotion>.
 * SMIL drives SVG geometry, so every animated particle forces a full layout
 * on every frame: at ~270 particles that was ~15k layouts/s, 80%+ of the main
 * thread, and it halved the framerate of the whole page. The CSS equivalent
 * animates a transform instead and leaves layout untouched.
 *
 * On WebKit only, the path is referenced via offset-path: url(#...) pointing
 * at an invisible <path> per flow, not inlined as path("..."): WebKit resolves
 * path() px coordinates in zoomed CSS px while the SVG stays in user units, so
 * with Safari page zoom ≠ 100% every particle drifted off its line. url()
 * references keep the referenced element's user-unit geometry and render
 * correctly at any zoom.
 *
 * Everything else gets inline path(): Gecko refuses to run any offset-path
 * url() animation on the compositor (the reference can't be resolved off the
 * main thread — KeyframeEffect::ShouldBlockAsyncTransformAnimations), so with
 * url() every particle is main-thread work on every frame and Firefox visibly
 * lags; path() animates on the compositor from a cached path.
 *
 * Browsers that lack the offset-path form we'd use or linear() easing (the
 * travel/idle split depends on it) get the original SMIL markup instead —
 * slower, but correct everywhere SVG works. useCssSupports is client-only,
 * which is fine here: this component never SSRs (FlowsGraphPanel renders it
 * only after ResizeObserver reports a size), so there is no hydration
 * mismatch.
 */
const IS_WEBKIT =
  typeof navigator !== 'undefined' &&
  navigator.vendor === 'Apple Computer, Inc.'
const CSS_MOTION_CONDITION = `(offset-path: ${IS_WEBKIT ? 'url("#a")' : 'path("M 0 0 H 1")'}) and (animation-timing-function: linear(0 0%, 1 50%, 1 100%))`
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
  const supportsCssMotion = useCssSupports(CSS_MOTION_CONDITION)
  const pathIdPrefix = useId()
  const particleRadius = isSmallScreen ? 1.5 : 2

  const { flowsParticles } = useScaledParticleCounts(
    visibleChainIds,
    chainData,
    flows,
    baseDollarsPerParticle,
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
        const travelPercent = +(t * 100).toFixed(4)

        // Travel over the first `t` of the cycle, then hold at the path end —
        // the linear() equivalent of SMIL keyPoints="0;1;1" keyTimes="0;t;1".
        const moveEasing = `linear(0 0%, 1 ${travelPercent}%, 1 100%)`
        // Fully opaque while traveling, then a discrete jump to hidden for the
        // rest of the cycle — the equivalent of calcMode="discrete".
        const fadeEasing = `linear(0 0%, 0 ${travelPercent}%, 1 ${travelPercent}%, 1 100%)`

        const pathId = `${pathIdPrefix}${flow.srcChain}-${flow.dstChain}`

        return (
          <g key={`${flow.srcChain}-${flow.dstChain}`} opacity={groupOpacity}>
            {supportsCssMotion && IS_WEBKIT && (
              <path id={pathId} d={path} fill="none" />
            )}
            {Array.from({ length: count }, (_, i) => {
              // Positive delay, so a particle stays at its base opacity of 0
              // until its turn comes up in the first cycle.
              const delay = `${initialOffset + i * particleInterval}s`

              if (!supportsCssMotion) {
                return (
                  <circle key={i} r={particleRadius} fill={color} opacity={0}>
                    <animateMotion
                      path={path}
                      dur={`${cycleDuration}s`}
                      keyPoints="0;1;1"
                      keyTimes={`0;${t};1`}
                      calcMode="linear"
                      begin={delay}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      dur={`${cycleDuration}s`}
                      begin={delay}
                      calcMode="discrete"
                      values={'0.8;0'}
                      keyTimes={`0;${t}`}
                      repeatCount="indefinite"
                    />
                  </circle>
                )
              }

              return (
                <circle
                  key={i}
                  r={particleRadius}
                  fill={color}
                  opacity={0}
                  style={{
                    offsetPath: IS_WEBKIT
                      ? `url("#${pathId}")`
                      : `path("${path}")`,
                    offsetRotate: '0deg',
                    animationName:
                      'interop-particle-move, interop-particle-fade',
                    animationDuration: `${cycleDuration}s, ${cycleDuration}s`,
                    animationDelay: `${delay}, ${delay}`,
                    animationIterationCount: 'infinite, infinite',
                    animationTimingFunction: `${moveEasing}, ${fadeEasing}`,
                  }}
                />
              )
            })}
          </g>
        )
      })}
    </g>
  )
}
