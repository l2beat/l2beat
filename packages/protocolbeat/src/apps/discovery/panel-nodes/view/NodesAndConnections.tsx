import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useParams } from 'react-router-dom'
import { useGlobalSettingsStore } from '../../store/global-settings-store'
import {
  useEdgeCallGraph,
  getEdgeCalls,
  hasEdgeCalls,
  type BidirectionalCalls,
} from '../../defidisco/useEdgeCallGraph'
import { EdgeCallGraphPopup } from '../../defidisco/EdgeCallGraphPopup'
import { ClickableConnection } from '../../defidisco/ClickableConnection'
import { useStore } from '../store/store'
import { NodeView } from './NodeView'

interface ClickedEdge {
  sourceAddress: string
  sourceName: string
  targetAddress: string
  targetName: string
  calls: BidirectionalCalls
  position: { x: number; y: number }
}

export function NodesAndConnections() {
  const { project } = useParams()
  const nodes = useStore((s) => s.nodes)
  const hidden = useStore((s) => s.hidden)
  const selected = useStore((s) => s.selected)
  const enableDimming = useStore(
    ({ userPreferences }) => userPreferences.enableDimming,
  )
  const markUnreachableEntries = useGlobalSettingsStore(
    (s) => s.markUnreachableEntries,
  )
  const visible = nodes.filter((n) => !hidden.includes(n.id))

  // State for clicked edge popup
  const [clickedEdge, setClickedEdge] = useState<ClickedEdge | null>(null)

  // Fetch call graph data to determine which edges are clickable
  const { edgeCallsMap } = useEdgeCallGraph(project ?? '')

  const connections = visible
    .flatMap((node) =>
      node.fields.map((field, i) => {
        const shouldHide =
          hidden.includes(field.target) ||
          node.hiddenFields.includes(field.name)

        if (shouldHide) return null

        const targetNode = visible.find((n) => n.id === field.target)
        const isDashed =
          targetNode?.addressType === 'EOA' ||
          targetNode?.addressType === 'EOAPermissioned'
        const isHighlighted =
          selected.includes(node.id) || selected.includes(field.target)
        const isDimmed = enableDimming && selected.length > 0 && !isHighlighted
        const isGrayedOut =
          markUnreachableEntries &&
          !(node.isReachable && targetNode?.isReachable)

        // Check if this edge has call graph data (in either direction)
        const calls = getEdgeCalls(edgeCallsMap, node.id, field.target)
        const hasCallGraphData = hasEdgeCalls(edgeCallsMap, node.id, field.target)

        return {
          key: `${node.id}-${i}-${field.target}`,
          sourceAddress: node.id,
          sourceName: node.name,
          targetAddress: field.target,
          targetName: targetNode?.name ?? field.target,
          from: field.connection.from,
          to: field.connection.to,
          isHighlighted,
          isDashed,
          isDimmed,
          isGrayedOut,
          hasCallGraphData,
          calls,
        }
      }),
    )
    .filter(Boolean) as {
    key: string
    sourceAddress: string
    sourceName: string
    targetAddress: string
    targetName: string
    from: { x: number; y: number; direction: 'left' | 'right' }
    to: { x: number; y: number; direction: 'left' | 'right' }
    isHighlighted: boolean
    isDashed: boolean
    isDimmed: boolean
    isGrayedOut?: boolean
    hasCallGraphData: boolean
    calls: BidirectionalCalls
  }[]

  let minX = Number.POSITIVE_INFINITY
  let minY = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY
  let maxY = Number.NEGATIVE_INFINITY

  connections.forEach(({ from, to }) => {
    minX = Math.min(minX, from.x, to.x) - 200
    maxX = Math.max(maxX, from.x, to.x) + 200
    minY = Math.min(minY, from.y, to.y) - 200
    maxY = Math.max(maxY, from.y, to.y) + 200
  })

  const width = maxX - minX
  const height = maxY - minY

  const handleEdgeClick = (
    connection: (typeof connections)[number],
    e: React.MouseEvent,
  ) => {
    e.stopPropagation()
    setClickedEdge({
      sourceAddress: connection.sourceAddress,
      sourceName: connection.sourceName,
      targetAddress: connection.targetAddress,
      targetName: connection.targetName,
      calls: connection.calls,
      position: { x: e.clientX, y: e.clientY },
    })
  }

  return (
    <>
      <svg
        viewBox={`${minX} ${minY} ${width} ${height}`}
        className="absolute"
        style={{ left: minX, top: minY, width, height, pointerEvents: 'none' }}
        fill="none"
      >
        {connections.map(({ key, sourceAddress, sourceName, targetAddress, targetName, calls, ...rest }) => (
          <ClickableConnection
            key={key}
            {...rest}
            onClick={
              rest.hasCallGraphData
                ? (e) =>
                    handleEdgeClick(
                      {
                        key,
                        sourceAddress,
                        sourceName,
                        targetAddress,
                        targetName,
                        calls,
                        ...rest,
                      },
                      e,
                    )
                : undefined
            }
          />
        ))}
      </svg>

      {visible.map((node) => {
        const highlightedIds =
          enableDimming && selected.length
            ? new Set([
                ...selected,
                ...visible
                  .filter((n) => selected.includes(n.id))
                  .flatMap((n) =>
                    n.fields
                      .filter((f) => !n.hiddenFields.includes(f.name))
                      .map((f) => f.target),
                  ),
                ...visible
                  .filter((n) =>
                    n.fields
                      .filter((f) => !n.hiddenFields.includes(f.name))
                      .some((f) => selected.includes(f.target)),
                  )
                  .map((n) => n.id),
              ])
            : new Set()

        const nodeHighlighted = highlightedIds.has(node.id)
        const isDimmed =
          enableDimming && selected.length > 0 && !nodeHighlighted
        const isGrayedOut = markUnreachableEntries && !node.isReachable

        return (
          <NodeView
            key={node.id}
            node={node}
            selected={selected.includes(node.id)}
            isDimmed={isDimmed}
            isGrayedOut={isGrayedOut}
          />
        )
      })}

      {/* Edge call graph popup */}
      {clickedEdge &&
        createPortal(
          <EdgeCallGraphPopup
            sourceAddress={clickedEdge.sourceAddress}
            sourceName={clickedEdge.sourceName}
            targetAddress={clickedEdge.targetAddress}
            targetName={clickedEdge.targetName}
            calls={clickedEdge.calls}
            position={clickedEdge.position}
            onClose={() => setClickedEdge(null)}
          />,
          document.body,
        )}
    </>
  )
}
