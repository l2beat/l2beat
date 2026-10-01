import { formatCurrency } from '@l2beat/shared-pure'
import { cn } from '~/utils/cn'
import type {
  FlowsGraphCaption,
  FlowsGraphNode,
  FlowsGraphNodeData,
  GetFlowsGraphCaption,
} from './types'
import type {
  ChainNodeLayout,
  FlowsGraphLayout,
} from './utils/computeGraphLayout'
import { useFlowsGraph } from './utils/FlowsGraphContext'
import { getCenterSquare } from './utils/getCenterSquare'
import { getChainColor } from './utils/getChainColor'

interface ChainBubblesLayerProps {
  interopChains: FlowsGraphNode[]
  layout: FlowsGraphLayout
  chainData: FlowsGraphNodeData[]
  isSmallScreen: boolean
  centerChainId?: string
  getCaption?: GetFlowsGraphCaption
}

export function ChainBubblesLayer({
  interopChains,
  layout,
  chainData,
  isSmallScreen,
  centerChainId,
  getCaption = getNetFlowCaption,
}: ChainBubblesLayerProps) {
  const { highlightedChains, toggleHighlightedChain } = useFlowsGraph()
  const centerLayout = centerChainId ? layout.get(centerChainId) : undefined

  return interopChains.map((chain) => {
    const nodeLayout = layout.get(chain.id)
    if (!chain || !nodeLayout) return null

    const caption = getCaption(chainData.find((f) => f.chainId === chain.id))
    const color = getChainColor(interopChains, chain.id)

    if (chain.id === centerChainId) {
      return (
        <CenterBubble
          key={chain.id}
          chain={chain}
          layout={nodeLayout}
          color={color}
          caption={caption}
          isSmallScreen={isSmallScreen}
        />
      )
    }

    return (
      <ChainBubble
        key={chain.id}
        chain={chain}
        layout={nodeLayout}
        highlightedChains={highlightedChains}
        color={color}
        caption={caption}
        isSmallScreen={isSmallScreen}
        onClick={() => toggleHighlightedChain(chain.id)}
        awayFrom={centerLayout}
      />
    )
  })
}

function getNetFlowCaption(
  node: FlowsGraphNodeData | undefined,
): FlowsGraphCaption {
  const netFlow = node?.netFlow ?? 0
  return {
    text: `${netFlow > 0 ? '+' : ''}${formatCurrency(netFlow, 'usd')}`,
    tone: netFlow > 0 ? 'positive' : 'negative',
  }
}

const CAPTION_TONE_CLASS_NAMES: Record<FlowsGraphCaption['tone'], string> = {
  positive: 'fill-positive',
  negative: 'fill-negative',
  neutral: 'fill-secondary',
}

interface ChainBubbleProps {
  chain: FlowsGraphNode
  layout: ChainNodeLayout
  highlightedChains: string[]
  color: string
  caption: FlowsGraphCaption | undefined
  isSmallScreen: boolean
  onClick: () => void
  /** Hub of the graph. The label goes on the far side of the bubble from it */
  awayFrom?: ChainNodeLayout
}

function ChainBubble({
  chain,
  layout,
  highlightedChains,
  color,
  caption,
  isSmallScreen,
  onClick,
  awayFrom,
}: ChainBubbleProps) {
  const { x, y, radius } = layout
  const iconSize = radius * 1.1
  const nameLines = getChainNameLines(chain.name, isSmallScreen)
  const nameLineHeight = isSmallScreen ? 11 : 12
  const { labelX, nameY, captionY, textAnchor } = getLabelPosition(
    layout,
    awayFrom,
    nameLines.length,
    nameLineHeight,
    isSmallScreen,
  )

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
        x={labelX}
        y={nameY}
        textAnchor={textAnchor}
        className={cn(
          'fill-primary font-medium',
          isSmallScreen ? 'text-label-value-13' : 'text-label-value-14',
        )}
      >
        {nameLines.map((line, index) => (
          <tspan key={line} x={labelX} dy={index === 0 ? 0 : nameLineHeight}>
            {line}
          </tspan>
        ))}
      </text>
      {caption && (
        <text
          x={labelX}
          y={captionY}
          textAnchor={textAnchor}
          className={cn(
            'font-medium text-label-value-12',
            CAPTION_TONE_CLASS_NAMES[caption.tone],
          )}
        >
          {caption.text}
        </text>
      )}
    </g>
  )
}

