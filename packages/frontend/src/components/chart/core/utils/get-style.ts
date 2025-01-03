import {
  FILL_STYLES,
  LINE_STYLES,
  type SeriesStyleFill,
  type SeriesStyleLine,
} from '../styles'

export function getFillStyle(
  ctx: CanvasRenderingContext2D,
  fill: SeriesStyleFill,
  theme: 'dark' | 'light',
  minY: number,
) {
  const fillStyle = FILL_STYLES[fill](ctx, minY)
  return fillStyle[theme]
}

export function getStrokeStyle(
  ctx: CanvasRenderingContext2D,
  line: SeriesStyleLine,
  theme: 'dark' | 'light',
) {
  const strokeStyle = LINE_STYLES[line](ctx)
  return strokeStyle[theme]
}
