import { Milestone } from '@l2beat/config'
import mean from 'lodash/mean'

import { formatRange } from '../../../utils'
import { makeQuery } from '../../query'
import { isMobile } from '../../utils/isMobile'
import {
  FILL_STYLES,
  LINE_STYLES,
  POINT_CLASS_NAMES,
  SeriesStyle,
} from '../styles'
import { renderMilestoneHover } from '../view-controller/hovers'
import { getYAxis } from './getYAxis'
import { renderMilestone } from './milestones'

interface Point<T> {
  series: number[]
  data: T
  milestone?: Milestone
}

export interface RenderParams<T> {
  points: Point<T>[]
  range: [number, number]
  seriesStyle: SeriesStyle[]
  formatYAxisLabel: (value: number) => string
  renderHoverContents: (pointData: T) => string
  useLogScale: boolean
}

const FIRST_LABEL_HEIGHT_PX = 20
const LABEL_COUNT = 5
const HOVER_CANVAS_PADDING = 16
const MILESTONE_MAX_Y = 25
const MILESTONE_MAX_Y_MOBILE = 30
const MILESTONE_CAPTURE_X = 20

export class ChartRenderer {
  private readonly labelElements: HTMLElement[] = []
  private readonly canvas: HTMLCanvasElement
  private readonly canvasInteractionZone: HTMLElement
  private readonly ctx: CanvasRenderingContext2D
  private readonly hover: HTMLElement
  private readonly hoverLine: HTMLElement
  private readonly hoverPointWrapper: HTMLElement
  private readonly hoverContents: HTMLElement
  private readonly milestonesWrapper: HTMLElement
  private readonly range: HTMLElement
  private renderParams?: RenderParams<unknown>
  private getY: (value: number) => number = (x) => x
  private lastPointIndex?: number

  constructor(chart: HTMLElement) {
    const { $, $$ } = makeQuery(chart)

    this.hover = $('[data-role="chart-hover"]')
    this.hoverLine = $('[data-role="chart-hover-line"]')
    this.hoverPointWrapper = $('[data-role="chart-hover-points"]')
    this.hoverContents = $('[data-role="chart-hover-contents"]')
    this.milestonesWrapper = $('[data-role="chart-milestones"]')
    this.range = $('[data-role="chart-range"]')
    this.labelElements = $$('[data-role="chart-label"]').reverse()
    console.assert(this.labelElements.length === LABEL_COUNT)

    this.canvasInteractionZone = $(
      '[data-role="chart-canvas-interaction-zone"]',
    )
    this.canvas = $('[data-role="chart-canvas"]')
    const ctx = this.canvas.getContext('2d')
    if (!ctx) throw new Error('Failed to get canvas context')

    this.ctx = ctx

    this.initializeListeners()
  }

  render<T>(params: RenderParams<T>) {
    this.renderParams = params as RenderParams<unknown>
    this.rerender(this.renderParams)
  }

  private rerender<T>(params: RenderParams<T>) {
    this.setupCanvas()
    this.setupYAxisLabels(
      params.points,
      params.useLogScale,
      params.formatYAxisLabel,
    )
    this.setupHoverPoints(params.seriesStyle)
    this.renderMilestones(params.points)
    this.range.innerHTML = formatRange(...params.range)
    this.renderData(params)
  }

