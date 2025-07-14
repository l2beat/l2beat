import { assert } from '@l2beat/shared-pure'

/**
 * Colorblind friendly color generation strategy:
 * - 11 colors is predefined in the base palette (Okabe-Ito + CARTO Safe)
 * - If more than 11 colors are needed, we use the CIELab space to generate new colors, however it does not guarantee that the colors are colorblind friendly
 */

type Color = { L: number; a: number; b: number } // Lab color object

const MIN_LAB_DISTANCE = 20

// Predefined base palette (12 colorblind-safe colors)
const basePaletteHex = [
  // 7-color Okabe-Ito (without black and with slight tweak for yellow for better contrast):
  '#E69F00',
  '#56B4E9',
  '#009E73',
  '#F5C710', // orange, sky blue, bluish green, amber
  '#0072B2',
  '#D55E00',
  '#CC79A7', // dark blue, vermilion, purple
  // Additional from CARTO Safe to extend to 11:
  '#88CCEE',
  '#DDCC77',
  '#117733',
  '#661100', // light blue, light yellow, dark green, dark brown
]
const basePaletteLab: Color[] = basePaletteHex.map(hexToLab)

/**
 * Generate an array of distinct, colorblind-friendly HEX colors.
 * @param n - Number of colors desired.
 */
export function generateAccessibleColors(n: number): string[] {
  if (n <= basePaletteHex.length) {
    return basePaletteHex.slice(0, n)
  }
  // Start with base palette
  const selected: Color[] = basePaletteLab.slice()
  // Sample candidate colors in HCL space
  const candidates: Color[] = []
  const targetL = [30, 55, 80] // example lightness levels to sample
  for (const L of targetL) {
    for (let H = 0; H < 360; H += 10) {
      const C = 60 // fixed chroma (saturation)
      // Convert HCL -> Lab (approximate)
      const rad = (H * Math.PI) / 180
      const a = Math.cos(rad) * C
      const b = Math.sin(rad) * C
      candidates.push({ L, a, b })
    }
  }
  // Filter out any candidate too close to an existing color
  const filtered = candidates.filter((c) =>
    selected.every((sel) => labDistance(c, sel) > MIN_LAB_DISTANCE),
  )
  // Greedily pick new colors until we have n
  while (selected.length < n && filtered.length) {
    // find the candidate with max distance to the nearest selected color
    let bestIndex = 0
    let bestDist = Number.NEGATIVE_INFINITY
    filtered.forEach((c, idx) => {
      // distance to closest selected color
      const d = Math.min(...selected.map((sel) => labDistance(c, sel)))
      if (d > bestDist) {
        bestDist = d
        bestIndex = idx
      }
    })
    const newColor = filtered.splice(bestIndex, 1)[0]
    if (!newColor) {
      throw new Error('No new color found')
    }
    selected.push(newColor)
    // Remove any remaining candidates that are too close to the new color
    for (const [i, color] of filtered.entries()) {
      if (labDistance(color, newColor) < MIN_LAB_DISTANCE) {
        filtered.splice(i, 1)
      }
    }
  }
  // Convert selected colors to HEX for output
  return selected.map(labToHex).slice(0, n)
}

// Utility: Convert HEX to Lab
function hexToLab(hex: string): Color {
  // Parse hex to RGB [0,255]
  const bigint = Number.parseInt(hex.slice(1), 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  // Convert sRGB to XYZ (D65) then to CIELAB
  // (For brevity, using a simplified conversion)
  const [R, G, B] = [r, g, b].map((v) => {
    const fv = v / 255
    return fv <= 0.04045 ? fv / 12.92 : Math.pow((fv + 0.055) / 1.055, 2.4)
  })
  assert(
    R !== undefined && G !== undefined && B !== undefined,
    'R, G, B are required',
  )
  const X = R * 0.4124 + G * 0.3576 + B * 0.1805
  const Y = R * 0.2126 + G * 0.7152 + B * 0.0722
  const Z = R * 0.0193 + G * 0.1192 + B * 0.9505
  // Normalize for D65 white point
  const [Xn, Yn, Zn] = [0.95047, 1.0, 1.08883]
  const fx = X / Xn > 0.008856 ? Math.cbrt(X / Xn) : (7.787 * X) / Xn + 16 / 116
  const fy = Y / Yn > 0.008856 ? Math.cbrt(Y / Yn) : (7.787 * Y) / Yn + 16 / 116
  const fz = Z / Zn > 0.008856 ? Math.cbrt(Z / Zn) : (7.787 * Z) / Zn + 16 / 116
  return {
    L: 116 * fy - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz),
  }
}

// Utility: Convert Lab to HEX (for final output)
function labToHex(color: Color): string {
  // Inverse of hexToLab: Lab -> XYZ -> linear RGB -> sRGB -> hex
  const { L, a, b: labB } = color
  // Lab to XYZ
  const fy = (L + 16) / 116
  const fx = fy + a / 500
  const fz = fy - labB / 200
  const [Xn, Yn, Zn] = [0.95047, 1.0, 1.08883]
  const [fx3, fy3, fz3] = [fx ** 3, fy ** 3, fz ** 3]
  const X = Xn * (fx3 > 0.008856 ? fx3 : (fx - 16 / 116) / 7.787)
  const Y = Yn * (fy3 > 0.008856 ? fy3 : (fy - 16 / 116) / 7.787)
  const Z = Zn * (fz3 > 0.008856 ? fz3 : (fz - 16 / 116) / 7.787)
  // XYZ to linear RGB
  let R = 3.2406 * X + -1.5372 * Y + -0.4986 * Z
  let G = -0.9689 * X + 1.8758 * Y + 0.0415 * Z
  let B = 0.0557 * X + -0.204 * Y + 1.057 * Z
  // linear RGB to sRGB
  const toSRGB = (u: number) =>
    u <= 0.0031308 ? 12.92 * u : 1.055 * Math.pow(u, 1 / 2.4) - 0.055
  ;[R, G, B] = [toSRGB(R), toSRGB(G), toSRGB(B)]
  // Clamp and convert to [0,255]
  const [r, g, b] = [R, G, B].map((u) => {
    const c = Math.min(Math.max(u, 0), 1)
    return Math.round(c * 255)
  })
  const hex = (x: number) => x.toString(16).padStart(2, '0')
  assert(
    r !== undefined && g !== undefined && b !== undefined,
    'r, g, b are required',
  )
  return `#${hex(r)}${hex(g)}${hex(b)}`
}

// Calculate CIEDE2000-like distance (using simple Euclidean in Lab as approximation)
function labDistance(c1: Color, c2: Color): number {
  const dL = c1.L - c2.L
  const da = c1.a - c2.a
  const db = c1.b - c2.b
  return Math.sqrt(dL * dL + da * da + db * db)
}
