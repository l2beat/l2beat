import Head from 'next/head'
import { useState } from 'react'
import { BlockDetails } from '@/components/blockDetails'
import { TransactionList } from '@/components/transactionList'
import type { BlockWithChain } from '@/types'
import { BlockForm } from '../components/blockForm'

export default function HomePage() {
  const [block, setBlock] = useState<BlockWithChain>()

  const handleSetTransactions = (block: BlockWithChain | undefined) => {
    setBlock(block)
  }

  return (
    <>
      <Head>
        <title>
          {block
            ? `${block?.chain.name} - ${block?.number}`
            : 'UOPS Explorer - L2BEAT'}
        </title>
      </Head>
      <main>
        <h1 className="mt-4 mb-4 text-center font-extrabold text-4xl text-gray-900 leading-none tracking-tight md:text-5xl lg:text-6xl dark:text-white">
          Block details
        </h1>
        <p className="2xlpx-48 mb-6 px-2 text-center font-normal text-gray-500 text-lg sm:px-16 lg:text-xl dark:text-gray-400">
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
      </main>
    </>
  )
}
