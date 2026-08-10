import { assert, formatCurrency } from '@l2beat/shared-pure'
import { useQueries } from '@tanstack/react-query'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { getTvl } from '../../../api/api'
import type {
  ApiAddressType,
  ApiProjectResponse,
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
import { type TileColor, toIntensity, toTileColor } from './tileColor'

// A chain has ~3k tokens and the ones below this cut hold under 1% of all
// market cap, which is the trade the map makes to value every address at once.
const TOKENS_PER_ADDRESS = 500

// How many tokens a single tile names.
const TOKENS_PER_TILE = 3

// Hue names the chain, so a multi-chain project reads as groups of tiles. The
// aux palette, ordered so that the chain holding the most comes out calmest.
const CHAIN_COLORS = [
  '#8B8BE8',
  '#FE8019',
  '#9DDE6C',
  '#83A599',
  '#e27991',
  '#FABD30',
  '#1c92a8',
  '#a73db5',
]

// What is sent to these is gone, so their balance is not value a project holds.
// They also have to leave for the map to be readable at all: tokens are burned
// in amounts their price was never meant to be multiplied by, which puts one
// tile several orders of magnitude above every real holder.
const BURNED = [
  '0x0000000000000000000000000000000000000000',
  '0x000000000000000000000000000000000000dead',
]

const TILE_GAP = 2

// One sweep per address is expensive, so an answer is held for as long as the
// backend holds the tokens and prices it was built from, and stays in the cache
// for that long as well: coming back to the panel then costs nothing.
const STALE_MS = 60 * 60 * 1000

interface Holder {
  address: string
  chain: string
  name: string | undefined
  type: ApiAddressType
}

interface Holding {
  holder: Holder
  tvl: number
  tokens: ApiTvlEntry[]
  color: TileColor
  share: number
}

export function TvlMapPanel() {
  const { project, projectResponse } = useProjectData()
  const holders = toHolders(projectResponse.data)

  // One request per address, which is what makes progress observable: every
  // answer that lands is a step, and the map draws whatever has landed.
  const results = useQueries({
    queries: holders.map((holder) => ({
      queryKey: [
        'projects',
        project,
        'tvl',
        holder.address,
        TOKENS_PER_ADDRESS,
      ],
      queryFn: () => getTvl(project, holder.address, TOKENS_PER_ADDRESS),
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
    return (
      <ActionNeededState message="This project has no addresses to value" />
    )
  }

  const swept = results.filter((result) => !result.isPending).length
  const failed = results.filter((result) => result.isError).length
  const chainColors = toChainColors(holders)
  const holdings = toHoldings(holders, results, chainColors)

  if (swept === holders.length && holdings.length === 0) {
    return <ActionNeededState message="No value held by this project" />
  }

  return (
    <div className="flex h-full w-full flex-col bg-coffee-900">
      <Summary
        holdings={holdings}
        chainColors={chainColors}
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
  chainColors: Map<string, string>
  addressCount: number
  swept: number
  failed: number
}) {
  const total = props.holdings.reduce((sum, holding) => sum + holding.tvl, 0)
  const isSweeping = props.swept < props.addressCount

  return (
    <div className="relative flex flex-wrap items-baseline gap-x-3 gap-y-1 border-coffee-600 border-b bg-coffee-800 px-3 py-2">
      <span className="font-bold text-2xs text-coffee-400 uppercase tracking-wider">
        Total
      </span>
      <span className="font-bold font-mono text-base text-coffee-200 tabular-nums">
        {formatCurrency(total, 'usd')}
      </span>

      {[...props.chainColors].map(([chain, color]) => (
        <span
          key={chain}
          className="flex items-center gap-1 text-2xs text-coffee-400 uppercase tracking-wider"
        >
          <span className="size-2" style={{ backgroundColor: color }} />
          {chain}
        </span>
      ))}

      <span className="ml-auto text-2xs text-coffee-400 uppercase tracking-wider">
        {isSweeping
          ? `${props.swept}/${props.addressCount} swept`
          : `${props.holdings.length}/${props.addressCount} hold value`}
        {props.failed > 0 && ` · ${props.failed} failed`}
        {` · top ${TOKENS_PER_ADDRESS} tokens per address`}
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
    if (container === null) {
      return
    }
    const observer = new ResizeObserver(() =>
      setSize({
        width: container.clientWidth,
        height: container.clientHeight,
      }),
    )
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  const tiles = squarify(props.holdings, (holding) => holding.tvl, {
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
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
  const { holder, tvl, tokens, color } = props.tile.item
  const isSelected = usePanelStore((state) =>
    state.selected.includes(holder.address),
  )
  const select = usePanelStore((state) => state.select)
  const detail = toDetail(props.tile)

  return (
    <button
      type="button"
      onClick={() => select([holder.address])}
      title={toTooltip(props.tile.item)}
      className={clsx(
        'absolute flex cursor-pointer flex-col items-start overflow-hidden text-left',
        isSelected
          ? 'ring-2 ring-autumn-300 ring-inset'
          : 'hover:ring-1 hover:ring-coffee-200/60 hover:ring-inset',
      )}
      style={{
        left: props.tile.x + TILE_GAP / 2,
        top: props.tile.y + TILE_GAP / 2,
        width: Math.max(0, props.tile.width - TILE_GAP),
        height: Math.max(0, props.tile.height - TILE_GAP),
        backgroundColor: color.background,
      }}
    >
      {detail >= DETAIL.name && (
        <div
          className={clsx(
            'flex w-full items-center gap-1 px-1 pt-0.5',
            color.prefersDarkText ? 'text-coffee-900' : 'text-coffee-200',
          )}
        >
          <AddressIcon type={holder.type} className="size-3 shrink-0" />
          <span className="truncate font-bold text-2xs">
            {holder.name ?? toShortenedAddress(holder.address)}
          </span>
        </div>
      )}
      {detail >= DETAIL.value && (
        <div
          className={clsx(
            'w-full truncate px-1 font-mono text-xs tabular-nums',
            color.prefersDarkText ? 'text-coffee-900' : 'text-coffee-200',
          )}
        >
          {formatCurrency(tvl, 'usd')}
        </div>
      )}
      {detail >= DETAIL.tokens && (
        <div
          className={clsx(
            'w-full px-1 pb-0.5 text-2xs',
            color.prefersDarkText ? 'text-coffee-900/70' : 'text-coffee-400',
          )}
        >
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

// How much a tile has room to say. Ordered, so that a bigger tile says
// everything a smaller one does and more.
const DETAIL = { nothing: 0, name: 1, value: 2, tokens: 3 } as const

function toDetail(tile: Tile<unknown>): number {
  if (tile.width < 44 || tile.height < 14) {
    return DETAIL.nothing
  }
  if (tile.height < 28) {
    return DETAIL.name
  }
  if (tile.width < 96 || tile.height < 64) {
    return DETAIL.value
  }
  return DETAIL.tokens
}

function toTooltip(holding: Holding): string {
  const name = holding.holder.name ?? holding.holder.address
  const share = `${(holding.share * 100).toFixed(1)}%`
  const header = `${name} · ${formatCurrency(holding.tvl, 'usd')} · ${share}`
  const tokens = holding.tokens.map(
    (token) => `${token.ticker} ${formatCurrency(token.tvl, 'usd')}`,
  )
  return [header, holding.holder.address, ...tokens].join('\n')
}

function toHolders(project: ApiProjectResponse | undefined): Holder[] {
  if (project === undefined) {
    return []
  }
  return project.entries
    .flatMap((chain) => [
      ...chain.initialContracts,
      ...chain.discoveredContracts,
      ...chain.eoas,
    ])
    .filter((entry) => !isBurned(entry.address))
    .map((entry) => ({
      address: entry.address,
      chain: entry.chain,
      name: entry.name,
      type: entry.type,
    }))
}

function isBurned(address: string): boolean {
  const separator = address.indexOf(':')
  const raw = separator === -1 ? address : address.slice(separator + 1)
  return BURNED.includes(raw.toLowerCase())
}

// Keyed off the holders rather than off what has arrived, so that a chain keeps
// its hue while the sweep is still filling the map in.
function toChainColors(holders: Holder[]): Map<string, string> {
  const colors = new Map<string, string>()
  for (const holder of holders) {
    if (colors.has(holder.chain)) {
      continue
    }
    const color = CHAIN_COLORS[colors.size % CHAIN_COLORS.length]
    if (color !== undefined) {
      colors.set(holder.chain, color)
    }
  }
  return colors
}

// Everything a tile draws itself with, worked out from the ranking rather than
// looked up per tile: the layout hands the tiles back in its own order.
function toHoldings(
  holders: Holder[],
  results: readonly { data: ApiTvlResponse | undefined }[],
  chainColors: Map<string, string>,
): Holding[] {
  const valued: { holder: Holder; tvl: number; tokens: ApiTvlEntry[] }[] = []
  for (const [index, holder] of holders.entries()) {
    const tokens = results[index]?.data
    if (tokens === undefined) {
      continue
    }
    const tvl = tokens.reduce((sum, token) => sum + token.tvl, 0)
    if (tvl <= 0) {
      continue
    }
    valued.push({ holder, tvl, tokens: tokens.slice(0, TOKENS_PER_TILE) })
  }
  valued.sort((a, b) => b.tvl - a.tvl)

  const total = valued.reduce((sum, entry) => sum + entry.tvl, 0)
  return valued.map((entry, rank) => {
    const chainColor = chainColors.get(entry.holder.chain)
    assert(chainColor !== undefined, 'Every chain on the map has a color')
    return {
      ...entry,
      color: toTileColor(chainColor, toIntensity(rank, valued.length)),
      share: total > 0 ? entry.tvl / total : 0,
    }
  })
}
