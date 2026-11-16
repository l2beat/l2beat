import { useMemo } from 'react'
import type { FlowsGraphLayout } from './utils/computeGraphLayout'

const BUBBLE_RADIUS = 4
/** Room left between a label's text box and the roads cut around it */
const LABEL_PADDING_X = 1

interface Props {
  id: string
  chainIds: string[]
  layout: FlowsGraphLayout
}

/**
 * Clip path covering everything outside the bubble discs and the label
 * boxes. Layers drawn beneath the bubbles (roads, particles) use it so they
 * never paint under icons with transparent middles or through a chain's
 * name and net flow.
 */
export function BubbleHolesClip({ id, chainIds, layout }: Props) {
  const d = useMemo(() => {
    // Even-odd: a huge rect with one subpath per bubble and label punched
    // out. The layout keeps them from overlapping, which would undo a hole.
    const holes = chainIds
      .map((chainId) => layout.get(chainId))
      .filter((node) => node !== undefined)
      .flatMap(({ x, y, labelBoxes }) => [
        `M ${x - BUBBLE_RADIUS} ${y} a ${BUBBLE_RADIUS} ${BUBBLE_RADIUS} 0 1 0 ${2 * BUBBLE_RADIUS} 0 a ${BUBBLE_RADIUS} ${BUBBLE_RADIUS} 0 1 0 ${-2 * BUBBLE_RADIUS} 0 Z`,
        ...labelBoxes.map(
          (box) =>
            `M ${box.x0 - LABEL_PADDING_X} ${box.y0} H ${box.x1 + LABEL_PADDING_X} V ${box.y1} H ${box.x0 - LABEL_PADDING_X} Z`,
        ),
      ])
      .join(' ')
    return `M -1e4 -1e4 H 1e4 V 1e4 H -1e4 Z ${holes}`
  }, [chainIds, layout])

  return (
    <defs>
      <clipPath id={id}>
        <path d={d} clipRule="evenodd" />
      </clipPath>
    </defs>
  )
}
