import { SimpleNode } from '../api/SimpleNode'

interface SidebarProps {
  selectedNodes: SimpleNode[]
  onDeleteNodes: (ids: string[]) => void
}

export function Sidebar({ selectedNodes, onDeleteNodes }: SidebarProps) {
  const selectedNode = selectedNodes[0]
  if (!selectedNode) {
    return <div>Click a contract to select it.</div>
  }

  if (selectedNodes.length === 1) {
    return (
      <SidebarForSingleNode node={selectedNode} onDeleteNodes={onDeleteNodes} />
    )
  }

  return (
    <SidebarForMultipleNodes
      selectedNodes={selectedNodes}
      onDeleteNodes={onDeleteNodes}
    />
  )
}

function SidebarForSingleNode({
  node,
  onDeleteNodes,
}: {
  node: SimpleNode
  onDeleteNodes: SidebarProps['onDeleteNodes']
}) {
  if (node.type === 'Unknown') {
    return (
      <>
        <div>Click on the "🔍" to discover</div>{' '}
        <p>
          <button
            className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
            type="button"
            onClick={() => onDeleteNodes([node.id])}
          >
            Delete
          </button>
        </p>
      </>
    )
  }

  const humanReadableName = node.type === 'Contract' ? node.name : node.type
  const etherscanLink = `https://etherscan.io/address/${node.data.address}`
  const sourceLink = node.type === 'Contract' ? node.data.code : undefined

  return (
    <>
      <h2 className="text-xl font-bold">{humanReadableName}</h2>
      <p className="text-sm text-gray-500">
        <a href={etherscanLink} target="_blank" title="Etherscan">
          {node.data.address}
        </a>{' '}
        {sourceLink ? (
          <a
            href={sourceLink}
            className="font-bold"
            target="_blank"
            title="DethCode"
          >
            📜
          </a>
        ) : null}
      </p>

      <p className="text-gray-500">Details:</p>
      <pre className="overflow-auto text-sm">
        <code>{JSON.stringify(node.data, null, 2)}</code>
      </pre>

      <p>
        <button
          className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
          type="button"
          onClick={() => onDeleteNodes([node.id])}
        >
          Delete
        </button>
      </p>
    </>
  )
}

function SidebarForMultipleNodes({
  selectedNodes,
  onDeleteNodes: onDeleteNode,
}: SidebarProps) {
  return (
    <>
      Selected <span className="font-bold">{selectedNodes.length}</span> nodes
      <p>
        <button
          className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
          type="button"
          onClick={() => onDeleteNode(selectedNodes.map((n) => n.id))}
        >
          Delete all
        </button>
      </p>
    </>
  )
}
