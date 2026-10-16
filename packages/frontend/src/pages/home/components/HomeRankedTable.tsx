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
   * The narrowest table that still shows the column, e.g. for the 7-day
   * change or a secondary figure, so names keep their room. A hidden column's
   * track just collapses and the others keep their places.
   */
  minTableWidth?: 360 | 480 | 640
}

/** Literal classes, so Tailwind sees them. */
const HIDE_BELOW: Record<360 | 480 | 640, string> = {
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
  const rest = columns.map(() => 'auto').join(' ')
  // Names and middle columns never go below their content here, so this
  // waits for a table wide enough to fit the longest of them.
  const restWide = columns
    .map((column) => (column.middle ? 'minmax(max-content,1fr)' : 'auto'))
    .join(' ')
  return (
    // A container: in a narrow card the secondary columns give way, so names
    // keep their room; in a wide one the middle columns move in from the
    // figures.
    <div className={cn('@container min-w-0', className)}>
      <div
        className="grid @min-[480px]:grid-cols-(--ranked-columns-wide) grid-cols-(--ranked-columns) content-start @min-[480px]:gap-x-5 gap-x-4"
        style={
          {
            '--ranked-columns': `auto minmax(0,1fr) ${rest}`,
            '--ranked-columns-wide': `auto minmax(max-content,1fr) ${restWide}`,
          } as CSSProperties
        }
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

/** The 7-day change; an em dash keeps the column when there is none. */
export function HomeRankedChange({ change }: { change: number | undefined }) {
  if (change === undefined) {
    return (
      <span className={cn(HOME_TEXT.value, 'text-secondary')}>{EM_DASH}</span>
    )
  }
  return (
    <Tooltip>
      {/* A flex box: as a plain button it would set its own 16px line box
          around the 14px figure, dropping it below the others and making
          the row taller than the rows beside it. */}
      <TooltipTrigger className="flex">
        <HomeChange
          value={change}
          className={cn(HOME_TEXT.value, 'font-medium')}
        />
      </TooltipTrigger>
      <TooltipContent>Compared to 7 days ago</TooltipContent>
    </Tooltip>
  )
}
