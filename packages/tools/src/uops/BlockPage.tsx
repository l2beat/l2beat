import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useSearchParams } from 'react-router'
import * as API from './api'
import {
  buttonClass,
  ChainSelect,
  ExplorerLink,
  Field,
  FieldList,
  INPUT_CLASS,
  UopsPage,
  useChains,
} from './common'
import { TransactionList } from './TransactionList'

const DEFAULT_CHAIN_ID = 'ethereum'

export function BlockPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const chainParam = searchParams.get('chain') ?? DEFAULT_CHAIN_ID
  const blockParam = searchParams.get('block') ?? ''

  const [chainId, setChainId] = useState(chainParam)
  const [blockNumber, setBlockNumber] = useState(blockParam)

  const chains = useChains()
  const latest = useMutation({
    mutationFn: API.getLatestBlockNumber,
    onSuccess: (latestBlockNumber) => setBlockNumber(String(latestBlockNumber)),
  })
  const block = useQuery({
    queryKey: ['uops-block', chainParam, blockParam],
    queryFn: () => API.getBlock(chainParam, Number(blockParam)),
    enabled: blockParam !== '',
    retry: false,
    staleTime: Number.POSITIVE_INFINITY,
  })

  const isBlockNumberValid = isBlockNumber(blockNumber)
  const chain = chains.data?.find((c) => c.id === chainParam)

  return (
    <UopsPage description="Pick a chain and a block number to compare the number of transactions to the number of user operations in that block.">
      <form
        className="max-w-[900px]"
        onSubmit={(e) => {
          e.preventDefault()
          if (chainId === chainParam && blockNumber === blockParam) {
            void block.refetch()
          } else {
            setSearchParams({ chain: chainId, block: blockNumber })
          }
        }}
      >
        {chains.data && (
          <ChainSelect
            chains={chains.data}
            value={chainId}
            disabled={latest.isPending}
            onChange={(id) => {
              setChainId(id)
              setBlockNumber('')
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
          <label className="mb-1 block text-sm" htmlFor="uops-block">
            Block number
          </label>
          <div className="flex items-center gap-2">
            <input
              className={INPUT_CLASS}
              id="uops-block"
              placeholder="12345678"
              value={blockNumber}
              onChange={(e) => setBlockNumber(e.target.value.trim())}
            />
            <button
              type="button"
              className="shrink-0 font-mono text-sm text-zinc-500 hover:text-zinc-300"
              disabled={latest.isPending}
              onClick={() => latest.mutate(chainId)}
            >
              {latest.isPending ? '[...]' : '[latest]'}
            </button>
          </div>
          {latest.isError && (
            <div className="text-red-500 text-sm">{latest.error.message}</div>
          )}
        </div>
        <button
          type="submit"
          disabled={!isBlockNumberValid || block.isFetching}
          className={buttonClass(!isBlockNumberValid || block.isFetching)}
        >
          {block.isFetching ? 'Counting...' : 'Count'}
        </button>
      </form>

      <div className="mt-8">
        {block.isFetching && <div className="text-zinc-500">Loading...</div>}
        {block.isError && (
          <div className="text-red-500">{block.error.message}</div>
        )}
        {block.data && !block.isFetching && (
          <BlockDetails block={block.data} chain={chain} />
        )}
      </div>
    </UopsPage>
  )
}

function BlockDetails(props: {
  block: API.CountedBlock
  chain: API.UopsChainInfo | undefined
}) {
  const { block, chain } = props
  const operationsCount = block.transactions.reduce(
    (sum, tx) => sum + tx.operationsCount,
    0,
  )

  return (
    <>
      <FieldList>
        <Field label="Number">
          <ExplorerLink chain={chain} path={`block/${block.number}`}>
            {block.number}
          </ExplorerLink>
        </Field>
        <Field label="Hash">{block.hash}</Field>
        <Field label="Timestamp">
          {new Date(block.timestamp * 1000).toLocaleString()}
        </Field>
        {block.status && <Field label="Status">{block.status}</Field>}
        <Field label="Transactions">{block.transactions.length}</Field>
        <Field label="User operations">
          <span className="text-orange-400">{operationsCount}</span>
        </Field>
      </FieldList>
      <TransactionList transactions={block.transactions} chain={chain} />
    </>
  )
}

function isBlockNumber(value: string): boolean {
  const parsed = Number(value)
  return value !== '' && Number.isSafeInteger(parsed) && parsed >= 0
}
