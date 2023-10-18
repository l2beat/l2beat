export interface SeriesStyle {
  point?: keyof typeof POINT_CLASS_NAMES
  fill?: keyof typeof FILL_STYLES
  line?: keyof typeof LINE_STYLES
}

export type PointStyle = keyof typeof POINT_CLASS_NAMES
export type PointShapeDef =
  | {
      type: 'html'
      className: string
    }
  | {
      type: 'svg'
      className: string
      svgViewBox: string
      svgPath: string
    }

export const POINT_CLASS_NAMES: Record<string, PointShapeDef> = {
  circle: {
    type: 'html',
    className:
      'h-2 w-2 rounded-full border-2 border-current bg-white dark:bg-black',
  },
  redCircle: {
    type: 'html',
    className: 'h-2 w-2 rounded-full border-2 border-current bg-red-300',
  },
  purpleCircle: {
    type: 'html',
    className: 'h-2 w-2 rounded-full border-2 border-current bg-[#7E41CC]',
  },
  blueSquare: {
    type: 'html',
    className: 'h-2 w-2 border-2 border-current bg-blue-600',
  },
  pinkSquare: {
    type: 'html',
    className: 'h-2 w-2 border-2 border-current bg-[#FF46C0]',
  },
  yellowTriangle: {
    type: 'svg',
    className: 'h-2 w-2 stroke-black dark:stroke-white',
    svgViewBox: '0 0 12 12',
    svgPath: `d="m1.4167 10.234 4.5833-7.9386 4.5833 7.9386z" fill="#FFC107" stroke-width="2"`,
  },
  milestone: {
    type: 'html',
    className:
      'h-2 w-2 rotate-45 border-2 border-green-200 bg-green-600 dark:border-current dark:bg-green-500',
  },
}

export const FILL_STYLES = {
  pink: () => '#FF46C0',
  yellow: () => '#FFC107',
  purple: () => '#7E41CC',
  'blue gradient': (ctx: CanvasRenderingContext2D) => {
    const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0)
    gradient.addColorStop(0, 'rgba(42, 91, 216, 0.3)')
    gradient.addColorStop(1, 'rgba(83, 162, 255, 0.3)')
    return gradient
  },
  'signature gradient': (ctx: CanvasRenderingContext2D) => {
    const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0)
    gradient.addColorStop(0, 'rgba(126, 65, 204, 0.4)')
    gradient.addColorStop(0.5, 'rgba(216, 61, 164, 0.4)')
    gradient.addColorStop(1, 'rgba(238, 44, 1, 0.4)')
    return gradient
  },
}

export const LINE_STYLES = {
  pink: () => '#FF46C0',
  yellow: () => '#FFC107',
  purple: () => '#7E41CC',
  'blue gradient': (ctx: CanvasRenderingContext2D) => {
    const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0)
    gradient.addColorStop(0, 'rgba(42, 91, 216')
    gradient.addColorStop(1, 'rgba(83, 162, 255')
    return gradient
  },
  'signature gradient': (ctx: CanvasRenderingContext2D) => {
    const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0)
    gradient.addColorStop(0, 'rgba(126, 65, 204')
    gradient.addColorStop(0.5, 'rgba(216, 61, 164')
    gradient.addColorStop(1, 'rgba(238, 44, 1')
    return gradient
  },
}
