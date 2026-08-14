import { formatAddress, formatCurrency } from '@l2beat/shared-pure'
import type { InteropTokenRelationsNode } from '~/server/features/scaling/interop/token/getInteropTokenRelationsGraph'
import { cn } from '~/utils/cn'
import type { NodeBox } from './layout'

const CHAIN_ICON = 13
const BRIDGE_ICON = 14
const BRIDGE_ICON_GAP = 4
const BRIDGE_LABEL_CHARACTER_WIDTH = 5.1
const BRIDGE_NAME_CHARACTER_WIDTH = 5.8
const GROUP_PADDING = 12
const GROUP_LEDGER_COLUMN_GAP = 16
const GROUP_LEDGER_START_Y = 54
const GROUP_LEDGER_ROW_HEIGHT = 27
const GROUP_LEDGER_SINGLE_COLUMN_WIDTH = 280
const GROUP_LEDGER_DOUBLE_COLUMN_WIDTH = 400
const SINGLE_NODE_CHAIN_ICON_X = 34
const SINGLE_NODE_CHAIN_NAME_X = SINGLE_NODE_CHAIN_ICON_X + CHAIN_ICON + 5

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
  const groupCellWidth =
    (box.width -
      GROUP_PADDING * 2 -
      GROUP_LEDGER_COLUMN_GAP * (groupColumns - 1)) /
    groupColumns

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
              {formatCurrency(node.volume, 'usd')}
            </text>
          )}
          <BurnMintBridgeLine node={node} maxX={box.width - GROUP_PADDING} />

          {node.deployments.map((deployment, index) => {
            const column = index % groupColumns
            const row = Math.floor(index / groupColumns)
            const x =
              GROUP_PADDING +
              column * (groupCellWidth + GROUP_LEDGER_COLUMN_GAP)
            const y = GROUP_LEDGER_START_Y + row * GROUP_LEDGER_ROW_HEIGHT
            return (
              <g
                key={`${deployment.chain}-${deployment.address}`}
                transform={`translate(${x}, ${y})`}
              >
                <line
                  x1={0}
                  x2={groupCellWidth}
                  y1={GROUP_LEDGER_ROW_HEIGHT}
                  y2={GROUP_LEDGER_ROW_HEIGHT}
                  className="stroke-divider"
                  strokeWidth={0.75}
                />
                <image
                  href={deployment.iconUrl}
                  x={0}
                  y={(GROUP_LEDGER_ROW_HEIGHT - CHAIN_ICON) / 2}
                  width={CHAIN_ICON}
                  height={CHAIN_ICON}
                />
                <text
                  x={CHAIN_ICON + 6}
                  y={GROUP_LEDGER_ROW_HEIGHT / 2 + 4}
                  className="fill-primary font-medium text-label-value-12"
                >
                  <title>{deployment.chainName}</title>
                  {shorten(deployment.chainName, 15)}
                </text>
                <text
                  x={groupCellWidth}
                  y={GROUP_LEDGER_ROW_HEIGHT / 2 + 4}
                  textAnchor="end"
                  className="fill-secondary text-label-value-12"
                >
                  {deployment.volume === null
                    ? '—'
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
            x={SINGLE_NODE_CHAIN_ICON_X}
            y={29}
            width={CHAIN_ICON}
            height={CHAIN_ICON}
          />
          <text
            x={SINGLE_NODE_CHAIN_NAME_X}
            y={39}
            className="fill-secondary text-label-value-12"
          >
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

function BurnMintBridgeLine({
  node,
  maxX,
}: {
  node: InteropTokenRelationsNode
  maxX: number
}) {
  const label = 'Burn & mint cluster via'
  const labelX = GROUP_PADDING
  const labelWidth = label.length * BRIDGE_LABEL_CHARACTER_WIDTH
  const iconX = labelX + labelWidth + 7
  const firstBridge = node.bridges[0]
  const namesX = iconX + (firstBridge?.icon ? BRIDGE_ICON + BRIDGE_ICON_GAP : 0)
  const maxCharacters = Math.max(
    4,
    Math.floor((maxX - namesX) / BRIDGE_NAME_CHARACTER_WIDTH),
  )
  const bridgeNames = formatBridgeNames(
    node.bridges.map((bridge) => bridge.name),
    maxCharacters,
  )

  return (
    <g>
      <title>
        {node.bridges.length > 0
          ? node.bridges.map((bridge) => bridge.name).join(', ')
          : 'Minter not identified'}
      </title>
      <text x={labelX} y={42} className="fill-secondary text-label-value-12">
        {label}
      </text>
      {firstBridge?.icon && (
        <image
          href={firstBridge.icon}
          x={iconX}
          y={31}
          width={BRIDGE_ICON}
          height={BRIDGE_ICON}
        />
      )}
      <text
        x={namesX}
        y={42}
        className="fill-primary font-medium text-label-value-12"
      >
        {bridgeNames}
      </text>
    </g>
  )
}

function formatBridgeNames(names: string[], maxCharacters: number): string {
  if (names.length === 0) return 'Not identified'
  const full = names.join(', ')
  if (full.length <= maxCharacters) return full

  for (let visible = names.length - 1; visible >= 1; visible--) {
    const summary = `${names.slice(0, visible).join(', ')} +${names.length - visible}`
    if (summary.length <= maxCharacters) return summary
  }

  return shorten(names[0] ?? 'Not identified', maxCharacters)
}

export function getRelationsNodeWidth(node: InteropTokenRelationsNode): number {
  if (node.deployments.length <= 1) return 168
  return getGroupColumns(node) === 1
    ? GROUP_LEDGER_SINGLE_COLUMN_WIDTH
    : GROUP_LEDGER_DOUBLE_COLUMN_WIDTH
}

export function getRelationsNodeHeight(
  node: InteropTokenRelationsNode,
): number {
  if (node.deployments.length <= 1) return 64
  const rows = Math.ceil(node.deployments.length / getGroupColumns(node))
  return GROUP_LEDGER_START_Y + rows * GROUP_LEDGER_ROW_HEIGHT + GROUP_PADDING
}

function getGroupColumns(node: InteropTokenRelationsNode): number {
  return node.deployments.length <= 3 ? 1 : 2
}

function shorten(value: string, length: number): string {
  return value.length > length ? `${value.slice(0, length - 1)}…` : value
}
