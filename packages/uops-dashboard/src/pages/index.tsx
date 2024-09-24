import { BlockDetails } from '@/components/blockDetails'
import { TransactionList } from '@/components/transactionList'
import type { BlockWithChain } from '@/types'
import { Flowbite } from 'flowbite-react'
import { useState } from 'react'
import { BlockForm } from '../components/blockForm'

export default function HomePage() {
  const [block, setBlock] = useState<BlockWithChain>()

  const handleSetTransactions = (block: BlockWithChain | undefined) => {
    setBlock(block)
  }

  return (
    <main>
      <Flowbite theme={{ mode: 'dark' }}>
        <h1 className="mb-4 mt-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white text-center">
          User Operations
        </h1>
        <p className="mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400 text-center">
          Select the chain and provide the block number and the tool will
          compare overall number of transactions to user operations. By clicking
          the magnifier icon you can get the latest block number.
        </p>
        <BlockForm onComplete={handleSetTransactions} />
        {block && (
          <>
            <BlockDetails block={block} />
            <TransactionList txs={block.transactions} chain={block.chain} />
          </>
        )}
      </Flowbite>
    </main>
  )
}
