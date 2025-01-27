export type SeriesStylePoint = keyof PointClassNames
export type SeriesStyleLine = keyof typeof LINE_STYLES
export type SeriesStyleFill = keyof typeof FILL_STYLES

export interface SeriesStyle {
  point?: SeriesStylePoint
  fill?: SeriesStyleFill
  line?: SeriesStyleLine
}

type PointShapeDefinition =
  | {
      type: 'div'
      className: string
    }
  | {
      type: 'svg'
      className: string
      height: number
      width: number
      svgViewBox: string
      svgShape: string
    }

interface PointClassNames {
  circle: PointShapeDefinition
  redCircle: PointShapeDefinition
  pinkCircle: PointShapeDefinition
  cyanCircle: PointShapeDefinition
  yellowCircle: PointShapeDefinition
  blueCircle: PointShapeDefinition
  blueSquare: PointShapeDefinition
  roundedPurpleSquare: PointShapeDefinition
  roundedBlueSquare: PointShapeDefinition
  roundedYellowSquare: PointShapeDefinition
  roundedLightYellowSquare: PointShapeDefinition
  roundedPinkSquare: PointShapeDefinition
  milestone: PointShapeDefinition
  incident: PointShapeDefinition
}

export const POINT_CLASS_NAMES: PointClassNames = {
  circle: {
    type: 'div',
    className:
      'size-2 rounded-full border-2 border-current bg-white dark:bg-black',
  },
  redCircle: {
    type: 'div',
    className: 'size-2 rounded-full border-2 border-current bg-red-300',
  },
  pinkCircle: {
    type: 'div',
    className: 'size-2 rounded-full border-2 border-current bg-n-pink-400',
  },
  cyanCircle: {
    type: 'div',
    className: 'size-2 rounded-full border-2 border-current bg-n-cyan-600',
  },
  yellowCircle: {
    type: 'div',
    className: 'size-2 rounded-full border-2 border-current bg-n-yellow-700',
  },
  blueCircle: {
    type: 'div',
    className: 'size-2 rounded-full border-2 border-current bg-blue-600',
  },
  blueSquare: {
    type: 'div',
    className: 'size-2 border-2 border-current bg-blue-600',
  },
  roundedPurpleSquare: {
    type: 'div',
    className: 'size-4 bg-purple-100 rounded-sm',
  },
  roundedBlueSquare: {
    type: 'div',
    className: 'size-4 dark:bg-sky-500 bg-sky-550 rounded-sm',
  },
  roundedLightYellowSquare: {
    type: 'div',
    className: 'size-4 dark:bg-yellow-100 bg-orange-400 rounded-sm',
  },
  roundedYellowSquare: {
    type: 'div',
    className: 'size-4 bg-yellow-200 rounded-sm',
  },
  roundedPinkSquare: {
    type: 'div',
    className: 'size-4 bg-pink-100 rounded-sm',
  },
  milestone: {
    type: 'div',
    className: 'size-2 rotate-45 border-2 border-green-500 bg-green-700',
  },
  incident: {
    type: 'div',
    className: 'size-2 rotate-45 border-2 border-red-700 bg-red-800',
  },
}

