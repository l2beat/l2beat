import type { BlockWithChain } from '@/types'

export function BlockDetails({ block }: { block: BlockWithChain }) {
  const userOps = block.transactions.reduce((sum, current) => {
    return sum + current.operationsCount
  }, 0)

  return (
    <div className="mt-10 mr-10 ml-10 block rounded-lg border border-gray-200 bg-white p-6 shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
      <h5 className="mb-2 font-bold text-2xl text-gray-900 tracking-tight dark:text-white">
        Block details
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        Number:
        <a
          className="font-medium text-blue-600 hover:underline dark:text-blue-500"
          href={block.chain.getBlockLink(block.number)}
          target="_blank"
          rel="noreferrer"
        >
          {block.number}
        </a>
      </p>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        Hash: {block.hash}
      </p>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        Timestamp: {new Date(block.timestamp * 1000).toLocaleString()}
      </p>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        Status: {block.status}
      </p>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        Transactions:
        <span className="pl-1 dark:text-gray-100">
          {block.transactions.length}
        </span>
      </p>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        User operations:
        <span className="pl-1 dark:text-gray-100">{userOps}</span>
      </p>
    </div>
  )
}
