import { useMemo } from 'react'
import { IconShield } from '../../../../icons/IconShield'
import { useStore } from '../store/store'
import { buildRenderGraph } from '../store/utils/renderGraph'
import { computeSecurityPerimeter } from '../store/utils/securityPerimeter'

const LABEL_OFFSET_X = 12
const LABEL_OFFSET_Y = 11
const LABEL_MIN_EDGE_PX = 8

export function PerimeterLabels() {
  const nodes = useStore((state) => state.nodes)
  const showSecurityPerimeter = useStore(
    (state) => state.userPreferences.showSecurityPerimeter,
  )
  const { offsetX, offsetY, scale } = useStore((state) => state.transform)

  const zones = useMemo(() => {
    if (!showSecurityPerimeter) return []
    const graph = buildRenderGraph(nodes)
    return computeSecurityPerimeter(graph.nodes, graph.hidden)
  }, [nodes, showSecurityPerimeter])

  if (zones.length === 0) return null

  return zones.map((zone, index) => {
    if (zones.length > 1 && zone.count < 2) return null
    const left = zone.box.x * scale + offsetX
    const top = zone.box.y * scale + offsetY
    const right = left + zone.box.width * scale
    const bottom = top + zone.box.height * scale
    if (right < LABEL_MIN_EDGE_PX || bottom < LABEL_MIN_EDGE_PX) return null

    const label = `Security perimeter · ${zone.count}`
    return (
      <div
        key={`${index}:${zone.nodeIds[0] ?? ''}`}
        className="pointer-events-none absolute flex select-none items-center gap-1.5 whitespace-nowrap rounded-sm border border-aux-yellow/50 bg-coffee-900/95 px-2 py-0.5 font-medium text-aux-yellow text-xs shadow-xs"
        style={{
          left: Math.max(LABEL_MIN_EDGE_PX, left + LABEL_OFFSET_X),
          top: Math.max(LABEL_MIN_EDGE_PX, top - LABEL_OFFSET_Y),
        }}
      >
        <IconShield className="size-3 shrink-0" />
        <span>{label}</span>
      </div>
    )
  })
}
