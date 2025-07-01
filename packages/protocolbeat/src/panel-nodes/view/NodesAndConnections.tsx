import { useStore } from '../store/store'
import { Connection } from './Connection'
import { NodeView } from './NodeView'
import { useMemo } from 'react'
import React from 'react'

export const NodesAndConnections = React.memo(function NodesAndConnections() {
  const nodes = useStore((s) => s.nodes)
  const hidden = useStore((s) => s.hidden)
  const selected = useStore((s) => s.selected)
  const enableDimming = useStore((s) => s.userPreferences.enableDimming)
  const transform = useStore((s) => s.transform)
  const viewportContainer = useStore((s) => s.viewportContainer)

  const { visible, connections, bounds } = useMemo(() => {
    // Step 1: filter out hidden nodes
    let candidates = nodes.filter((n) => !hidden.includes(n.id))

    // Step 2: optional viewport clipping for large graphs
    if (viewportContainer) {
      const rect = viewportContainer.getBoundingClientRect()
      const viewX = -transform.offsetX / transform.scale
      const viewY = -transform.offsetY / transform.scale
      const viewW = rect.width / transform.scale
      const viewH = rect.height / transform.scale

      const MARGIN = 400 // render some off-screen buffer for smoothness
      const inView = (box: {
        x: number
        y: number
        width: number
        height: number
      }) =>
        box.x + box.width >= viewX - MARGIN &&
        box.x <= viewX + viewW + MARGIN &&
        box.y + box.height >= viewY - MARGIN &&
        box.y <= viewY + viewH + MARGIN

      candidates = candidates.filter((n) => inView(n.box))
    }

    const visibleNodes = candidates

    const conns = visibleNodes
      .flatMap((node) =>
        node.fields.map((field, i) => {
          const shouldHide =
            hidden.includes(field.target) ||
            node.hiddenFields.includes(field.name)
          if (shouldHide) return null

          const targetNode = visibleNodes.find((n) => n.id === field.target)
          const isDashed = targetNode?.addressType === 'EOA'
          const isHighlighted =
            selected.includes(node.id) || selected.includes(field.target)
          const isDimmed =
            enableDimming && selected.length > 0 && !isHighlighted

          return {
            key: `${node.id}-${i}-${field.target}`,
            from: field.connection.from,
            to: field.connection.to,
            isHighlighted,
            isDashed,
            isDimmed,
          }
        }),
      )
      .filter(Boolean) as {
      key: string
      from: { x: number; y: number; direction: 'left' | 'right' }
      to: { x: number; y: number; direction: 'left' | 'right' }
      isHighlighted: boolean
      isDashed: boolean
      isDimmed: boolean
    }[]

    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity

    conns.forEach(({ from, to }) => {
      minX = Math.min(minX, from.x, to.x) - 200
      maxX = Math.max(maxX, from.x, to.x) + 200
      minY = Math.min(minY, from.y, to.y) - 200
      maxY = Math.max(maxY, from.y, to.y) + 200
    })

    const bounds = {
      minX,
      minY,
      width: maxX - minX,
      height: maxY - minY,
    }

    return { visible: visibleNodes, connections: conns, bounds }
  }, [nodes, hidden, selected, enableDimming, transform, viewportContainer])

  const { minX, minY, width, height } = bounds

  const highlightedIds = useMemo(() => {
    if (!enableDimming || selected.length === 0) {
      return new Set<string>()
    }

    const directTargets = visible
      .filter((n) => (selected.includes(n.id) ? n.fields : []))
      .flatMap((n) =>
        n.fields
          .filter((f) => !n.hiddenFields.includes(f.name))
          .map((f) => f.target),
      )

    const sourcesOfSelected = visible
      .filter((n) =>
        n.fields
          .filter((f) => !n.hiddenFields.includes(f.name))
          .some((f) => selected.includes(f.target)),
      )
      .map((n) => n.id)

    return new Set<string>([
      ...selected,
      ...directTargets,
      ...sourcesOfSelected,
    ])
  }, [enableDimming, selected, visible])

  return (
    <>
      <svg
        viewBox={`${minX} ${minY} ${width} ${height}`}
        className="pointer-events-none absolute"
        style={{ left: minX, top: minY, width, height }}
        fill="none"
      >
        {connections.map((c) => (
          <Connection {...c} />
        ))}
      </svg>

      {visible.map((node) => {
        const nodeHighlighted = highlightedIds.has(node.id)
        const isDimmed =
          enableDimming && selected.length > 0 && !nodeHighlighted

        return (
          <NodeView
            key={node.id}
            node={node}
            selected={selected.includes(node.id)}
            isDimmed={isDimmed}
          />
        )
      })}
    </>
  )
})
