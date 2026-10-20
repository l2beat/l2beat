import { formatCurrency } from '@l2beat/shared-pure'
import type { CSSProperties, ReactNode } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { EM_DASH } from '~/consts/characters'
import { cn } from '~/utils/cn'
import {
  HOME_ICON_CLASS,
  HOME_ROW_CLASS,
  HOME_ROW_LINES_CLASS,
  HOME_TEXT,
} from '../homeStyles'
import { HomeChange } from './HomeChange'

export interface HomeRankedTableRow {
  id: string
  name: string
  href: string | undefined
  iconUrl: string
}

export interface HomeRankedTableColumn<T> {
  id: string
  cell: (row: T) => ReactNode
  align?: 'center' | 'right'
  /**
   * In a wide table the column shares the free space with the names and
   * starts halfway along it, rather than with the figures at the far end.
   */
  middle?: boolean
  /** Above the column, so the rows need no label of their own. */
  header?: string
  /**
   * The narrowest table that still shows the column, e.g. for a secondary
   * figure, so names keep their room. A hidden column takes its track with
   * it, so the others close up to the table's right edge.
   */
  minTableWidth?: MinTableWidth
}

type MinTableWidth = 360 | 480 | 640

/** Literal classes, so Tailwind sees them. */
const HIDE_BELOW: Record<MinTableWidth, string> = {
  360: '@max-[360px]:hidden',
  480: '@max-[480px]:hidden',
  640: '@max-[640px]:hidden',
}

function alignClass(align: HomeRankedTableColumn<unknown>['align']) {
  return cn(
    align === 'right' && 'justify-end text-right',
    align === 'center' && 'justify-center text-center',
  )
}

/**
 * A short, single-line ranking under a header row: the title over the names,
 * then each column's header. Rows are subgrids of one grid, so every column
 * lines up across rows whatever the width of its content. Only the name
 * links, so cells can hold their own tooltips.
 */
export function HomeRankedTable<T extends HomeRankedTableRow>({
  title,
  rows,
  columns,
  className,
}: {
  title: string
  rows: T[]
  /** Columns after the rank and the name. */
  columns: HomeRankedTableColumn<T>[]
  className?: string
}) {
  if (rows.length === 0) {
    return null
  }
  const columnsStyle = Object.fromEntries(
    TIERS.map((width) => [
      `--ranked-columns-${width}`,
      getGridColumns(columns, width),
    ]),
  ) as CSSProperties
  return (
    // A container: in a narrow card the secondary columns give way, so names
    // keep their room; in a wide one the middle columns move in from the
    // figures.
    <div className={cn('@container min-w-0', className)}>
      <div
        className="grid @min-[360px]:grid-cols-(--ranked-columns-360) @min-[480px]:grid-cols-(--ranked-columns-480) @min-[640px]:grid-cols-(--ranked-columns-640) grid-cols-(--ranked-columns-0) content-start @min-[480px]:gap-x-5 gap-x-4"
        style={columnsStyle}
      >
        <div className="col-span-full grid grid-cols-subgrid items-baseline pb-2">
          <h3 className={cn('col-span-2', HOME_TEXT.sectionTitle)}>{title}</h3>
          {columns.map((column) => (
            <span
              key={column.id}
              className={cn(
                'flex whitespace-nowrap',
                HOME_TEXT.meta,
                alignClass(column.align),
                column.minTableWidth && HIDE_BELOW[column.minTableWidth],
              )}
            >
              {column.header}
            </span>
          ))}
        </div>
        {/* The list's own box steps aside, so its rows join the grid. */}
        <ol className={cn('contents', HOME_ROW_LINES_CLASS)}>
          {rows.map((row, index) => (
            <li
              key={row.id}
              className={cn(
                'col-span-full grid grid-cols-subgrid items-center',
                HOME_ROW_CLASS,
              )}
            >
              <span
                className={cn('w-3 text-right tabular-nums', HOME_TEXT.meta)}
              >
                {index + 1}
              </span>
              <Name row={row} />
              {columns.map((column) => (
                <span
                  key={column.id}
                  className={cn(
                    'flex min-w-0 items-center',
                    alignClass(column.align),
                    column.minTableWidth && HIDE_BELOW[column.minTableWidth],
                  )}
                >
                  {column.cell(row)}
                </span>
              ))}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

/** The table widths where columns hide or show, each with its own tracks. */
const TIERS = [0, 360, 480, 640] as const

/**
 * The tracks of a table at least `width` wide: the rank, the name, then only
 * the columns shown at that width. A track left for a hidden column would
 * take the next column's cells and leave an empty one, and its gap, at the
 * right edge.
 */
function getGridColumns<T>(
  columns: HomeRankedTableColumn<T>[],
  width: (typeof TIERS)[number],
) {
  const shown = columns.filter(
    (column) => !column.minTableWidth || width >= column.minTableWidth,
  )
  if (width < 480) {
    return ['auto minmax(0,1fr)', ...shown.map(() => 'auto')].join(' ')
  }
  // Names and middle columns never go below their content here, so this
  // waits for a table wide enough to fit the longest of them.
  return [
    'auto minmax(max-content,1fr)',
    ...shown.map((column) =>
      column.middle ? 'minmax(max-content,1fr)' : 'auto',
    ),
  ].join(' ')
}

function Name({ row }: { row: HomeRankedTableRow }) {
  const content = (
    <>
      <img src={row.iconUrl} alt="" className={HOME_ICON_CLASS} />
      <span
        className={cn(
          'truncate underline-offset-2 group-hover:underline',
          HOME_TEXT.row,
        )}
      >
        {row.name}
      </span>
    </>
  )
  if (!row.href) {
    return <span className="flex min-w-0 items-center gap-2">{content}</span>
  }
  return (
    <a href={row.href} className="group flex min-w-0 items-center gap-2">
      {content}
    </a>
  )
}

/** A value, USD unless `format` says otherwise; no value draws a dash. */
export function HomeRankedValue({
  value,
  format = (value) => formatCurrency(value, 'usd'),
}: {
  value: number | undefined
  format?: (value: number) => string
}) {
  return (
    // No value is drawn like no change: the same grey dash.
    <span
      className={cn(
        'whitespace-nowrap',
        HOME_TEXT.value,
        value === undefined && 'text-secondary',
      )}
    >
      {value !== undefined ? format(value) : EM_DASH}
    </span>
  )
}

/**
 * A value with its 7-day change after it, in one column: the change in the
 * KPIs' small print, in a slot of its own width so the values stay aligned.
 * In a narrow table only the value shows.
 */
export function HomeRankedValueWithChange({
  value,
  change,
}: {
  value: number | undefined
  change: number | undefined
}) {
  return (
    <span className="flex items-baseline gap-1.5">
      <HomeRankedValue value={value} />
      <span className="flex @max-[360px]:hidden min-w-13 justify-end">
        {change !== undefined && (
          <Tooltip>
            <TooltipTrigger className="flex">
              <HomeChange
                value={change}
                className="font-medium text-label-value-13"
              />
            </TooltipTrigger>
            <TooltipContent>Compared to 7 days ago</TooltipContent>
          </Tooltip>
        )}
      </span>
    </span>
  )
}
