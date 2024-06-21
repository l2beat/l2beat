import { useTheme } from 'next-themes'
import { useEffect, useRef } from 'react'
import { useChartContext } from './chart-context'
import { getLineDashSegments } from './utils/get-line-dash-segments'
import { getRenderPaths } from './utils/get-render-paths'
import { getFillStyle, getStrokeStyle } from './utils/get-style'

export function ChartRenderer() {
  const ref = useRef<HTMLCanvasElement>(null)
  const context = useChartContext()
  const { theme: rawTheme } = useTheme()
  const theme = rawTheme === 'dark' ? 'dark' : 'light'

  useEffect(() => {
    const chart = ref.current
    const ctx = chart?.getContext('2d')
    if (!chart || !ctx) return
    const setupCanvas = () =>
      requestAnimationFrame(() => {
        const rect = chart.parentElement?.getBoundingClientRect()
        if (rect) {
          chart.width = rect.width * window.devicePixelRatio
          chart.height = rect.height * window.devicePixelRatio
          context.setRect(rect)
        }
      })

    setupCanvas()
    window.addEventListener('resize', setupCanvas)
    return () => {
      window.removeEventListener('resize', setupCanvas)
    }
  }, [])

  useEffect(() => {
    const chart = ref.current
    const ctx = chart?.getContext('2d')
    if (!chart || !ctx) return

    const render = () =>
      requestAnimationFrame(() => {
        ctx.clearRect(0, 0, chart.width, chart.height)
        const renderPaths = getRenderPaths({ chart, context })

        for (const { style, paths } of renderPaths) {
          if (style.fill) {
            for (const path of paths) {
              ctx.fillStyle = getFillStyle(ctx, style.fill, theme)
              const fillPath = new Path2D(path.path)
              fillPath.lineTo(path.lastX, chart.height)
              fillPath.lineTo(path.startX ?? 0, chart.height)
              fillPath.closePath()
              ctx.fill(fillPath)
            }
          }
        }

        for (const { style, paths } of renderPaths) {
          if (style.line) {
            for (const path of paths) {
              ctx.lineWidth = Math.floor(2 * window.devicePixelRatio)
              ctx.strokeStyle = getStrokeStyle(ctx, style.line, theme)
              if (path.dashed) {
                const segments = getLineDashSegments(context.range)
                ctx.setLineDash(segments)
              } else {
                ctx.setLineDash([])
              }

              ctx.stroke(path.path)
            }
          }
        }
      })

    window.addEventListener('resize', render)
    render()

    return () => {
      window.removeEventListener('resize', render)
    }
  }, [context, theme])

  return (
    <canvas
      ref={ref}
      className="absolute bottom-0 left-0 z-20 block size-full"
    />
  )
}
