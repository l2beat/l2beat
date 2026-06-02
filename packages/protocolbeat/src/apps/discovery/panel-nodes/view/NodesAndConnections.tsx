import { useMemo } from 'react'
import { useGlobalSettingsStore } from '../../store/global-settings-store'
import type { Node } from '../store/State'
import { useStore } from '../store/store'
import { getResolvedFieldConnection } from '../store/utils/connections'
import {
  applyEntrypointCollapse,
  expandSelectionForHighlighting,
  isSelectionTargetHighlighted,
  normalizeSelectionForDisplay,
  resolveFieldTarget,
} from '../store/utils/entrypointGroups'
import { Connection, type ConnectionProps } from './Connection'
import { NodeView } from './NodeView'

interface ConnectionView extends ConnectionProps {
  key: string
}

interface NodeFlags {
  isSelected: boolean
  isDimmed: boolean
  isGrayedOut: boolean
  isOverlapping: boolean
  isSimilar: boolean
  colorOverride?: number
  fieldHighlightedMask: string
  fieldTargetHiddenMask: string
}

interface DerivedView {
  visible: Node[]
  connections: ConnectionView[]
  flags: Map<string, NodeFlags>
  bounds: { minX: number; minY: number; width: number; height: number } | null
}

export function NodesAndConnections() {
  const nodes = useStore((s) => s.nodes)
  const hidden = useStore((s) => s.hidden)
  const selected = useStore((s) => s.selected)
  const enableDimming = useStore(
    ({ userPreferences }) => userPreferences.enableDimming,
  )
  const highlightOverlapping = useStore(
    ({ userPreferences }) => userPreferences.highlightOverlapping !== false,
  )
  const highlightSimilar = useStore(
    ({ userPreferences }) => userPreferences.highlightSimilarImplementation,
  )
  const markUnreachableEntries = useGlobalSettingsStore(
    (s) => s.markUnreachableEntries,
  )
  const entrypointGroups = useStore((s) => s.entrypointGroups)
  const collapsedEntrypointGroups = useStore((s) => s.collapsedEntrypointGroups)

  const view = useMemo<DerivedView>(() => {
    const collapsed = applyEntrypointCollapse(nodes, hidden, {
      groups: entrypointGroups,
      collapsedGroupIds: collapsedEntrypointGroups,
    })
    const displaySelected = normalizeSelectionForDisplay(selected, {
      entrypointGroups,
      collapsedEntrypointGroups,
      hidden,
    })
    const highlightSelection = expandSelectionForHighlighting(selected, {
      entrypointGroups,
      collapsedEntrypointGroups,
      hidden,
    })
    return buildView(
      collapsed.nodes,
      collapsed.hidden,
      displaySelected,
      highlightSelection,
      enableDimming,
      highlightOverlapping,
      highlightSimilar,
      markUnreachableEntries,
      collapsed.targetResolver,
    )
  }, [
    nodes,
    hidden,
    selected,
    enableDimming,
    highlightOverlapping,
    highlightSimilar,
    markUnreachableEntries,
    entrypointGroups,
    collapsedEntrypointGroups,
  ])

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
            isOverlapping={flags.isOverlapping}
            isSimilar={flags.isSimilar}
            colorOverride={flags.colorOverride}
            fieldHighlightedMask={flags.fieldHighlightedMask}
            fieldTargetHiddenMask={flags.fieldTargetHiddenMask}
          />
        )
      })}
    </>
  )
}

// Sweep-line on the x-axis: sort by left edge, maintain an `active` set of
// nodes whose right edge hasn't passed the current node's left edge, and only
// check those for y-overlap. Sort dominates at O(n log n); the sweep is near
// linear when node widths are small relative to the canvas. Worst case is
// still O(n²) if every node spans the full x-range.
function computeOverlappingIds(nodes: readonly Node[]): Set<string> {
  const overlapping = new Set<string>()
  if (nodes.length < 2) return overlapping

  const sorted = nodes.slice().sort((a, b) => a.box.x - b.box.x)
  const active: Node[] = []

  for (const node of sorted) {
    const left = node.box.x
    const top = node.box.y
    const bottom = top + node.box.height

    for (let k = active.length - 1; k >= 0; k--) {
      const candidate = active[k]
      if (!candidate) continue
      if (candidate.box.x + candidate.box.width <= left) {
        active[k] = active[active.length - 1] as Node
        active.pop()
        continue
      }
      if (
        candidate.box.y < bottom &&
        candidate.box.y + candidate.box.height > top
      ) {
        overlapping.add(node.id)
        overlapping.add(candidate.id)
      }
    }
    active.push(node)
  }

  return overlapping
}

