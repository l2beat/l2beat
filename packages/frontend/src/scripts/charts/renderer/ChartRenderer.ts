import { Milestone } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import mean from 'lodash/mean'
import { formatRange } from '../../../utils'
import { makeQuery } from '../../query'
import { isMobile } from '../../utils/isMobile'
import {
  FILL_STYLES,
  LINE_STYLES,
  POINT_CLASS_NAMES,
  SeriesStyle,
  SeriesStyleFill,
  SeriesStyleLine,
} from '../styles'
import { renderMilestoneHover } from '../view-controller/hovers'
import { getSeriesGroups } from './getSeriesGroups'
import { getYAxis } from './getYAxis'
import { renderMilestone } from './milestones'

export interface Point<T> {
  series: { value: number; dashed?: boolean }[]
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
  theme: 'dark' | 'light'
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
    const renderPaths = this.getRenderPaths(params)

    for (const { style, paths } of renderPaths) {
      if (style.fill) {
        for (const path of paths) {
          this.ctx.fillStyle = this.getFillStyle(style.fill, params.theme)
          const fillPath = new Path2D(path.path)
          fillPath.lineTo(path.lastX, this.canvas.height)
          fillPath.lineTo(path.startX ?? 0, this.canvas.height)
          fillPath.closePath()
          this.ctx.fill(fillPath)
        }
      }
    }

    for (const { style, paths } of renderPaths) {
      if (style.line) {
        for (const path of paths) {
          this.ctx.lineWidth = Math.floor(2 * window.devicePixelRatio)
          this.ctx.strokeStyle = this.getStrokeStyle(style.line, params.theme)
          if (path.dashed) {
            const segments = this.getLineDashSegments(params.range)
            this.ctx.setLineDash(segments)
          } else {
            this.ctx.setLineDash([])
          }

          if (params) this.ctx.stroke(path.path)
        }
      }
    }
  }

  private getRenderPaths<T>(params: RenderParams<T>) {
    const usableHeight =
      this.canvas.height - FIRST_LABEL_HEIGHT_PX * window.devicePixelRatio

    return params.seriesStyle.flatMap((series, si) => {
      let startX: number | undefined
      let lastX: number | undefined
      let lastY: number | undefined

      const seriesGroup = getSeriesGroups(params.points, si)

      return {
        style: series,
        paths: seriesGroup.map((group, gi) => {
          const prevGroup = gi > 0 ? seriesGroup.at(gi - 1) : undefined
          const path = new Path2D()

          for (const [groupPointIndex, point] of group.entries()) {
            const pointIndex = (prevGroup?.length ?? 0) + groupPointIndex
            const x =
              (pointIndex / (params.points.length - 1)) * this.canvas.width
            const y = this.canvas.height - this.getY(point.value) * usableHeight

            if (pointIndex === 0) {
              path.moveTo(x, y)
            } else if (
              groupPointIndex === 0 &&
              lastX !== undefined &&
              lastY !== undefined
            ) {
              startX = lastX
              path.moveTo(lastX, lastY)
              path.lineTo(x, y)
            } else {
              path.lineTo(x, y)
            }
            lastX = x
            lastY = y
          }
          assert(lastX !== undefined, 'lastX is undefined')
          return {
            path,
            dashed: group.at(0)?.dashed ?? false,
            startX,
            lastX,
          }
        }),
      }
    })
  }

  private getLineDashSegments(range: [number, number]) {
    const [start, end] = range
    const time = end - start
    const isMoreThanYear = time > 365 * 24 * 60 * 60
    // TODO: Come up with nice dash segments
    if (isMoreThanYear) {
      return [3, 2]
    }

    return [10, 5]
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
    const values = points.flatMap((point) => point.series.map((s) => s.value))
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

    for (const [i, data] of point.series.entries()) {
      const pointElement = this.hoverPointWrapper.querySelector<HTMLElement>(
        `[data-series="${i}"]`,
      )
      if (pointElement) {
        const pointStyle = this.renderParams.seriesStyle[i].point
        pointElement.className = `absolute z-40 ${
          milestone
            ? POINT_CLASS_NAMES.milestone.className
            : pointStyle
              ? POINT_CLASS_NAMES[pointStyle].className
              : ''
        }`
        const y = this.getY(data.value)
        const bottom = Math.max(0, y * (canvasHeight - FIRST_LABEL_HEIGHT_PX))
        yValues.push(bottom)
        pointElement.style.left = `${left - 4}px`
        pointElement.style.bottom = `${bottom - 4}px`
      }
    }

    if (milestone) {
      this.hoverLine.classList.add('bg-green-500')
    } else {
      this.hoverLine.classList.remove('bg-green-500')
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

  private getStrokeStyle(line: SeriesStyleLine, theme: 'dark' | 'light') {
    const strokeStyle = LINE_STYLES[line](this.ctx)
    return strokeStyle[theme]
  }

  private getFillStyle(fill: SeriesStyleFill, theme: 'dark' | 'light') {
    const fillStyle = FILL_STYLES[fill](this.ctx)
    return fillStyle[theme]
  }
}
