import Head from 'next/head'
import { useState } from 'react'
import { BlockList } from '@/components/blockList'
import { SmartAccountList } from '@/components/smartAccountList'
import { StatsDetails } from '@/components/statsDetails'
import { StatsForm } from '@/components/statsForm'
import type { StatsWithChain } from '@/types'
import { rankBlocks } from '../../utils/rankBlocks'

export default function StatsPage() {
  const [stats, setStats] = useState<StatsWithChain>()

  const concatSmartAccountUsage = (
    usage1: { signature: string; count: number }[],
    usage2: { signature: string; count: number }[],
  ) => {
    const usageMap = new Map<string, number>()
    usage1.forEach(({ signature, count }) => {
      usageMap.set(signature, (usageMap.get(signature) || 0) + count)
    })
    usage2.forEach(({ signature, count }) => {
      usageMap.set(signature, (usageMap.get(signature) || 0) + count)
    })
    return Array.from(usageMap.entries()).map(([signature, count]) => ({
      signature,
      count,
    }))
  }

  const handleUpdateStats = (newStats: StatsWithChain | undefined) => {
    setStats((stats) => {
      if (!newStats) {
        return undefined
      }

      return {
        chain: newStats.chain,
        startBlock: newStats.startBlock,
        endBlock: stats?.endBlock || newStats.endBlock,
        dateStart: newStats.dateStart,
        dateEnd: stats?.dateEnd || newStats.dateEnd,
        numberOfBlocks: (stats?.numberOfBlocks || 0) + newStats.numberOfBlocks,
        numberOfTransactions:
          (stats?.numberOfTransactions || 0) + newStats.numberOfTransactions,
        numberOfOperations:
          (stats?.numberOfOperations || 0) + newStats.numberOfOperations,
        topBlocks: newStats.topBlocks
          .concat(stats?.topBlocks || [])
          .sort(rankBlocks)
          .slice(0, 10),
        smartAccountUsage: newStats.smartAccountUsage
          ? concatSmartAccountUsage(
              stats?.smartAccountUsage || [],
              newStats.smartAccountUsage,
            )
          : undefined,
      }
    })
  }
  return (
    <>
      <Head>
        <title>UOPS Explorer - L2BEAT</title>
      </Head>
      <main>
        <h1 className="mt-4 mb-4 text-center font-extrabold text-4xl text-gray-900 leading-none tracking-tight md:text-5xl lg:text-6xl dark:text-white">
          Block statistics
        </h1>
        <p className="2xlpx-48 mb-6 text-center font-normal text-gray-500 text-lg sm:px-16 lg:text-xl dark:text-gray-400">
          Select the chain and provide the number of blocks to analyze. The tool
          will fetch the data and generate statistics by comparing overall
          number of transactions to user operations. Subsequent clicks on Go!
          button will result in fetching more blocks on top of the previous ones
          and aggregating the statistics.
        </p>
        <StatsForm
          lastFetched={stats?.startBlock}
          onUpdate={handleUpdateStats}
        />
        {stats && (
          <>
            <StatsDetails stats={stats} />
            {stats.smartAccountUsage && (
              <SmartAccountList smartAccountUsage={stats.smartAccountUsage} />
            )}
            <BlockList blocks={stats.topBlocks} chain={stats.chain} />
          </>
        )}
      </main>
    </>
  )
}
