interface FontConfig {
  fontSizePx: number
  lineHeightPx: number
}

export function labelText(
  point: { x: number; y: number },
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  usableHeight: number,
  label: string,
  fillStyle: string,
) {
  ctx.fillStyle = fillStyle
  const fontCfg = rescaleFontConfig(queryTailwindFontClass('text-sm'))
  const PADDING = fontCfg.lineHeightPx / 3

  ctx.font = `${fontCfg.fontSizePx}px/${fontCfg.lineHeightPx}px Roboto`
  ctx.fillText(
    label,
    point.x * canvas.width,
    point.y * usableHeight + (canvas.height - usableHeight) - PADDING,
  )
}

function queryTailwindFontClass(tailwindClass: string): FontConfig {
  // Default being text-sm
  const DEFAULT = { fontSizePx: 15, lineHeightPx: 22 }

  const elementWithClass = document.querySelector(`.${tailwindClass}`)
  if (!elementWithClass) {
    return DEFAULT
  }
  const styles = window.getComputedStyle(elementWithClass)

  const fontSize = styles.getPropertyValue('font-size')
  const lineHeight = styles.getPropertyValue('line-height')

  if (!fontSize.includes('px') || !lineHeight.includes('px')) {
    return DEFAULT
  }

  return {
    fontSizePx: parseInt(fontSize),
    lineHeightPx: parseInt(lineHeight),
  }
}

function rescaleFontConfig(config: FontConfig): FontConfig {
  return {
    fontSizePx: Math.floor(config.fontSizePx * window.devicePixelRatio),
    lineHeightPx: Math.floor(config.lineHeightPx * window.devicePixelRatio),
  }
}
