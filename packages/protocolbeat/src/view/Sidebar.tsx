import { Node } from '../store/State'
import { useStore } from '../store/store'

export function Sidebar() {
  const multipleSelection = useStore((state) => state.selected.length > 1)
  const selected = useStore((state) =>
    state.nodes.find((x) => state.selected[0] === x.id),
  )
  if (!selected || multipleSelection) {
    return null
  }

  return <SidebarForSingleNode node={selected} />
}

function SidebarForSingleNode({ node }: { node: Node }) {
  const address = node.meta.address
  const etherscanLink = `https://etherscan.io/address/${address}`
  const sourceLink =
    node.meta.type === 'Contract'
      ? `https://vscode.blockscan.com/ethereum/${address}`
      : undefined

  return (
    <div className="flex w-[400px] flex-col gap-2 overflow-y-auto bg-white p-2 drop-shadow-xl">
      <h2 className="font-bold text-xl">{node.name}</h2>
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
        <code>{JSON.stringify(node.meta.data, null, 2)}</code>
      </pre>
    </div>
  )
}
