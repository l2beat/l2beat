import { useCallback, useEffect, useRef } from 'react'
import type { CameraTransform, Node } from '../store/State'
import { useStore } from '../store/store'
import { toViewportXY } from '../store/utils/coordinates'

export interface ConnectionsCanvasProps {
  nodes: Node[]
  transform: CameraTransform
}

export function ConnectionsCanvas({
  nodes,
  transform,
}: ConnectionsCanvasProps) {
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

  ctx.lineWidth = transform.scale
  ctx.strokeStyle = '#000000'
  for (const node of nodes) {
    for (const field of node.fields) {
      if (field.connection === undefined) {
        continue
      }

      const connection = field.connection
      if (
        selectedNodeIds.includes(node.simpleNode.id) ||
        selectedNodeIds.includes(field.connection.nodeId)
      ) {
        ctx.lineWidth = transform.scale * 8
        ctx.strokeStyle = '#0088ff'
      } else {
        ctx.lineWidth = transform.scale * 4
        ctx.strokeStyle = '#000000'
      }

      const [fromX, fromY] = toViewportXY(
        connection.from.x,
        connection.from.y,
        transform,
      )
      const [toX, toY] = toViewportXY(
        connection.to.x,
        connection.to.y,
        transform,
      )

      const { from, to } = field.connection
      const [cp1x, cp1y] = toViewportXY(
        from.x + (from.direction === 'left' ? -50 : 50),
        from.y,
        transform,
      )

      const [cp2x, cp2y] = toViewportXY(
        to.x + (to.direction === 'left' ? -50 : 50),
        to.y,
        transform,
      )

      ctx.beginPath()
      ctx.moveTo(fromX, fromY)
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, toX, toY)
      ctx.stroke()
    }
  }
}
