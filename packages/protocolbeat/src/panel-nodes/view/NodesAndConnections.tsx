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

  const { visible, connections, bounds } = useMemo(() => {
    const visibleNodes = nodes.filter((n) => !hidden.includes(n.id))

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
  }, [nodes, hidden, selected, enableDimming])

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
