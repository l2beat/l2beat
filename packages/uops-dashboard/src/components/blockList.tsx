import type { Chain } from '@/chains'
import type { BlockRatio } from '@/types'
import { BatchIcon } from './icons/batchIcon'
import { UnknownIcon } from './icons/unknownIcon'

export function BlockList({
  blocks,
  chain,
}: {
  blocks: BlockRatio[]
  chain: Chain
}) {
  const getBlockLink = (blockNumber: number) => {
    return `${window.location.origin}/?chain=${chain.id}&block=${blockNumber}`
  }

  return (
    <div className="m-10">
      <table className="w-full text-left text-gray-500 text-sm rtl:text-right dark:text-gray-400">
        <thead className="bg-gray-50 text-gray-700 text-xs uppercase dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Block number
            </th>
            <th scope="col" className="px-6 py-3">
              Ratio
            </th>
          </tr>
        </thead>
        <tbody>
          {blocks.map((block) => (
            <tr
              key={block.number}
              className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <th
                scope="row"
                className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
              >
                <a
                  className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  href={getBlockLink(block.number)}
                  target="_blank"
                  rel="noreferrer"
                >
                  {block.number}
                </a>
              </th>
              {(block.includesBatch || block.includesUnknown) && (
                <td className="inline-flex items-center px-6 py-2">
                  {block.ratio.toFixed(4)}
                  {block.includesBatch && (
                    <BatchIcon tooltipContent="Block contains batch execution" />
                  )}
                  {block.includesUnknown && (
                    <UnknownIcon tooltipContent="Block contains unknown Smart Account implementation" />
                  )}
                </td>
              )}
              {!block.includesBatch && !block.includesUnknown && (
                <>
                  <td className="px-6 py-4">{block.ratio.toFixed(4)}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
