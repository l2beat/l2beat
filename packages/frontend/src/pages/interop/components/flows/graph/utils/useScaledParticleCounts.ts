import { assert, UnixTime } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import { INTEROP_PAIR_SEPARATOR } from '~/server/features/layer2s/interop/consts'
import { BASE_DURATION_S } from '../../consts'
import type { FlowsGraphFlow, FlowsGraphNodeData } from '../types'
import { computeGraphLayout } from './computeGraphLayout'
import { getScaledParticleCounts } from './getScaledParticleCounts'
import { DOLLARS_PARTICLE_SCALE, type ParticleScale } from './particleScale'

interface FlowParticles {
  /** Fractional scaled on-screen count (e.g. 2.5) - the renderer ceils this */
  exactCount: number
  travelDuration: number
}

interface Result {
  valuePerParticle: number | undefined
  flowsParticles: Map<string, FlowParticles>
}

interface Options {
  /** Must match the graph, since it changes the path lengths */
  centerChainId?: string
  /** Defaults to dollars. `base` is overridden by baseValuePerParticle */
  scale?: ParticleScale
}

/**
 * Computes the scaled particle count per flow and the resulting value-per-particle.
 * Uses a unit-sized layout so the result is pixel-independent — both the graph
 * (for animation) and general stats (for the "1 particle ≈ $X" label) share it.
 *
 * Particle emission rate is exact (no rounding):
 *   volume in 24h → value/second → particles/second (R)
 *   → on-screen count = R × travelDuration (fractional)
 *
 * Counts are scaled in two stages by getScaledParticleCounts:
 *   1. per-flow cap so the largest flow stays within MAX_PARTICLES_PER_FLOW
 *   2. global cap so the overall graph stays within MAX_TOTAL_PARTICLES
 */
export function useScaledParticleCounts(
  chainIds: string[],
  chainData: FlowsGraphNodeData[] | undefined,
  flows: FlowsGraphFlow[] | undefined,
  baseValuePerParticle?: number,
  options?: Options,
): Result {
  const centerChainId = options?.centerChainId
  const scale = options?.scale ?? DOLLARS_PARTICLE_SCALE
  const base = baseValuePerParticle ?? scale.base

  return useMemo(() => {
    const filteredFlows = flows?.filter((f) => f.volume > 0) ?? []

    if (filteredFlows.length === 0 || !chainData) {
      return { valuePerParticle: undefined, flowsParticles: new Map() }
    }

    // Unit-sized layout: distances are in arbitrary units, but the d/maxD
    // ratio is pixel-independent, so travel durations derived here match the
    // on-screen animation exactly.
    const layout = computeGraphLayout(
      chainIds,
      chainData,
      1,
      false,
      undefined,
      centerChainId,
    )

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
      const particlesPerSecond = volumePerSecond / base
      return particlesPerSecond * (travelDurations[i] ?? 0)
    })

    const { counts, valuePerParticle } = getScaledParticleCounts(
      exactCounts,
      base,
      scale,
    )

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

    return { valuePerParticle, flowsParticles: result }
  }, [chainIds, chainData, flows, base, scale, centerChainId])
}
