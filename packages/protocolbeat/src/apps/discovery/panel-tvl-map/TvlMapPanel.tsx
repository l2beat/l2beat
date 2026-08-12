import { formatCurrency } from '@l2beat/shared-pure'
import { useQueries } from '@tanstack/react-query'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { getTvl } from '../../../api/api'
import type {
  ApiAddressEntry,
  ApiTvlEntry,
  ApiTvlResponse,
} from '../../../api/types'
import { ActionNeededState } from '../../../components/ActionNeededState'
import { AddressIcon } from '../../../components/AddressIcon'
import { LoadingState } from '../../../components/LoadingState'
import { toShortenedAddress } from '../../../utils/toShortenedAddress'
import { useProjectData } from '../hooks/useProjectData'
import { usePanelStore } from '../store/panel-store'
import { squarify, type Tile } from './squarify'

// Tokens below this cut hold under 1% of all market cap, which is the trade the
// map makes to value every address of a project at once.
const TOP_TOKENS = 500
const TOKENS_PER_TILE = 3
const TILE_GAP = 2
const STALE_MS = 60 * 60 * 1000

const CHAIN_STYLES = [
  'bg-aux-blue/25 hover:bg-aux-blue/40',
  'bg-aux-orange/25 hover:bg-aux-orange/40',
  'bg-aux-green/25 hover:bg-aux-green/40',
  'bg-aux-teal/25 hover:bg-aux-teal/40',
  'bg-aux-pink/25 hover:bg-aux-pink/40',
  'bg-aux-cyan/25 hover:bg-aux-cyan/40',
  'bg-aux-yellow/25 hover:bg-aux-yellow/40',
  'bg-aux-purple/25 hover:bg-aux-purple/40',
]

// Value sent to these is gone, and burned amounts are large enough to leave
// every real holder invisible.
const BURNED = [
  '0x0000000000000000000000000000000000000000',
  '0x0000000000000000000000000000000000000001',
  '0x000000000000000000000000000000000000dead',
  '0x00000000000000000000000000000000000e16e4',
]

interface Holding {
  holder: ApiAddressEntry
  tvl: number
  tokens: ApiTvlEntry[]
  chainStyle: string
}

export function TvlMapPanel() {
  const { project, projectResponse } = useProjectData()
  const holders = (projectResponse.data?.entries ?? [])
    .flatMap((chain) => [
      ...chain.initialContracts,
      ...chain.discoveredContracts,
      ...chain.eoas,
    ])
    .filter((entry) => !isBurned(entry.address))

  // One request per address, so the map fills in as answers land.
  const results = useQueries({
    queries: holders.map((holder) => ({
      queryKey: ['projects', project, 'tvl', holder.address, TOP_TOKENS],
      queryFn: () => getTvl(holder.address, TOP_TOKENS),
      staleTime: STALE_MS,
      gcTime: STALE_MS,
      refetchOnWindowFocus: false,
      retry: 1,
    })),
  })

  if (projectResponse.isError) {
    return <ActionNeededState message="Failed to load the project" />
  }
  if (projectResponse.data === undefined) {
    return <LoadingState />
  }
  if (holders.length === 0) {
    return <ActionNeededState message="No addresses to value" />
  }

  const swept = results.filter((result) => !result.isPending).length
  const failed = results.filter((result) => result.isError).length
  const holdings = toHoldings(holders, results)

  if (swept === holders.length && holdings.length === 0) {
    return failed > 0 ? (
      <ActionNeededState
        message={`Failed to value ${failed} of ${holders.length} addresses`}
      />
    ) : (
      <ActionNeededState message="No value held by this project" />
    )
  }

  return (
    <div className="flex h-full w-full flex-col bg-coffee-900">
      <Summary
        holdings={holdings}
        addressCount={holders.length}
        swept={swept}
        failed={failed}
      />
      <TreeMap holdings={holdings} />
    </div>
  )
}

function Summary(props: {
  holdings: Holding[]
  addressCount: number
  swept: number
  failed: number
}) {
  const total = props.holdings.reduce((sum, holding) => sum + holding.tvl, 0)
  const isSweeping = props.swept < props.addressCount

  return (
    <div className="relative flex items-baseline gap-2 border-coffee-600 border-b bg-coffee-800 px-3 py-2">
      <span className="font-bold text-2xs text-coffee-400 uppercase tracking-wider">
        Total
      </span>
      <span className="font-bold font-mono text-base text-coffee-200 tabular-nums">
        {formatCurrency(total, 'usd')}
      </span>
      <span className="ml-auto text-2xs text-coffee-400 uppercase tracking-wider">
        {isSweeping
          ? `${props.swept}/${props.addressCount} swept`
          : `${props.holdings.length}/${props.addressCount} hold value`}
        {props.failed > 0 && ` · ${props.failed} failed`}
        {` · top ${TOP_TOKENS} tokens`}
      </span>
      {isSweeping && (
        <div
          className="absolute bottom-0 left-0 h-0.5 bg-autumn-300 transition-[width] duration-200"
          style={{
            width: `${((props.swept / props.addressCount) * 100).toFixed(1)}%`,
          }}
        />
      )}
    </div>
  )
}