// Given the current selection, find every visible node that shares an
// implementation with any selected node: the same flattened source (sourceKey)
// OR the same template + value-key shape (valuesShapeKey). The matching nodes
// adopt the (first) selected node's color so the group reads as one cluster.
function computeSimilarSet(
  visible: readonly Node[],
  selectedSet: ReadonlySet<string>,
): { ids: Set<string>; colorOverride: number | undefined } {
  const ids = new Set<string>()
  if (selectedSet.size === 0) {
    return { ids, colorOverride: undefined }
  }

  const selectedNodes = visible.filter((node) => selectedSet.has(node.id))
  const sourceKeys = new Set<string>()
  const valuesShapeKeys = new Set<string>()
  for (const node of selectedNodes) {
    if (node.sourceKey) sourceKeys.add(node.sourceKey)
    if (node.valuesShapeKey) valuesShapeKeys.add(node.valuesShapeKey)
  }

  if (sourceKeys.size === 0 && valuesShapeKeys.size === 0) {
    return { ids, colorOverride: undefined }
  }

  for (const node of visible) {
    const matches =
      (node.sourceKey !== undefined && sourceKeys.has(node.sourceKey)) ||
      (node.valuesShapeKey !== undefined &&
        valuesShapeKeys.has(node.valuesShapeKey))
    if (matches) {
      ids.add(node.id)
    }
  }

  const anchor = selectedNodes[0]
  const colorOverride = anchor
    ? (anchor.entrypointColors?.[0] ?? anchor.color)
    : undefined

  return { ids, colorOverride }
}

function buildView(
  nodes: readonly Node[],
  hidden: readonly string[],
  displaySelected: readonly string[],
  highlightSelection: ReadonlySet<string>,
  enableDimming: boolean,
  highlightOverlapping: boolean,
  highlightSimilar: boolean,
  markUnreachableEntries: boolean,
  targetResolver: Map<string, string> = new Map(),
): DerivedView {
  const hiddenSet = new Set(hidden)
  const displaySelectedSet = new Set(displaySelected)
  const effectiveDimming = enableDimming
  const visible: Node[] = []
  const visibleById = new Map<string, Node>()

  for (const node of nodes) {
    if (!hiddenSet.has(node.id)) {
      visible.push(node)
      visibleById.set(node.id, node)
    }
  }

  const overlappingIds = highlightOverlapping
    ? computeOverlappingIds(visible)
    : new Set<string>()

  const similar = highlightSimilar
    ? computeSimilarSet(visible, displaySelectedSet)
    : { ids: new Set<string>(), colorOverride: undefined }
  // When similar mode finds matches, emphasis is driven by the similar set:
  // matching nodes stay at full opacity, everything else is dimmed.
  const similarActive =
    highlightSimilar && displaySelected.length > 0 && similar.ids.size > 0

  const highlightedSet = new Set<string>(displaySelectedSet)
  if (effectiveDimming && displaySelected.length > 0) {
    for (const node of nodes) {
      if (!highlightSelection.has(node.id)) continue
      const hiddenFields =
        node.hiddenFields.length > 0 ? new Set(node.hiddenFields) : undefined
      for (const field of node.fields) {
        if (hiddenFields?.has(field.name)) continue
        highlightedSet.add(resolveFieldTarget(field.target, targetResolver))
      }
    }
    for (const node of visible) {
      if (highlightedSet.has(node.id)) continue
      const hiddenFields =
        node.hiddenFields.length > 0 ? new Set(node.hiddenFields) : undefined
      for (const field of node.fields) {
        if (hiddenFields?.has(field.name)) continue
        const resolvedTarget = resolveFieldTarget(field.target, targetResolver)
        if (
          isSelectionTargetHighlighted(
            field.target,
            resolvedTarget,
            displaySelectedSet,
            highlightSelection,
          )
        ) {
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
    const isSelected = displaySelectedSet.has(node.id)
    const isDimmed = similarActive
      ? !similar.ids.has(node.id)
      : effectiveDimming &&
        displaySelected.length > 0 &&
        !highlightedSet.has(node.id)
    const isGrayedOut = markUnreachableEntries && !node.isReachable
    const isOverlapping = overlappingIds.has(node.id)
    const isSimilar = similar.ids.has(node.id)
    const colorOverride =
      isSimilar && !isSelected ? similar.colorOverride : undefined

    const hiddenFieldsSet =
      node.hiddenFields.length > 0 ? new Set(node.hiddenFields) : undefined

    let fieldHighlightedMask = ''
    let fieldTargetHiddenMask = ''

    for (let i = 0; i < node.fields.length; i++) {
      const field = node.fields[i]
      if (!field) continue

      const resolvedTarget = resolveFieldTarget(field.target, targetResolver)
      const targetSelected = isSelectionTargetHighlighted(
        field.target,
        resolvedTarget,
        displaySelectedSet,
        highlightSelection,
      )
      const targetNode = visibleById.get(resolvedTarget)
      const targetHidden = targetNode === undefined
      fieldHighlightedMask += targetSelected ? '1' : '0'
      fieldTargetHiddenMask += targetHidden ? '1' : '0'

      const fieldHidden = hiddenFieldsSet?.has(field.name) ?? false
      if (fieldHidden || targetHidden) continue

      const connection = getResolvedFieldConnection(
        node,
        field,
        i,
        visibleById,
        targetResolver,
      )
      if (!connection) continue

      const isDashed =
        targetNode.addressType === 'EOA' ||
        targetNode.addressType === 'EOAPermissioned'
      const isHighlighted = isSelected || targetSelected
      const isConnDimmed =
        effectiveDimming && displaySelected.length > 0 && !isHighlighted
      const isConnGrayedOut =
        markUnreachableEntries && !(node.isReachable && targetNode.isReachable)

      const from = connection.from
      const to = connection.to
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
      isOverlapping,
      isSimilar,
      colorOverride,
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

  return { visible, connections, flags, bounds }
}
