import type { Chain } from '@/chains'
import type { CountedTransaction } from '@/types'
import { BatchIcon } from './icons/batchIcon'
import { UnknownIcon } from './icons/unknownIcon'
import { TransactionDetails } from './transactionDetails'

export function TransactionList({
  txs,
  chain,
}: {
  txs: CountedTransaction[]
  chain: Chain
}) {
  function sortTransactions(
    a: CountedTransaction,
    b: CountedTransaction,
  ): number {
    if (a.operationsCount !== b.operationsCount) {
      // sort by operations count
      return b.operationsCount - a.operationsCount
    }

    if (a.details !== b.details) {
      return a.details ? -1 : 1
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

    if (a.type.startsWith('ERC') || a.type.startsWith('EIP-712')) {
      return -1
    }

    if (b.type.startsWith('ERC') || b.type.startsWith('EIP-712')) {
      return 1
    }

    return a.type.localeCompare(b.type)
  }

  return (
    <div className="m-3 overflow-x-auto rounded-lg md:m-10">
      <table className="min-w-full text-left text-gray-500 text-sm rtl:text-right dark:text-gray-400">
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
              <td className="inline-flex items-center px-6 py-4">
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
