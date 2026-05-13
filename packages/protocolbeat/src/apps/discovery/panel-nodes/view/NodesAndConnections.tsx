import { useMemo } from 'react'
import { useGlobalSettingsStore } from '../../store/global-settings-store'
import type { Node } from '../store/State'
import { useStore } from '../store/store'
import { Connection, type ConnectionProps } from './Connection'
import { NodeView } from './NodeView'

interface ConnectionView extends ConnectionProps {
  key: string
}

interface NodeFlags {
  isSelected: boolean
  isDimmed: boolean
  isGrayedOut: boolean
  fieldHighlightedMask: string
  fieldTargetHiddenMask: string
}

interface DerivedView {
  visible: Node[]
  connections: ConnectionView[]
  flags: Map<string, NodeFlags>
  bounds: { minX: number; minY: number; width: number; height: number } | null
  fieldCount: number
}

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

  const view = useMemo<DerivedView>(
    () =>
      buildView(nodes, hidden, selected, enableDimming, markUnreachableEntries),
    [nodes, hidden, selected, enableDimming, markUnreachableEntries],
  )

  const bounds = view.bounds
  const svg = bounds && (
    <svg
      viewBox={`${bounds.minX} ${bounds.minY} ${bounds.width} ${bounds.height}`}
      className="pointer-events-none absolute"
      style={{
        left: bounds.minX,
        top: bounds.minY,
        width: bounds.width,
        height: bounds.height,
      }}
      fill="none"
    >
      {view.connections.map(({ key, ...rest }) => (
        <Connection key={key} {...rest} />
      ))}
    </svg>
  )

  return (
    <>
      {svg}
      {view.visible.map((node) => {
        const flags = view.flags.get(node.id) as NodeFlags
        return (
          <NodeView
            key={node.id}
            node={node}
            isSelected={flags.isSelected}
            isDimmed={flags.isDimmed}
            isGrayedOut={flags.isGrayedOut}
            fieldHighlightedMask={flags.fieldHighlightedMask}
            fieldTargetHiddenMask={flags.fieldTargetHiddenMask}
          />
        )
      })}
    </>
  )
}

function buildView(
  nodes: readonly Node[],
  hidden: readonly string[],
  selected: readonly string[],
  enableDimming: boolean,
  markUnreachableEntries: boolean,
): DerivedView {
  const hiddenSet = new Set(hidden)
  const selectedSet = new Set(selected)
  const visible: Node[] = []
  const visibleById = new Map<string, Node>()
  let fieldCount = 0
  for (const node of nodes) {
    fieldCount += node.fields.length
    if (!hiddenSet.has(node.id)) {
      visible.push(node)
      visibleById.set(node.id, node)
    }
  }

  // Highlight set: selected nodes plus, when dimming is on, every node either
  // pointed-at by a selected node or pointing at a selected node through a
  // non-hidden field.
  const highlightedSet = new Set<string>(selectedSet)
  if (enableDimming && selected.length > 0) {
    for (const node of visible) {
      if (!selectedSet.has(node.id)) continue
      const hiddenFields =
        node.hiddenFields.length > 0 ? new Set(node.hiddenFields) : undefined
      for (const field of node.fields) {
        if (hiddenFields?.has(field.name)) continue
        highlightedSet.add(field.target)
      }
    }
    for (const node of visible) {
      if (highlightedSet.has(node.id)) continue
      const hiddenFields =
        node.hiddenFields.length > 0 ? new Set(node.hiddenFields) : undefined
      for (const field of node.fields) {
        if (hiddenFields?.has(field.name)) continue
        if (selectedSet.has(field.target)) {
          highlightedSet.add(node.id)
          break
        }
      }
    }
  }

  const connections: ConnectionView[] = []
  const flags = new Map<string, NodeFlags>()
  let minX = Number.POSITIVE_INFINITY
  let minY = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY
  let maxY = Number.NEGATIVE_INFINITY

  for (const node of visible) {
    const isSelected = selectedSet.has(node.id)
    const isDimmed =
      enableDimming && selected.length > 0 && !highlightedSet.has(node.id)
    const isGrayedOut = markUnreachableEntries && !node.isReachable

    const hiddenFieldsSet =
      node.hiddenFields.length > 0 ? new Set(node.hiddenFields) : undefined

    let fieldHighlightedMask = ''
    let fieldTargetHiddenMask = ''

    for (let i = 0; i < node.fields.length; i++) {
      const field = node.fields[i]
      if (!field) continue

      const targetSelected = selectedSet.has(field.target)
      const targetHidden = hiddenSet.has(field.target)
      fieldHighlightedMask += targetSelected ? '1' : '0'
      fieldTargetHiddenMask += targetHidden ? '1' : '0'

      const fieldHidden = hiddenFieldsSet?.has(field.name) ?? false
      if (fieldHidden || targetHidden) continue

      const targetNode = visibleById.get(field.target)
      const isDashed =
        targetNode?.addressType === 'EOA' ||
        targetNode?.addressType === 'EOAPermissioned'
      const isHighlighted = isSelected || targetSelected
      const isConnDimmed =
        enableDimming && selected.length > 0 && !isHighlighted
      const isConnGrayedOut =
        markUnreachableEntries && !(node.isReachable && targetNode?.isReachable)

      const from = field.connection.from
      const to = field.connection.to
      connections.push({
        key: `${node.id}-${i}-${field.target}`,
        fromX: from.x,
        fromY: from.y,
        fromDirection: from.direction,
        toX: to.x,
        toY: to.y,
        toDirection: to.direction,
        isHighlighted,
        isDashed,
        isDimmed: isConnDimmed,
        isGrayedOut: isConnGrayedOut,
      })

      if (from.x < minX) minX = from.x
      if (to.x < minX) minX = to.x
      if (from.x > maxX) maxX = from.x
      if (to.x > maxX) maxX = to.x
      if (from.y < minY) minY = from.y
      if (to.y < minY) minY = to.y
      if (from.y > maxY) maxY = from.y
      if (to.y > maxY) maxY = to.y
    }

    flags.set(node.id, {
      isSelected,
      isDimmed,
      isGrayedOut,
      fieldHighlightedMask,
      fieldTargetHiddenMask,
    })
  }

  const bounds =
    connections.length > 0
      ? {
          minX: minX - 200,
          minY: minY - 200,
          width: maxX - minX + 400,
          height: maxY - minY + 400,
        }
      : null

  return { visible, connections, flags, bounds, fieldCount }
}
