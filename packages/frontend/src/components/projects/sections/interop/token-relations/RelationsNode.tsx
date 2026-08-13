import { formatAddress, formatCurrency } from '@l2beat/shared-pure'
import type { InteropTokenRelationsNode } from '~/server/features/scaling/interop/token/getInteropTokenRelationsGraph'
import { cn } from '~/utils/cn'
import type { NodeBox } from './layout'

const ICON_SIZE = 18
const CHAIN_ICON = 13
const MAX_STACKED_ICONS = 4
const BRIDGE_ICON = 14
const MAX_BRIDGE_ICONS = 3
export const EXPANDED_ROW_HEIGHT = 18
export const EXPANDED_HEADER_HEIGHT = 84

interface Props {
  node: InteropTokenRelationsNode
  box: NodeBox
  isExpanded: boolean
  isSelected: boolean
  isDimmed: boolean
  isUnconnected: boolean
  onPointerDown: (event: React.PointerEvent<SVGGElement>) => void
  onHoverChange: (hovered: boolean) => void
}

export function RelationsNode({
  node,
  box,
  isExpanded,
  isSelected,
  isDimmed,
  isUnconnected,
  onPointerDown,
  onHoverChange,
}: Props) {
  const isGroup = node.deployments.length > 1
  const first = node.deployments[0]
  if (!first) return null

  return (
    <g
      transform={`translate(${box.x}, ${box.y})`}
      className={cn('cursor-pointer', isDimmed && 'opacity-20')}
      onPointerDown={onPointerDown}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      <rect
        width={box.width}
        height={box.height}
        rx={10}
        className={cn(
          'fill-surface-primary',
          isSelected ? 'stroke-brand' : 'stroke-divider',
        )}
        strokeWidth={isSelected ? 2 : 1}
        strokeDasharray={isUnconnected ? '4 3' : undefined}
      />

      {isGroup ? (
        <>
          <g transform="translate(12, 12)">
            {node.deployments
              .slice(0, MAX_STACKED_ICONS)
              .map((deployment, index) => (
                <image
                  key={`${deployment.chain}-${deployment.address}`}
                  href={deployment.iconUrl}
                  x={index * (ICON_SIZE - 6)}
                  width={ICON_SIZE}
                  height={ICON_SIZE}
                />
              ))}
            {node.deployments.length > MAX_STACKED_ICONS && (
              <text
                x={MAX_STACKED_ICONS * (ICON_SIZE - 6) + 6}
                y={ICON_SIZE - 4}
                className="fill-secondary font-bold text-label-value-12"
              >
                +{node.deployments.length - MAX_STACKED_ICONS}
              </text>
            )}
          </g>
          <text
            x={12}
            y={50}
            className="fill-primary font-bold text-label-value-13"
          >
            {first.symbol}
          </text>
          <text x={12} y={66} className="fill-secondary text-label-value-12">
            Burn-mint · {node.deployments.length} chains
          </text>
          {/* No figure for the group as a whole: a transfer between two of its
              own deployments is credited to both, so summing them would double
              count. Per-deployment volume shows when the group is expanded. */}
          {/* Which bridge puts them in a burn-mint relation — the relations
              that pulled this group together. */}
          {node.bridges.length > 0 && (
            <g transform={`translate(${box.width - 12}, 52)`}>
              {node.bridges
                .slice(0, MAX_BRIDGE_ICONS)
                .map((bridge, index, shown) => (
                  <image
                    key={bridge.id}
                    href={bridge.icon}
                    x={-(shown.length - index) * (BRIDGE_ICON - 5)}
                    width={BRIDGE_ICON}
                    height={BRIDGE_ICON}
                  >
                    <title>{bridge.name}</title>
                  </image>
                ))}
            </g>
          )}
        </>
      ) : (
        <>
          <text
            x={12}
            y={24}
            className="fill-primary font-bold text-label-value-13"
          >
            {first.symbol}
          </text>
          {/* Volume rides the symbol's line: the node is only 64px tall, and a
              line of its own would crowd out the address. */}
          {first.volume !== null && (
            <text
              x={box.width - 12}
              y={24}
              textAnchor="end"
              className="fill-secondary font-medium text-label-value-12"
            >
              {formatCurrency(first.volume, 'usd')}
            </text>
          )}
          {/* The chain reads as a sentence — "On Avalanche" — rather than as a
              second title competing with the symbol. */}
          <text x={12} y={43} className="fill-secondary text-label-value-12">
            On
          </text>
          <image
            href={first.iconUrl}
            x={30}
            y={33}
            width={CHAIN_ICON}
            height={CHAIN_ICON}
          />
          <text x={48} y={43} className="fill-secondary text-label-value-12">
            {first.chainName}
          </text>
          <text x={12} y={58} className="fill-secondary text-label-value-12">
            {formatAddress(first.address)}
          </text>
        </>
      )}

      {isExpanded &&
        node.deployments.map((deployment, index) => (
          <g
            key={`${deployment.chain}-${deployment.address}`}
            transform={`translate(12, ${EXPANDED_HEADER_HEIGHT + index * EXPANDED_ROW_HEIGHT})`}
          >
            <image href={deployment.iconUrl} width={12} height={12} y={-10} />
            <text x={18} className="fill-secondary text-label-value-12">
              {deployment.chainName}
            </text>
            {deployment.volume !== null && (
              <text
                x={box.width - 24}
                textAnchor="end"
                className="fill-secondary text-label-value-12"
              >
                {formatCurrency(deployment.volume, 'usd')}
              </text>
            )}
          </g>
        ))}
    </g>
  )
}
