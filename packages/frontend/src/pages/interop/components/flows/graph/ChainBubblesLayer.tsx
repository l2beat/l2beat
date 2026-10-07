import { formatCurrency } from '@l2beat/shared-pure'
import type { ChainData } from '~/server/features/layer2s/interop/getInteropFlows'
import { cn } from '~/utils/cn'
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

  const nodes = interopChains.flatMap((chain) => {
    const nodeLayout = layout.get(chain.id)
    if (!nodeLayout) return []
    return [
      {
        chain,
        layout: nodeLayout,
        netFlow: chainData.find((f) => f.chainId === chain.id)?.netFlow ?? 0,
        onClick: () => toggleHighlightedChain(chain.id),
      },
    ]
  })

  // Labels are drawn after every bubble, so no bubble or logo covers another chain's label.
  return (
    <>
      {nodes.map((node) => (
        <ChainBubble
          key={node.chain.id}
          chain={node.chain}
          layout={node.layout}
          highlightedChains={highlightedChains}
          color={getChainColor(interopChains, node.chain.id)}
          onClick={node.onClick}
        />
      ))}
      {nodes.map((node) => (
        <ChainLabel
          key={node.chain.id}
          chain={node.chain}
          layout={node.layout}
          netFlow={node.netFlow}
          isSmallScreen={isSmallScreen}
          onClick={node.onClick}
        />
      ))}
    </>
  )
}

interface ChainBubbleProps {
  chain: InteropChainWithIcon
  layout: ChainNodeLayout
  highlightedChains: string[]
  color: string
  onClick: () => void
}

function ChainBubble({
  chain,
  layout,
  highlightedChains,
  color,
  onClick,
}: ChainBubbleProps) {
  const { x, y, radius } = layout
  const iconSize = radius * 1.1

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
    </g>
  )
}

interface ChainLabelProps {
  chain: InteropChainWithIcon
  layout: ChainNodeLayout
  netFlow: number
  isSmallScreen: boolean
  onClick: () => void
}

// A halo in the card colour keeps a label legible where it crosses a neighbouring bubble.
const LABEL_HALO =
  'stroke-surface-primary [paint-order:stroke] [stroke-linejoin:round] [stroke-width:3px]'

function ChainLabel({
  chain,
  layout,
  netFlow,
  isSmallScreen,
  onClick,
}: ChainLabelProps) {
  const { x, y, radius } = layout
  const nameLines = getChainNameLines(chain.name, isSmallScreen)
  const nameLineHeight = isSmallScreen ? 11 : 12
  const nameY = y + radius + 16
  const netFlowY = nameY + (nameLines.length - 1) * nameLineHeight + 14

  return (
    <g className="cursor-pointer" onClick={onClick}>
      <text
        x={x}
        y={nameY}
        textAnchor="middle"
        className={cn(
          'fill-primary font-medium',
          LABEL_HALO,
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
          LABEL_HALO,
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
