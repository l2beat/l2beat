import { useCallback, useEffect, useRef } from 'react'
import type { CameraTransform, Node } from '../store/State'
import { useStore } from '../store/store'
import { toViewportBox } from '../store/utils/coordinates'
import { oklchColorToCSS } from '../utils/color'

export interface NodeViewCanvasProps {
  nodes: Node[]
  transform: CameraTransform
}

export function NodeViewCanvas({ nodes, transform }: NodeViewCanvasProps) {
  const canvasRef = useRef(null)
  const selectedNodeIds = useStore((state) => state.selectedNodeIds)

  const setupCanvas = useCallback(() => {
    const chart = canvasRef.current as HTMLCanvasElement | null
    if (!chart) return

    requestAnimationFrame(() => {
      const rect = chart.parentElement?.getBoundingClientRect()
      if (rect) {
        chart.width = rect.width
        chart.height = rect.height
      }
    })
  }, [])

  const render = useCallback(() => {
    const chart = canvasRef.current as HTMLCanvasElement | null
    const ctx = chart?.getContext('2d')
    if (!chart || !ctx) return

    requestAnimationFrame(() => {
      draw(ctx, nodes, selectedNodeIds, transform)
    })
  }, [transform, nodes])

  useEffect(() => {
    setupCanvas()
    render()
  }, [render, setupCanvas])

  return (
    <canvas ref={canvasRef} className="absolute" style={{ left: 0, top: 0 }} />
  )
}

function draw(
  ctx: CanvasRenderingContext2D,
  nodes: Node[],
  selectedNodeIds: readonly string[],
  transform: CameraTransform,
) {
  const offscreen = new OffscreenCanvas(ctx.canvas.width, ctx.canvas.height)
  if (offscreen === null) {
    return
  }
  const offscreenCtx = offscreen.getContext('2d')
  if (offscreenCtx === null) {
    return
  }

  drawOffscreen(offscreenCtx, nodes, selectedNodeIds, transform)

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.drawImage(offscreen, 0, 0)
  ctx.fill()
}

function drawOffscreen(
  ctx: OffscreenCanvasRenderingContext2D,
  nodes: Node[],
  selectedNodeIds: readonly string[],
  transform: CameraTransform,
) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  ctx.strokeStyle = '#000000'
  ctx.fillStyle = '#FFFFFF'
  for (const node of nodes) {
    const { x, y, width, height } = toViewportBox(node.box, transform)

    ctx.fillStyle = oklchColorToCSS(node.simpleNode.color)
    if (selectedNodeIds.find((e) => e === node.simpleNode.id) !== undefined) {
      ctx.strokeStyle = '#11aaff'
      ctx.lineWidth = transform.scale * 16
    } else {
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = transform.scale * 8
    }

    ctx.beginPath()
    ctx.roundRect(x, y, width, height, 10 * transform.scale)
    ctx.stroke()
    ctx.fill()

    ctx.fillStyle = '#000000'
    ctx.font = `${(16 * transform.scale).toFixed()}px system-ui`

    const maxWidth = width - 16 * transform.scale
    let yText = y + 28 * transform.scale
    ctx.fillText(node.simpleNode.name, x + 8 * transform.scale, yText, maxWidth)
    for (const field of node.fields) {
      yText += 24 * transform.scale
      ctx.fillText(field.name, x + 8 * transform.scale, yText, maxWidth)
    }
    ctx.fillStyle = '#ffffff'
  }
}
