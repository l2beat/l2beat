import type { ChainVolume } from '~/server/features/scaling/interop/getInteropFlows'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import type { InteropChainWithIcon } from '../../chain-selector/types'
import type {
  ChainNodeLayout,
  FlowsGraphLayout,
} from './utils/computeGraphLayout'
import { getChainColor } from './utils/getChainColor'

interface ChainBubblesLayerProps {
  interopChains: InteropChainWithIcon[]
  layout: FlowsGraphLayout
  chainVolumes: ChainVolume[]
}

export function ChainBubblesLayer({
  interopChains,
  layout,
  chainVolumes,
}: ChainBubblesLayerProps) {
  return interopChains.map((chain) => {
    const nodeLayout = layout.get(chain.id)
    if (!chain || !nodeLayout) return null

    const netFlow =
      chainVolumes.find((f) => f.chainId === chain.id)?.netFlow ?? 0

    return (
      <ChainBubble
        key={chain.id}
        chain={chain}
        layout={nodeLayout}
        selected={false}
        hovered={false}
        color={getChainColor(interopChains, chain.id)}
        netFlow={netFlow}
        onClick={() => {}}
      />
    )
  })
}

interface ChainBubbleProps {
  chain: InteropChainWithIcon
  layout: ChainNodeLayout
  selected: boolean
  hovered: boolean
  color: string
  netFlow: number
  onClick: () => void
}

function ChainBubble({
  chain,
  layout,
  selected,
  hovered,
  color,
  netFlow,
  onClick,
}: ChainBubbleProps) {
  const { x, y, radius } = layout
  const iconSize = radius * 1.1

  return (
    <g className="cursor-pointer" onClick={onClick}>
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill={color}
        fillOpacity={selected ? 0.25 : hovered ? 0.2 : 0.15}
        stroke={color}
        strokeWidth={selected ? 2.5 : 1.5}
        strokeOpacity={selected ? 1 : hovered ? 0.8 : 0.5}
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
        className="font-medium text-label-value-14"
      >
        {chain.name}
      </text>
      <text
        x={x}
        y={y + radius + 30}
        textAnchor="middle"
        className={cn(
          'font-medium text-label-value-12',
          netFlow > 0 ? 'fill-positive' : 'fill-negative',
        )}
      >
        {formatCurrency(netFlow, 'usd')}
      </text>
    </g>
  )
}
