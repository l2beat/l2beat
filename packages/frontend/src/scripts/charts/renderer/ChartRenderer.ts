import { makeQuery } from '../../query'
import { getYAxis } from './getYAxis'
import { FILL_STYLES, LINE_STYLES, SeriesStyle } from './styles'

interface Point<T> {
  series: number[]
  data: T
  // TODO: milestone?: Milestone
}

interface RenderParams<T> {
  points: Point<T>[]
  seriesStyle: SeriesStyle[]
  formatYAxisLabel: (value: number) => string
  renderTooltip: (pointData: T) => string
  yAxisScale: 'LOG' | 'LIN'
}

export class ChartRenderer {
  private readonly LABEL_COUNT = 5
  private readonly labelElements: HTMLElement[] = []
  private readonly canvas: HTMLCanvasElement
  private readonly ctx: CanvasRenderingContext2D
  private renderParams?: RenderParams<unknown>

  constructor(chartView: HTMLElement) {
    const { $, $$ } = makeQuery(chartView)

    const labelWrapper = $('[data-role="chart-labels"]')
    labelWrapper.dataset.enabled = 'true'

    this.labelElements = $$('[data-role="chart-label"]').reverse()
    console.assert(this.labelElements.length === this.LABEL_COUNT)

    this.canvas = $('[data-role="chart-canvas"]')
    const ctx = this.canvas.getContext('2d')
    if (!ctx) throw new Error('Failed to get canvas context')
    this.ctx = ctx

    window.addEventListener('resize', () => {
      if (this.renderParams) {
        this.rerender(this.renderParams)
      }
    })
  }

  render(params: RenderParams<unknown>) {
    this.renderParams = params
    this.rerender(this.renderParams)
  }

  private rerender<T>(params: RenderParams<T>) {
    const values = params.points.flatMap((point) => point.series)
    const { labels, getY } = getYAxis(
      values,
      params.yAxisScale === 'LOG',
      params.formatYAxisLabel,
      this.LABEL_COUNT,
    )
    for (let i = 0; i < this.LABEL_COUNT; i++) {
      this.labelElements[i].textContent = labels[i]
    }

    const rect = this.canvas.parentElement?.getBoundingClientRect()
    if (rect) {
      this.canvas.width = rect.width * window.devicePixelRatio
      this.canvas.height = rect.height * window.devicePixelRatio
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    for (const [si, series] of params.seriesStyle.entries()) {
      const usableHeight = this.canvas.height - 20 * window.devicePixelRatio // TODO: constant

      const linePath = new Path2D()
      for (const [pi, point] of params.points.entries()) {
        const x = (pi / (params.points.length - 1)) * this.canvas.width
        const y = this.canvas.height - getY(point.series[si]) * usableHeight
        if (pi === 0) {
          linePath.moveTo(x, y)
        } else {
          linePath.lineTo(x, y)
        }
      }

      const fillPath = new Path2D(linePath)
      fillPath.lineTo(this.canvas.width, this.canvas.height)
      fillPath.lineTo(0, this.canvas.height)
      fillPath.closePath()

      if (series.fillStyle) {
        this.ctx.fillStyle = FILL_STYLES[series.fillStyle](this.ctx)
        this.ctx.fill(fillPath)
      }

      if (series.lineStyle) {
        this.ctx.lineWidth = Math.floor(2 * window.devicePixelRatio)
        this.ctx.strokeStyle = LINE_STYLES[series.lineStyle](this.ctx)
        this.ctx.stroke(linePath)
      }
    }
  }
}
