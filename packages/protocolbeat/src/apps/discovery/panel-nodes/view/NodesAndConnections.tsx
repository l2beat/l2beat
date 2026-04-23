import { useMemo } from 'react'
import { useGlobalSettingsStore } from '../../store/global-settings-store'
import { useStore } from '../store/store'
import type { Node } from '../store/State'
import { Connection } from './Connection'
import { NodeView } from './NodeView'

const EMPTY_STRING_SET: ReadonlySet<string> = new Set()

export function NodesAndConnections() {
  const nodes = useStore((s) => s.nodes)
  const hidden = useStore((s) => s.hidden)
  const selected = useStore((s) => s.selected)
  const enableDimming = useStore(
    ({ userPreferences }) => userPreferences.enableDimming,
  )
  const markUnreachableEntries = useGlobalSettingsStore(
    (s) => s.markUnreachableEntries,
  )

  const hiddenSet = useMemo<ReadonlySet<string>>(
    () => new Set(hidden),
    [hidden],
  )
  const selectedSet = useMemo<ReadonlySet<string>>(
    () => new Set(selected),
    [selected],
  )
  const { visible, visibleById } = useMemo(() => {
    const visible = nodes.filter((n) => !hiddenSet.has(n.id))
    const visibleById = new Map<string, Node>(visible.map((n) => [n.id, n]))
    return { visible, visibleById }
  }, [nodes, hiddenSet])

  const { connections, viewBox } = useMemo(() => {
    type Conn = {
      key: string
      from: { x: number; y: number; direction: 'left' | 'right' }
      to: { x: number; y: number; direction: 'left' | 'right' }
      isHighlighted: boolean
      isDashed: boolean
      isDimmed: boolean
      isGrayedOut: boolean
    }
    const connections: Conn[] = []
    let minX = Number.POSITIVE_INFINITY
    let minY = Number.POSITIVE_INFINITY
    let maxX = Number.NEGATIVE_INFINITY
    let maxY = Number.NEGATIVE_INFINITY

    for (const node of visible) {
      const nodeSelected = selectedSet.has(node.id)
      const nodeHiddenFields =
        node.hiddenFields.length > 0
          ? new Set(node.hiddenFields)
          : (EMPTY_STRING_SET as ReadonlySet<string>)
      let i = -1
      for (const field of node.fields) {
        i++
        if (hiddenSet.has(field.target) || nodeHiddenFields.has(field.name)) {
          continue
        }
        const targetNode = visibleById.get(field.target)
        const isDashed =
          targetNode?.addressType === 'EOA' ||
          targetNode?.addressType === 'EOAPermissioned'
        const isHighlighted = nodeSelected || selectedSet.has(field.target)
        const isDimmed = enableDimming && selectedSet.size > 0 && !isHighlighted
        const isGrayedOut =
          markUnreachableEntries &&
          !(node.isReachable && targetNode?.isReachable)

        const { from, to } = field.connection
        if (from.x < minX) minX = from.x
        if (to.x < minX) minX = to.x
        if (from.x > maxX) maxX = from.x
        if (to.x > maxX) maxX = to.x
        if (from.y < minY) minY = from.y
        if (to.y < minY) minY = to.y
        if (from.y > maxY) maxY = from.y
        if (to.y > maxY) maxY = to.y

        connections.push({
          key: `${node.id}-${i}-${field.target}`,
          from,
          to,
          isHighlighted,
          isDashed,
          isDimmed,
          isGrayedOut,
        })
      }
    }

    if (connections.length === 0) {
      return {
        connections,
        viewBox: { minX: 0, minY: 0, width: 0, height: 0 },
      }
    }
    const vbMinX = minX - 200
    const vbMinY = minY - 200
    const vbMaxX = maxX + 200
    const vbMaxY = maxY + 200
    return {
      connections,
      viewBox: {
        minX: vbMinX,
        minY: vbMinY,
        width: vbMaxX - vbMinX,
        height: vbMaxY - vbMinY,
      },
    }
  }, [
    visible,
    visibleById,
    hiddenSet,
    selectedSet,
    enableDimming,
    markUnreachableEntries,
  ])

  const highlightedIds = useMemo(() => {
    if (!enableDimming || selectedSet.size === 0) {
      return null
    }
    const result = new Set<string>(selectedSet)
    for (const node of visible) {
      if (selectedSet.has(node.id)) {
        for (const f of node.fields) {
          if (!node.hiddenFields.includes(f.name)) {
            result.add(f.target)
          }
        }
      } else {
        for (const f of node.fields) {
          if (!node.hiddenFields.includes(f.name) && selectedSet.has(f.target)) {
            result.add(node.id)
            break
          }
        }
      }
    }
    return result
  }, [visible, selectedSet, enableDimming])

  return (
    <>
      <svg
        viewBox={`${viewBox.minX} ${viewBox.minY} ${viewBox.width} ${viewBox.height}`}
        className="pointer-events-none absolute"
        style={{
          left: viewBox.minX,
          top: viewBox.minY,
          width: viewBox.width,
          height: viewBox.height,
        }}
        fill="none"
      >
        {connections.map(({ key, ...rest }) => (
          <Connection key={key} {...rest} />
        ))}
      </svg>

      {visible.map((node) => {
        const nodeHighlighted =
          highlightedIds === null ? false : highlightedIds.has(node.id)
        const isDimmed =
          enableDimming && selectedSet.size > 0 && !nodeHighlighted
        const isGrayedOut = markUnreachableEntries && !node.isReachable
        return (
          <NodeView
            key={node.id}
            node={node}
            selected={selectedSet.has(node.id)}
            selectedSet={selectedSet}
            hiddenSet={hiddenSet}
            isDimmed={isDimmed}
            isGrayedOut={isGrayedOut}
          />
        )
      })}
    </>
  )
}
