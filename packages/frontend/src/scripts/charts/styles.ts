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
  purpleCircle: PointShapeDefinition
  pinkSquare: PointShapeDefinition
  yellowTriangle: PointShapeDefinition
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
  purpleCircle: {
    type: 'svg',
    className: 'h-[9px] w-[9px] stroke-black dark:stroke-white',
    height: 9,
    width: 9,
    svgViewBox: '0 0 9 9',
    svgShape: '<circle cx="4.5" cy="4.5" r="3.5" fill="#A64EFF" />',
  },
  pinkSquare: {
    type: 'svg',
    className: 'size-2 stroke-black dark:stroke-white',
    height: 9,
    width: 9,
    svgViewBox: '0 0 9 9',
    svgShape: `<rect x="0" y="0" width="9" height="9" fill="#FF46C0" stroke-width="2"/>`,
  },
  yellowTriangle: {
    type: 'svg',
    className: 'h-2.5 w-2.5 stroke-black dark:stroke-white',
    height: 12,
    width: 12,
    svgViewBox: '0 0 12 12',
    svgShape: `<path d="m1.4167 10.234 4.5833-7.9386 4.5833 7.9386z" fill="#ef8f00" stroke-width="1.0585" />`,
  },
  milestone: {
    type: 'div',
    className:
      'size-2 rotate-45 border-2 border-green-200 bg-green-600 dark:border-current dark:bg-green-500',
  },
}

export const FILL_STYLES = {
  pink: () => ({ light: '#FF46C0', dark: '#FF46C0' }),
  yellow: () => ({ light: '#FFC107', dark: '#FFC107' }),
  'light-yellow': () => ({ light: '#FF8B36', dark: '#FFDD28' }),
  purple: () => ({ light: '#7E41CC', dark: '#7E41CC' }),
  green: () => ({ light: '#11CC00', dark: '#11CC00' }),
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
  green: () => ({ light: '#11CC00', dark: '#11CC00' }),
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