  private renderData<T>(params: RenderParams<T>) {
    const usableHeight =
      this.canvas.height - FIRST_LABEL_HEIGHT_PX * window.devicePixelRatio

    const paths = params.seriesStyle.map((series, si) => {
      const linePath = new Path2D()
      for (const [pi, point] of params.points.entries()) {
        const x = (pi / (params.points.length - 1)) * this.canvas.width
        const y =
          this.canvas.height - this.getY(point.series[si]) * usableHeight
        if (pi === 0) {
          linePath.moveTo(x, y)
        } else {
          linePath.lineTo(x, y)
        }
      }
      return { style: series, path: linePath }
    })

    for (const { style, path } of paths) {
      if (style.fill) {
        this.ctx.fillStyle = FILL_STYLES[style.fill](this.ctx)
        const fillPath = new Path2D(path)
        fillPath.lineTo(this.canvas.width, this.canvas.height)
        fillPath.lineTo(0, this.canvas.height)
        fillPath.closePath()
        this.ctx.fill(fillPath)
      }
    }

    for (const { style, path } of paths) {
      if (style.line) {
        this.ctx.lineWidth = Math.floor(2 * window.devicePixelRatio)
        this.ctx.strokeStyle = LINE_STYLES[style.line](this.ctx)
        this.ctx.stroke(path)
      }
    }
  }

  private initializeListeners() {
    window.addEventListener('resize', () => {
      if (this.renderParams) {
        this.rerender(this.renderParams)
      }
    })

    window.addEventListener('mousemove', (e) => this.onWindowMoveEvent(e))
    window.addEventListener('touchmove', (e) =>
      this.onWindowMoveEvent(e.touches[0]),
    )

    const interactiveZones = [
      this.milestonesWrapper,
      this.canvasInteractionZone,
    ]

    interactiveZones.forEach((zone) => {
      zone.addEventListener('mousemove', (e) => this.onCanvasMoveEvent(e))
      zone.addEventListener('touchmove', (e) =>
        this.onCanvasMoveEvent(e.touches[0]),
      )
    })
  }

  private renderMilestones(points: Point<unknown>[]) {
    const { width } = this.canvas.getBoundingClientRect()
    const milestonesHtml = points
      .map((point, i) =>
        point.milestone
          ? renderMilestone(
              (width / (points.length - 1)) * i,
              point.milestone.link,
            )
          : '',
      )
      .join('')
    this.milestonesWrapper.innerHTML = milestonesHtml
  }

