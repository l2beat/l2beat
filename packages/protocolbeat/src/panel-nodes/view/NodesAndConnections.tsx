import { useMemo } from 'react'
import React from 'react'
import { useStore } from '../store/store'
import { ConnectionsSVG } from './ConnectionsSVG'
import { NodesRenderer } from './NodesRenderer'
import {
  getViewportInfo,
  filterVisibleNodes,
  calculateBounds,
  filterVisibleConnections,
} from './viewport-utils'

export const NodesAndConnections = React.memo(function NodesAndConnections() {
  const nodes = useStore((s) => s.nodes)
  const hidden = useStore((s) => s.hidden)
  const selected = useStore((s) => s.selected)
  const enableDimming = useStore((s) => s.userPreferences.enableDimming)
  const transform = useStore((s) => s.transform)
  const viewportContainer = useStore((s) => s.viewportContainer)

  const { visible, connections, bounds } = useMemo(() => {
    const viewport = viewportContainer
      ? getViewportInfo(viewportContainer, transform)
      : undefined

    const visibleNodes = filterVisibleNodes(nodes, hidden, viewport)

    const allConnections = visibleNodes
      .flatMap((node) =>
        node.fields.map((field, i) => {
          const shouldHide =
            hidden.includes(field.target) ||
            node.hiddenFields.includes(field.name)
          if (shouldHide) return null

          const targetNode = nodes.find((n) => n.id === field.target)
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
      .filter((x) => x !== null) as {
      key: string
      from: { x: number; y: number; direction: 'left' | 'right' }
      to: { x: number; y: number; direction: 'left' | 'right' }
      isHighlighted: boolean
      isDashed: boolean
      isDimmed: boolean
    }[]

    const canvasBounds = calculateBounds(allConnections, viewport)

    const visibleConnections = filterVisibleConnections(
      allConnections,
      viewport,
    )

    return {
      visible: visibleNodes,
      connections: visibleConnections,
      bounds: canvasBounds,
    }
  }, [nodes, hidden, selected, enableDimming, transform, viewportContainer])

  const { minX, minY, width, height } = bounds

  const highlightedIds = useMemo(() => {
    if (!enableDimming || selected.length === 0) {
      return new Set<string>()
    }

    const selectedAndVisible = visible.filter((n) => selected.includes(n.id))

    const directTargets = selectedAndVisible.flatMap((sav) =>
      sav.fields
        .filter((f) => !sav.hiddenFields.includes(f.name))
        .map((f) => f.target),
    )

    const pointers = visible.filter((v) =>
      v.fields.some((vf) => selected.includes(vf.target)),
    )

    return new Set<string>([
      ...selected,
      ...directTargets,
      ...pointers.map((p) => p.id),
    ])
  }, [enableDimming, selected, visible])

  return (
    <>
      <ConnectionsSVG
        connections={connections}
        bounds={{ minX, minY, width, height }}
      />

      <NodesRenderer
        nodes={visible}
        selected={selected}
        highlightedIds={highlightedIds}
        enableDimming={enableDimming}
      />
    </>
  )
})
