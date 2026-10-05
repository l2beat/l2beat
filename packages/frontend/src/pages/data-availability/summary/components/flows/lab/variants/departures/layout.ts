/**
 * How the board fits a width. Wide, every column has its tiles: time, rollup,
 * cargo, cadence, day total and status. Narrow, only time, rollup and status
 * keep tiles, and cargo and cadence go under the name in small print.
 */
export interface BoardLayout {
  mode: 'full' | 'compact'
  tile: TileSize
  /** The clock in the header, a size up from the rows */
  clockTile: TileSize
  columns: BoardColumn[]
  /** Whether departure times show seconds; a phone has room only for 11:53 */
  withSeconds: boolean
  rows: number
  rowHeight: number
  paddingX: number
  iconSize: number
}

export interface TileSize {
  width: number
  height: number
  /** Between tiles of one value */
  gap: number
  font: number
  /** The colon printed between hours, minutes and seconds */
  colon: number
}

type ColumnId = 'time' | 'rollup' | 'cargo' | 'every' | 'total' | 'status'

export interface BoardColumn {
  id: ColumnId
  label: string
  width: number
  /** Numbers line up on their units, words on their first letter */
  align: 'left' | 'right'
  /** Tiles the value has */
  length: number
}

const FULL_ROWS = 14
const COMPACT_ROWS = 10
const PHONE_ROWS = 8
const PHONE_WIDTH = 560
const NAME_LENGTH = 15
const VALUE_LENGTHS = { cargo: 8, every: 7, total: 8, status: 8 }

export function layoutBoard(width: number): BoardLayout {
  return layoutFull(width) ?? layoutCompact(width)
}

function layoutFull(width: number): BoardLayout | undefined {
  const paddingX = 24
  for (let tileWidth = 19; tileWidth >= 12; tileWidth--) {
    const tile = sizeTile(tileWidth)
    const iconSize = Math.round(tile.height * 0.92)
    const columnGap = Math.round(tileWidth * 1.2)
    const columns: BoardColumn[] = [
      timeColumn(tile, true),
      rollupColumn(tile, iconSize, NAME_LENGTH),
      valueColumn('cargo', 'Cargo', tile, 'right'),
      valueColumn('every', 'Every', tile, 'right'),
      valueColumn('total', 'Day total', tile, 'right'),
      valueColumn('status', 'Status', tile, 'left'),
    ]
    if (sum(columns) + columnGap * 5 + paddingX * 2 > width) continue
    return {
      mode: 'full',
      tile,
      clockTile: sizeTile(Math.round(tileWidth * 1.6)),
      columns,
      withSeconds: true,
      rows: FULL_ROWS,
      rowHeight: tile.height + 14,
      paddingX,
      iconSize,
    }
  }
}

function layoutCompact(width: number): BoardLayout {
  const isPhone = width < PHONE_WIDTH
  const paddingX = isPhone ? 10 : 20
  const fit = fitCompact(width - paddingX * 2)
  const tile = sizeTile(fit.tileWidth)
  const iconSize = Math.round(tile.height * 0.92)
  return {
    mode: 'compact',
    tile,
    clockTile: sizeTile(Math.round(fit.tileWidth * 1.15)),
    columns: [
      timeColumn(tile, fit.withSeconds),
      rollupColumn(tile, iconSize, fit.nameLength),
      valueColumn('status', 'Status', tile, 'left'),
    ],
    withSeconds: fit.withSeconds,
    rows: isPhone ? PHONE_ROWS : COMPACT_ROWS,
    // the tiles, then a line of small print under the name
    rowHeight: tile.height + 30,
    paddingX,
    iconSize,
  }
}

interface CompactFit {
  tileWidth: number
  withSeconds: boolean
  nameLength: number
}

// Best first: whole names on large tiles, then shorter names, then no
// seconds, as on a phone a name long enough for OP MAINNET matters more
const COMPACT_FITS = [
  { withSeconds: true, minNameLength: NAME_LENGTH, minTileWidth: 14 },
  { withSeconds: true, minNameLength: 12, minTileWidth: 12 },
  { withSeconds: false, minNameLength: 10, minTileWidth: 10 },
]

function fitCompact(available: number): CompactFit {
  for (const wanted of COMPACT_FITS) {
    const fit = fitLargestTiles(available, wanted)
    if (fit) return fit
  }
  return { tileWidth: 9, withSeconds: false, nameLength: 8 }
}

/** The largest tiles that leave the name at least `minNameLength` tiles */
function fitLargestTiles(
  available: number,
  { withSeconds, minNameLength, minTileWidth }: (typeof COMPACT_FITS)[number],
): CompactFit | undefined {
  for (let tileWidth = 20; tileWidth >= minTileWidth; tileWidth--) {
    const tile = sizeTile(tileWidth)
    const iconSize = Math.round(tile.height * 0.92)
    const columnGap = compactColumnGap(tileWidth)
    const fixed =
      timeColumn(tile, withSeconds).width +
      valueColumn('status', 'Status', tile, 'left').width +
      iconSize +
      iconGap(tile) +
      columnGap * 2
    const nameLength = Math.min(
      NAME_LENGTH,
      Math.floor((available - fixed + tile.gap) / (tile.width + tile.gap)),
    )
    if (nameLength >= minNameLength) {
      return { tileWidth, withSeconds, nameLength }
    }
  }
}

function compactColumnGap(tileWidth: number) {
  return Math.round(tileWidth * 0.9)
}

export function iconGap(tile: TileSize): number {
  return Math.round(tile.width * 0.55)
}

function sizeTile(width: number): TileSize {
  return {
    width,
    // even, so the hinge falls on a whole pixel
    height: Math.round(width * 0.75) * 2,
    gap: Math.max(1, Math.round(width * 0.12)),
    font: Math.round(width * 1.25),
    colon: Math.round(width * 0.4),
  }
}

function timeColumn(tile: TileSize, withSeconds: boolean): BoardColumn {
  const digits = withSeconds ? 6 : 4
  const colons = digits / 2 - 1
  return {
    id: 'time',
    label: 'Time',
    width:
      digits * tile.width +
      colons * tile.colon +
      (digits + colons - 1) * tile.gap,
    align: 'left',
    length: digits,
  }
}

function rollupColumn(
  tile: TileSize,
  iconSize: number,
  nameLength: number,
): BoardColumn {
  return {
    id: 'rollup',
    label: 'Rollup',
    width: iconSize + iconGap(tile) + tilesWidth(tile, nameLength),
    align: 'left',
    length: nameLength,
  }
}

function valueColumn(
  id: keyof typeof VALUE_LENGTHS,
  label: string,
  tile: TileSize,
  align: BoardColumn['align'],
): BoardColumn {
  const length = VALUE_LENGTHS[id]
  return { id, label, width: tilesWidth(tile, length), align, length }
}

function tilesWidth(tile: TileSize, length: number) {
  return length * tile.width + (length - 1) * tile.gap
}

function sum(columns: BoardColumn[]) {
  return columns.reduce((total, column) => total + column.width, 0)
}