  private setupCanvas() {
    const rect = this.canvas.parentElement?.getBoundingClientRect()
    if (rect) {
      this.canvas.width = rect.width * window.devicePixelRatio
      this.canvas.height = rect.height * window.devicePixelRatio
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  private setupHoverPoints(seriesStyle: SeriesStyle[]) {
    this.hover.classList.add('hidden')
    this.hoverPointWrapper.innerHTML = seriesStyle
      .map((series, i) => {
        if (!series.point) {
          return ''
        }
        return `<div data-series="${i}" class="absolute z-40"></div>`
      })
      .join('')
  }

  private setupYAxisLabels(
    points: Point<unknown>[],
    useLogScale: boolean,
    formatYAxisLabel: (value: number) => string,
  ) {
    const values = points.flatMap((point) => point.series)
    const { labels, getY } = getYAxis(
      values,
      useLogScale,
      formatYAxisLabel,
      LABEL_COUNT,
    )
    this.getY = getY
    for (let i = 0; i < LABEL_COUNT; i++) {
      this.labelElements[i].textContent = labels[i]
    }
  }

  private onCanvasMoveEvent(e: MouseEvent | Touch) {
    const rect = this.canvas.getBoundingClientRect()

    const position = (e.clientX - rect.left) / rect.width
    const x = Math.min(1, Math.max(0, position))
    const y = Math.abs(e.clientY - rect.top - rect.height)

    this.onMouseMoved(x, y)
  }

  private onWindowMoveEvent(e: MouseEvent | Touch) {
    const rect = this.canvasInteractionZone.getBoundingClientRect()
    const isInside =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom

    if (!isInside) {
      this.onMouseExited()
    }
  }

  private onMouseMoved(mouseX: number, mouseY: number) {
    if (!this.renderParams) {
      return
    }
    const pointsLength = this.renderParams.points.length
    let pointIndex = Math.round(mouseX * (pointsLength - 1))
    if (this.lastPointIndex === pointIndex) {
      return
    }
    this.lastPointIndex = pointIndex
    let point = this.renderParams.points[pointIndex]

    const { width: canvasWidth, height: canvasHeight } =
      this.canvas.getBoundingClientRect()
    const getCanvasX = (index: number) =>
      (index / (pointsLength - 1)) * canvasWidth

    let milestone: Milestone | undefined
    const milestoneHoverIndex = this.getMilestoneHoverIndex(
      mouseX,
      mouseY,
      canvasWidth,
      this.renderParams.points,
      getCanvasX,
    )
    if (milestoneHoverIndex !== undefined) {
      pointIndex = milestoneHoverIndex
      point = this.renderParams.points[pointIndex]
      milestone = point.milestone
    }

    const left = getCanvasX(pointIndex)

    const yValues: number[] = []

    for (const [i, value] of point.series.entries()) {
      const pointElement = this.hoverPointWrapper.querySelector<HTMLElement>(
        `[data-series="${i}"]`,
      )
      if (pointElement) {
        const pointStyle = this.renderParams.seriesStyle[i].point
        pointElement.className = `absolute z-40 ${
          milestone
            ? POINT_CLASS_NAMES.milestone
            : pointStyle
            ? POINT_CLASS_NAMES[pointStyle]
            : ''
        }`
        const y = this.getY(value)
        const bottom = Math.max(0, y * (canvasHeight - FIRST_LABEL_HEIGHT_PX))
        yValues.push(bottom)
        pointElement.style.left = `${left - 4}px`
        pointElement.style.bottom = `${bottom - 4}px`
      }
    }

    if (milestone) {
      this.hoverLine.classList.add('dark:bg-green-500', 'bg-green-600')
    } else {
      this.hoverLine.classList.remove('dark:bg-green-500', 'bg-green-600')
    }

    this.hoverLine.style.left = `${left - 1}px`

    const averageY = yValues.length === 0 ? canvasHeight / 2 : mean(yValues)

    this.hoverContents.innerHTML = milestone
      ? renderMilestoneHover(milestone)
      : this.renderParams.renderHoverContents(point.data)
    this.hover.classList.remove('hidden')
    const { height } = this.hoverContents.getBoundingClientRect()
    const contentsBottom = Math.min(
      canvasHeight - height - HOVER_CANVAS_PADDING,
      Math.max(averageY - height / 2, HOVER_CANVAS_PADDING),
    )
    this.hoverContents.style.bottom = `${contentsBottom}px`
    if (
      this.hoverContents.clientWidth + left <
      canvasWidth - HOVER_CANVAS_PADDING
    ) {
      this.hoverContents.style.removeProperty('right')
      this.hoverContents.style.left = `${left + HOVER_CANVAS_PADDING}px`
    } else {
      this.hoverContents.style.removeProperty('left')
      this.hoverContents.style.right = `${
        canvasWidth - left + HOVER_CANVAS_PADDING
      }px`
    }
  }

  private onMouseExited() {
    this.lastPointIndex = undefined
    this.hover.classList.add('hidden')
  }

  private getMilestoneHoverIndex(
    mouseX: number,
    mouseY: number,
    canvasWidth: number,
    points: Point<unknown>[],
    getCanvasX: (index: number) => number,
  ) {
    const milestoneMouseY = isMobile()
      ? MILESTONE_MAX_Y_MOBILE
      : MILESTONE_MAX_Y
    const mouseCanvasX = mouseX * canvasWidth

    if (mouseY < milestoneMouseY) {
      let result = Infinity
      let indexResult
      for (const [i, p] of points.entries()) {
        if (p.milestone) {
          const milestoneDistance = Math.abs(mouseCanvasX - getCanvasX(i))
          if (milestoneDistance < result) {
            result = milestoneDistance
            indexResult = i
          }
        }
      }
      if (result <= MILESTONE_CAPTURE_X && indexResult !== undefined) {
        return indexResult
      }
    }
  }
}
