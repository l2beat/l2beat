import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import * as API from './api'
import {
  buttonClass,
  ChainSelect,
  Field,
  FieldList,
  Flags,
  INPUT_CLASS,
  UopsPage,
  useChains,
} from './common'
import { type AggregatedStats, mergeStats } from './mergeStats'

const BATCH_SIZE_BLOCKS = 10
const BLOCK_COUNT_DEFAULT = 100
const BLOCK_COUNT_MAX = 10_000
const PROGRESS_BAR_WIDTH = 40

interface Progress {
  loaded: number
  total: number
}

export function StatsPage() {
  const chains = useChains()
  const [chainId, setChainId] = useState('ethereum')
  const [blockCountInput, setBlockCountInput] = useState(
    String(BLOCK_COUNT_DEFAULT),
  )
  const [stats, setStats] = useState<AggregatedStats>()
  const [progress, setProgress] = useState<Progress>()
  const [error, setError] = useState('')
  const isMounted = useRef(false)
  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  const blockCount = Number(blockCountInput)
  const isBlockCountValid =
    Number.isSafeInteger(blockCount) &&
    blockCount > 0 &&
    blockCount <= BLOCK_COUNT_MAX
  const isRunning = progress !== undefined
  const isAtGenesis = stats?.startBlock === 0
  const canRun = isBlockCountValid && !isRunning && !isAtGenesis

  async function run(total: number) {
    setError('')
    setProgress({ loaded: 0, total })
    let aggregated = stats
    try {
      for (let loaded = 0; loaded < total; loaded += BATCH_SIZE_BLOCKS) {
        if (!isMounted.current) return
        const count = Math.min(BATCH_SIZE_BLOCKS, total - loaded)
        const batch = await API.getStats(chainId, count, aggregated?.startBlock)
        aggregated = mergeStats(aggregated, batch)
        setStats(aggregated)
        setProgress({ loaded: loaded + count, total })
        if (batch.startBlock === 0) break
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed')
    }
    setProgress(undefined)
  }

  return (
    <UopsPage description="Pick a chain and the number of blocks to analyze, counting back from the latest block. Running it again fetches the blocks before the ones already analyzed and adds them to the totals.">
      <form
        className="max-w-[900px]"
        onSubmit={(e) => {
          e.preventDefault()
          void run(blockCount)
        }}
      >
        {chains.data && (
          <ChainSelect
            chains={chains.data}
            value={chainId}
            disabled={isRunning}
            onChange={(id) => {
              setChainId(id)
              setStats(undefined)
            }}
          />
        )}
        {chains.isPending && (
          <div className="mb-4 text-sm text-zinc-500">Loading chains...</div>
        )}
        {chains.isError && (
          <div className="mb-4 text-red-500 text-sm">
            {chains.error.message}
          </div>
        )}
        <div className="mb-4">
          <label className="mb-1 block text-sm" htmlFor="uops-count">
            Blocks to analyze
          </label>
          <input
            className={clsx(INPUT_CLASS, 'max-w-[200px]')}
            id="uops-count"
            type="number"
            min={1}
            max={BLOCK_COUNT_MAX}
            value={blockCountInput}
            onChange={(e) => setBlockCountInput(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={!canRun}
          className={buttonClass(!canRun)}
        >
          {stats ? 'Analyze more' : 'Analyze'}
        </button>
      </form>

      <div className="mt-8">
        {progress && <ProgressBar progress={progress} />}
        {error && <div className="mb-4 text-red-500">{error}</div>}
        {stats && <StatsDetails stats={stats} chainId={chainId} />}
      </div>
    </UopsPage>
  )
}

function ProgressBar(props: { progress: Progress }) {
  const { loaded, total } = props.progress
  const filled = Math.floor((loaded / total) * PROGRESS_BAR_WIDTH)
  return (
    <div className="mb-4 whitespace-pre font-mono text-orange-500 text-sm">
      [{'='.repeat(filled)}
      {' '.repeat(PROGRESS_BAR_WIDTH - filled)}] {loaded}/{total} blocks
    </div>
  )
}

function StatsDetails(props: { stats: AggregatedStats; chainId: string }) {
  const { stats } = props
  return (
    <>
      <FieldList>
        <Field label="Blocks">
          {stats.startBlock} to {stats.endBlock} ({stats.numberOfBlocks})
        </Field>
        <Field label="Time">
          {new Date(stats.dateStart).toLocaleString()} to{' '}
          {new Date(stats.dateEnd).toLocaleString()}
        </Field>
        <Field label="Transactions">{stats.numberOfTransactions}</Field>
        <Field label="User operations">{stats.numberOfOperations}</Field>
        <Field label="Ratio">
          <span className="text-orange-400">
            {stats.numberOfTransactions === 0
              ? '-'
              : `x${(stats.numberOfOperations / stats.numberOfTransactions).toFixed(4)}`}
          </span>
        </Field>
      </FieldList>
      {stats.smartAccountUsage.length > 0 && (
        <SmartAccountTable usage={stats.smartAccountUsage} />
      )}
      <TopBlocksTable blocks={stats.topBlocks} chainId={props.chainId} />
    </>
  )
}

function SmartAccountTable(props: { usage: API.SmartAccountUsage[] }) {
  const sum = props.usage.reduce((acc, item) => acc + item.count, 0)
  const sorted = [...props.usage].sort((a, b) => b.count - a.count)
  return (
    <section className="mb-8">
      <h2 className="mb-2 font-bold">Smart account usage</h2>
      <table className="w-full font-mono text-sm">
        <thead className="text-left text-zinc-500">
          <tr className="border-zinc-800 border-b">
            <th className="py-1 pr-6 font-normal">Signature</th>
            <th className="py-1 font-normal">Count</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((item) => (
            <tr key={item.signature} className="border-zinc-900 border-b">
              <td className="py-1 pr-6">{item.signature}</td>
              <td className="whitespace-nowrap py-1">
                {item.count}{' '}
                <span className="text-zinc-500">
                  ({formatShare(item.count, sum)})
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

function TopBlocksTable(props: { blocks: API.BlockRatio[]; chainId: string }) {
  return (
    <section>
      <h2 className="mb-2 font-bold">Top blocks</h2>
      <table className="w-full font-mono text-sm">
        <thead className="text-left text-zinc-500">
          <tr className="border-zinc-800 border-b">
            <th className="py-1 pr-6 font-normal">Block</th>
            <th className="py-1 font-normal">Ratio</th>
          </tr>
        </thead>
        <tbody>
          {props.blocks.map((block) => (
            <tr key={block.number} className="border-zinc-900 border-b">
              <td className="py-1 pr-6">
                <Link
                  className="text-orange-500 underline"
                  to={`/uops?chain=${props.chainId}&block=${block.number}`}
                >
                  {block.number}
                </Link>
              </td>
              <td className="py-1">
                {block.ratio.toFixed(4)}
                <Flags
                  subject="Block"
                  includesBatch={block.includesBatch}
                  includesUnknown={block.includesUnknown}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

function formatShare(count: number, sum: number): string {
  const percentage = (count / sum) * 100
  return percentage < 1 ? '< 1%' : `${percentage.toFixed(0)}%`
}
