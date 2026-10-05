/**
 * The vessel: the Ethereum logo as a hollow glass, cut into a grid of cells
 * that each hold one grain. It is sized so it holds an exact number of cells,
 * which is what makes the height of the sand in it true to scale.
 */
export interface Vessel {
  /** The top vertex, where the sand pours in. CSS px of the drawing */
  apexX: number
  apexY: number
  height: number
  /** Side of a grid cell, CSS px */
  cell: number
  columns: number
  rows: number
  /** Top left corner of the grid, CSS px */
  gridX: number
  gridY: number
  /** 1 for a cell inside the vessel. The grid keeps an empty ring around it */
  mask: Uint8Array
  /** Cells inside the vessel in each row */
  rowCells: Int32Array
  /** The column the sand pours down */
  centerColumn: number
  /** The highest row with room for a grain */
  inletRow: number
  outline: Point[]
  facets: Point[][]
  faces: Face[]
}

/** A face of the logo, for shading the glass like the logo is shaded */
export interface Face {
  points: Point[]
  /** 1 for the logo's lightest faces, towards 0 for its darkest */
  light: number
}

export interface Point {
  x: number
  y: number
}

/**
 * Builds a vessel that holds exactly `cellCount` cells of `cell` CSS px,
 * hanging from its top vertex at (`apexX`, `apexY`). The count sets its
 * height: it takes the smallest outline that holds as many cells, then shaves
 * the few cells over off its tip, where the sand never gets to.
 */
export function buildVessel({
  cellCount,
  cell,
  apexX,
  apexY,
  density,
}: {
  cellCount: number
  cell: number
  apexX: number
  apexY: number
  /** Device pixels per CSS px, so the grid lands on whole pixels */
  density: number
}): Vessel {
  const height = findHeightHolding(cellCount, cell)
  const halfCells = Math.floor((height * VESSEL_ASPECT) / 2 / cell)
  // an empty cell on every side spares the simulation bound checks
  const columns = 2 * halfCells + 3
  const rows = Math.ceil(height / cell) + 1
  const centerColumn = (columns - 1) / 2

  const snap = (value: number) => Math.round(value * density) / density
  const gridX = snap(apexX - (columns * cell) / 2)
  const gridY = snap(apexY)
  const x = gridX + (columns * cell) / 2

  const mask = new Uint8Array(columns * rows)
  const rowCells = new Int32Array(rows)
  let excess = countCells(height, cell) - cellCount
  for (let row = 0; row < rows; row++) {
    const half = cellsBesideCenter(height, cell, row)
    if (half < 0) continue
    let from = centerColumn - half
    let to = centerColumn + half
    // the tip goes first, a cell at a time from alternating sides
    while (excess > 0 && from <= to) {
      if ((excess & 1) === 1) from++
      else to--
      excess--
    }
    for (let column = from; column <= to; column++) {
      mask[row * columns + column] = 1
    }
    rowCells[row] = Math.max(0, to - from + 1)
  }

  let inletRow = 0
  while (inletRow < rows && (rowCells[inletRow] ?? 0) < 3) inletRow++

  const toDrawing = (p: Point): Point => ({
    x: x + ((p.x - LOGO.width / 2) / LOGO.height) * height,
    y: gridY + (p.y / LOGO.height) * height,
  })

  return {
    apexX: x,
    apexY: gridY,
    height,
    cell,
    columns,
    rows,
    gridX,
    gridY,
    mask,
    rowCells,
    centerColumn,
    inletRow,
    outline: OUTLINE.map(toDrawing),
    facets: FACETS.map((line) => line.map(toDrawing)),
    faces: FACES.map((face) => ({
      light: face.light,
      points: face.points.map(toDrawing),
    })),
  }
}

/**
 * The height, CSS px of the drawing, under which the vessel holds `cells`
 * cells. The vessel narrows towards its bottom, so the same number of grains
 * stands taller there than higher up.
 */
export function levelOf(vessel: Vessel, cells: number): number {
  let remaining = cells
  for (let row = vessel.rows - 1; row >= 0; row--) {
    const inRow = vessel.rowCells[row] ?? 0
    if (inRow === 0) continue
    if (remaining <= inRow) {
      return vessel.gridY + (row + 1 - remaining / inRow) * vessel.cell
    }
    remaining -= inRow
  }
  return vessel.apexY
}

/**
 * Half the width of a vessel `height` tall, `depth` below its top vertex;
 * -1 above or below it
 */
export function halfWidth(height: number, depth: number): number {
  const y = (depth / height) * LOGO.height
  if (y < 0 || y > LOGO.height) return -1
  const half = LOGO.width / 2
  const scale = height / LOGO.height
  if (y <= LOGO.upperWaist) return ((half * y) / LOGO.upperWaist) * scale
  if (y <= LOGO.lowerWaist) return half * scale
  return ((half * (LOGO.height - y)) / (LOGO.height - LOGO.lowerWaist)) * scale
}

/**
 * How far below the top vertex the vessel is filled to, as a share of its
 * height, when it holds `share` of all it can. For laying out before cutting
 * the grid; on the grid itself `levelOf` is exact.
 */
