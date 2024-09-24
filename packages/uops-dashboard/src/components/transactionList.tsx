import type { CountedOperation, Operation, Transaction } from '@/types'
import { TransactionDetails } from './transactionDetails'
import type { Chain } from '@/chains'
import { BatchIcon } from './icons/batchIcon'
import { UnknownIcon } from './icons/unknownIcon'

export function TransactionList({
  txs,
  chain,
}: { txs: Transaction[]; chain: Chain }) {
  function sortTransactions(a: Transaction, b: Transaction): number {
    if (a.operationsCount !== b.operationsCount) {
      // sort by operations count
      return b.operationsCount - a.operationsCount
    }

    // sort by type
    if (a.type === b.type) {
      return 0
    }

    if (a.type === 'unknown') {
      return 1
    }

    if (b.type === 'unknown') {
      return -1
    }

    return a.type.localeCompare(b.type)
  }

  return (
    <div className="m-10">
      <table className="w-full text-left text-gray-500 text-sm rtl:text-right dark:text-gray-400">
        <thead className="bg-gray-50 text-gray-700 text-xs uppercase dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Transaction hash
            </th>
            <th scope="col" className="px-6 py-3">
              Type
            </th>
            <th scope="col" className="px-6 py-3">
              User operations
            </th>
          </tr>
        </thead>
        <tbody>
          {txs.sort(sortTransactions).map((tx) => (
            <tr
              key={tx.hash}
              className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <th
                scope="row"
                className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
              >
                {tx.hash}
              </th>
              <td className="px-6 py-4">
                {tx.type}
                {tx.includesBatch && (
                  <BatchIcon tooltipContent="Transaction contains batch execution" />
                )}
                {tx.includesUnknown && (
                  <UnknownIcon tooltipContent="Transaction contains unknown Smart Account implementation" />
                )}
              </td>
              <td className="px-6 py-4">
                {tx.operationsCount}
                {tx.details && <TransactionDetails tx={tx} chain={chain} />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}