interface CenterBubbleProps {
  chain: FlowsGraphNode
  layout: ChainNodeLayout
  color: string
  caption: FlowsGraphCaption | undefined
  isSmallScreen: boolean
}

/**
 * The hub of the graph. Every spoke meets it, so there is no free space
 * around it for a label: the icon and the value sit inside its square.
 */
function CenterBubble({
  chain,
  layout,
  color,
  caption,
  isSmallScreen,
}: CenterBubbleProps) {
  const { x, y, radius } = layout
  const square = getCenterSquare(layout)
  const iconSize = radius * (caption ? 0.8 : 1.1)
  const iconY = caption ? y - radius * 0.62 : y - iconSize / 2

  return (
    <g>
      <title>{chain.name}</title>
      <rect
        x={square.x}
        y={square.y}
        width={square.size}
        height={square.size}
        rx={square.cornerRadius}
        fill={color}
        stroke={color}
        fillOpacity={0.15}
        strokeWidth={1.5}
        strokeOpacity={0.5}
      />
      <image
        href={chain.iconUrl}
        x={x - iconSize / 2}
        y={iconY}
        width={iconSize}
        height={iconSize}
      />
      {caption && (
        <text
          x={x}
          y={y + radius * 0.52}
          textAnchor="middle"
          className={cn(
            'fill-primary font-bold',
            isSmallScreen ? 'text-label-value-12' : 'text-label-value-14',
          )}
        >
          {caption.text}
        </text>
      )}
    </g>
  )
}

const CAPTION_LINE_HEIGHT = 14
// Below this share of the direction being horizontal, a bubble counts as
// sitting at the top or bottom of the ring rather than on its side
const SIDE_THRESHOLD = 0.35

/**
 * Under the bubble by default. Around a hub that spot lies on the spoke, so
 * the label moves to the outside of the ring: above or below the bubbles at
 * the top and bottom, next to the ones on the sides.
 * A small screen has no room beside the ring, so there every label goes
 * above or below its bubble, whichever is further from the hub.
 */
export function getLabelPosition(
  { x, y, radius }: ChainNodeLayout,
  awayFrom: ChainNodeLayout | undefined,
  nameLinesCount: number,
  nameLineHeight: number,
  isSmallScreen: boolean,
): {
  labelX: number
  nameY: number
  captionY: number
  textAnchor: 'start' | 'middle' | 'end'
} {
  const namesHeight = (nameLinesCount - 1) * nameLineHeight
  const distance = awayFrom ? Math.hypot(x - awayFrom.x, y - awayFrom.y) : 0

  if (!awayFrom || distance === 0) {
    const nameY = y + radius + 16
    return {
      labelX: x,
      nameY,
      captionY: nameY + namesHeight + CAPTION_LINE_HEIGHT,
      textAnchor: 'middle',
    }
  }

  const dirX = (x - awayFrom.x) / distance
  const dirY = (y - awayFrom.y) / distance

  if (isSmallScreen || Math.abs(dirX) < SIDE_THRESHOLD) {
    const nameY =
      dirY < 0
        ? y - radius - 10 - CAPTION_LINE_HEIGHT - namesHeight
        : y + radius + 16
    return {
      labelX: x,
      nameY,
      captionY: nameY + namesHeight + CAPTION_LINE_HEIGHT,
      textAnchor: 'middle',
    }
  }

  // Centered on the bubble, then nudged up or down to follow the ring
  const nameY = y - (namesHeight + CAPTION_LINE_HEIGHT) / 2 + 4 + dirY * 12
  return {
    labelX: x + Math.sign(dirX) * (radius + 8),
    nameY,
    captionY: nameY + namesHeight + CAPTION_LINE_HEIGHT,
    textAnchor: dirX > 0 ? 'start' : 'end',
  }
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
