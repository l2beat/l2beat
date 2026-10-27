import { formatCurrency } from '@l2beat/shared-pure'
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Badge } from '~/components/core/Badge'
import { TableHead } from '~/components/core/Table'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/Tooltip'
import { ExplorerLink } from '~/components/ExplorerLink'
import { cn } from '~/utils/cn'
import {
  describeStatus,
  formatAmount,
  formatBridgeType,
  formatChain,
  formatRole,
  formatStatus,
  type Row,
  type Snapshot,
  type Sort,
  type SortKey,
  type Status,
  shortAddress,
} from './rows'

const MAX_VISIBLE_BRIDGES = 4

const STATUS_STYLES: Record<Status, string> = {
  counted:
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300',
  countedViaCounterpart:
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300',
  scheduled:
    'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300',
  sameAssetOnly:
    'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200',
  missing:
    'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300',
}

const NOTE_BADGE =
  'h-5 border-amber-300 bg-amber-50 px-1.5 font-normal text-[10px] text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200'

export function WithTooltip({
  content,
  children,
}: {
  content: ReactNode
  children: ReactNode
}) {
  if (!content) return children
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex" tabIndex={0}>
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-80 text-left">{content}</TooltipContent>
    </Tooltip>
  )
}

export function StatusBadge({ row }: { row: Row }) {
  return (
    <WithTooltip content={describeStatus(row)}>
      <Badge variant="outline" className={STATUS_STYLES[row.status]}>
        {formatStatus(row.status)}
      </Badge>
    </WithTooltip>
  )
}

export function ProjectCell({
  row,
  project,
}: {
  row: Row
  project: Snapshot['projects'][number] | undefined
}) {
  return (
    <div className="flex min-w-0 items-start gap-2">
      {project ? (
        <Icon
          src={project.iconUrl}
          className="mt-0.5 size-4 shrink-0 rounded-sm"
        />
      ) : (
        <span className="size-4 shrink-0" />
      )}
      <div className="min-w-0">
        <div className="truncate font-medium">
          {project?.name ?? row.projectId}
        </div>
        {row.side === 'escrow' && (
          <div className="truncate text-muted-foreground text-xs">
            Escrow on {formatChain(row.chain)}
          </div>
        )}
      </div>
    </div>
  )
}

export function TokenCell({
  row,
  explorerUrl,
}: {
  row: Row
  explorerUrl: string | undefined
}) {
  const symbol = row.symbol ?? row.abstractSymbol ?? 'Unknown'
  const vault = row.value?.vaultAsset
  return (
    <div className="flex min-w-0 items-center gap-2">
      <Icon
        src={tokenIconUrl(row.iconUrl)}
        fallback="/images/token-placeholder.png"
        className="size-6 shrink-0 rounded-full bg-muted"
      />
      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="truncate font-medium">{symbol}</span>
          {row.role && row.role !== 'unknown' && (
            <span className="shrink-0 text-muted-foreground text-xs">
              {formatRole(row.role).toLowerCase()}
            </span>
          )}
          {row.ignored && (
            <span className="shrink-0 text-muted-foreground text-xs">
              ignored
            </span>
          )}
          {vault && (
            <WithTooltip
              content={
                <>
                  <div>ERC-4626 asset(): {vault.symbol ?? vault.address}</div>
                  <div className="font-mono opacity-75">{vault.address}</div>
                  {vault.counted && (
                    <div>The project already counts this asset.</div>
                  )}
                </>
              }
            >
              <Badge
                variant="outline"
                className={cn(
                  'h-5 max-w-28 px-1.5 font-normal text-[10px]',
                  vault.counted && NOTE_BADGE,
                )}
              >
                <span className="truncate">
                  Vault: {vault.symbol ?? shortAddress(vault.address)}
                </span>
              </Badge>
            </WithTooltip>
          )}
        </div>
        <div
          className="truncate font-mono text-muted-foreground text-xs"
          title={row.address}
        >
          {explorerUrl && /^0x[0-9a-f]{40}$/.test(row.address) ? (
            <ExplorerLink
              explorerUrl={explorerUrl}
              value={row.address}
              type="address"
            >
              {shortAddress(row.address)}
            </ExplorerLink>
          ) : (
            shortAddress(row.address)
          )}
        </div>
      </div>
    </div>
  )
}

