import { useEffect, useRef } from 'react'

export interface CanvasConnection {
  from: { x: number; y: number; direction: 'left' | 'right' }
  to: { x: number; y: number; direction: 'left' | 'right' }
  isHighlighted?: boolean
  isDashed?: boolean
  isDimmed?: boolean
}

export interface ConnectionsCanvasProps {
  connections: readonly CanvasConnection[]
  bounds: { minX: number; minY: number; width: number; height: number }
}

export function ConnectionsCanvas({
  connections,
  bounds,
}: ConnectionsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Draw when connections or bounds change
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = bounds.width * dpr
    canvas.height = bounds.height * dpr
    canvas.style.width = bounds.width + 'px'
    canvas.style.height = bounds.height + 'px'

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Reset any existing transform then apply DPR scaling
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.scale(dpr, dpr)

    // Collect computed colors once
    const colorCache: Record<string, string> = {}
    function getColor(className: string): string {
      if (colorCache[className]) return colorCache[className]
      const path = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'path',
      )
      path.setAttribute('class', className)
      document.body.appendChild(path)
      let color = getComputedStyle(path).stroke
      if (!color || color === 'none') {
        color = '#c21919'
      }
      document.body.removeChild(path)
      colorCache[className] = color
      return color
    }

    const defaultColor = getColor('stroke-2 stroke-coffee-400')
    const dimmedColor = getColor('stroke-2 stroke-coffee-400/30')
    const highlightedColor = getColor('stroke-[3] stroke-autumn-300')

    ctx.clearRect(0, 0, bounds.width, bounds.height)

    for (const conn of connections) {
      const fromCtrlX =
        conn.from.x + (conn.from.direction === 'left' ? -50 : 50)
      const toCtrlX = conn.to.x + (conn.to.direction === 'left' ? -50 : 50)

      const xOffset = -bounds.minX
      const yOffset = -bounds.minY

      ctx.beginPath()
      ctx.moveTo(conn.from.x + xOffset, conn.from.y + yOffset)
      ctx.bezierCurveTo(
        fromCtrlX + xOffset,
        conn.from.y + yOffset,
        toCtrlX + xOffset,
        conn.to.y + yOffset,
        conn.to.x + xOffset,
        conn.to.y + yOffset,
      )

      if (conn.isDashed) {
        ctx.setLineDash([5, 5])
      } else {
        ctx.setLineDash([])
      }

      if (conn.isHighlighted) {
        ctx.strokeStyle = highlightedColor
        ctx.lineWidth = 3
      } else if (conn.isDimmed) {
        ctx.strokeStyle = dimmedColor
        ctx.lineWidth = 2
      } else {
        ctx.strokeStyle = defaultColor
        ctx.lineWidth = 2
      }

      ctx.lineCap = 'round'
      ctx.stroke()
    }
  }, [connections, bounds])

  // Even when no connections we'll render to debug positioning
  if (bounds.width <= 0 || bounds.height <= 0) {
    return null
  }

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute"
      style={{
        left: bounds.minX,
        top: bounds.minY,
        zIndex: 0,
      }}
    />
  )
}
