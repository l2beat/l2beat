import { formatDollarValueNumber, formatInteger } from '@l2beat/shared-pure'
import { CropBadge } from '~/components/garden/CropBadge'
import { CropEvaluationDetails } from '~/components/garden/CropFindings'
import {
  CROP_COLUMNS,
  type CropEntry,
  getCropStatusText,
  toCropEntries,
} from '~/components/garden/crops'
import { useEntranceHold } from '~/components/garden/useEntranceHold'
import { PercentChange } from '~/components/PercentChange'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableHeaderRow,
  TableRow,
} from '~/components/table/Table'
import { stickyTableColumnRowProps } from '~/components/table/useStickyTableHeader'
import { cn } from '~/utils/cn'
import type { GardenEntry } from '../getGardenData'

export function GardenTable({ entries }: { entries: GardenEntry[] }) {
  const entranceHold = useEntranceHold()
  return (
    <Table
      className={cn('md:min-w-[680px]', entranceHold)}
      header={<CropLettersHeader />}
      stickyHeader
    >
      <TableBody>
        {entries.map((entry, rowIndex) => (
          <TableRow key={entry.slug} highlightId={undefined}>
            <TableCell className="whitespace-nowrap max-md:py-3 max-md:pr-0">
              {/* On phones the row stacks, so all four plants show without a sideways scroll. */}
              <div className="flex items-center justify-between gap-3">
                <ProjectCell entry={entry} />
                <div className="md:hidden">
                  <MetricCell
                    metric={entry.metric}
                    alwaysReserveChange={false}
                  />
                </div>
              </div>
              <EvaluatedCrops
                entry={entry}
                rowIndex={rowIndex}
                className={cn(PHONE_PLANTS_CLASS, 'mt-2 md:hidden')}
              />
            </TableCell>
            <TableCell className="py-3 max-md:hidden">
              <EvaluatedCrops
                entry={entry}
                rowIndex={rowIndex}
                className="flex justify-center gap-3.5"
              />
            </TableCell>
            <TableCell align="right" className="max-md:hidden">
              <MetricCell metric={entry.metric} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

/** Names the plant columns with the letters that spell CROPS, as on project pages. */
function CropLettersHeader() {
  return (
    <>
      {/* One per column: the sticky header copy takes its widths from these. */}
      <colgroup>
        <col />
        <col />
        <col />
      </colgroup>
      <TableHeader>
        <TableHeaderRow {...stickyTableColumnRowProps}>
          {/* The body cell's insets, so the letters sit over their plants. */}
          <TableHead className="max-md:pr-0 max-md:first:pl-3">
            <CropLetters className={cn(PHONE_PLANTS_CLASS, 'md:hidden')} />
          </TableHead>
          <TableHead className="max-md:hidden">
            <CropLetters className="mx-auto flex gap-3.5" />
          </TableHead>
          <TableHead className="max-md:hidden" />
        </TableHeaderRow>
        {/* Sets the stuck header apart from the rows it covers, as on other tables. Desktop has none. */}
        <TableHeaderRow className="md:hidden">
          <th colSpan={3} className="mx-0.5 h-0.5 rounded-full bg-divider" />
        </TableHeaderRow>
      </TableHeader>
    </>
  )
}

/**
 * Under the project name: the 34 px icon and its 12 px gap. Below 400 px that
 * indent leaves too little room for four 56 px plants, so they spread across
 * the whole row instead of scrolling sideways.
 */
const PHONE_PLANTS_CLASS =
  'flex w-full justify-between min-[400px]:justify-start min-[400px]:gap-2 min-[400px]:pl-[46px]'

function CropLetters({ className }: { className: string }) {
  return (
    <div className={className}>
      {CROP_COLUMNS.map((column) => (
        <abbr
          key={column.key}
          title={column.label}
          className="w-14 text-center no-underline"
        >
          {column.letter}
        </abbr>
      ))}
    </div>
  )
}

function EvaluatedCrops({
  entry,
  rowIndex,
  className,
}: {
  entry: GardenEntry
  rowIndex: number
  className: string
}) {
  return (
    <div className={className}>
      {toCropEntries(entry.crops, entry.ossification).map(
        (crop, columnIndex) => (
          <EvaluatedCrop
            key={crop.definition.key}
            crop={crop}
            delay={entranceDelay(rowIndex, columnIndex)}
            jitterKey={`${entry.slug}:${crop.definition.key}`}
          />
        ),
      )}
    </div>
  )
}

/** Rows ripple down the table, capped so a long table's last row is not left waiting. */
function entranceDelay(rowIndex: number, columnIndex: number) {
  const MAX_ROW_DELAY = 0.3
  return columnIndex * 0.05 + Math.min(rowIndex * 0.04, MAX_ROW_DELAY)
}

function EvaluatedCrop({
  crop,
  delay,
  jitterKey,
}: {
  crop: CropEntry
  delay: number
  jitterKey: string
}) {
  const { definition, evaluation } = crop
  const statusText = getCropStatusText(evaluation.status, evaluation.sentiment)
  return (
    <CropBadge
      status={evaluation.status}
      sentiment={evaluation.sentiment}
      delay={delay}
      jitterKey={jitterKey}
      label={`${definition.label}: ${statusText}`}
    >
      <CropEvaluationDetails entry={crop} />
    </CropBadge>
  )
}

function ProjectCell({ entry }: { entry: GardenEntry }) {
  const content = (
    <>
      {/* Preflight's max-width: 100% makes WebKit size the column as if the icon were not there, so the name overlaps the plants. */}
      <img
        src={entry.iconUrl}
        alt=""
        width={40}
        height={40}
        className="size-[34px] max-w-none shrink-0 rounded-lg md:size-10"
      />
      {/* Wraps on phones, so a long name and its TVL fit one row. */}
      <div className="flex flex-col leading-tight max-md:whitespace-normal">
        <span
          className={cn(
            'font-semibold text-primary text-sm md:text-base',
            entry.href && 'group-hover/project:underline',
          )}
        >
          {entry.name}
        </span>
        <span className="text-secondary text-xs md:text-sm">
          {entry.subtitle}
        </span>
      </div>
    </>
  )
  if (!entry.href) {
    return <div className="flex min-w-0 items-center gap-3">{content}</div>
  }
  return (
    <a
      href={entry.href}
      className="group/project flex min-w-0 items-center gap-3"
    >
      {content}
    </a>
  )
}

/**
 * In the table the change has a column of its own, empty when there is none,
 * so amounts and the dash share a right edge. A phone row stands alone, so
 * without a change its amount goes to the row's right edge instead.
 */
function MetricCell({
  metric,
  alwaysReserveChange = true,
}: {
  metric: GardenEntry['metric']
  alwaysReserveChange?: boolean
}) {
  const reserveChange = alwaysReserveChange || metric?.change !== undefined
  return (
    <div
      className={cn(
        'inline-grid items-baseline gap-x-1 gap-y-px text-right',
        reserveChange ? 'grid-cols-[auto_3.5rem]' : 'grid-cols-[auto]',
      )}
    >
      {metric ? (
        <>
          <span className="font-medium text-label-value-13 text-primary">
            {metric.label}
          </span>
          <span className="row-start-2 font-semibold text-base text-primary tabular-nums">
            {metric.kind === 'usd'
              ? formatDollarValueNumber(metric.value)
              : formatInteger(metric.value)}
          </span>
          {reserveChange && (
            <span className="row-start-2 text-left">
              {metric.change !== undefined && (
                <PercentChange
                  value={metric.change}
                  period="7D"
                  textClassName="text-xs"
                />
              )}
            </span>
          )}
        </>
      ) : (
        <>
          {/* Holds the label's line, so the dash sits on the amounts' line. */}
          <span aria-hidden className="text-label-value-13">
            &nbsp;
          </span>
          <span className="row-start-2 text-secondary">&mdash;</span>
        </>
      )}
    </div>
  )
}
