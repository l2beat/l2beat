import { assert, UnixTime } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import { INTEROP_PAIR_SEPARATOR } from '~/server/features/scaling/interop/consts'
import type {
  ChainData,
  Flow,
} from '~/server/features/scaling/interop/getInteropFlows'
import { BASE_DURATION_S, DOLLARS_PER_PARTICLE } from '../../consts'
import { computeGraphLayout } from './computeGraphLayout'
import { getScaledParticleCounts } from './getScaledParticleCounts'

interface FlowParticles {
  /** Fractional scaled on-screen count (e.g. 2.5) - the renderer ceils this */
  exactCount: number
  travelDuration: number
}

interface Result {
  dollarsPerParticle: number | undefined
  flowsParticles: Map<string, FlowParticles>
}

/**
 * Computes the scaled particle count per flow and the resulting dollars-per-particle.
 * Uses a unit-sized layout so the result is pixel-independent — both the graph
 * (for animation) and general stats (for the "1 particle ≈ $X" label) share it.
 *
 * Particle emission rate is exact (no rounding):
 *   volume in 24h → $/second → particles/second (R)
 *   → on-screen count = R × travelDuration (fractional)
 *
 * Counts are scaled in two stages by getScaledParticleCounts:
 *   1. per-flow cap so the largest flow stays within MAX_PARTICLES_PER_FLOW
 *   2. global cap so the overall graph stays within MAX_TOTAL_PARTICLES
 */
export function useScaledParticleCounts(
  chainIds: string[],
  chainData: ChainData[] | undefined,
  flows: Flow[] | undefined,
): Result {
  return useMemo(() => {
    const filteredFlows = flows?.filter((f) => f.volume > 0) ?? []

    if (filteredFlows.length === 0 || !chainData) {
      return { dollarsPerParticle: undefined, flowsParticles: new Map() }
    }

    // Unit-sized layout: distances are in arbitrary units, but the d/maxD
    // ratio is pixel-independent, so travel durations derived here match the
    // on-screen animation exactly.
    const layout = computeGraphLayout(chainIds, chainData, 1, false)

    const distances = filteredFlows.map((flow) => {
      const src = layout.get(flow.srcChain)
      const dst = layout.get(flow.dstChain)
      if (!src || !dst) return 0
      const dx = dst.x - src.x
      const dy = dst.y - src.y
      return Math.sqrt(dx * dx + dy * dy)
    })
    const maxDistance = Math.max(...distances, 1)

    // Constant speed: the longest path takes BASE_DURATION_S, shorter paths less
    const travelDurations = distances.map(
      (d) => (d / maxDistance) * BASE_DURATION_S,
    )

    const exactCounts = filteredFlows.map((flow, i) => {
      const volumePerSecond = flow.volume / UnixTime.DAY
      const particlesPerSecond = volumePerSecond / DOLLARS_PER_PARTICLE
      return particlesPerSecond * (travelDurations[i] ?? 0)
    })

    const { counts, dollarsPerParticle } = getScaledParticleCounts(exactCounts)

    const result = new Map<string, FlowParticles>()
    for (let i = 0; i < filteredFlows.length; i++) {
      const flow = filteredFlows[i]
      assert(flow)
      const pairKey = `${flow.srcChain}${INTEROP_PAIR_SEPARATOR}${flow.dstChain}`
      result.set(pairKey, {
        exactCount: counts[i] ?? 0,
        travelDuration: travelDurations[i] ?? 0,
      })
    }

    return { dollarsPerParticle, flowsParticles: result }
  }, [chainIds, chainData, flows])
}
