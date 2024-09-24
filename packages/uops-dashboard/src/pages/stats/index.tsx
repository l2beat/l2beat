import { BlockList } from '@/components/blockList'
import { SmartAccountList } from '@/components/smartAccountList'
import { StatsDetails } from '@/components/statsDetails'
import { StatsForm } from '@/components/statsForm'
import type { Stats, StatsWithChain } from '@/types'
import { useState } from 'react'
import { rankBlocks } from '../api/utils/rankBlocks'
import { Flowbite } from 'flowbite-react'

export default function StatsPage() {
  const [stats, setStats] = useState<StatsWithChain>()

  const concatSmartAccountUsage = (
    usage1: { signature: string; count: number }[],
    usage2: { signature: string; count: number }[],
  ) => {
    const usageMap = new Map<string, number>()
    // biome-ignore lint/complexity/noForEach: <explanation>
    usage1.forEach(({ signature, count }) => {
      usageMap.set(signature, (usageMap.get(signature) || 0) + count)
    })
    // biome-ignore lint/complexity/noForEach: <explanation>
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
    <main>
      <Flowbite theme={{ mode: 'dark' }}>
        <h1 className="mb-4 mt-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white text-center">
          User Operations
        </h1>
        <p className="mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400 text-center">
          Select the chain and provide the number of blocks to analyze. The tool
          will fetch the data and generate statistics by comparing overall
          number of transactions to user operations. Subsequent clicks on Go!
          button will result in fetching more block on top of the previous ones
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
      </Flowbite>
    </main>
  )
}
