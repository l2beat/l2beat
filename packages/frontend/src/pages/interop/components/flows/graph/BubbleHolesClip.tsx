import { useMemo } from 'react'
import type { FlowsGraphLayout } from './utils/computeGraphLayout'

const BUBBLE_RADIUS = 4

interface Props {
  id: string
  chainIds: string[]
  layout: FlowsGraphLayout
  centerChainId?: string
}

/**
 * Clip path covering everything outside the bubble discs. Layers drawn
 * beneath the bubbles (roads, particles) use it so they never paint under
 * icons with transparent middles.
 *
 * The center bubble is punched out whole: every flow ends there, so anything
 * painted inside it would pile up under its icon and value.
 */
export function BubbleHolesClip({
  id,
  chainIds,
  layout,
  centerChainId,
}: Props) {
  const d = useMemo(() => {
    // Even-odd: a huge rect with one circle subpath per bubble punched out
    const bubbleHoles = chainIds
      .map((chainId) => {
        const node = layout.get(chainId)
        if (!node) return undefined
        const r = chainId === centerChainId ? node.radius : BUBBLE_RADIUS
        return `M ${node.x - r} ${node.y} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0 Z`
      })
      .filter((hole) => hole !== undefined)
      .join(' ')
    return `M -1e4 -1e4 H 1e4 V 1e4 H -1e4 Z ${bubbleHoles}`
  }, [chainIds, layout, centerChainId])

  return (
    <defs>
      <clipPath id={id}>
        <path d={d} clipRule="evenodd" />
      </clipPath>
    </defs>
  )
}
