export interface SeriesStyle {
  fillStyle?: keyof typeof FILL_STYLES
  lineStyle?: keyof typeof LINE_STYLES
}

export const POINTER_STYLE = {}

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
