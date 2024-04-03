export type SeriesStylePoint = keyof PointClassNames
export type SeriesStyleLine = keyof typeof LINE_STYLES
export type SeriesStyleFill = keyof typeof FILL_STYLES

export interface SeriesStyle {
  point?: SeriesStylePoint
  fill?: SeriesStyleFill
  line?: SeriesStyleLine
}

export type PointStyle = SeriesStylePoint
export type PointShapeDefinition =
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
  blueSquare: PointShapeDefinition
  roundedPurpleSquare: PointShapeDefinition
  roundedBlueSquare: PointShapeDefinition
  roundedYellowSquare: PointShapeDefinition
  roundedLightYellowSquare: PointShapeDefinition
  roundedPinkSquare: PointShapeDefinition
  roundedGreenSquare: PointShapeDefinition
  milestone: PointShapeDefinition
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
  blueSquare: {
    type: 'div',
    className: 'size-2 border-2 border-current bg-blue-600',
  },
  roundedPurpleSquare: {
    type: 'div',
    className: 'size-4 bg-purple-100 rounded',
  },
  roundedBlueSquare: {
    type: 'div',
    className: 'size-4 dark:bg-blue-500 bg-blue-700 rounded',
  },
  roundedLightYellowSquare: {
    type: 'div',
    className: 'size-4 dark:bg-yellow-100 bg-orange-400 rounded',
  },
  roundedYellowSquare: {
    type: 'div',
    className: 'size-4 bg-yellow-200 rounded',
  },
  roundedPinkSquare: {
    type: 'div',
    className: 'size-4 bg-pink-100 rounded',
  },
  roundedGreenSquare: {
    type: 'div',
    className: 'size-4 dark:bg-green-500 bg-green-600 rounded',
  },
  milestone: {
    type: 'div',
    className: 'size-2 rotate-45 border-2 border-green-500 bg-green-700',
  },
}

export const FILL_STYLES = {
  pink: () => ({ light: '#FF46C0', dark: '#FF46C0' }),
  yellow: () => ({ light: '#FFC107', dark: '#FFC107' }),
  'light-yellow': () => ({ light: '#FF8B36', dark: '#FFDD28' }),
  purple: () => ({ light: '#7E41CC', dark: '#7E41CC' }),
  green: () => ({ light: '#15CA60', dark: '#15CA60' }),
  blue: () => ({ light: '#005DD7', dark: '#53A2FF' }),
  'blue gradient': (ctx: CanvasRenderingContext2D) => {
    const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0)
    gradient.addColorStop(0, 'rgba(42, 91, 216, 0.3)')
    gradient.addColorStop(1, 'rgba(83, 162, 255, 0.3)')
    return { light: gradient, dark: gradient }
  },
  'signature gradient': (ctx: CanvasRenderingContext2D) => {
    const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0)
    gradient.addColorStop(0, 'rgba(126, 65, 204, 0.4)')
    gradient.addColorStop(0.5, 'rgba(216, 61, 164, 0.4)')
    gradient.addColorStop(1, 'rgba(238, 44, 1, 0.4)')
    return { light: gradient, dark: gradient }
  },
}

export const LINE_STYLES = {
  pink: () => ({ light: '#FF46C0', dark: '#FF46C0' }),
  yellow: () => ({ light: '#FFC107', dark: '#FFC107' }),
  'light-yellow': () => ({ light: '#FF8B36', dark: '#FFDD28' }),
  purple: () => ({ light: '#7E41CC', dark: '#7E41CC' }),
  green: () => ({ light: '#15CA60', dark: '#15CA60' }),
  blue: () => ({ light: '#005DD7', dark: '#53A2FF' }),
  'blue gradient': (ctx: CanvasRenderingContext2D) => {
    const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0)
    gradient.addColorStop(0, 'rgba(42, 91, 216')
    gradient.addColorStop(1, 'rgba(83, 162, 255')
    return { light: gradient, dark: gradient }
  },
  'signature gradient': (ctx: CanvasRenderingContext2D) => {
    const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0)
    gradient.addColorStop(0, 'rgba(126, 65, 204')
    gradient.addColorStop(0.5, 'rgba(216, 61, 164')
    gradient.addColorStop(1, 'rgba(238, 44, 1')
    return { light: gradient, dark: gradient }
  },
}
