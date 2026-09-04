import {
  formatAddress,
  formatCurrency,
  formatInteger,
  formatSeconds,
} from '@l2beat/shared-pure'
import type { ReactNode } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { CustomLink } from '~/components/link/CustomLink'
import type { ProjectIconListItem } from '~/components/ProjectIconList'
import { InfoIcon } from '~/icons/Info'
import { ChainIcon } from '~/pages/interop/components/ChainIcon'
import type {
  InteropTokenRelationsDeployment,
  InteropTokenRelationsNode,
} from '~/server/features/layer2s/interop/token/getInteropTokenRelationsGraph'
import type { InteropTokenStats } from '~/server/features/layer2s/interop/utils/createStatsLookup'
import { cn } from '~/utils/cn'
import { describeNode, isCluster } from './graphSelectors'

export function Section({
  title,
  hint,
  children,
}: {
  title: string
  hint?: string
  children: ReactNode
}) {
  return (
    <section className="py-5">
      <p className="flex items-center gap-1.5 font-bold text-label-value-12 text-secondary uppercase">
        {title}
        {hint && (
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon className="size-3 fill-current" />
            </TooltipTrigger>
            <TooltipContent>{hint}</TooltipContent>
          </Tooltip>
        )}
      </p>
      <div className="mt-3">{children}</div>
    </section>
  )
}

export function Stats({ stats }: { stats: InteropTokenStats }) {
  const items = [
    [
      'Volume',
      stats.volume === null ? '—' : formatCurrency(stats.volume, 'usd'),
    ],
    [
      'Transfers',
      stats.transferCount === null ? '—' : formatInteger(stats.transferCount),
    ],
    [
      'Avg. time',
      stats.avgDuration === null ? '—' : formatSeconds(stats.avgDuration),
    ],
  ]
  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map(([label, value]) => (
        <div key={label} className="min-w-0">
          <p className="font-medium text-paragraph-12 text-secondary">
            {label}
          </p>
          <p
            className="mt-1 truncate font-bold text-label-value-16 tabular-nums leading-none"
            title={value}
          >
            {value}
          </p>
        </div>
      ))}
    </div>
  )
}

export function NodeButton({
  node,
  onSelectNode,
  className,
  children,
}: {
  node: InteropTokenRelationsNode
  onSelectNode: (id: string) => void
  className?: string
  children?: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={() => onSelectNode(node.id)}
      className={cn(
        'truncate text-left hover:text-brand hover:underline',
        className,
      )}
    >
      {children ?? describeNode(node)}
    </button>
  )
}

export function BridgeList({
  prefix,
  bridges,
  fallback,
  className,
}: {
  prefix: string
  bridges: ProjectIconListItem[]
  /** Shown when no bridge is known; omitted entirely otherwise. */
  fallback?: string
  className?: string
}) {
  if (bridges.length === 0)
    return fallback ? <Muted className={className}>{fallback}</Muted> : null
  return (
    <span
      className={cn(
        'flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-label-value-12 text-secondary',
        className,
      )}
    >
      {prefix}
      {bridges.map((bridge) => (
        <CustomLink
          key={bridge.id}
          href={bridge.href}
          variant="plain"
          underline={false}
          className="flex items-center gap-1 hover:underline"
        >
          <img src={bridge.iconUrl} alt="" className="size-3.5 rounded-full" />
          {bridge.name}
        </CustomLink>
      ))}
    </span>
  )
}

export function Address({
  deployment,
  className,
}: {
  deployment: InteropTokenRelationsDeployment
  className?: string
}) {
  const label = shortAddress(deployment.address)
  return deployment.explorerUrl ? (
    <CustomLink
      href={deployment.explorerUrl}
      variant="plain"
      underline={false}
      className={cn(
        'font-normal text-label-value-12 text-secondary hover:text-primary hover:underline',
        className,
      )}
    >
      {label}
    </CustomLink>
  ) : (
    <span className={cn('text-label-value-12 text-secondary', className)}>
      {label}
    </span>
  )
}

export function Muted({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <p className={cn('text-label-value-12 text-secondary', className)}>
      {children}
    </p>
  )
}

export function MoreNote({ count, noun }: { count: number; noun: string }) {
  if (count <= 0) return null
  return (
    <Muted>
      +{count} other {noun}
      {count === 1 ? '' : 's'}
    </Muted>
  )
}

export function NodeIcon({ node }: { node: InteropTokenRelationsNode }) {
  const shown = isCluster(node)
    ? node.deployments.slice(0, 2)
    : node.deployments.slice(0, 1)
  return (
    <span className="-space-x-1.5 flex shrink-0">
      {shown.map((deployment) => (
        <span
          key={`${deployment.chain.id}|${deployment.address}`}
          className="rounded-sm bg-surface-primary"
        >
          <ChainIcon iconUrl={deployment.chain.iconUrl} alt="" />
        </span>
      ))}
    </span>
  )
}

export function BridgeIcons({ bridges }: { bridges: ProjectIconListItem[] }) {
  if (bridges.length === 0) return <Muted>unknown bridge</Muted>
  return (
    <span className="-space-x-1 flex shrink-0">
      {bridges.map((bridge) => (
        <CustomLink
          key={bridge.id}
          href={bridge.href}
          variant="plain"
          underline={false}
          title={bridge.name}
          className="rounded-full bg-surface-primary"
        >
          <img
            src={bridge.iconUrl}
            alt={bridge.name}
            className="size-4 rounded-full"
          />
        </CustomLink>
      ))}
    </span>
  )
}

export function Volume({
  value,
  className,
}: {
  value: number | null
  className?: string
}) {
  return (
    <span className={cn('shrink-0 tabular-nums', className)}>
      {value === null ? '—' : formatCurrency(value, 'usd')}
    </span>
  )
}

export function shortAddress(address: string): string {
  return address.startsWith('0x') ? formatAddress(address) : address
}
