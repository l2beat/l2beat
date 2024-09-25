import { type ChainId, SUPPORTED_CHAINS } from '@/chains'
import type { ApiError, Stats, StatsApiRequest, StatsWithChain } from '@/types'
import { useState } from 'react'
import { BlockCountInput, type InputMode } from './blockCountInput'
import { ChainDropdown } from './chainDropdown'
import { ErrorModal } from './errorModal'
import { ProgressBar } from './progressBar'
import { SubmitButton } from './submitButton'

export function StatsForm({
  lastFetched,
  onUpdate,
}: {
  lastFetched?: number
  onUpdate: (block: StatsWithChain | undefined) => void
}) {
  const [chainId, setChain] = useState<ChainId>(SUPPORTED_CHAINS[0].id)
  const [blockCount, setBlockCount] = useState(
    SUPPORTED_CHAINS[0].suggestedBlocksCount,
  )

  const [loadedCount, setLoadedCount] = useState(0)

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSetChain = (chain: ChainId) => {
    setChain(chain)
    const selectedChain = SUPPORTED_CHAINS.find((c) => c.id === chain)
    setBlockCount(selectedChain?.suggestedBlocksCount || 100)
    onUpdate(undefined)
  }

  const handleSetBlockCount = (mode: InputMode, newCount?: number) => {
    if (mode === 'plus') {
      setBlockCount((count) => count + 100)
      return
    }

    if (mode === 'minus') {
      setBlockCount((count) => {
        console.log('minus', count)
        const newCount = count - 100
        if (newCount < 100) {
          return 100
        }
        return newCount
      })
      return
    }

    if (!newCount) {
      setBlockCount(100)
      return
    }

    setBlockCount(() => {
      if (newCount < 100) {
        return 100
      }
      return newCount
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    getStats(chainId, blockCount)
  }

  const getStats = async (chainId: ChainId, blockNumber: number) => {
    setIsLoading(true)

    const chain = SUPPORTED_CHAINS.find((c) => c.id === chainId)

    if (!chain) {
      throw new Error(`Unsupported chain: ${chain}`)
    }

    let currentBatchSize = chain.batchSize || 10
    let blocksLeftToFetch = blockCount
    let currentLastFetched = lastFetched

    try {
      while (blocksLeftToFetch > 0) {
        if (blocksLeftToFetch < currentBatchSize) {
          currentBatchSize = blocksLeftToFetch
        }

        const batch = await getBatch(
          chainId,
          currentBatchSize,
          currentLastFetched,
        )
        currentLastFetched = batch.startBlock

        setLoadedCount((loadedCount) => loadedCount + currentBatchSize)
        onUpdate({
          chain,
          ...batch,
        })
        blocksLeftToFetch -= currentBatchSize
      }
    } catch (err) {
      setErrorMessage((err as Error).message)
    }

    setIsLoading(false)
    setLoadedCount(0)
  }

  const getBatch = async (
    chainId: ChainId,
    count: number,
    lastFetched?: number,
  ): Promise<Stats> => {
    const res = await fetch(`${window.location.origin}/api/stats`, {
      method: 'POST',
      body: JSON.stringify({
        chainId,
        count,
        lastFetched,
      } as StatsApiRequest),
    })

    const body = await res.json()
    if (res.status !== 200) {
      const error = body as ApiError
      throw new Error(error.message)
    }

    const stats = body as Stats
    return stats
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-sm">
      <ChainDropdown chain={chainId} setChain={handleSetChain} />
      <BlockCountInput
        value={blockCount}
        handleSetBlockCount={handleSetBlockCount}
      />
      <SubmitButton isLoading={isLoading} />
      {isLoading && <ProgressBar count={loadedCount} of={blockCount} />}

      {errorMessage && (
        <ErrorModal
          errorMessage={errorMessage}
          onClose={() => setErrorMessage('')}
        />
      )}
    </form>
  )
}
