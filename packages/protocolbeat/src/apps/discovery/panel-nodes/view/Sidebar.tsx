import type { Node } from '../store/State'
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
  const etherscanLink = `https://etherscan.io/address/${node.address}`
  const sourceLink = `https://vscode.blockscan.com/ethereum/${node.address}`

  return (
    <div className="flex w-[400px] flex-col gap-2 overflow-y-auto border-coffee-600 border-l bg-black p-2 drop-shadow-xl">
      <h2 className="font-bold text-xl">{node.name}</h2>
      <p className="text-coffee-400 text-sm">
        <a
          href={etherscanLink}
          target="_blank"
          title="Etherscan"
          rel="noreferrer"
        >
          {node.address}
        </a>{' '}
        {sourceLink ? (
          <a
            href={sourceLink}
            className="font-bold"
            target="_blank"
            title="Source Code"
            rel="noreferrer"
          >
            📜
          </a>
        ) : null}
      </p>

      <p className="text-coffee-400">Details:</p>
      <pre className="overflow-auto text-sm">
        <code>{JSON.stringify(node.data, null, 2)}</code>
      </pre>
    </div>
  )
}
