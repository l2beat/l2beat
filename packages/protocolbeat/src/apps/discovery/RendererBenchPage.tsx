import { useEffect, useMemo, useState } from 'react'
import { stackAutoLayout } from './panel-nodes/controls/StackLayoutButton'
import type { Node } from './panel-nodes/store/State'
import { useStore } from './panel-nodes/store/store'
import {
  BOTTOM_PADDING,
  FIELD_HEIGHT,
  HEADER_HEIGHT,
  NODE_WIDTH,
} from './panel-nodes/store/utils/constants'
import { getGraphProjection } from './panel-nodes/store/utils/graphProjection'
import { Viewport, type ViewportRenderer } from './panel-nodes/view/Viewport'

const GRID_HGAP = 80
const GRID_VGAP = 60

export function RendererBenchPage() {
  const [nodeCount, setNodeCount] = useState(500)
  const [fieldsPerNode, setFieldsPerNode] = useState(10)
  const [seed, setSeed] = useState(1)
  const [renderer, setRenderer] = useState<ViewportRenderer>('webgl')
  const layoutAction = useStore((s) => s.layout)

  const nodes = useMemo(
    () => generateNodes(nodeCount, fieldsPerNode, seed),
    [nodeCount, fieldsPerNode, seed],
  )

  const [layoutMs, setLayoutMs] = useState<number | null>(null)

  const runLayout = () => {
    const state = useStore.getState()
    const projection = getGraphProjection(state.nodes)
    const visible = state.nodes.filter(
      (node) => !projection.hiddenNodeIds.has(node.id),
    )
    const t0 = performance.now()
    const locations = stackAutoLayout(visible, true, projection.visibleEdges)
    const elapsed = Math.round(performance.now() - t0)
    layoutAction(locations)
    setLayoutMs(elapsed)
  }

  useEffect(() => {
    useStore.setState({
      projectId: 'bench',
      nodes,
      selected: [],
      loaded: true,
      transform: { offsetX: 20, offsetY: 20, scale: 0.25 },
    })
    runLayout()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes])

  const fps = useFps()
  const totalConnections = nodes.reduce((acc, n) => acc + n.fields.length, 0)

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <Viewport renderer={renderer} />
      <div className="absolute top-3 left-3 z-50 flex flex-col gap-2 rounded bg-coffee-900/90 p-3 font-mono text-coffee-200 text-xs shadow-lg">
        <div className="flex items-center gap-2">
          <span className="w-28">Renderer</span>
          <button
            type="button"
            className={btnClass(renderer === 'dom')}
            onClick={() => setRenderer('dom')}
          >
            dom
          </button>
          <button
            type="button"
            className={btnClass(renderer === 'webgl')}
            onClick={() => setRenderer('webgl')}
          >
            webgl
          </button>
        </div>
        <NumberRow
          label="Nodes"
          value={nodeCount}
          min={1}
          max={20000}
          onChange={setNodeCount}
        />
        <NumberRow
          label="Fields / node"
          value={fieldsPerNode}
          min={0}
          max={30}
          onChange={setFieldsPerNode}
        />
        <NumberRow
          label="Seed"
          value={seed}
          min={1}
          max={9999}
          onChange={setSeed}
        />
        <div className="flex items-center gap-2 border-coffee-700 border-t pt-2">
          <span className="w-28">Layout</span>
          <button type="button" className={btnClass(false)} onClick={runLayout}>
            run stack layout
          </button>
          {layoutMs !== null && <span>{layoutMs}ms</span>}
        </div>
        <div className="flex items-center gap-2">
          <span className="w-28">Connections</span>
          <span>{totalConnections.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-28">FPS</span>
          <span>{fps}</span>
        </div>
      </div>
    </div>
  )
}

interface NumberRowProps {
  label: string
  value: number
  min: number
  max: number
  onChange: (v: number) => void
}

function NumberRow({ label, value, min, max, onChange }: NumberRowProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-28">{label}</span>
      <input
        type="number"
        className="w-24 rounded bg-coffee-800 px-1 py-0.5 text-coffee-200"
        value={value}
        min={min}
        max={max}
        onChange={(e) => {
          const next = Number.parseInt(e.target.value, 10)
          if (Number.isFinite(next)) {
            onChange(Math.max(min, Math.min(max, next)))
          }
        }}
      />
    </div>
  )
}

function btnClass(active: boolean): string {
  return [
    'rounded border px-2 py-0.5',
    active
      ? 'border-autumn-300 bg-autumn-300/20 text-autumn-300'
      : 'border-coffee-700 text-coffee-200 hover:border-coffee-500',
  ].join(' ')
}

function useFps(): number {
  const [fps, setFps] = useState(0)
  useEffect(() => {
    let frames = 0
    let last = performance.now()
    let raf = 0
    const tick = () => {
      frames++
      const now = performance.now()
      if (now - last >= 500) {
        setFps(Math.round((frames * 1000) / (now - last)))
        frames = 0
        last = now
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  return fps
}

function generateNodes(
  count: number,
  fieldsPerNode: number,
  seed: number,
): Node[] {
  const rng = mulberry32(seed)
  const cols = Math.max(1, Math.ceil(Math.sqrt(count)))
  const colStride = NODE_WIDTH + GRID_HGAP
  const nodeHeight =
    HEADER_HEIGHT + fieldsPerNode * FIELD_HEIGHT + BOTTOM_PADDING
  const rowStride = nodeHeight + GRID_VGAP

  const nodes: Node[] = []
  for (let i = 0; i < count; i++) {
    const col = i % cols
    const row = Math.floor(i / cols)
    nodes.push({
      id: `eth:n${i}`,
      address: `eth:0x${i.toString(16).padStart(40, '0')}`,
      isInitial: false,
      hasTemplate: false,
      addressType: 'Contract',
      name: `Node ${i}`,
      fields: [],
      hiddenFields: [],
      box: {
        x: col * colStride,
        y: row * rowStride,
        width: NODE_WIDTH,
        height: nodeHeight,
      },
      color: 0,
      hueShift: 0,
      data: undefined,
      isReachable: true,
      opened: false,
      subnodes: [],
    })
  }

  for (let i = 0; i < nodes.length; i++) {
    const src = nodes[i]
    if (!src) continue
    for (let f = 0; f < fieldsPerNode; f++) {
      let targetIdx = Math.floor(rng() * nodes.length)
      if (targetIdx === i) targetIdx = (targetIdx + 1) % nodes.length
      const tgt = nodes[targetIdx]
      if (!tgt) continue

      const fromY =
        src.box.y + HEADER_HEIGHT + f * FIELD_HEIGHT + FIELD_HEIGHT / 2
      const tgtMidY = tgt.box.y + tgt.box.height / 2
      const tgtCenterX = tgt.box.x + tgt.box.width / 2
      const srcCenterX = src.box.x + src.box.width / 2
      const targetIsRight = tgtCenterX >= srcCenterX

      src.fields.push({
        name: `f${f}`,
        target: tgt.id,
        box: {
          x: src.box.x,
          y: src.box.y + HEADER_HEIGHT + f * FIELD_HEIGHT,
          width: src.box.width,
          height: FIELD_HEIGHT,
        },
        connection: {
          from: {
            direction: targetIsRight ? 'right' : 'left',
            x: targetIsRight ? src.box.x + src.box.width : src.box.x,
            y: fromY,
          },
          to: {
            direction: targetIsRight ? 'left' : 'right',
            x: targetIsRight ? tgt.box.x : tgt.box.x + tgt.box.width,
            y: tgtMidY,
          },
        },
      })
    }
  }

  return nodes
}

function mulberry32(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
