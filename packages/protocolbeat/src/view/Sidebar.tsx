import type { SimpleNode } from '../api/SimpleNode'
import { OklchColor } from '../utils/color'
import { ColorPicker } from './ColorPicker'

interface SidebarProps {
  selectedNodes: SimpleNode[]
  onDeleteNodes: (ids: string[]) => void
  onHideNodes: (ids: string[]) => void
  onColorChange: (ids: string[], color: OklchColor) => void
}

export function Sidebar({
  selectedNodes,
  onDeleteNodes,
  onHideNodes,
  onColorChange,
}: SidebarProps) {
  const selectedNode = selectedNodes[0]
  if (!selectedNode) {
    return <div>Click a contract to select it.</div>
  }

  if (selectedNodes.length === 1) {
    return (
      <SidebarForSingleNode
        node={selectedNode}
        onDeleteNodes={onDeleteNodes}
        onHideNodes={onHideNodes}
        onColorChange={onColorChange}
      />
    )
  }

  return (
    <SidebarForMultipleNodes
      selectedNodes={selectedNodes}
      onDeleteNodes={onDeleteNodes}
      onHideNodes={onHideNodes}
      onColorChange={onColorChange}
    />
  )
}

function SidebarForSingleNode({
  node,
  onDeleteNodes,
  onHideNodes,
  onColorChange,
}: {
  node: SimpleNode
  onDeleteNodes: SidebarProps['onDeleteNodes']
  onHideNodes: SidebarProps['onHideNodes']
  onColorChange: SidebarProps['onColorChange']
}) {
  if (node.type === 'Unknown') {
    return (
      <>
        <div>Click on the "🔍" to discover</div>{' '}
        <p className="flex gap-2">
          <button
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            type="button"
            onClick={() => onDeleteNodes([node.id])}
          >
            Delete
          </button>
          <button
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            type="button"
            onClick={() => onHideNodes([node.id])}
          >
            Hide
          </button>
        </p>
      </>
    )
  }

  const humanReadableName = node.type === 'Contract' ? node.name : node.type
  const etherscanLink = `https://etherscan.io/address/${node.data.address.toString()}`
  const sourceLink =
    node.type === 'Contract'
      ? `https://vscode.blockscan.com/ethereum/${node.data.address.toString()}`
      : undefined

  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-bold text-xl">{humanReadableName}</h2>
      <p className="text-gray-500 text-sm">
        <a
          href={etherscanLink}
          target="_blank"
          title="Etherscan"
          rel="noreferrer"
        >
          {node.data.address}
        </a>{' '}
        {sourceLink ? (
          <a
            href={sourceLink}
            className="font-bold"
            target="_blank"
            title="DethCode"
            rel="noreferrer"
          >
            📜
          </a>
        ) : null}
      </p>

      <p className="text-gray-500">Details:</p>
      <pre className="overflow-auto text-sm">
        <code>{JSON.stringify(node.data, null, 2)}</code>
      </pre>

      <p className="flex gap-2">
        <button
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          type="button"
          onClick={() => onDeleteNodes([node.id])}
        >
          Delete
        </button>
        <button
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          type="button"
          onClick={() => onHideNodes([node.id])}
        >
          Hide
        </button>

        {node.proxyType === 'gnosis safe' && (
          <button
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            type="button"
            onClick={() => {
              const members = node.fields
                .filter((f) => f.name.startsWith('$members'))
                .map((f) => f.connection)
                .filter((c) => c !== undefined)

              onDeleteNodes(members)
            }}
          >
            Delete members
          </button>
        )}
      </p>

      <hr />

      <ColorPicker ids={[node.id]} onColorChange={onColorChange} />
    </div>
  )
}

function SidebarForMultipleNodes({
  selectedNodes,
  onDeleteNodes,
  onHideNodes,
  onColorChange,
}: SidebarProps) {
  const ids = selectedNodes.map((n) => n.id)
  return (
    <div className="flex flex-col gap-2">
      Selected <span className="font-bold">{selectedNodes.length}</span> nodes
      <p className="flex gap-2">
        <button
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          type="button"
          onClick={() => onDeleteNodes(ids)}
        >
          Delete all
        </button>
        <button
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          type="button"
          onClick={() => onHideNodes(ids)}
        >
          Hide all
        </button>
      </p>
      <hr />
      <ColorPicker ids={ids} onColorChange={onColorChange} />
    </div>
  )
}
