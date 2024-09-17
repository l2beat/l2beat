import type { Node } from '../store/State'
import { useStore } from '../store/store'
import type { NodeLocations } from '../store/utils/storageParsing'

export function AutoLayoutButton() {
  const nodes = useStore((state) => state.nodes)
  const updateNodeLocations = useStore((state) => state.updateNodeLocations)

  function handleAutoLayout() {
    updateNodeLocations(autoLayout(nodes))
  }

  return (
    <button
      className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      type="button"
      onClick={handleAutoLayout}
    >
      Auto-layout
    </button>
  )
}

function autoLayout(baseNodes: readonly Node[]) {
  interface Connected {
    id: string
    connectionsIn: Connected[]
    connectionsOut: Connected[]
    base: Node
    column: number | undefined
  }

  let nodes = baseNodes.map((base): Connected => {
    return {
      id: base.simpleNode.id,
      connectionsIn: [],
      connectionsOut: [],
      base,
      column: undefined,
    }
  })
  const byId = new Map(nodes.map((x) => [x.id, x]))

  for (const node of nodes) {
    for (const field of node.base.fields) {
      const id = field.connection?.nodeId
      const other = id && byId.get(id)
      if (other && other !== node) {
        node.connectionsOut.push(other)
        other.connectionsIn.push(node)
      }
    }
  }

  for (const node of nodes) {
    if (
      node.connectionsIn.length === 1 &&
      node.connectionsOut.length > 1 &&
      node.connectionsIn.every((x) => node.connectionsOut.includes(x))
    ) {
      // This node is a child that knows about it's parent. Common pattern,
      // but we remove the sole connection to parent to simplify the logic
      node.connectionsIn = []
    }
  }

  const columns: Connected[][] = []

  while (nodes.length !== 0) {
    const full: Connected[] = []
    const reflected: Connected[] = []

    for (const node of nodes) {
      if (node.connectionsIn.every((n) => n.column !== undefined)) {
        full.push(node)
      } else if (
        node.connectionsIn.every(
          (n) => n.column !== undefined || node.connectionsOut.includes(n),
        )
      ) {
        reflected.push(node)
      }
    }

    const column = full.length > 0 ? full : reflected
    for (const node of column) {
      node.column = columns.length
    }
    nodes = nodes.filter((x) => x.column === undefined)
    columns.push(column)
  }

  const order: string[] = columns[0]?.map((x) => x.id) ?? []
  for (const column of columns) {
    for (const node of column) {
      const index = order.indexOf(node.id)
      const uniqueChildren = node.connectionsOut
        .map((x) => x.id)
        .filter((id) => order.indexOf(id) === -1)
      order.splice(index, 0, ...uniqueChildren)
    }
  }

  for (const column of columns) {
    column.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
  }

  const X_SPACING = 200
  const Y_SPACING = 50

  const nodeLocations: NodeLocations = {}
  let xOffset = 0
  for (const column of columns) {
    let yOffset = 0
    let maxWidth = 0

    for (const node of column) {
      nodeLocations[node.id] = {
        x: xOffset,
        y: yOffset,
      }

      yOffset += node.base.box.height + Y_SPACING
      maxWidth = Math.max(node.base.box.width, maxWidth)
    }

    xOffset += maxWidth + X_SPACING
  }

  return nodeLocations
}
