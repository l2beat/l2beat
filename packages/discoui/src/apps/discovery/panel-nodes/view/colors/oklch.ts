// l :: 0 - 1
// c :: 0 - 0.37
// h :: 0 - 360
export interface OklchColor {
  l: number
  c: number
  h: number
}

interface RGBColor {
  r: number
  g: number
  b: number
}

const White: OklchColor = { l: 100, c: 0, h: 106 }

export function oklchColorToCSS(color: OklchColor | undefined): string {
  const { r, g, b } = oklch2rgb(color ?? White)
  return `rgb(${r}, ${g}, ${b})`
}

const multiplyMatrices = (A: number[], B: number[]) => [
  // biome-ignore lint/style/noNonNullAssertion: We know it's there
  A[0]! * B[0]! + A[1]! * B[1]! + A[2]! * B[2]!,
  // biome-ignore lint/style/noNonNullAssertion: We know it's there
  A[3]! * B[0]! + A[4]! * B[1]! + A[5]! * B[2]!,
  // biome-ignore lint/style/noNonNullAssertion: We know it's there
  A[6]! * B[0]! + A[7]! * B[1]! + A[8]! * B[2]!,
]

// NOTE(radomski): Clamps the result between 0 - 255
function oklch2rgb(color: OklchColor): RGBColor {
  const { l, c, h } = color
  const lab = [
    l,
    Number.isNaN(h) ? 0 : c * Math.cos((h * Math.PI) / 180),
    Number.isNaN(h) ? 0 : c * Math.sin((h * Math.PI) / 180),
  ]
  const LMSg = multiplyMatrices(
    [
      1, 0.3963377773761749, 0.2158037573099136, 1, -0.1055613458156586,
      -0.0638541728258133, 1, -0.0894841775298119, -1.2914855480194092,
    ],
    lab,
  )

  const LMS = LMSg.map((val) => val ** 3)

  const xyz = multiplyMatrices(
    [
      1.2268798758459243, -0.5578149944602171, 0.2813910456659647,
      -0.0405757452148008, 1.112286803280317, -0.0717110580655164,
      -0.0763729366746601, -0.4214933324022432, 1.5869240198367816,
    ],
    LMS,
  )

  const rgbLinear = multiplyMatrices(
    [
      3.2409699419045226, -1.537383177570094, -0.4986107602930034,
      -0.9692436362808796, 1.8759675015077202, 0.04155505740717559,
      0.05563007969699366, -0.20397695888897652, 1.0569715142428786,
    ],
    xyz,
  )

  const [r, g, b] = rgbLinear.map((c) => {
    const srgb =
      Math.abs(c) > 0.0031308
        ? (c < 0 ? -1 : 1) * (1.055 * Math.abs(c) ** (1 / 2.4) - 0.055)
        : 12.92 * c

    return Math.max(0, Math.min(255, srgb * 255))
  })

  // biome-ignore lint/style/noNonNullAssertion: We know it's there
  return { r: r!, g: g!, b: b! }
}
