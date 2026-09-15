import type { ReactNode } from 'react'
import { ChainIcon } from '~/pages/interop/components/ChainIcon'
import type { InteropTokenRelationsNode } from '~/server/features/layer2s/interop/token/getInteropTokenRelationsGraph'
import { cn } from '~/utils/cn'
import { isCluster } from './graphSelectors'
import type { NodeBox } from './layoutRelationsGraph'
import { shortAddress, Volume } from './RelationsPrimitives'

// Members are listed up to a cap that guards the canvas against a runaway cluster.
const CLUSTER_MEMBERS_CAP = 16

// The layout needs sizes before anything renders, so the same numbers drive
// both the size formula and the inline styles below.
const PADDING_X = 12
const PADDING_Y = 10
const BORDER_Y = 2
const TITLE_HEIGHT = 20
const META_GAP = 4
const META_HEIGHT = 16
const LIST_GAP = 12
const CLUSTER_ROW_HEIGHT = 26
const CLUSTER_FOOTER_HEIGHT = 20
const HEADER_HEIGHT = TITLE_HEIGHT + META_GAP + META_HEIGHT

export function getNodeSize(node: InteropTokenRelationsNode): {
  width: number
  height: number
} {
  const count = node.deployments.length
  const frame = 2 * PADDING_Y + BORDER_Y + HEADER_HEIGHT
  if (count <= 1) return { width: 184, height: frame + META_GAP + META_HEIGHT }
  const shown = getShownMembers(node).length
  const columns = getClusterColumns(count)
  const rows = Math.ceil(shown / columns)
  const list = LIST_GAP + rows * CLUSTER_ROW_HEIGHT
  const footer = count > shown ? CLUSTER_FOOTER_HEIGHT : 0
  return { width: columns === 1 ? 268 : 420, height: frame + list + footer }
}

function getClusterColumns(count: number): number {
  return count <= 3 ? 1 : 2
}

function getShownMembers(node: InteropTokenRelationsNode) {
  return node.deployments.length > CLUSTER_MEMBERS_CAP
    ? node.deployments.slice(0, CLUSTER_MEMBERS_CAP - 1)
    : node.deployments
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
  const shown = getShownMembers(node)
  const hiddenCount = node.deployments.length - shown.length
  const columns = getClusterColumns(node.deployments.length)

  return (
    <button
      type="button"
      style={{
        left: box.x,
        top: box.y,
        width: box.width,
        height: box.height,
        padding: `${PADDING_Y}px ${PADDING_X}px`,
      }}
      className={cn(
        'absolute flex flex-col overflow-hidden rounded-xl border bg-surface-primary text-left',
        'focus-visible:outline-2 focus-visible:outline-brand/50',
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
      <span
        className="flex w-full items-baseline justify-between gap-3"
        style={{ height: TITLE_HEIGHT }}
      >
        <span className="truncate font-bold text-label-value-15 text-primary">
          {first.symbol}
        </span>
        <Volume
          value={node.volume}
          className="font-semibold text-label-value-13 text-primary"
        />
      </span>
      {isCluster(node) ? (
        <>
          <Meta>
            <span className="shrink-0">Burn & mint via</span>
            <Bridges bridges={node.bridges} />
          </Meta>
          <span
            className="grid w-full gap-x-4"
            style={{
              marginTop: LIST_GAP,
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
          >
            {shown.map((deployment, index) => (
              <span
                key={`${deployment.chain.id}|${deployment.address}`}
                style={{ height: CLUSTER_ROW_HEIGHT }}
                className={cn(
                  'flex items-center justify-between gap-3 text-label-value-13',
                  index >= columns && 'border-divider border-t',
                )}
              >
                <span className="flex min-w-0 items-center gap-2 font-semibold text-primary">
                  <ChainIcon iconUrl={deployment.chain.iconUrl} alt="" />
                  <span className="truncate">{deployment.chain.name}</span>
                </span>
                <Volume value={deployment.volume} className="text-secondary" />
              </span>
            ))}
          </span>
          {hiddenCount > 0 && (
            <span
              className="flex w-full items-end text-label-value-12 text-secondary leading-none"
              style={{ height: CLUSTER_FOOTER_HEIGHT }}
            >
              +{hiddenCount} more deployments
            </span>
          )}
        </>
      ) : (
        <>
          <Meta>
            <span>On</span>
            <ChainIcon iconUrl={first.chain.iconUrl} alt="" />
            <span className="truncate font-semibold text-primary">
              {first.chain.name}
            </span>
          </Meta>
          <Meta className="font-mono">{shortAddress(first.address)}</Meta>
        </>
      )}
    </button>
  )
}

function Meta({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <span
      className={cn(
        'flex w-full items-center gap-1.5 text-label-value-12 text-secondary leading-none',
        className,
      )}
      style={{ marginTop: META_GAP, height: META_HEIGHT }}
    >
      {children}
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
    <span className="flex min-w-0 items-center gap-1.5">
      <span className="-space-x-1 flex shrink-0">
        {bridges.slice(0, 3).map((bridge) => (
          <img
            key={bridge.id}
            src={bridge.iconUrl}
            alt=""
            className="size-4 rounded-full bg-surface-primary"
          />
        ))}
      </span>
      <span className="truncate font-semibold text-primary">
        {bridges.map((bridge) => bridge.name).join(', ')}
      </span>
    </span>
  )
}
