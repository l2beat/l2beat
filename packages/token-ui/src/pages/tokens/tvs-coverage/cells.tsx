import { formatCurrency } from '@l2beat/shared-pure'
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  InfoIcon,
} from 'lucide-react'
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
  type Bridge,
  describeRole,
  describeStatus,
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
const TOKEN_PLACEHOLDER = '/images/token-placeholder.png'

const TONES = {
  neutral: '',
  success:
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300',
  info: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300',
  warning:
    'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200',
  danger:
    'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300',
}

const STATUS_TONES: Record<Status, keyof typeof TONES> = {
  counted: 'success',
  countedViaCounterpart: 'success',
  scheduled: 'info',
  sameAssetOnly: 'warning',
  missing: 'danger',
}

export function Tag({
  tone,
  small = false,
  className,
  children,
}: {
  tone: keyof typeof TONES
  small?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        TONES[tone],
        small && 'h-4 px-1 font-normal text-[10px]',
        className,
      )}
    >
      {children}
    </Badge>
  )
}

// The info icon marks what can be hovered; pass `hint={false}` when the
// trigger already has an icon of its own.
export function WithTooltip({
  content,
  hint = true,
  children,
}: {
  content: ReactNode
  hint?: boolean
  children: ReactNode
}) {
  if (!content) return children
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex items-center gap-0.5" tabIndex={0}>
          {children}
          {hint && (
            <InfoIcon
              aria-hidden
              className="size-3 shrink-0 text-muted-foreground/70"
            />
          )}
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-80 text-left">{content}</TooltipContent>
    </Tooltip>
  )
}

export function StatusBadge({ row }: { row: Row }) {
  return (
    <WithTooltip content={describeStatus(row)}>
      <Tag tone={STATUS_TONES[row.status]}>{formatStatus(row.status)}</Tag>
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
      <Icon
        src={project?.iconUrl}
        className="mt-0.5 size-4 shrink-0 rounded-sm"
      />
      <div className="min-w-0">
        <div className="truncate font-medium">
          {project?.name ?? row.projectId}
        </div>
        {row.side === 'escrow' && (
          <WithTooltip
            content={`The project's own lock-and-mint bridge moved this token on ${formatChain(row.chain)}, so the project's escrows there should hold it.`}
          >
            <span className="truncate text-muted-foreground text-xs">
              Escrow on {formatChain(row.chain)}
            </span>
          </WithTooltip>
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
  const vault = row.value?.vaultAsset
  return (
    <div className="flex min-w-0 items-center gap-2">
      <Icon
        src={tokenIconUrl(row.iconUrl)}
        fallback={TOKEN_PLACEHOLDER}
        className="size-6 shrink-0 rounded-full bg-muted"
      />
      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="truncate font-medium">
            {row.symbol ?? row.abstractSymbol ?? 'Unknown'}
          </span>
          {row.role && row.role !== 'unknown' && (
            <WithTooltip
              content={
                <>
                  <div>{describeRole(row.role)}</div>
                  <div className="opacity-75">
                    From the token DB's relations, which cover every bridge, not
                    only the project's own.
                  </div>
                </>
              }
            >
              <Note>{formatRole(row.role)}</Note>
            </WithTooltip>
          )}
          {row.ignored && (
            <WithTooltip content="The token DB marks this token as ignored, which also leaves it out of interop financials.">
              <Note>ignored</Note>
            </WithTooltip>
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
              <Tag
                tone={vault.counted ? 'warning' : 'neutral'}
                small
                className="max-w-28"
              >
                <span className="truncate">
                  Vault: {vault.symbol ?? shortAddress(vault.address)}
                </span>
              </Tag>
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

export function BridgeIconStack({
  bridges,
  bridgeInfo,
}: {
  bridges: Bridge[]
  bridgeInfo: (id: string) => { name: string; iconUrl: string | undefined }
}) {
  const visible = bridges.slice(0, MAX_VISIBLE_BRIDGES)
  const hidden = bridges.length - visible.length
  return (
    <WithTooltip
      content={bridges.map((bridge) => (
        <div key={`${bridge.id}:${bridge.bridgeType}`}>
          {`${bridgeInfo(bridge.id).name} (${formatBridgeType(bridge.bridgeType)}): ${formatCurrency(bridge.volumeUsd, 'usd')}`}
        </div>
      ))}
    >
      <div className="-space-x-1.5 isolate flex items-center">
        {visible.map((bridge, index) => {
          const { name, iconUrl } = bridgeInfo(bridge.id)
          return (
            <span
              key={`${bridge.id}:${bridge.bridgeType}`}
              className="relative grid size-5 shrink-0 place-items-center rounded-full bg-muted font-medium text-[9px] text-muted-foreground uppercase shadow"
              style={{ zIndex: visible.length - index }}
            >
              {iconUrl ? (
                <Icon src={iconUrl} className="size-5 rounded-full" />
              ) : (
                name.slice(0, 1)
              )}
            </span>
          )
        })}
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
  const SortIcon = !active
    ? ArrowUpDownIcon
    : sort.direction === 'asc'
      ? ArrowUpIcon
      : ArrowDownIcon
  const ariaSort = !active
    ? 'none'
    : sort.direction === 'asc'
      ? 'ascending'
      : 'descending'
  return (
    <TableHead className={className} aria-sort={ariaSort}>
      <button
        type="button"
        className={cn(
          'flex w-full items-center gap-1 py-2',
          align === 'right' && 'justify-end',
        )}
        onClick={() => onSort(sortKey)}
      >
        {label}
        <SortIcon
          aria-hidden="true"
          className={cn('size-3 shrink-0', !active && 'opacity-30')}
        />
      </button>
    </TableHead>
  )
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <span className="shrink-0 text-muted-foreground text-xs">{children}</span>
  )
}

function Icon({
  src,
  fallback,
  className,
}: {
  src: string | undefined
  fallback?: string
  className?: string
}) {
  if (!src) return <span className={className} />
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

function tokenIconUrl(iconUrl: string | undefined): string {
  if (!iconUrl) return TOKEN_PLACEHOLDER
  return iconUrl.startsWith('/') ? `https://l2beat.com${iconUrl}` : iconUrl
}