function TreeMap(props: { holdings: Holding[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const observer = new ResizeObserver(() =>
      setSize({ width: container.clientWidth, height: container.clientHeight }),
    )
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  const tiles = squarify(props.holdings, (holding) => holding.tvl, {
    x: 0,
    y: 0,
    ...size,
  })

  return (
    <div ref={containerRef} className="relative flex-1 overflow-hidden">
      {tiles.map((tile) => (
        <TreeMapTile key={tile.item.holder.address} tile={tile} />
      ))}
    </div>
  )
}

function TreeMapTile(props: { tile: Tile<Holding> }) {
  const { holder, tvl, tokens, chainStyle } = props.tile.item
  const isSelected = usePanelStore((state) =>
    state.selected.includes(holder.address),
  )
  const select = usePanelStore((state) => state.select)
  const showName = props.tile.width >= 44 && props.tile.height >= 14
  const showValue = showName && props.tile.height >= 28
  const showTokens =
    showValue && props.tile.width >= 96 && props.tile.height >= 64

  return (
    <button
      type="button"
      onClick={() => select([holder.address])}
      title={toTooltip(props.tile.item)}
      className={clsx(
        'absolute flex cursor-pointer flex-col items-start overflow-hidden border-2 text-left',
        chainStyle,
        isSelected
          ? 'border-autumn-300'
          : 'border-coffee-200/25 hover:border-coffee-200/60',
      )}
      style={{
        left: props.tile.x + TILE_GAP / 2,
        top: props.tile.y + TILE_GAP / 2,
        width: Math.max(0, props.tile.width - TILE_GAP),
        height: Math.max(0, props.tile.height - TILE_GAP),
      }}
    >
      {showName && (
        <div className="flex w-full items-center gap-1 px-1 pt-0.5 text-coffee-200">
          <AddressIcon type={holder.type} className="size-3 shrink-0" />
          <span className="truncate font-bold text-2xs">
            {holder.name ?? toShortenedAddress(holder.address)}
          </span>
        </div>
      )}
      {showValue && (
        <div className="w-full truncate px-1 font-mono text-coffee-200 text-xs tabular-nums">
          {formatCurrency(tvl, 'usd')}
        </div>
      )}
      {showTokens && (
        <div className="w-full px-1 pb-0.5 text-2xs text-coffee-400">
          {tokens.map((token) => (
            <div key={token.ticker} className="flex justify-between gap-2">
              <span className="truncate">{token.ticker}</span>
              <span className="font-mono tabular-nums">
                {formatCurrency(token.tvl, 'usd')}
              </span>
            </div>
          ))}
        </div>
      )}
    </button>
  )
}

function toTooltip(holding: Holding): string {
  const { holder } = holding
  return [
    `${holder.name ?? holder.address} · ${holder.chain} · ${formatCurrency(holding.tvl, 'usd')}`,
    holder.address,
    ...holding.tokens.map(
      (token) => `${token.ticker} ${formatCurrency(token.tvl, 'usd')}`,
    ),
  ].join('\n')
}

function isBurned(address: string): boolean {
  return BURNED.includes(address.slice(address.indexOf(':') + 1).toLowerCase())
}

function toHoldings(
  holders: ApiAddressEntry[],
  results: readonly { data: ApiTvlResponse | undefined }[],
): Holding[] {
  const chains = [...new Set(holders.map((holder) => holder.chain))]
  return holders
    .map((holder, index) => {
      const tokens = results[index]?.data ?? []
      const chain = chains.indexOf(holder.chain) % CHAIN_STYLES.length
      return {
        holder,
        tvl: tokens.reduce((sum, token) => sum + token.tvl, 0),
        tokens: tokens.slice(0, TOKENS_PER_TILE),
        chainStyle: CHAIN_STYLES[chain] ?? '',
      }
    })
    .filter((holding) => holding.tvl > 0)
    .sort((a, b) => b.tvl - a.tvl)
}
