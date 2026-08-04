import { useEffect, useMemo, useRef } from 'react'
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion'
import type { InteropFlowsData } from '~/server/features/scaling/interop/getInteropFlows'
import type { InteropChainWithIcon } from '../../chain-selector/types'
import { BackgroundRoads } from './BackgroundRoads'
import { ChainBubblesLayer } from './ChainBubblesLayer'
import { FlowsLogo } from './FlowsLogo'
import { ParticleLayer } from './ParticleLayer'
import { computeGraphLayout } from './utils/computeGraphLayout'

interface FlowsGraphProps {
  interopChains: InteropChainWithIcon[]
  visibleChainIds: string[]
  data: InteropFlowsData
  size: number
  isSmallScreen: boolean
  baseDollarsPerParticle?: number
  topChainId?: string
}

export function FlowsGraph({
  interopChains,
  visibleChainIds,
  data,
  size,
  isSmallScreen,
  baseDollarsPerParticle,
  topChainId,
}: FlowsGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  // The particle animations (SMIL) run on the main thread and keep burning
  // CPU even when the graph is scrolled out of view — pause them until the
  // graph is actually visible.
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry) return
      if (entry.isIntersecting) {
        svg.unpauseAnimations()
      } else {
        svg.pauseAnimations()
      }
    })
    observer.observe(svg)
    return () => observer.disconnect()
  }, [])

  const layout = useMemo(
    () =>
      computeGraphLayout(
        visibleChainIds,
        data.chainData,
        size,
        isSmallScreen,
        topChainId,
      ),
    [visibleChainIds, data.chainData, size, isSmallScreen, topChainId],
  )

  const center = size / 2

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      overflow="visible"
    >
      <BackgroundRoads
        chainIds={visibleChainIds}
        layout={layout}
        centerX={center}
        centerY={center}
      />
      <FlowsLogo
        centerX={center}
        centerY={center}
        isSmallScreen={isSmallScreen}
      />
      {!prefersReducedMotion && (
        <ParticleLayer
          flows={data.flows}
          chainData={data.chainData}
          visibleChainIds={visibleChainIds}
          layout={layout}
          interopChains={interopChains}
          centerX={center}
          centerY={center}
          isSmallScreen={isSmallScreen}
          baseDollarsPerParticle={baseDollarsPerParticle}
        />
      )}
      <ChainBubblesLayer
        interopChains={interopChains}
        layout={layout}
        chainData={data.chainData}
        isSmallScreen={isSmallScreen}
      />
    </svg>
  )
}
