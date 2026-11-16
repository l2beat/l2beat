import { cn } from '~/utils/cn'
import type { InteropChainWithIcon } from '../../chain-selector/types'
import { useInteropFlows } from '../utils/InteropFlowsContext'
import { type ChainLabel, getLabelMetrics } from './utils/chainLabel'
import type {
  ChainNodeLayout,
  FlowsGraphLayout,
} from './utils/computeGraphLayout'
import { getChainColor } from './utils/getChainColor'

interface ChainBubblesLayerProps {
  interopChains: InteropChainWithIcon[]
  layout: FlowsGraphLayout
  labels: Map<string, ChainLabel>
  isSmallScreen: boolean
}

export function ChainBubblesLayer({
  interopChains,
  layout,
  labels,
  isSmallScreen,
}: ChainBubblesLayerProps) {
  const { highlightedChains, toggleHighlightedChain } = useInteropFlows()

  return interopChains.map((chain) => {
    const nodeLayout = layout.get(chain.id)
    const label = labels.get(chain.id)
    if (!chain || !nodeLayout || !label) return null

    return (
      <ChainBubble
        key={chain.id}
        chain={chain}
        layout={nodeLayout}
        highlightedChains={highlightedChains}
        color={getChainColor(interopChains, chain.id)}
        label={label}
        isSmallScreen={isSmallScreen}
        onClick={() => toggleHighlightedChain(chain.id)}
      />
    )
  })
}

interface ChainBubbleProps {
  chain: InteropChainWithIcon
  layout: ChainNodeLayout
  highlightedChains: string[]
  color: string
  label: ChainLabel
  isSmallScreen: boolean
  onClick: () => void
}

function ChainBubble({
  chain,
  layout,
  highlightedChains,
  color,
  label,
  isSmallScreen,
  onClick,
}: ChainBubbleProps) {
  const { x, y, radius, showNetFlow } = layout
  const iconSize = radius * 1.1
  const { nameLines, netFlow } = label
  const { nameLineHeight, nameOffset, netFlowOffset } =
    getLabelMetrics(isSmallScreen)
  const nameY = y + radius + nameOffset
  const netFlowY =
    nameY + (nameLines.length - 1) * nameLineHeight + netFlowOffset

  const highlighted = highlightedChains.includes(chain.id)

  const { fillOpacity, strokeWidth, strokeOpacity } = getBubbleStyle(
    highlighted,
    highlightedChains.length,
  )

  return (
    <g className="cursor-pointer" onClick={onClick}>
      {!showNetFlow && <title>{`${chain.name}: ${netFlow} net flow`}</title>}
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill={color}
        stroke={color}
        fillOpacity={fillOpacity}
        strokeWidth={strokeWidth}
        strokeOpacity={strokeOpacity}
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
        y={nameY}
        textAnchor="middle"
        className={cn(
          'fill-primary font-medium',
          isSmallScreen ? 'text-label-value-13' : 'text-label-value-14',
        )}
      >
        {nameLines.map((line, index) => (
          <tspan key={line} x={x} dy={index === 0 ? 0 : nameLineHeight}>
            {line}
          </tspan>
        ))}
      </text>
      {showNetFlow && (
        <text
          x={x}
          y={netFlowY}
          textAnchor="middle"
          className={cn(
            'font-medium text-label-value-12',
            netFlow.startsWith('+') ? 'fill-positive' : 'fill-negative',
          )}
        >
          {netFlow}
        </text>
      )}
    </g>
  )
}

function getBubbleStyle(highlighted: boolean, highlightedCount: number) {
  if (highlighted) {
    return { fillOpacity: 0.3, strokeWidth: 4, strokeOpacity: 1 }
  }
  if (highlightedCount === 2) {
    return { fillOpacity: 0.1125, strokeWidth: 0, strokeOpacity: 0 }
  }
  return { fillOpacity: 0.15, strokeWidth: 1.5, strokeOpacity: 0.5 }
}
