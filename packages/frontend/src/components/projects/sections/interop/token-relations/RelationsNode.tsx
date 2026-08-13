import { formatAddress, formatCurrency } from '@l2beat/shared-pure'
import type { InteropTokenRelationsNode } from '~/server/features/scaling/interop/token/getInteropTokenRelationsGraph'
import { cn } from '~/utils/cn'
import type { NodeBox } from './layout'

const CHAIN_ICON = 13
const BRIDGE_ICON = 14
const MAX_BRIDGE_ICONS = 3
const GROUP_CELL_WIDTH = 148
const GROUP_CELL_HEIGHT = 38
const GROUP_CELL_GAP = 6
const GROUP_HEADER_HEIGHT = 56
const GROUP_PADDING = 12

interface Props {
  node: InteropTokenRelationsNode
  box: NodeBox
  isSource: boolean
  isSelected: boolean
  isDimmed: boolean
  isUnconnected: boolean
  onPointerDown: (event: React.PointerEvent<SVGGElement>) => void
  onHoverChange: (hovered: boolean) => void
}

export function RelationsNode({
  node,
  box,
  isSource,
  isSelected,
  isDimmed,
  isUnconnected,
  onPointerDown,
  onHoverChange,
}: Props) {
  const isGroup = node.deployments.length > 1
  const first = node.deployments[0]
  if (!first) return null
  const groupColumns = getGroupColumns(node)

  return (
    <g
      transform={`translate(${box.x}, ${box.y})`}
      className={cn('cursor-pointer', isDimmed && 'opacity-20')}
      onPointerDown={onPointerDown}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      {isSource && (
        <rect
          x={-5}
          y={-5}
          width={box.width + 10}
          height={box.height + 10}
          rx={15}
          fill="none"
          className="stroke-brand"
          strokeOpacity={0.3}
          strokeWidth={1.5}
        />
      )}
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
          <text
            x={12}
            y={20}
            className="fill-primary font-bold text-label-value-13"
          >
            {first.symbol}
          </text>
          {node.volume !== null && (
            <text
              x={box.width - GROUP_PADDING}
              y={20}
              textAnchor="end"
              className="fill-secondary font-medium text-label-value-12"
            >
              <title>
                Observed 24h activity across the deployments in this set
              </title>
              {formatCurrency(node.volume, 'usd')}
            </text>
          )}
          <text x={12} y={42} className="fill-secondary text-label-value-12">
            Burn-mint · {node.deployments.length} chains
          </text>
          {node.bridges.length > 0 && (
            <g transform={`translate(${box.width - 12}, 30)`}>
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

          {node.deployments.map((deployment, index) => {
            const column = index % groupColumns
            const row = Math.floor(index / groupColumns)
            const x =
              GROUP_PADDING + column * (GROUP_CELL_WIDTH + GROUP_CELL_GAP)
            const y =
              GROUP_HEADER_HEIGHT + row * (GROUP_CELL_HEIGHT + GROUP_CELL_GAP)
            return (
              <g
                key={`${deployment.chain}-${deployment.address}`}
                transform={`translate(${x}, ${y})`}
              >
                <rect
                  width={GROUP_CELL_WIDTH}
                  height={GROUP_CELL_HEIGHT}
                  rx={6}
                  className="fill-surface-secondary stroke-divider"
                  strokeWidth={0.75}
                />
                <image
                  href={deployment.iconUrl}
                  x={8}
                  y={7}
                  width={CHAIN_ICON}
                  height={CHAIN_ICON}
                />
                <text
                  x={27}
                  y={17}
                  className="fill-primary font-medium text-label-value-12"
                >
                  <title>{deployment.chainName}</title>
                  {shorten(deployment.chainName, 17)}
                </text>
                <text
                  x={GROUP_CELL_WIDTH - 8}
                  y={32}
                  textAnchor="end"
                  className="fill-secondary text-label-value-12"
                >
                  {deployment.volume === null
                    ? 'No volume data'
                    : formatCurrency(deployment.volume, 'usd')}
                </text>
              </g>
            )
          })}
        </>
      ) : (
        <>
          <text
            x={12}
            y={20}
            className="fill-primary font-bold text-label-value-13"
          >
            {first.symbol}
          </text>
          {/* Volume rides the symbol's line: the node is only 64px tall, and a
              line of its own would crowd out the address. */}
          {first.volume !== null && (
            <text
              x={box.width - 12}
              y={20}
              textAnchor="end"
              className="fill-secondary font-medium text-label-value-12"
            >
              {formatCurrency(first.volume, 'usd')}
            </text>
          )}
          {/* The chain reads as a sentence — "On Avalanche" — rather than as a
              second title competing with the symbol. */}
          <text x={12} y={39} className="fill-secondary text-label-value-12">
            On
          </text>
          <image
            href={first.iconUrl}
            x={30}
            y={29}
            width={CHAIN_ICON}
            height={CHAIN_ICON}
          />
          <text x={48} y={39} className="fill-secondary text-label-value-12">
            {first.chainName}
          </text>
          <text x={12} y={54} className="fill-secondary text-label-value-12">
            {formatAddress(first.address)}
          </text>
        </>
      )}
    </g>
  )
}

export function getRelationsNodeWidth(node: InteropTokenRelationsNode): number {
  if (node.deployments.length <= 1) return 168
  const columns = getGroupColumns(node)
  return (
    GROUP_PADDING * 2 +
    columns * GROUP_CELL_WIDTH +
    (columns - 1) * GROUP_CELL_GAP
  )
}

export function getRelationsNodeHeight(
  node: InteropTokenRelationsNode,
): number {
  if (node.deployments.length <= 1) return 64
  const rows = Math.ceil(node.deployments.length / getGroupColumns(node))
  return (
    GROUP_HEADER_HEIGHT +
    rows * GROUP_CELL_HEIGHT +
    Math.max(0, rows - 1) * GROUP_CELL_GAP +
    GROUP_PADDING
  )
}

function getGroupColumns(node: InteropTokenRelationsNode): number {
  if (node.deployments.length <= 4) return 2
  return 3
}

function shorten(value: string, length: number): string {
  return value.length > length ? `${value.slice(0, length - 1)}…` : value
}
