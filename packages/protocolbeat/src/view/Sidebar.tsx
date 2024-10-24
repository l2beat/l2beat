import type { SimpleNode } from '../api/SimpleNode'
import { useStore } from '../store/store'

export function Sidebar() {
  const multiple = useStore((state) => state.selectedNodeIds.length > 1)
  const selected = useStore(
    (state) =>
      state.nodes.find((x) => state.selectedNodeIds[0] === x.simpleNode.id)
        ?.simpleNode,
  )
  if (!selected || multiple) {
    return null
  }

  return <SidebarForSingleNode node={selected} />
}

function SidebarForSingleNode({ node }: { node: SimpleNode }) {
  const address =
    node.type === 'Unknown'
      ? (node.id.split(':')[1] as string)
      : node.data.address
  const humanReadableName = node.type === 'Contract' ? node.name : node.type
  const etherscanLink = `https://etherscan.io/address/${address}`
  const sourceLink =
    node.type === 'Contract'
      ? `https://vscode.blockscan.com/ethereum/${address}`
      : undefined

  return (
    <div className="row-span-2 overflow-y-auto bg-white p-2 drop-shadow-xl">
      <div className="flex flex-col gap-2">
        <h2 className="font-bold text-xl">{humanReadableName}</h2>
        <p className="text-gray-500 text-sm">
          <a
            href={etherscanLink}
            target="_blank"
            title="Etherscan"
            rel="noreferrer"
          >
            {address}
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
          <code>
            {JSON.stringify(
              node.type !== 'Unknown' ? node.data : null,
              null,
              2,
            )}
          </code>
        </pre>
      </div>
    </div>
  )
}
