import { useEffect, useRef } from 'react'
import { useChartContext } from './chart-context'

export function ChartRenderer() {
  const ref = useRef<HTMLCanvasElement>(null)
  const context = useChartContext()

  useEffect(() => {
    const chart = ref.current
    const ctx = chart?.getContext('2d')
    if (!chart || !ctx) return
    // Setup canvas
    const rect = chart.parentElement?.getBoundingClientRect()
    if (rect) {
      chart.width = rect.width * window.devicePixelRatio
      chart.height = rect.height * window.devicePixelRatio
    }
    ctx.clearRect(0, 0, chart.width, chart.height)
  }, [])

  return (
    <canvas
      ref={ref}
      className="absolute bottom-0 left-0 z-20 block size-full"
    />
  )
}
