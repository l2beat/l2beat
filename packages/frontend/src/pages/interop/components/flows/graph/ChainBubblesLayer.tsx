import type { ChainData } from '~/server/features/scaling/interop/getInteropFlows'
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
  chainData: ChainData[]
  isSmallScreen: boolean
}

export function ChainBubblesLayer({
  interopChains,
  layout,
  chainData,
  isSmallScreen,
}: ChainBubblesLayerProps) {
  const { highlightedChains, toggleHighlightedChain } = useInteropFlows()

  return interopChains.map((chain) => {
    const nodeLayout = layout.get(chain.id)
    if (!chain || !nodeLayout) return null

    const netFlow = chainData.find((f) => f.chainId === chain.id)?.netFlow ?? 0

    return (
      <ChainBubble
        key={chain.id}
        chain={chain}
        layout={nodeLayout}
        highlightedChains={highlightedChains}
        color={getChainColor(interopChains, chain.id)}
        netFlow={netFlow}
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
  netFlow: number
  isSmallScreen: boolean
  onClick: () => void
}

function ChainBubble({
  chain,
  layout,
  highlightedChains,
  color,
  netFlow,
  isSmallScreen,
  onClick,
}: ChainBubbleProps) {
  const { x, y, radius } = layout
  const iconSize = radius * 1.1
  const nameLines = getChainNameLines(chain.name, isSmallScreen)
  const nameLineHeight = isSmallScreen ? 11 : 12
  const nameY = y + radius + 16
  const netFlowY = nameY + (nameLines.length - 1) * nameLineHeight + 14

  const highlighted = highlightedChains.includes(chain.id)

  const { fillOpacity, strokeWidth, strokeOpacity } = getBubbleStyle(
    highlighted,
    highlightedChains.length,
  )

  return (
    <g className="cursor-pointer" onClick={onClick}>
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
      <text
        x={x}
        y={netFlowY}
        textAnchor="middle"
        className={cn(
          'font-medium text-label-value-12',
          netFlow > 0 ? 'fill-positive' : 'fill-negative',
        )}
      >
        {`${netFlow > 0 ? '+' : ''}${formatCurrency(netFlow, 'usd')}`}
      </text>
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

const MOBILE_LABEL_MAX_LINE_LENGTH = 13

function getChainNameLines(name: string, isSmallScreen: boolean): string[] {
  if (!isSmallScreen) return [name]

  const words = name.trim().split(/\s+/)
  if (words.length <= 1) return [name]

  const lines: string[] = []
  let currentLine = words[0] ?? ''

  for (const word of words.slice(1)) {
    const nextLine = `${currentLine} ${word}`
    if (nextLine.length <= MOBILE_LABEL_MAX_LINE_LENGTH || lines.length === 1) {
      currentLine = nextLine
      continue
    }

    lines.push(currentLine)
    currentLine = word
  }

  lines.push(currentLine)
  return lines
}
