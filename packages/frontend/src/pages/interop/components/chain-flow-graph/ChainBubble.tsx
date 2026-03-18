import type { KnownInteropBridgeType } from '@l2beat/shared-pure'
import { api } from '~/trpc/React'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { toInteropApiSelection } from '../../utils/toInteropApiSelection'
import type { InteropChainWithIcon } from '../chain-selector/types'
import type { ChainNodeLayout } from './computeGraphLayout'

interface Props {
  chain: InteropChainWithIcon
  layout: ChainNodeLayout
  selected: boolean
  netFlow: number
  firstSelectedChainId: string | undefined
  type: KnownInteropBridgeType | undefined
  onClick: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export function ChainBubble({
  chain,
  layout,
  selected,
  netFlow,
  firstSelectedChainId,
  type,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: Props) {
  const utils = api.useUtils()
  const { x, y, radius } = layout
  const iconSize = radius * 1.1

  const netFlowLabel =
    netFlow !== 0
      ? `${netFlow > 0 ? '+' : '-'}${formatCurrency(Math.abs(netFlow), 'usd')}`
      : undefined

  return (
    <g
      className="cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => {
        onMouseEnter()
        if (!firstSelectedChainId) return
        utils.interop.dashboard.prefetch({
          ...toInteropApiSelection(
            { from: [firstSelectedChainId], to: [chain.id] },
            'public',
          ),
          type,
        })
      }}
      onMouseLeave={onMouseLeave}
    >
      <circle
        cx={x}
        cy={y}
        r={radius}
        className={
          selected
            ? 'fill-brand/15 stroke-brand'
            : 'fill-surface-secondary stroke-divider hover:fill-brand/5'
        }
        strokeWidth={selected ? 2.5 : 1.5}
      />
      <image
        href={chain.iconUrl}
        x={x - iconSize / 2}
        y={y - iconSize / 2}
        width={iconSize}
        height={iconSize}
      />
      <text
        x={x}
        y={y + radius + 16}
        textAnchor="middle"
        className="fill-primary font-medium text-[12px]"
        fontSize={12}
      >
        {chain.name}
      </text>
      {netFlowLabel && (
        <text
          x={x}
          y={y + radius + 30}
          textAnchor="middle"
          className={
            netFlow > 0
              ? 'fill-positive font-medium'
              : 'fill-negative font-medium'
          }
          fontSize={10}
        >
          {netFlowLabel}
        </text>
      )}
    </g>
  )
}