export function depthOfShare(share: number): number {
  const above = (1 - Math.min(Math.max(share, 0), 1)) * LOGO_AREA
  let low = 0
  let high = LOGO.height
  for (let i = 0; i < 40; i++) {
    const middle = (low + high) / 2
    if (areaAbove(middle) < above) low = middle
    else high = middle
  }
  return high / LOGO.height
}

/** The height of a vessel holding `cells` cells, by its area alone */
export function estimateHeight(cells: number, cell: number): number {
  return Math.sqrt(cells / VESSEL_AREA_PER_HEIGHT_SQUARED) * cell
}

/** The logo, in its own units: two pyramids, the upper one taller */
const LOGO = {
  width: 256,
  height: 416.905,
  /** Where the upper pyramid is widest, down from the top */
  upperWaist: 212.32,
  /** Where the lower pyramid is widest */
  lowerWaist: 236.587,
}

const TOP = { x: 128, y: 0 }
const BOTTOM = { x: 128, y: LOGO.height }
const UPPER_LEFT = { x: 0, y: LOGO.upperWaist }
const UPPER_RIGHT = { x: 256, y: LOGO.upperWaist }
const LOWER_LEFT = { x: 0, y: LOGO.lowerWaist }
const LOWER_RIGHT = { x: 256, y: LOGO.lowerWaist }
/** Where the logo's two inner faces start, on its middle line */
const INNER_TOP = { x: 128, y: 154.158 }
const UPPER_CENTER = { x: 128, y: 287.958 }
const LOWER_CENTER = { x: 128, y: 312.187 }

/** Clockwise from the top. The gap between the pyramids is filled in */
const OUTLINE: Point[] = [
  TOP,
  UPPER_RIGHT,
  LOWER_RIGHT,
  BOTTOM,
  LOWER_LEFT,
  UPPER_LEFT,
]

/** Where the logo's faces meet: its ridges and the chevrons at its waist */
const FACETS: Point[][] = [
  [TOP, UPPER_CENTER],
  [UPPER_LEFT, INNER_TOP, UPPER_RIGHT],
  [UPPER_LEFT, UPPER_CENTER, UPPER_RIGHT],
  [LOWER_LEFT, LOWER_CENTER, LOWER_RIGHT],
  [LOWER_CENTER, BOTTOM],
]

/** Lightness as in the logo's grays, #8c8c8c being the lightest */
const FACES: Face[] = [
  { light: 1, points: [TOP, UPPER_LEFT, INNER_TOP] },
  { light: 0.37, points: [TOP, UPPER_RIGHT, INNER_TOP] },
  { light: 0.41, points: [UPPER_LEFT, UPPER_CENTER, INNER_TOP] },
  { light: 0.14, points: [UPPER_RIGHT, UPPER_CENTER, INNER_TOP] },
  // the gap between the pyramids, clear glass
  {
    light: 1.2,
    points: [
      UPPER_LEFT,
      UPPER_CENTER,
      UPPER_RIGHT,
      LOWER_RIGHT,
      LOWER_CENTER,
      LOWER_LEFT,
    ],
  },
  { light: 1, points: [LOWER_LEFT, LOWER_CENTER, BOTTOM] },
  { light: 0.43, points: [LOWER_RIGHT, LOWER_CENTER, BOTTOM] },
]

const LOGO_AREA =
  (LOGO.width / 2) * LOGO.upperWaist +
  LOGO.width * (LOGO.lowerWaist - LOGO.upperWaist) +
  (LOGO.width / 2) * (LOGO.height - LOGO.lowerWaist)

/** Width of the vessel for its height, as in the logo */
export const VESSEL_ASPECT = LOGO.width / LOGO.height

const VESSEL_AREA_PER_HEIGHT_SQUARED = LOGO_AREA / LOGO.height ** 2

/** Area of the outline above `y`, in the logo's units */
function areaAbove(y: number): number {
  const half = LOGO.width / 2
  if (y <= LOGO.upperWaist) return (half * y * y) / LOGO.upperWaist
  if (y <= LOGO.lowerWaist) {
    return half * LOGO.upperWaist + LOGO.width * (y - LOGO.upperWaist)
  }
  const below = LOGO.height - y
  return LOGO_AREA - (half * below * below) / (LOGO.height - LOGO.lowerWaist)
}

/**
 * Cells on each side of the center column whose middle is inside the
 * vessel, -1 for a row below or above it. Rows count from the top vertex
 */
function cellsBesideCenter(height: number, cell: number, row: number) {
  const half = halfWidth(height, (row + 0.5) * cell)
  return half < 0 ? -1 : Math.floor(half / cell)
}

function countCells(height: number, cell: number): number {
  let count = 0
  const rows = Math.ceil(height / cell)
  for (let row = 0; row < rows; row++) {
    const half = cellsBesideCenter(height, cell, row)
    if (half >= 0) count += 2 * half + 1
  }
  return count
}

/** The cell count only grows with the height, so halving finds the edge */
function findHeightHolding(cells: number, cell: number): number {
  let low = 0
  let high = estimateHeight(cells, cell) * 2
  for (let i = 0; i < 60; i++) {
    const middle = (low + high) / 2
    if (countCells(middle, cell) >= cells) high = middle
    else low = middle
  }
  return high
}
