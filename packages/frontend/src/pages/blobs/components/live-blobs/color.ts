type Rgb = [number, number, number]

const FALLBACK: Rgb = [138, 143, 156]

/** Reads #rgb, #rrggbb and rgb(…) colors, the forms project colors and CSS variables come in */
function parseColor(color: string): Rgb {
  const value = color.trim()
  if (value.startsWith('#')) {
    const hex =
      value.length === 4
        ? value
            .slice(1)
            .split('')
            .map((c) => c + c)
            .join('')
        : value.slice(1, 7)
    const number = Number.parseInt(hex, 16)
    if (Number.isNaN(number)) return FALLBACK
    return [(number >> 16) & 255, (number >> 8) & 255, number & 255]
  }
  const parts = value.match(/[\d.]+/g)
  if (value.startsWith('rgb') && parts && parts.length >= 3) {
    return [Number(parts[0]), Number(parts[1]), Number(parts[2])]
  }
  return FALLBACK
}

export function toRgba(color: string, alpha: number): string {
  const [r, g, b] = parseColor(color)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/** `t` of the way from `from` to `to` */
export function mixColors(from: string, to: string, t: number): string {
  const a = parseColor(from)
  const b = parseColor(to)
  const channel = (i: 0 | 1 | 2) => Math.round(a[i] + (b[i] - a[i]) * t)
  return toHex([channel(0), channel(1), channel(2)])
}

function contrastRatio(a: string, b: string): number {
  const la = luminance(parseColor(a))
  const lb = luminance(parseColor(b))
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

/**
 * The project's color, lightened or darkened just enough to stand out from
 * `background`. Brand colors are picked for a project's own site: a black
 * logo color disappears on the dark theme, a pale one on the light theme.
 */
export function readableColor(
  color: string,
  background: string,
  minContrast = 1.9,
): string {
  if (contrastRatio(color, background) >= minContrast) return color
  const towards =
    luminance(parseColor(background)) > 0.4 ? '#000000' : '#ffffff'
  for (let t = 0.1; t <= 1; t += 0.1) {
    const mixed = mixColors(color, towards, t)
    if (contrastRatio(mixed, background) >= minContrast) return mixed
  }
  return towards
}

function luminance([r, g, b]: Rgb): number {
  const linear = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b)
}

function toHex(rgb: Rgb): string {
  return `#${rgb.map((c) => c.toString(16).padStart(2, '0')).join('')}`
}