export const FILL_STYLES = {
  pink: () => ({ light: '#FF46C0', dark: '#FF46C0' }),
  yellow: () => ({ light: '#FFC107', dark: '#FFC107' }),
  'light-yellow': () => ({ light: '#FFA336', dark: '#FFDD28' }),
  purple: () => ({ light: '#7E41CC', dark: '#7E41CC' }),
  blue: () => ({ light: '#2670FF', dark: '#0074FD' }),
  'blue gradient': (ctx: CanvasRenderingContext2D, minY: number) => {
    const light = ctx.createLinearGradient(0, minY, 0, ctx.canvas.height)
    light.addColorStop(0, 'rgba(28, 103, 224, 1)')
    light.addColorStop(0.5, 'rgba(28, 103, 224, 0.4)')
    light.addColorStop(1, 'rgba(28, 103, 224, 0)')
    const dark = ctx.createLinearGradient(0, minY, 0, ctx.canvas.height)
    dark.addColorStop(0, 'rgba(20, 65, 125, 1)')
    dark.addColorStop(0.5, 'rgba(20, 65, 125, 0.4)')
    dark.addColorStop(1, 'rgba(20, 65, 125, 0)')
    return { light, dark }
  },
  'signature gradient': (ctx: CanvasRenderingContext2D, minY: number) => {
    const light = ctx.createLinearGradient(0, minY, 0, ctx.canvas.height)
    light.addColorStop(0, 'rgba(255, 95, 251, 1)')
    light.addColorStop(0.5, 'rgba(255, 95, 251, 0.4)')
    light.addColorStop(1, 'rgba(255, 95, 251, 0)')
    const dark = ctx.createLinearGradient(0, minY, 0, ctx.canvas.height)
    dark.addColorStop(0, 'rgba(138, 59, 121, 1)')
    dark.addColorStop(0.5, 'rgba(138, 59, 121, 0.4)')
    dark.addColorStop(1, 'rgba(138, 59, 121, 0)')
    return { light, dark }
  },
  'cyan gradient': (ctx: CanvasRenderingContext2D, minY: number) => {
    const light = ctx.createLinearGradient(0, minY, 0, ctx.canvas.height)
    light.addColorStop(0, 'rgba(58, 197, 225, 1)')
    light.addColorStop(0.5, 'rgba(58, 197, 225, 0.4)')
    light.addColorStop(1, 'rgba(58, 197, 225, 0)')
    const dark = ctx.createLinearGradient(0, minY, 0, ctx.canvas.height)
    dark.addColorStop(0, 'rgba(42, 123, 145, 1)')
    dark.addColorStop(0.5, 'rgba(42, 123, 145, 0.4)')
    dark.addColorStop(1, 'rgba(42, 123, 145, 0)')
    return { light, dark }
  },
  'yellow gradient': (ctx: CanvasRenderingContext2D, minY: number) => {
    const light = ctx.createLinearGradient(0, minY, 0, ctx.canvas.height)
    light.addColorStop(0, 'rgba(223, 207, 67, 1)')
    light.addColorStop(0.5, 'rgba(223, 207, 67, 0.4)')
    light.addColorStop(1, 'rgba(223, 207, 67, 0)')
    const dark = ctx.createLinearGradient(0, minY, 0, ctx.canvas.height)
    dark.addColorStop(0, 'rgba(163, 143, 42, 1)')
    dark.addColorStop(0.5, 'rgba(163, 143, 42, 0.4)')
    dark.addColorStop(1, 'rgba(163, 143, 42, 0)')
    return { light, dark }
  },
}

export const LINE_STYLES = {
  pink: () => ({ light: '#FF46C0', dark: '#FF46C0' }),
  yellow: () => ({ light: '#FFC107', dark: '#FFC107' }),
  'light-yellow': () => ({ light: '#FFA336', dark: '#FFDD28' }),
  purple: () => ({ light: '#7E41CC', dark: '#7E41CC' }),
  blue: () => ({ light: '#2670FF', dark: '#0074FD' }),
  'blue gradient': (ctx: CanvasRenderingContext2D) => {
    const light = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0)
    light.addColorStop(0, 'rgba(83, 162, 255')
    light.addColorStop(1, 'rgba(42, 91, 216')
    const dark = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0)
    dark.addColorStop(0, 'rgba(83, 162, 255')
    dark.addColorStop(1, 'rgba(28, 103, 224')
    return { light, dark }
  },
  'signature gradient': (ctx: CanvasRenderingContext2D) => {
    const light = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0)
    light.addColorStop(0, 'rgba(126, 65, 204')
    light.addColorStop(1, 'rgba(239, 67, 180')
    const dark = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0)
    dark.addColorStop(0, 'rgba(218, 139, 247')
    dark.addColorStop(1, 'rgba(239, 67, 180')
    return { light, dark }
  },
  'cyan gradient': (ctx: CanvasRenderingContext2D) => {
    const light = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0)
    light.addColorStop(0, 'rgba(54, 163, 163')
    light.addColorStop(1, 'rgba(28, 139, 164')
    const dark = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0)
    dark.addColorStop(0, 'rgba(54, 163, 163')
    dark.addColorStop(1, 'rgba(58, 197, 225')
    return { light, dark: light }
  },
  'yellow gradient': (ctx: CanvasRenderingContext2D) => {
    const light = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0)
    light.addColorStop(0, 'rgba(171, 128, 0')
    light.addColorStop(1, 'rgba(184, 145, 46')
    const dark = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0)
    dark.addColorStop(0, 'rgba(255, 194, 10')
    dark.addColorStop(1, 'rgba(184, 145, 46')
    return { light, dark }
  },
}
