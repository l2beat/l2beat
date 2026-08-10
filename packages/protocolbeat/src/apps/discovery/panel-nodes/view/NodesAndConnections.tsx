import clsx from 'clsx'
import { useMemo } from 'react'
import { AddressIcon } from '../../../../components/AddressIcon'
import { useGlobalSettingsStore } from '../../store/global-settings-store'
import type { Node } from '../store/State'
import { useStore } from '../store/store'
import {
  buildRenderGraph,
  isFieldConnectionLive,
} from '../store/utils/renderGraph'
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
  const selected = useStore((s) => s.selected)
  const enableDimming = useStore(
    ({ userPreferences }) => userPreferences.enableDimming,
  )
  const highlightOverlapping = useStore(
    ({ userPreferences }) => userPreferences.highlightOverlapping !== false,
  )
  const markUnreachableEntries = useGlobalSettingsStore(
    (s) => s.markUnreachableEntries,
  )

  const graph = useMemo(() => buildRenderGraph(nodes), [nodes])

  const view = useMemo<DerivedView>(
    () =>
      buildView(
        graph.nodes,
        graph.hidden,
        graph.liveGroupTargets,
        selected,
        enableDimming,
        highlightOverlapping,
        markUnreachableEntries,
      ),
    [
      graph,
      selected,
      enableDimming,
      highlightOverlapping,
      markUnreachableEntries,
    ],
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
      {graph.containers.map((container) => {
        const isSelected = selected.includes(container.id)
        return (
          <div
            key={container.id}
            className={clsx(
              'pointer-events-none absolute rounded-xl border-2 border-coffee-200/60 border-dashed bg-coffee-200/5',
              isSelected && 'outline outline-4 outline-autumn-300',
            )}
            style={{
              left: container.box.x,
              top: container.box.y,
              width: container.box.width,
              height: container.box.height,
            }}
          >
            <div
              className="absolute top-0 right-0 left-0 flex items-center gap-1 rounded-t-lg bg-coffee-600 px-2 font-medium text-coffee-200 text-xs"
              style={{ height: container.headerBox.height }}
            >
              <AddressIcon type="Group" />
              <span className="truncate">{container.name}</span>
            </div>
          </div>
        )
      })}
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

function buildView(
  nodes: readonly Node[],
  hidden: ReadonlySet<string>,
  liveGroupTargets: ReadonlyMap<string, ReadonlySet<string>>,
  selected: readonly string[],
  enableDimming: boolean,
  highlightOverlapping: boolean,
  markUnreachableEntries: boolean,
): DerivedView {
  const hiddenSet = hidden
  const selectedSet = new Set(selected)
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

  // Highlight set: selected nodes plus, when dimming is on, every node either
  // pointed-at by a selected node or pointing at a selected node through a
  // non-hidden field.
  const highlightedSet = new Set<string>(selectedSet)
  if (enableDimming && selected.length > 0) {
    for (const node of visible) {
      if (!selectedSet.has(node.id)) continue
      for (const field of node.fields) {
        if (!isFieldConnectionLive(node, field, liveGroupTargets)) continue
        if (hiddenSet.has(field.target)) continue
        highlightedSet.add(field.target)
      }
    }
    for (const node of visible) {
      if (highlightedSet.has(node.id)) continue
      for (const field of node.fields) {
        if (!isFieldConnectionLive(node, field, liveGroupTargets)) continue
        if (hiddenSet.has(field.target)) continue
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
    const isOverlapping = overlappingIds.has(node.id)

    let fieldHighlightedMask = ''
    let fieldTargetHiddenMask = ''

    for (let i = 0; i < node.fields.length; i++) {
      const field = node.fields[i]
      if (!field) continue

      const targetSelected = selectedSet.has(field.target)
      const targetHidden = hiddenSet.has(field.target)
      fieldHighlightedMask += targetSelected ? '1' : '0'
      fieldTargetHiddenMask += targetHidden ? '1' : '0'

      if (!isFieldConnectionLive(node, field, liveGroupTargets) || targetHidden)
        continue

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
      isOverlapping,
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
