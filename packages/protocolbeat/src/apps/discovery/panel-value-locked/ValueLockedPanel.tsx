import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchValueLocked, getValueLocked } from '../../../api/api'
import type {
  ApiAbstractTokenValue,
  ApiDeploymentBalance,
} from '../../../api/types'
import { Checkbox } from '../../../components/Checkbox'
import { LoadingState } from '../../../components/LoadingState'
import { IconChevronDown } from '../../../icons/IconChevronDown'
import { IconChevronRight } from '../../../icons/IconChevronRight'
import { toShortenedAddress } from '../../../utils/toShortenedAddress'
import { useProjectQueryOptions } from '../hooks/projectQuery'
import { useMultiViewStore } from '../multi-view/store'
import { usePanelStore } from '../store/panel-store'

const VALUE_LOCKED_KEY = 'value-locked'

type ViewMode = 'token' | 'contract'

export function ValueLockedPanel() {
  const { project } = useParams()
  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }

  const queryClient = useQueryClient()
  const selectedAddress = usePanelStore((state) => state.selected)
  const projectQuery = useQuery(useProjectQueryOptions(project))
  const [onlySelected, setOnlySelected] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('token')

  const valueLocked = useQuery({
    queryKey: ['projects', project, VALUE_LOCKED_KEY],
    queryFn: () => getValueLocked(project),
  })

  const mutation = useMutation({
    mutationFn: ({
      addresses,
      merge,
    }: {
      addresses: string[]
      merge: boolean
    }) => fetchValueLocked(project, addresses, merge),
    onSuccess: (result) => {
      queryClient.setQueryData(['projects', project, VALUE_LOCKED_KEY], result)
    },
  })

  // Map every node address ("chain:address") to its display name so deployment
  // rows can show the contract/EOA name instead of a raw address.
  const nameByAddress = new Map<string, string>()
  for (const chain of projectQuery.data?.entries ?? []) {
    for (const entry of [
      ...chain.initialContracts,
      ...chain.discoveredContracts,
      ...chain.eoas,
    ]) {
      if (entry.name) {
        nameByAddress.set(entry.address, entry.name)
      }
    }
  }

  const allAddresses = (projectQuery.data?.entries ?? []).flatMap((chain) => [
    ...chain.initialContracts.map((c) => c.address),
    ...chain.discoveredContracts.map((c) => c.address),
    ...chain.eoas.map((e) => e.address),
  ])
  const uniqueAddresses = [...new Set(allAddresses)]

  const response = valueLocked.data
  const tokens =
    onlySelected && selectedAddress
      ? filterToHolder(response?.tokens ?? [], selectedAddress)
      : (response?.tokens ?? [])

  const totalUsd = tokens.reduce((sum, token) => sum + token.totalUsd, 0)

  return (
    <div className="flex h-full w-full flex-col text-sm">
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-2 border-coffee-600 border-b bg-coffee-800 p-2">
        <button
          className="border border-coffee-500 px-2 py-1 font-bold text-xs uppercase hover:bg-coffee-600 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={mutation.isPending || !selectedAddress}
          onClick={() => {
            if (!selectedAddress) return
            // Scope the view to the contract we're fetching — the file still
            // accumulates every holder, but the list shows just this one.
            setOnlySelected(true)
            mutation.mutate({ addresses: [selectedAddress], merge: true })
          }}
        >
          Fetch tokens
        </button>
        <button
          className="border border-coffee-500 px-2 py-1 font-bold text-xs uppercase hover:bg-coffee-600 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={mutation.isPending || uniqueAddresses.length === 0}
          onClick={() => {
            setOnlySelected(false)
            mutation.mutate({ addresses: uniqueAddresses, merge: false })
          }}
        >
          Fetch all
        </button>
        <div
          className="flex cursor-pointer select-none items-center gap-1.5"
          onClick={() => setOnlySelected((v) => !v)}
        >
          <Checkbox checked={onlySelected} />
          Selected contract
        </div>
        <ViewSwitch viewMode={viewMode} setViewMode={setViewMode} />
        <Status
          isPending={mutation.isPending}
          error={mutation.error}
          fetchedAt={response?.fetchedAt}
        />
      </div>

      {!valueLocked.isLoading && tokens.length > 0 && (
        <div className="flex items-center justify-between border-coffee-600 border-b bg-coffee-800/60 px-2 py-1 font-bold">
          <span className="text-coffee-200">Total</span>
          <span className="font-mono">{formatUsd(totalUsd)}</span>
        </div>
      )}

      <div className="overflow-auto">
        <ValueLockedList
          tokens={tokens}
          isLoading={valueLocked.isLoading}
          nameByAddress={nameByAddress}
          onlySelected={onlySelected}
          hasSelected={selectedAddress !== undefined}
          viewMode={viewMode}
        />
      </div>
    </div>
  )
}

