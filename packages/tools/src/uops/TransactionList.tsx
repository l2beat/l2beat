import { Fragment, useState } from 'react'
import type * as API from './api'
import { ExplorerLink, Flags } from './common'
import { compareTransactions } from './compareTransactions'

export function TransactionList(props: {
  transactions: API.CountedTransaction[]
  chain: API.UopsChainInfo | undefined
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const transactions = [...props.transactions].sort(compareTransactions)

  function toggle(hash: string) {
    setExpanded((previous) => {
      const next = new Set(previous)
      if (next.has(hash)) {
        next.delete(hash)
      } else {
        next.add(hash)
      }
      return next
    })
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full font-mono text-sm">
        <thead className="text-left text-zinc-500">
          <tr className="border-zinc-800 border-b">
            <th className="py-1 pr-6 font-normal">Transaction</th>
            <th className="py-1 pr-6 font-normal">Type</th>
            <th className="py-1 font-normal">User operations</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <Fragment key={tx.hash}>
              <tr className="border-zinc-900 border-b align-top">
                <td className="py-1 pr-6">
                  <ExplorerLink chain={props.chain} path={`tx/${tx.hash}`}>
                    {tx.hash}
                  </ExplorerLink>
                </td>
                <td className="whitespace-nowrap py-1 pr-6">
                  {tx.type}
                  <Flags
                    subject="Transaction"
                    includesBatch={tx.includesBatch}
                    includesUnknown={tx.includesUnknown}
                  />
                </td>
                <td className="whitespace-nowrap py-1">
                  {tx.operationsCount}
                  {tx.details && (
                    <button
                      type="button"
                      className="ml-2 text-zinc-500 hover:text-zinc-300"
                      onClick={() => toggle(tx.hash)}
                    >
                      {expanded.has(tx.hash) ? '[-]' : '[+]'}
                    </button>
                  )}
                </td>
              </tr>
              {tx.details && expanded.has(tx.hash) && (
                <tr className="border-zinc-900 border-b">
                  <td colSpan={3} className="bg-zinc-900 px-4 py-2">
                    <OperationTree root={tx.details} chain={props.chain} />
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function OperationTree(props: {
  root: API.CountedOperation
  chain: API.UopsChainInfo | undefined
}) {
  return (
    <ol>
      {flattenOperations(props.root).map((operation) => (
        <li key={operation.id} style={{ paddingLeft: `${operation.level}rem` }}>
          {operation.contractAddress && (
            <>
              <ExplorerLink
                chain={props.chain}
                path={`address/${operation.contractAddress}`}
              >
                {operation.contractName ?? operation.contractAddress}
              </ExplorerLink>
              <span className="text-zinc-300">.</span>
            </>
          )}
          <span className="text-orange-400">
            {operation.methodName ?? operation.methodSelector}
          </span>
          <span className="text-zinc-500"> ({operation.count})</span>
        </li>
      ))}
    </ol>
  )
}

function flattenOperations(root: API.CountedOperation): API.CountedOperation[] {
  const result: API.CountedOperation[] = []
  const stack = [root]
  for (let operation = stack.pop(); operation; operation = stack.pop()) {
    result.push(operation)
    stack.push(...[...operation.children].reverse())
  }
  return result
}
