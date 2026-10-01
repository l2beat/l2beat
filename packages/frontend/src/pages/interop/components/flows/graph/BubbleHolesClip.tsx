import { useMemo } from 'react'
import type { FlowsGraphLayout } from './utils/computeGraphLayout'

const BUBBLE_RADIUS = 4

interface Props {
  id: string
  chainIds: string[]
  layout: FlowsGraphLayout
}

/**
 * Clip path covering everything outside the bubble discs. Layers drawn
 * beneath the bubbles (roads, particles) use it so they never paint under
 * icons with transparent middles.
 *
 * A hub needs no bigger hole: its icon and value cover what flows into it.
 */
export function BubbleHolesClip({ id, chainIds, layout }: Props) {
  const d = useMemo(() => {
    // Even-odd: a huge rect with one circle subpath per bubble punched out
    const r = BUBBLE_RADIUS
    const bubbleHoles = chainIds
      .map((chainId) => {
        const node = layout.get(chainId)
        if (!node) return undefined
        return `M ${node.x - r} ${node.y} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0 Z`
      })
      .filter((hole) => hole !== undefined)
      .join(' ')
    return `M -1e4 -1e4 H 1e4 V 1e4 H -1e4 Z ${bubbleHoles}`
  }, [chainIds, layout])

  return (
    <defs>
      <clipPath id={id}>
        <path d={d} clipRule="evenodd" />
      </clipPath>
    </defs>
  )
}
