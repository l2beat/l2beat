'use client'
import { useTheme } from 'next-themes'
import { useCallback, useEffect, useRef } from 'react'
import { useEventListener } from '~/hooks/use-event-listener'
import { useChartContext } from './chart-context'
import { useChartRect } from './chart-rect-context'
import { getLineDashSegments } from './utils/get-line-dash-segments'
import { getRenderPaths } from './utils/get-render-paths'
import { getFillStyle, getStrokeStyle } from './utils/get-style'

export function ChartRenderer() {
  const ref = useRef<HTMLCanvasElement>(null)
  const { setRect } = useChartRect()
  const context = useChartContext()
  const { resolvedTheme } = useTheme()
  const theme = resolvedTheme === 'light' ? 'light' : 'dark'

  const setupCanvas = useCallback(() => {
    const chart = ref.current
    if (!chart) return

    requestAnimationFrame(() => {
      const rect = chart.parentElement?.getBoundingClientRect()
      if (rect) {
        chart.width = rect.width * window.devicePixelRatio
        chart.height = rect.height * window.devicePixelRatio
        setRect(rect)
      }
    })
  }, [setRect])

  const render = useCallback(() => {
    const chart = ref.current
    const ctx = chart?.getContext('2d')
    if (!chart || !ctx || context.columns.length < 1) return

    requestAnimationFrame(() => {
      ctx.clearRect(0, 0, chart.width, chart.height)
      const renderPaths = getRenderPaths({ chart, context })

      for (const { style, paths } of renderPaths) {
        if (style.fill) {
          for (const path of paths) {
            ctx.fillStyle = getFillStyle(ctx, style.fill, theme, path.minY)
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
  }, [context, theme])

  useEffect(() => {
    setupCanvas()
    render()
  }, [render, setupCanvas])

  useEventListener('resize', () => {
    setupCanvas()
    render()
  })

  useEventListener('scroll', () => {
    const rect = ref.current?.parentElement?.getBoundingClientRect()
    if (rect) {
      setRect(rect)
    }
  })

  return (
    <canvas ref={ref} className="absolute bottom-0 left-0 block size-full" />
  )
}
