import { SimpleNode } from '../api/SimpleNode'

interface SidebarProps {
  node?: SimpleNode
}

export function Sidebar({ node }: SidebarProps) {
  if (node === undefined) {
    return <div>Click a contract to select it.</div>
  }

  if (node.type === 'Unknown') {
    return <div>Click on the "🔍" to discover</div>
  }

  const humanReadableName = node.type === 'Contract' ? node.name : node.type
  const etherscanLink = `https://etherscan.io/address/${node.data.address}`
  const sourceLink = node.type === 'Contract' ? node.data.code : undefined

  return (
    <>
      <h2 className="text-xl font-bold">{humanReadableName}</h2>
      <p className="text-sm text-gray-500">
        <a href={etherscanLink} target="_blank">
          {node.data.address}
        </a>{' '}
        {sourceLink ? (
          <a href={sourceLink} className="font-bold" target="_blank">
            📜
          </a>
        ) : null}
      </p>

      <p className="text-gray-500">Details:</p>
      <pre className="h-full overflow-auto text-sm">
        <code>{JSON.stringify(node.data, null, 2)}</code>
      </pre>
    </>
  )
}
