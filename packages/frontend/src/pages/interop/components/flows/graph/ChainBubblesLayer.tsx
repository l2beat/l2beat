import { formatCurrency } from '@l2beat/shared-pure'
import { useId, useLayoutEffect, useRef, useState } from 'react'
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
  // A full ring around a hub on a small screen packs its labels closest
  const isCompact = isSmallScreen && awayFrom !== undefined
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
          isCompact
            ? 'text-label-value-12'
            : isSmallScreen
              ? 'text-label-value-13'
              : 'text-label-value-14',
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
            'font-medium',
            isCompact ? 'text-subtitle-11' : 'text-label-value-12',
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

// Everything flows into the hub, so what reaches it is hidden under its
// logo and value. They are filled with the color of the card the graph sits
// on, which reads as no background at all
const HUB_FILL = 'var(--surface-primary)'
const HUB_STROKE_OPACITY = 0.6
const HUB_STROKE_WIDTH = 1.5
// Room between the logo and the outline that follows its shape
const LOGO_OUTLINE_GAP = 2.5

/**
 * The hub of the graph. Every spoke meets it, so there is no free space
 * around it for a label: the value sits right under the icon.
 */
function CenterBubble({
  chain,
  layout,
  color,
  caption,
  isSmallScreen,
}: CenterBubbleProps) {
  const { x, y, radius } = layout
  const outlineId = `hub-outline-${useId().replace(/\W/g, '')}`
  const iconSize = radius * (caption ? 0.8 : 1.1)
  const iconY = caption ? y - radius * 0.62 : y - iconSize / 2

  return (
    <g>
      <title>{chain.name}</title>
      <defs>
        <LogoOutlineFilter id={outlineId} color={color} />
      </defs>
      <image
        href={chain.iconUrl}
        x={x - iconSize / 2}
        y={iconY}
        width={iconSize}
        height={iconSize}
        filter={`url(#${outlineId})`}
      />
      {caption && (
        <HubValue
          text={caption.text}
          x={x}
          y={y + radius * 0.45}
          color={color}
          isSmallScreen={isSmallScreen}
        />
      )}
    </g>
  )
}

/**
 * Draws a line around an image in the image's own shape, taken from its
 * transparency, and fills the gap between the two so nothing shows through
 * the transparent parts of the image.
 */
function LogoOutlineFilter({ id, color }: { id: string; color: string }) {
  return (
    <filter id={id} x="-25%" y="-25%" width="150%" height="150%">
      <GrowAlpha by={LOGO_OUTLINE_GAP} result="inner" />
      <GrowAlpha by={LOGO_OUTLINE_GAP + HUB_STROKE_WIDTH} result="outer" />
      <feFlood style={{ floodColor: HUB_FILL }} result="fillColor" />
      <feComposite in="fillColor" in2="outer" operator="in" result="fill" />
      <feFlood
        floodColor={color}
        floodOpacity={HUB_STROKE_OPACITY}
        result="strokeColor"
      />
      <feComposite in="strokeColor" in2="outer" operator="in" result="shape" />
      <feComposite in="shape" in2="inner" operator="out" result="stroke" />
      <feMerge>
        <feMergeNode in="fill" />
        <feMergeNode in="stroke" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  )
}

// Past a straight edge, blurred alpha falls to a tenth 1.28 deviations out
const EDGE_THRESHOLD = 0.1
const DEVIATIONS_AT_THRESHOLD = 1.28

/**
 * The image's silhouette grown outwards by `by` pixels. A blur cut at a
 * threshold grows it the same amount in every direction, so its points stay
 * points, where dilating would square them off.
 */
function GrowAlpha({ by, result }: { by: number; result: string }) {
  // a steep ramp around the threshold, so the edge stays smooth
  const slope = 40
  return (
    <>
      <feGaussianBlur
        in="SourceAlpha"
        stdDeviation={by / DEVIATIONS_AT_THRESHOLD}
      />
      <feComponentTransfer result={result}>
        <feFuncA
          type="linear"
          slope={slope}
          intercept={0.5 - EDGE_THRESHOLD * slope}
        />
      </feComponentTransfer>
    </>
  )
}

const HUB_VALUE_PADDING_X = 8

function HubValue({
  text,
  x,
  y,
  color,
  isSmallScreen,
}: {
  text: string
  x: number
  y: number
  color: string
  isSmallScreen: boolean
}) {
  const textRef = useRef<SVGTextElement>(null)
  const [textWidth, setTextWidth] = useState<number>()
  const height = isSmallScreen ? 18 : 22

  // The pill fits the text, whose width is only known once it is drawn
  // biome-ignore lint/correctness/useExhaustiveDependencies: remeasured when the text or its size changes
  useLayoutEffect(() => {
    setTextWidth(textRef.current?.getComputedTextLength())
  }, [text, isSmallScreen])

  const width =
    textWidth === undefined ? undefined : textWidth + 2 * HUB_VALUE_PADDING_X

  return (
    <g>
      {width !== undefined && (
        <rect
          x={x - width / 2}
          y={y - height / 2}
          width={width}
          height={height}
          rx={height / 2}
          style={{ fill: HUB_FILL }}
          stroke={color}
          strokeOpacity={HUB_STROKE_OPACITY}
          strokeWidth={HUB_STROKE_WIDTH}
        />
      )}
      <text
        ref={textRef}
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        className={cn(
          'fill-primary font-bold',
          isSmallScreen ? 'text-label-value-12' : 'text-label-value-14',
        )}
      >
        {text}
      </text>
    </g>
  )
}

const CAPTION_LINE_HEIGHT = 14
// Below this share of the direction being horizontal, a bubble counts as
// sitting at the top or bottom of the ring rather than on its side
const SIDE_THRESHOLD = 0.35
// A small screen has less room above and below than a full ring needs, so
// only the bubbles right at the top and bottom take their labels there
const SMALL_SCREEN_SIDE_THRESHOLD = 0.12

/**
 * Under the bubble by default. Around a hub that spot lies on the spoke, so
 * the label moves to the outside of the ring: above or below the bubbles at
 * the top and bottom, next to the ones on the sides. A full ring leaves no
 * room between neighbours for labels above and below them, so this holds on
 * a small screen too, with even fewer labels above and below.
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

  const sideThreshold = isSmallScreen
    ? SMALL_SCREEN_SIDE_THRESHOLD
    : SIDE_THRESHOLD
  if (Math.abs(dirX) < sideThreshold) {
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
