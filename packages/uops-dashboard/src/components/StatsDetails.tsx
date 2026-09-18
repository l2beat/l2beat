import type { Stats } from '@/types'

export function StatsDetails({ stats }: { stats: Stats }) {
  return (
    <div className="mt-10 mr-10 ml-10 block rounded-lg border border-gray-200 bg-white p-6 shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
      <h5 className="mb-2 font-bold text-2xl text-gray-900 tracking-tight dark:text-white">
        Blocks from {stats.startBlock} to {stats.endBlock}
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        {stats.dateStart.toString()} - {stats.dateEnd.toString()}
      </p>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        Blocks: {stats.numberOfBlocks}
      </p>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        Transactions: {stats.numberOfTransactions}
      </p>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        Operations: {stats.numberOfOperations}
      </p>
      <p className="font-bold text-gray-700 dark:text-gray-400">
        Ratio: x
        {(stats.numberOfOperations / stats.numberOfTransactions).toFixed(4)}
      </p>
    </div>
  )
}
