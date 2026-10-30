import { useEffect, useMemo, useRef, useState } from 'react'
import type { Node } from '../panel-nodes/store/State'
import { useStore as useNodeStore } from '../panel-nodes/store/store'
import { HEADER_HEIGHT } from '../panel-nodes/store/utils/constants'
import { processConnection } from '../panel-nodes/store/utils/updateNodePositions'
import {
  buildDrawData,
  type ConnectionHop,
  GraphCanvas,
} from '../panel-nodes/view/NodesAndConnectionsWebGL'
import { usePanelStore } from '../store/panel-store'
import { edgeKey, resolvePathEdges } from './pathEdges'
import { fitScale, layoutAgentPaths } from './pathLayout'
import { type AgentFocus, fitGraphTo, useAgentStore } from './store'
import { useGraphLinks } from './useGraphLinks'

export function AgentPathView(props: { focus: AgentFocus }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewport = useElementSize(containerRef)
  const nodes = useNodeStore((state) => state.nodes)
  const selected = usePanelStore((state) => state.selected)

  const { paths } = props.focus.step
  const loose =
    props.focus.step.nodes.length > 0 || paths.length > 0
      ? props.focus.step.nodes
      : [...props.focus.nodes]
  const links = useGraphLinks()
  const edges = useMemo(() => resolvePathEdges(paths, links), [paths, links])
  const layout = useMemo(() => {
    const lanes = loose.length > 0 ? [...paths, loose] : paths
    const looseIds = new Set(loose)
    const shown = props.focus.nodes
    // Contracts shown on their own have no path, so every link between shown
    // contracts is part of the answer.
    const keep = (from: string, to: string) =>
      edges.has(edgeKey(from, to)) || (looseIds.has(from) && shown.has(to))
    return layoutAgentPaths(lanes, indexNodes(nodes), keep, viewport)
  }, [props.focus, paths, loose, edges, nodes, viewport])

  const data = useMemo(() => {
    const placedIds = new Set(layout.nodes.map((node) => node.id))
    return buildDrawData({
      nodes: layout.nodes,
      containers: [],
      hidden: unplacedTargets(layout.nodes, placedIds),
      liveGroupTargets: new Map(),
      selected,
      enableDimming: false,
      highlightOverlapping: false,
      markUnreachableEntries: false,
      agent: {
        nodes: placedIds,
        isOnPath: (from, to) => edges.has(edgeKey(from, to)),
      },
      hops: linklessHops(paths, layout.nodes, links),
    })
  }, [layout, selected, edges, paths, links])

  const scale = fitScale(layout, viewport)
  const transform = {
    offsetX: Math.max(0, (viewport.width - layout.width * scale) / 2),
    offsetY: Math.max(0, (viewport.height - layout.height * scale) / 2),
    scale,
  }

  return (
    <div ref={containerRef} className="relative min-h-0 flex-1 overflow-hidden">
      <GraphCanvas data={data} getTransform={() => transform} />
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{
          transform: `translate(${transform.offsetX}px, ${transform.offsetY}px) scale(${scale})`,
          width: layout.width,
          height: layout.height,
        }}
      >
        {layout.nodes.map((node) => (
          <PathNodeTarget key={node.id} node={node} />
        ))}
      </div>
      {layout.nodes.length === 0 && (
        <div className="flex h-full items-center justify-center text-coffee-400 text-sm">
          The contracts the agent points at are not in this graph
        </div>
      )}
    </div>
  )
}

function PathNodeTarget(props: { node: Node }) {
  const { node } = props
  const select = () => usePanelStore.getState().select([node.id])
  const openInGraph = () => {
    select()
    fitGraphTo(new Set([node.id]))
    useAgentStore.getState().setView('graph')
  }
  return (
    <button
      type="button"
      aria-label={`Select ${node.name}`}
      title="Click to select, double click to find it in the full graph"
      className="absolute cursor-pointer"
      style={{
        left: node.box.x,
        top: node.box.y,
        width: node.box.width,
        height: node.box.height,
      }}
      onClick={select}
      onDoubleClick={openInGraph}
    />
  )
}

// A field pointing at a contract the answer does not place draws no dot and
// no line.
function unplacedTargets(
  placed: readonly Node[],
  placedIds: ReadonlySet<string>,
): Set<string> {
  const targets = new Set<string>()
  for (const node of placed) {
    for (const field of node.fields) {
      if (!placedIds.has(field.target)) {
        targets.add(field.target)
      }
    }
  }
  return targets
}

// A hop with no field either way, like a message between chains, still reads
// as part of the path: a dashed line between the two headers.
function linklessHops(
  paths: readonly (readonly string[])[],
  placed: readonly Node[],
  links: ReadonlySet<string>,
): ConnectionHop[] {
  const boxById = new Map(placed.map((node) => [node.id, node.box]))
  const result: ConnectionHop[] = []
  for (const path of paths) {
    for (const [i, from] of path.entries()) {
      const to = path[i + 1]
      const fromBox = boxById.get(from)
      const toBox = to === undefined ? undefined : boxById.get(to)
      if (to === undefined || fromBox === undefined || toBox === undefined) {
        continue
      }
      if (links.has(edgeKey(from, to)) || links.has(edgeKey(to, from))) {
        continue
      }
      const { from: start, to: end } = processConnection(0, toBox, fromBox)
      result.push({
        from: { ...start, y: toBox.y + HEADER_HEIGHT / 2 },
        to: end,
      })
    }
  }
  return result
}

// Members of closed groups are subnodes, and the agent may point at any of
// them, so the index covers the whole tree.
function indexNodes(nodes: readonly Node[]): Map<string, Node> {
  const byId = new Map<string, Node>()
  const stack = [...nodes]
  for (let node = stack.pop(); node !== undefined; node = stack.pop()) {
    byId.set(node.id, node)
    stack.push(...node.subnodes)
  }
  return byId
}

function useElementSize(ref: React.RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 })
  useEffect(() => {
    const element = ref.current
    if (element === null) {
      return
    }
    const observer = new ResizeObserver(([entry]) => {
      if (entry !== undefined) {
        const { width, height } = entry.contentRect
        setSize({ width, height })
      }
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])
  return size
}