export function ValueCell({ row }: { row: Row }) {
  const value = row.value
  if (value?.amount === undefined) {
    return (
      <WithTooltip
        content={row.pricing ? undefined : 'No price for this token'}
      >
        <Empty />
      </WithTooltip>
    )
  }
  const via = row.pricing?.via
  return (
    <div className="flex flex-col items-end">
      {value.valueUsd === undefined ? (
        <WithTooltip content="No price for this token">
          <Empty />
        </WithTooltip>
      ) : (
        <WithTooltip
          content={
            <>
              <div>
                Price {formatCurrency(value.priceUsd ?? 0, 'usd')} from{' '}
                {row.pricing?.coingeckoId}
              </div>
              {via && (
                <div>
                  Priced as its locked counterpart on {via.chain} ({via.address}
                  )
                </div>
              )}
            </>
          }
        >
          <span className="font-medium">
            {formatCurrency(value.valueUsd, 'usd')}
            {via && <span className="text-muted-foreground">*</span>}
          </span>
        </WithTooltip>
      )}
      <div className="flex items-center gap-1 text-muted-foreground text-xs">
        {value.cappedByCirculatingSupply && (
          <WithTooltip content="The on-chain supply is above CoinGecko's global circulating supply, so the circulating supply is used.">
            <Badge
              variant="outline"
              className={cn(NOTE_BADGE, 'h-4 px-1 text-[10px]')}
            >
              capped
            </Badge>
          </WithTooltip>
        )}
        <span title={String(value.amount)}>{formatAmount(value.amount)}</span>
      </div>
    </div>
  )
}

export function BridgeIconStack({
  bridges,
}: {
  bridges: (Row['bridges'][number] & {
    name: string
    iconUrl: string | undefined
  })[]
}) {
  const visible = bridges.slice(0, MAX_VISIBLE_BRIDGES)
  const hidden = bridges.length - visible.length
  return (
    <WithTooltip
      content={bridges.map((bridge) => (
        <div key={`${bridge.id}:${bridge.bridgeType}`}>
          {bridge.name} ({formatBridgeType(bridge.bridgeType)}):{' '}
          {formatCurrency(bridge.volumeUsd, 'usd')}
        </div>
      ))}
    >
      <div className="-space-x-1.5 isolate flex items-center">
        {visible.map((bridge, index) => (
          <span
            key={`${bridge.id}:${bridge.bridgeType}`}
            className="relative block size-5 shrink-0 rounded-full bg-white shadow"
            style={{ zIndex: visible.length - index }}
          >
            {bridge.iconUrl ? (
              <Icon src={bridge.iconUrl} className="size-5 rounded-full" />
            ) : (
              <span className="grid size-5 place-items-center rounded-full bg-muted font-medium text-[9px] text-muted-foreground uppercase">
                {bridge.name.slice(0, 1)}
              </span>
            )}
          </span>
        ))}
        {hidden > 0 && (
          <span className="relative grid size-5 shrink-0 place-items-center rounded-full bg-muted font-medium text-[9px] text-muted-foreground shadow">
            +{hidden}
          </span>
        )}
      </div>
    </WithTooltip>
  )
}

export function SortableHead({
  label,
  sortKey,
  sort,
  onSort,
  align = 'left',
  className,
}: {
  label: string
  sortKey: SortKey
  sort: Sort
  onSort: (key: SortKey) => void
  align?: 'left' | 'right'
  className?: string
}) {
  const active = sort.key === sortKey
  const Icon = active
    ? sort.direction === 'asc'
      ? ArrowUpIcon
      : ArrowDownIcon
    : ArrowUpDownIcon
  return (
    <TableHead
      className={className}
      aria-sort={
        active
          ? sort.direction === 'asc'
            ? 'ascending'
            : 'descending'
          : 'none'
      }
    >
      <button
        type="button"
        className={cn(
          'flex w-full items-center gap-1 py-2',
          align === 'right' && 'justify-end',
        )}
        onClick={() => onSort(sortKey)}
      >
        {label}
        <Icon
          aria-hidden="true"
          className={cn('size-3 shrink-0', !active && 'opacity-30')}
        />
      </button>
    </TableHead>
  )
}

export function Empty() {
  return <span className="text-muted-foreground">—</span>
}

function Icon({
  src,
  fallback,
  className,
}: {
  src: string
  fallback?: string
  className?: string
}) {
  return (
    <img
      src={src}
      alt=""
      width={24}
      height={24}
      className={cn('object-cover', className)}
      onError={(event) => {
        if (fallback && !event.currentTarget.src.endsWith(fallback)) {
          event.currentTarget.src = fallback
        } else {
          event.currentTarget.style.visibility = 'hidden'
        }
      }}
    />
  )
}

function tokenIconUrl(iconUrl: string | undefined) {
  if (!iconUrl) return '/images/token-placeholder.png'
  return iconUrl.startsWith('/') ? `https://l2beat.com${iconUrl}` : iconUrl
}
