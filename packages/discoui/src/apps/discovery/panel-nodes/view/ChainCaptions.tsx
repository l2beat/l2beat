import { useMemo } from 'react'
import { AVAILABLE_CHAINS } from '../../../../config/chains'
import type { Box, Node } from '../store/State'
import { useStore } from '../store/store'
import { buildRenderGraph } from '../store/utils/renderGraph'
import { getChainHeaderColor } from './colors/colors'
import { drawsNodeDetail } from './NodesAndConnectionsWebGL'

const CAPTION_OFFSET_PX = 28
const CAPTION_MIN_EDGE_PX = 8

interface ChainCaption {
  name: string
  color: string
  box: Box
}

export function ChainCaptions() {
  const nodes = useStore((state) => state.nodes)
  const { offsetX, offsetY, scale } = useStore((state) => state.transform)
  const captions = useMemo(() => chainCaptions(nodes), [nodes])

  if (captions.length < 2) return null
  if (drawsNodeDetail(scale)) return null
  return captions.map((caption) => {
    const left = caption.box.x * scale + offsetX
    const top = caption.box.y * scale + offsetY
    if (left + caption.box.width * scale < 0) return null
    if (top + caption.box.height * scale < 0) return null
    return (
      <div
        key={caption.name}
        className="pointer-events-none absolute flex select-none items-center gap-2 whitespace-nowrap font-medium text-coffee-200 text-sm"
        style={{
          left: Math.max(CAPTION_MIN_EDGE_PX, left),
          top: Math.max(CAPTION_MIN_EDGE_PX, top - CAPTION_OFFSET_PX),
        }}
      >
        <span
          className="size-2.5 rounded-xs"
          style={{ backgroundColor: caption.color }}
        />
        {caption.name}
      </div>
    )
  })
}

function chainCaptions(nodes: readonly Node[]): ChainCaption[] {
  const graph = buildRenderGraph(nodes)
  const byChain = new Map<string, ChainCaption>()
  for (const node of graph.nodes) {
    if (graph.hidden.has(node.id)) continue
    const shortName = node.id.split(':')[0]
    const chain = AVAILABLE_CHAINS.find((c) => c.shortName === shortName)
    if (chain === undefined) continue
    const caption = byChain.get(chain.name)
    if (caption === undefined) {
      byChain.set(chain.name, {
        name: chain.displayName,
        color: getChainHeaderColor(chain.shortName),
        box: node.box,
      })
      continue
    }
    caption.box = unionBox(caption.box, node.box)
  }
  return [...byChain.values()]
}

function unionBox(a: Box, b: Box): Box {
  const x = Math.min(a.x, b.x)
  const y = Math.min(a.y, b.y)
  return {
    x,
    y,
    width: Math.max(a.x + a.width, b.x + b.width) - x,
    height: Math.max(a.y + a.height, b.y + b.height) - y,
  }
}
