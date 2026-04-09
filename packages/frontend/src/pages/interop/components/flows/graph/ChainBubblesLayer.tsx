import type { ChainVolume } from '~/server/features/scaling/interop/getInteropFlows'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import type { InteropChainWithIcon } from '../../chain-selector/types'
import { useInteropFlows } from '../utils/InteropFlowsContext'
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
  const { highlightedChains, toggleHighlightedChain } = useInteropFlows()

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
        highlighted={highlightedChains.includes(chain.id)}
        color={getChainColor(interopChains, chain.id)}
        netFlow={netFlow}
        onClick={() => toggleHighlightedChain(chain.id)}
      />
    )
  })
}

interface ChainBubbleProps {
  chain: InteropChainWithIcon
  layout: ChainNodeLayout
  highlighted: boolean
  color: string
  netFlow: number
  onClick: () => void
}

function ChainBubble({
  chain,
  layout,
  highlighted,
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
        stroke={color}
        fillOpacity={highlighted ? 0.25 : 0.15}
        strokeWidth={highlighted ? 2.5 : 1.5}
        strokeOpacity={highlighted ? 1 : 0.5}
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