function ViewSwitch(props: {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
}) {
  const options: { value: ViewMode; label: string }[] = [
    { value: 'token', label: 'By token' },
    { value: 'contract', label: 'By contract' },
  ]
  return (
    <div className="flex border border-coffee-500 text-xs">
      {options.map((option) => (
        <button
          key={option.value}
          className={clsx(
            'px-2 py-1 font-bold uppercase',
            props.viewMode === option.value
              ? 'bg-coffee-600 text-coffee-100'
              : 'text-coffee-300 hover:text-coffee-100',
          )}
          onClick={() => props.setViewMode(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

function Status(props: {
  isPending: boolean
  error: unknown
  fetchedAt: number | undefined
}) {
  if (props.isPending) {
    return <span className="text-coffee-300 text-xs">Fetching balances…</span>
  }
  if (props.error) {
    return (
      <span className="text-aux-red text-xs">
        {props.error instanceof Error ? props.error.message : 'Fetch failed'}
      </span>
    )
  }
  if (props.fetchedAt) {
    return (
      <span className="text-coffee-400 text-xs">
        Last fetched {new Date(props.fetchedAt).toLocaleString()}
      </span>
    )
  }
  return null
}

function ValueLockedList(props: {
  tokens: ApiAbstractTokenValue[]
  isLoading: boolean
  nameByAddress: Map<string, string>
  onlySelected: boolean
  hasSelected: boolean
  viewMode: ViewMode
}) {
  if (props.isLoading) {
    return <LoadingState />
  }
  if (props.onlySelected && !props.hasSelected) {
    return (
      <div className="p-3 text-coffee-400">
        Select a contract in the nodes view to filter by it.
      </div>
    )
  }
  if (props.tokens.length === 0) {
    return (
      <div className="p-3 text-coffee-400">
        {props.onlySelected ? (
          'No tokens held by the selected contract.'
        ) : (
          <>
            No value found. Select a contract and press{' '}
            <span className="font-bold">Fetch tokens</span>, or press{' '}
            <span className="font-bold">Fetch all</span> to scan the whole
            project.
          </>
        )}
      </div>
    )
  }
  if (props.viewMode === 'contract') {
    return (
      <ul>
        {groupByContract(props.tokens).map((holder) => (
          <ContractRow
            key={holder.holderAddress}
            holder={holder}
            nameByAddress={props.nameByAddress}
          />
        ))}
      </ul>
    )
  }
  return (
    <ul>
      {props.tokens.map((token) => (
        <TokenRow
          key={token.abstractTokenId}
          token={token}
          nameByAddress={props.nameByAddress}
        />
      ))}
    </ul>
  )
}

function TokenRow(props: {
  token: ApiAbstractTokenValue
  nameByAddress: Map<string, string>
}) {
  const [open, setOpen] = useState(false)
  const token = props.token
  return (
    <li className="border-b border-b-coffee-600">
      <button
        className="flex w-full items-center gap-2 p-2 text-left hover:bg-coffee-700"
        onClick={() => setOpen((v) => !v)}
      >
        <Chevron open={open} />
        <TokenIcon iconUrl={token.iconUrl} />
        <span className="font-bold">{token.symbol}</span>
        <span className="ml-auto text-right">
          <div className="font-mono">{formatAmount(token.totalAmount)}</div>
          <div className="font-mono text-coffee-400 text-xs">
            {formatUsd(token.totalUsd)}
          </div>
        </span>
      </button>
      {open && (
        <ul className="bg-coffee-800/40">
          {token.deployments.map((deployment, idx) => (
            <DeploymentRow
              key={idx}
              deployment={deployment}
              nameByAddress={props.nameByAddress}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

function DeploymentRow(props: {
  deployment: ApiDeploymentBalance
  nameByAddress: Map<string, string>
}) {
  const deployment = props.deployment
  const holderName =
    props.nameByAddress.get(deployment.holderAddress) ??
    toShortenedAddress(deployment.holderAddress)

  return (
    <li className="flex items-center gap-2 py-1 pr-2 pl-8">
      <span className="text-coffee-300 text-xs">{deployment.tokenSymbol}</span>
      <NodeLink address={deployment.holderAddress} label={holderName} />
      <span className="ml-auto text-right">
        <div className="font-mono text-xs">
          {formatAmount(deployment.amount)}
        </div>
        <div className="font-mono text-coffee-400 text-xs">
          {deployment.usd !== undefined ? formatUsd(deployment.usd) : '—'}
        </div>
      </span>
    </li>
  )
}

function ContractRow(props: {
  holder: ContractHolder
  nameByAddress: Map<string, string>
}) {
  const [open, setOpen] = useState(false)
  const holder = props.holder
  const holderName =
    props.nameByAddress.get(holder.holderAddress) ??
    toShortenedAddress(holder.holderAddress)

  return (
    <li className="border-b border-b-coffee-600">
      <button
        className="flex w-full items-center gap-2 p-2 text-left hover:bg-coffee-700"
        onClick={() => setOpen((v) => !v)}
      >
        <Chevron open={open} />
        <NodeLink address={holder.holderAddress} label={holderName} bold />
        <span className="ml-auto text-right">
          <div className="font-mono">
            {holder.tokenCount} {holder.tokenCount === 1 ? 'token' : 'tokens'}
          </div>
          <div className="font-mono text-coffee-400 text-xs">
            {formatUsd(holder.totalUsd)}
          </div>
        </span>
      </button>
      {open && (
        <ul className="bg-coffee-800/40">
          {holder.tokens.map((entry, idx) => (
            <li key={idx} className="flex items-center gap-2 py-1 pr-2 pl-8">
              <TokenIcon iconUrl={entry.iconUrl} small />
              <span className="font-bold text-xs">{entry.symbol}</span>
              <span className="text-coffee-300 text-xs">
                {entry.tokenSymbol}
              </span>
              <span className="ml-auto text-right">
                <div className="font-mono text-xs">
                  {formatAmount(entry.amount)}
                </div>
                <div className="font-mono text-coffee-400 text-xs">
                  {entry.usd !== undefined ? formatUsd(entry.usd) : '—'}
                </div>
              </span>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

function NodeLink(props: { address: string; label: string; bold?: boolean }) {
  const select = usePanelStore((state) => state.select)
  const ensurePanel = useMultiViewStore((state) => state.ensurePanel)
  return (
    <button
      className={clsx(
        'text-aux-blue hover:underline',
        props.bold ? 'font-bold' : 'text-xs',
      )}
      title={props.address}
      onClick={(e) => {
        e.stopPropagation()
        select(props.address)
        ensurePanel('nodes')
      }}
    >
      {props.label}
    </button>
  )
}

function Chevron(props: { open: boolean }) {
  return props.open ? (
    <IconChevronDown className="size-3 shrink-0" />
  ) : (
    <IconChevronRight className="size-3 shrink-0" />
  )
}

function TokenIcon(props: { iconUrl: string | null; small?: boolean }) {
  const size = props.small ? 'size-4' : 'size-5'
  return props.iconUrl ? (
    <img
      src={props.iconUrl}
      alt=""
      className={clsx(size, 'shrink-0 rounded-full')}
    />
  ) : (
    <span className={clsx(size, 'shrink-0 rounded-full bg-coffee-600')} />
  )
}

interface ContractTokenEntry {
  abstractTokenId: string
  symbol: string
  iconUrl: string | null
  tokenSymbol: string
  amount: number
  usd?: number
}

interface ContractHolder {
  holderAddress: string
  totalUsd: number
  tokenCount: number
  tokens: ContractTokenEntry[]
}

// Re-pivots the by-token data into a by-holder view: each contract/EOA with the
// tokens it holds, sorted by USD value.
function groupByContract(tokens: ApiAbstractTokenValue[]): ContractHolder[] {
  const byHolder = new Map<string, ContractHolder>()
  for (const token of tokens) {
    for (const deployment of token.deployments) {
      let holder = byHolder.get(deployment.holderAddress)
      if (!holder) {
        holder = {
          holderAddress: deployment.holderAddress,
          totalUsd: 0,
          tokenCount: 0,
          tokens: [],
        }
        byHolder.set(deployment.holderAddress, holder)
      }
      holder.tokens.push({
        abstractTokenId: token.abstractTokenId,
        symbol: token.symbol,
        iconUrl: token.iconUrl,
        tokenSymbol: deployment.tokenSymbol,
        amount: deployment.amount,
        usd: deployment.usd,
      })
      holder.totalUsd += deployment.usd ?? 0
      holder.tokenCount += 1
    }
  }
  const holders = [...byHolder.values()]
  for (const holder of holders) {
    holder.tokens.sort((a, b) => (b.usd ?? 0) - (a.usd ?? 0))
  }
  return holders.sort((a, b) => b.totalUsd - a.totalUsd)
}

// Keep only the deployments held by the given holder and recompute totals so
// the list reflects just that contract's holdings.
function filterToHolder(
  tokens: ApiAbstractTokenValue[],
  holder: string,
): ApiAbstractTokenValue[] {
  const result: ApiAbstractTokenValue[] = []
  for (const token of tokens) {
    const deployments = token.deployments.filter(
      (d) => d.holderAddress === holder,
    )
    if (deployments.length === 0) {
      continue
    }
    result.push({
      ...token,
      totalAmount: deployments.reduce((sum, d) => sum + d.amount, 0),
      totalUsd: deployments.reduce((sum, d) => sum + (d.usd ?? 0), 0),
      deployments,
    })
  }
  return result.sort((a, b) => b.totalUsd - a.totalUsd)
}

function formatAmount(amount: number): string {
  return amount.toLocaleString('en-US', { maximumFractionDigits: 4 })
}

function formatUsd(usd: number): string {
  return usd.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  })
}
