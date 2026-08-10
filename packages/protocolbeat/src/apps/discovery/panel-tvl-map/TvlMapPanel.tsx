import { formatCurrency } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getTvlMap } from '../../../api/api'
import type { ApiTvlMapEntry, ApiTvlMapResponse } from '../../../api/types'
import { ActionNeededState } from '../../../components/ActionNeededState'
import { AddressIcon } from '../../../components/AddressIcon'
import { LoadingState } from '../../../components/LoadingState'
import { toShortenedAddress } from '../../../utils/toShortenedAddress'
import { usePanelStore } from '../store/panel-store'
import { squarify, type Tile } from './squarify'
import { type TileColor, toIntensity, toTileColor } from './tileColor'

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

const TILE_GAP = 2

// Sweeping a whole project is expensive, so the panel holds its answer for as
// long as the backend holds the tokens and prices it was built from.
const STALE_MS = 60 * 60 * 1000

export function TvlMapPanel() {
  const { project } = useParams()

  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }

  const mapResponse = useQuery({
    queryKey: ['projects', project, 'tvl-map'],
    queryFn: () => getTvlMap(project),
    staleTime: STALE_MS,
    refetchOnWindowFocus: false,
  })

  if (mapResponse.isError) {
    return <ActionNeededState message="Failed to estimate project TVL" />
  }
  const response = mapResponse.data
  if (response === undefined) {
    return <LoadingState />
  }
  if (response.entries.length === 0) {
    return <ActionNeededState message="No value held by this project" />
  }

  return <TvlMap response={response} />
}

function TvlMap(props: { response: ApiTvlMapResponse }) {
  const entries = props.response.entries
  const chainColors = useMemo(() => toChainColors(entries), [entries])
  const tileColors = useMemo(
    () => toTileColors(entries, chainColors),
    [entries, chainColors],
  )

  return (
    <div className="flex h-full w-full flex-col bg-coffee-900">
      <Summary response={props.response} chainColors={chainColors} />
      <TreeMap entries={entries} colors={tileColors} />
    </div>
  )
}

function Summary(props: {
  response: ApiTvlMapResponse
  chainColors: Map<string, string>
}) {
  const total = props.response.entries.reduce(
    (sum, entry) => sum + entry.tvl,
    0,
  )

  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-coffee-600 border-b bg-coffee-800 px-3 py-2">
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
        {props.response.entries.length}/{props.response.addressCount} addresses
        · top {props.response.tokensPerChain} tokens per chain
      </span>
    </div>
  )
}

function TreeMap(props: {
  entries: ApiTvlMapEntry[]
  colors: Map<string, TileColor>
}) {
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

  const tiles = useMemo(
    () =>
      squarify(props.entries, (entry) => entry.tvl, {
        x: 0,
        y: 0,
        width: size.width,
        height: size.height,
      }),
    [props.entries, size],
  )
  const total = useMemo(
    () => props.entries.reduce((sum, entry) => sum + entry.tvl, 0),
    [props.entries],
  )

  return (
    <div ref={containerRef} className="relative flex-1 overflow-hidden">
      {tiles.map((tile) => (
        <TreeMapTile
          key={tile.item.address}
          tile={tile}
          share={total > 0 ? tile.item.tvl / total : 0}
          color={props.colors.get(tile.item.address)}
        />
      ))}
    </div>
  )
}

function TreeMapTile(props: {
  tile: Tile<ApiTvlMapEntry>
  share: number
  color: TileColor | undefined
}) {
  const entry = props.tile.item
  const isSelected = usePanelStore((state) =>
    state.selected.includes(entry.address),
  )
  const select = usePanelStore((state) => state.select)
  const detail = toDetail(props.tile)
  const isDarkText = props.color?.prefersDarkText === true

  return (
    <button
      type="button"
      onClick={() => select([entry.address])}
      title={toTooltip(entry, props.share)}
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
        backgroundColor: props.color?.background,
      }}
    >
      {detail !== 'none' && (
        <div
          className={clsx(
            'flex w-full items-center gap-1 px-1 pt-0.5',
            isDarkText ? 'text-coffee-900' : 'text-coffee-200',
          )}
        >
          <AddressIcon type={entry.type} className="size-3 shrink-0" />
          <span className="truncate font-bold text-2xs">
            {entry.name ?? toShortenedAddress(entry.address)}
          </span>
        </div>
      )}
      {detail !== 'name' && detail !== 'none' && (
        <div
          className={clsx(
            'w-full truncate px-1 font-mono text-xs tabular-nums',
            isDarkText ? 'text-coffee-900' : 'text-coffee-200',
          )}
        >
          {formatCurrency(entry.tvl, 'usd')}
        </div>
      )}
      {detail === 'full' && (
        <div
          className={clsx(
            'w-full px-1 pb-0.5 text-2xs',
            isDarkText ? 'text-coffee-900/70' : 'text-coffee-400',
          )}
        >
          {entry.tokens.map((token) => (
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

type Detail = 'none' | 'name' | 'value' | 'full'

function toDetail(tile: Tile<unknown>): Detail {
  if (tile.width < 44 || tile.height < 14) {
    return 'none'
  }
  if (tile.height < 28) {
    return 'name'
  }
  if (tile.width < 96 || tile.height < 64) {
    return 'value'
  }
  return 'full'
}

function toTooltip(entry: ApiTvlMapEntry, share: number): string {
  const header = `${entry.name ?? entry.address} · ${formatCurrency(entry.tvl, 'usd')} · ${(share * 100).toFixed(1)}%`
  const tokens = entry.tokens.map(
    (token) => `${token.ticker} ${formatCurrency(token.tvl, 'usd')}`,
  )
  return [header, entry.address, ...tokens].join('\n')
}

// Chains are met in descending order of what they hold, because the entries are
// sorted, which keeps a chain's hue stable for as long as its ranking holds.
function toChainColors(entries: ApiTvlMapEntry[]): Map<string, string> {
  const colors = new Map<string, string>()
  for (const entry of entries) {
    if (colors.has(entry.chain)) {
      continue
    }
    const color = CHAIN_COLORS[colors.size % CHAIN_COLORS.length]
    if (color !== undefined) {
      colors.set(entry.chain, color)
    }
  }
  return colors
}

function toTileColors(
  entries: ApiTvlMapEntry[],
  chainColors: Map<string, string>,
): Map<string, TileColor> {
  const colors = new Map<string, TileColor>()
  for (const [rank, entry] of entries.entries()) {
    const chainColor = chainColors.get(entry.chain)
    if (chainColor === undefined) {
      continue
    }
    colors.set(
      entry.address,
      toTileColor(chainColor, toIntensity(rank, entries.length)),
    )
  }
  return colors
}
