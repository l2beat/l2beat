import { useState, useMemo } from 'react'
import { Badge } from '../../../components/Badge'
import { AddressDisplay } from '../../../components/AddressDisplay'
import type { CompiledReview, ActivityEvent } from '../../../types'
import { stripChainPrefix } from '../../../utils/format'

interface ActivityViewProps {
  review: CompiledReview
}

type SortDir = 'asc' | 'desc'

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

const CHAIN_EXPLORERS: Record<string, string> = {
  ethereum: 'https://etherscan.io',
  arbitrum: 'https://arbiscan.io',
  base: 'https://basescan.org',
  optimism: 'https://optimistic.etherscan.io',
  polygon: 'https://polygonscan.com',
  avalanche: 'https://snowtrace.io',
  bsc: 'https://bscscan.com',
  gnosis: 'https://gnosisscan.io',
  zksync: 'https://explorer.zksync.io',
  linea: 'https://lineascan.build',
  scroll: 'https://scrollscan.com',
  blast: 'https://blastscan.io',
}

function explorerTxUrl(txHash: string, chain?: string): string {
  const raw = txHash.startsWith('0x') ? txHash : `0x${txHash}`
  const base = CHAIN_EXPLORERS[chain?.toLowerCase() ?? ''] ?? CHAIN_EXPLORERS.ethereum!
  return `${base}/tx/${raw}`
}

export function ActivityView({ review }: ActivityViewProps) {
  const events = review.activity ?? []
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [expanded, setExpanded] = useState<Set<number>>(new Set())

  const sorted = useMemo(() => {
    const copy = events.map((e, i) => ({ ...e, _idx: i }))
    copy.sort((a, b) => {
      const cmp =
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      return sortDir === 'desc' ? -cmp : cmp
    })
    return copy
  }, [events, sortDir])

  function toggleSort() {
    setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
  }

  // Group events by year-month for the timeline
  const grouped = useMemo(() => {
    const groups: {
      label: string
      events: (ActivityEvent & { _idx: number })[]
    }[] = []
    let currentLabel = ''
    for (const event of sorted) {
      const d = new Date(event.timestamp)
      const label = d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      })
      if (label !== currentLabel) {
        currentLabel = label
        groups.push({ label, events: [] })
      }
      groups[groups.length - 1]!.events.push(event)
    }
    return groups
  }, [sorted])

  function toggleExpand(idx: number) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(idx)) {
        next.delete(idx)
      } else {
        next.add(idx)
      }
      return next
    })
  }

  if (events.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="text-4xl mb-4">
          <svg
            className="w-12 h-12 mx-auto text-text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-text-primary">
          No activity recorded yet
        </h3>
        <p className="mt-2 text-sm text-text-secondary">
          Contract upgrades will appear here.
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            Activity Feed
          </h2>
          <p className="text-sm text-text-secondary">
            {(() => {
              const contractCount = new Set(events.map((e) => e.contractAddress)).size
              return `${events.length} upgrade${events.length !== 1 ? 's' : ''} across ${contractCount} contract${contractCount !== 1 ? 's' : ''}`
            })()}
          </p>
        </div>
        <button
          onClick={toggleSort}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-text-secondary hover:text-purple-600 rounded-lg border border-border hover:border-purple-300 transition-colors"
        >
          {sortDir === 'desc' ? 'Newest first' : 'Oldest first'}
          <svg
            className={`w-4 h-4 transition-transform ${sortDir === 'asc' ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Timeline */}
      <div className="space-y-8">
        {grouped.map((group) => (
          <div key={group.label}>
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
              {group.label}
            </h3>
            <div className="space-y-2">
              {group.events.map((event) => (
                <UpgradeRow
                  key={event._idx}
                  event={event}
                  chain={review.metadata.chain}
                  isExpanded={expanded.has(event._idx)}
                  onToggle={() => toggleExpand(event._idx)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function UpgradeRow({
  event,
  chain,
  isExpanded,
  onToggle,
}: {
  event: ActivityEvent & { _idx: number }
  chain?: string
  isExpanded: boolean
  onToggle: () => void
}) {
  return (
    <div className="rounded-xl border border-border bg-white overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-4 py-3 text-left hover:bg-bg-muted/50 transition-colors"
      >
        {/* Date column */}
        <div className="flex-shrink-0 w-24 text-right">
          <div className="text-sm font-medium text-text-primary">
            {formatDate(event.timestamp)}
          </div>
          <div className="text-xs text-text-muted">
            {formatTime(event.timestamp)}
          </div>
        </div>

        {/* Type badge */}
        <div className="flex-shrink-0">
          <Badge variant="purple">Upgrade</Badge>
        </div>

        {/* Contract name */}
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium text-text-primary truncate block">
            {event.contractName}
          </span>
        </div>

        {/* Implementation count */}
        <div className="flex-shrink-0 text-xs text-text-muted">
          {event.implementations.length} impl
          {event.implementations.length !== 1 ? 's' : ''}
        </div>

        {/* Expand chevron */}
        <svg
          className={`w-4 h-4 text-text-muted transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 pt-1 border-t border-border bg-bg-muted/30">
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
            {/* Contract address */}
            <span className="text-text-muted">Contract</span>
            <AddressDisplay address={event.contractAddress} />

            {/* Transaction */}
            <span className="text-text-muted">Transaction</span>
            <a
              href={explorerTxUrl(event.txHash, chain)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-purple-600 hover:text-purple-800 transition-colors truncate"
              title={event.txHash}
            >
              {stripChainPrefix(event.txHash).slice(0, 10)}...
              {stripChainPrefix(event.txHash).slice(-8)}
            </a>

            {/* New implementations */}
            <span className="text-text-muted">
              New impl{event.implementations.length !== 1 ? 's' : ''}
            </span>
            <div className="space-y-1">
              {event.implementations.map((impl) => (
                <AddressDisplay key={impl} address={impl} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
