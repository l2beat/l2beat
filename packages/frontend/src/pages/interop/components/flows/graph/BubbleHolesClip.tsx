import { useMemo } from 'react'
import type { FlowsGraphLayout } from './utils/computeGraphLayout'

interface Props {
  id: string
  chainIds: string[]
  layout: FlowsGraphLayout
}

/**
 * Clip path covering everything outside the bubble discs. Layers drawn
 * beneath the bubbles (roads, particles) use it so they never paint under
 * icons with transparent middles.
 */
export function BubbleHolesClip({ id, chainIds, layout }: Props) {
  const d = useMemo(() => {
    // Even-odd: a huge rect with one circle subpath per bubble punched out
    const bubbleHoles = chainIds
      .map((chainId) => layout.get(chainId))
      .filter((node) => node !== undefined)
      .map(
        ({ x, y, radius: r }) =>
          `M ${x - r} ${y} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0 Z`,
      )
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
