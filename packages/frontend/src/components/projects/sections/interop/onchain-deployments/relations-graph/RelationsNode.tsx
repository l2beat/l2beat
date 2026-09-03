import { formatAddress, formatCurrency } from '@l2beat/shared-pure'
import type { ReactNode } from 'react'
import { ChainIcon } from '~/pages/interop/components/ChainIcon'
import type { InteropTokenRelationsNode } from '~/server/features/layer2s/interop/token/getInteropTokenRelationsGraph'
import { cn } from '~/utils/cn'
import type { NodeBox } from './layoutRelationsGraph'

const CLUSTER_ROWS_SHOWN = 4

export function getNodeSize(node: InteropTokenRelationsNode): {
  width: number
  height: number
} {
  const count = node.deployments.length
  if (count <= 1) return { width: 168, height: 64 }
  const rows = Math.min(count, CLUSTER_ROWS_SHOWN)
  return { width: 260, height: 52 + rows * 20 + (count > rows ? 16 : 0) }
}

interface Props {
  node: InteropTokenRelationsNode
  box: NodeBox
  isSelected: boolean
  isDimmed: boolean
  isUnconnected: boolean
  isSource: boolean
  onSelect: (id: string) => void
  onHover: (id: string | undefined) => void
}

export function RelationsNode({
  node,
  box,
  isSelected,
  isDimmed,
  isUnconnected,
  isSource,
  onSelect,
  onHover,
}: Props) {
  const first = node.deployments[0]
  if (!first) return null
  const hiddenCount = node.deployments.length - CLUSTER_ROWS_SHOWN

  return (
    <button
      type="button"
      data-node-id={node.id}
      style={{ left: box.x, top: box.y, width: box.width, height: box.height }}
      className={cn(
        'absolute flex flex-col rounded-lg border bg-surface-primary p-2 text-left',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50',
        isSelected ? 'border-brand ring-1 ring-brand' : 'border-divider',
        isUnconnected && 'border-dashed',
        isSource && 'outline outline-4 outline-brand/20 outline-offset-2',
        isDimmed && 'opacity-20',
      )}
      onClick={(event) => {
        event.stopPropagation()
        onSelect(node.id)
      }}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(undefined)}
      onFocus={() => onHover(node.id)}
      onBlur={() => onHover(undefined)}
    >
      <Line className="justify-between gap-2">
        <span className="truncate font-bold text-label-value-13 text-primary">
          {first.symbol}
          {node.deployments.length > 1 && (
            <span className="ml-1 font-normal text-secondary">
              · {node.deployments.length} deployments
            </span>
          )}
        </span>
        <Volume value={node.volume} className="text-secondary" />
      </Line>
      {node.deployments.length > 1 ? (
        <>
          <Line className="gap-1 text-secondary">
            <span className="shrink-0">Burn & mint via</span>
            <Bridges bridges={node.bridges} />
          </Line>
          <ul className="mt-1 w-full">
            {node.deployments.slice(0, CLUSTER_ROWS_SHOWN).map((deployment) => (
              <li
                key={`${deployment.chain.id}|${deployment.address}`}
                className="flex h-5 items-center justify-between gap-2 border-divider border-t text-label-value-12"
              >
                <span className="flex min-w-0 items-center gap-1.5">
                  <ChainIcon iconUrl={deployment.chain.iconUrl} alt="" />
                  <span className="truncate">{deployment.chain.name}</span>
                </span>
                <Volume value={deployment.volume} className="text-secondary" />
              </li>
            ))}
          </ul>
          {hiddenCount > 0 && (
            <Line className="text-secondary">+{hiddenCount} more</Line>
          )}
        </>
      ) : (
        <>
          <Line className="gap-1 text-secondary">
            <span>On</span>
            <ChainIcon iconUrl={first.chain.iconUrl} alt="" />
            <span className="truncate">{first.chain.name}</span>
          </Line>
          <Line className="text-secondary">{shortAddress(first.address)}</Line>
        </>
      )}
    </button>
  )
}

function Line({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        'flex h-4 w-full items-center text-label-value-12 leading-none',
        className,
      )}
    >
      {children}
    </div>
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

function Bridges({
  bridges,
}: {
  bridges: InteropTokenRelationsNode['bridges']
}) {
  if (bridges.length === 0)
    return <span className="truncate">not identified</span>
  return (
    <span className="flex min-w-0 items-center gap-1">
      <span className="-space-x-1 flex shrink-0">
        {bridges.slice(0, 3).map((bridge) => (
          <img
            key={bridge.id}
            src={bridge.iconUrl}
            alt=""
            className="size-3.5 rounded-full bg-surface-primary"
          />
        ))}
      </span>
      <span className="truncate font-medium text-primary">
        {bridges.map((bridge) => bridge.name).join(', ')}
      </span>
    </span>
  )
}

export function shortAddress(address: string): string {
  return address.startsWith('0x') ? formatAddress(address) : address
}
