import { formatCurrency } from '@l2beat/shared-pure'
import type { CSSProperties, ReactNode } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { EM_DASH } from '~/consts/characters'
import { cn } from '~/utils/cn'
import { HOME_ICON_CLASS, HOME_TEXT } from '../homeStyles'
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
}

/**
 * A short, single-line ranking. Rows are subgrids of one grid, so every
 * column lines up across rows whatever the width of its content. Only the
 * name links, so cells can hold their own tooltips.
 */
export function HomeRankedTable<T extends HomeRankedTableRow>({
  rows,
  columns,
  className,
}: {
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
    // A container: in a narrow card the metric labels and the 7-day change
    // give way, so names keep their room; in a wide one the middle columns
    // move in from the figures.
    <div className={cn('@container min-w-0', className)}>
      <ol
        className="grid @min-[480px]:grid-cols-(--ranked-columns-wide) grid-cols-(--ranked-columns) content-start gap-x-2 divide-y divide-divider"
        style={
          {
            '--ranked-columns': `auto minmax(0,1fr) ${rest}`,
            '--ranked-columns-wide': `auto minmax(max-content,1fr) ${restWide}`,
          } as CSSProperties
        }
      >
        {rows.map((row, index) => (
          <li
            key={row.id}
            className="col-span-full grid min-h-10 grid-cols-subgrid items-center py-2"
          >
            <span className={cn('w-3 text-right tabular-nums', HOME_TEXT.meta)}>
              {index + 1}
            </span>
            <Name row={row} />
            {columns.map((column) => (
              <span
                key={column.id}
                className={cn(
                  'flex min-w-0 items-center',
                  column.align === 'right' && 'justify-end',
                  column.align === 'center' && 'justify-center',
                )}
              >
                {column.cell(row)}
              </span>
            ))}
          </li>
        ))}
      </ol>
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

/**
 * A USD value with its metric named in front, e.g. "TVS $1.2B". It fills its
 * column: the label keeps to the start, so every row's lines up, and the
 * value to the end.
 */
export function HomeRankedValue({
  label,
  value,
}: {
  label: string
  value: number | undefined
}) {
  return (
    <span className="flex w-full items-baseline gap-1.5 whitespace-nowrap">
      <span className={cn(HOME_TEXT.meta, '@max-[360px]:hidden')}>{label}</span>
      {/* No value is drawn like no change: the same grey dash. */}
      <span
        className={cn(
          'ml-auto',
          HOME_TEXT.value,
          value === undefined && 'text-secondary',
        )}
      >
        {value !== undefined ? formatCurrency(value, 'usd') : EM_DASH}
      </span>
    </span>
  )
}

/**
 * The 7-day change; an em dash keeps the column when there is none. Hidden in
 * a narrow table to leave names their room; as the last column, its track
 * just collapses, so the others keep their places.
 */
export function HomeRankedChange({ change }: { change: number | undefined }) {
  if (change === undefined) {
    return (
      <span
        className={cn('@max-[360px]:hidden', HOME_TEXT.value, 'text-secondary')}
      >
        {EM_DASH}
      </span>
    )
  }
  return (
    <Tooltip>
      {/* A flex box: as a plain button it would set its own 16px line box
          around the 14px figure, dropping it below the others and making
          the row taller than the rows beside it. */}
      <TooltipTrigger className="flex @max-[360px]:hidden">
        <HomeChange
          value={change}
          className={cn(HOME_TEXT.value, 'font-medium')}
        />
      </TooltipTrigger>
      <TooltipContent>Compared to 7 days ago</TooltipContent>
    </Tooltip>
  )
}
