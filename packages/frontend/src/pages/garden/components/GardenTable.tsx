import { formatDollarValueNumber, formatInteger } from '@l2beat/shared-pure'
import { CropBadge } from '~/components/garden/CropBadge'
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
import { CropTooltip } from './CropTooltip'

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
                  <MetricCell metric={entry.metric} />
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
      {toCropEntries(entry.crops).map((crop, columnIndex) => (
        <EvaluatedCrop
          key={crop.definition.key}
          crop={crop}
          project={entry}
          delay={entranceDelay(rowIndex, columnIndex)}
          jitterKey={`${entry.slug}:${crop.definition.key}`}
        />
      ))}
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
  project,
  delay,
  jitterKey,
}: {
  crop: CropEntry
  project: GardenEntry
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
      <CropTooltip crop={crop} project={project} />
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
 * The change hangs under the amount on a row of no height, so every amount
 * shares the right edge and a row with a change is as tall as one without:
 * on phones it sits in the gap above the plants instead of pushing them down.
 * Being in the grid, it still widens the cell when it is wider than the
 * amount, so it cannot run into the project name.
 * Below 400px the plants reach the right edge (`PHONE_PLANTS_CLASS`), so
 * there is no gap and the change is left out.
 */
function MetricCell({ metric }: { metric: GardenEntry['metric'] }) {
  return (
    <div className="inline-grid items-baseline gap-y-px text-right">
      {metric ? (
        <>
          <span className="font-medium text-label-value-13 text-primary">
            {metric.label}
          </span>
          <span className="font-semibold text-base text-primary tabular-nums">
            {metric.kind === 'usd'
              ? formatDollarValueNumber(metric.value)
              : formatInteger(metric.value)}
          </span>
          {metric.change !== undefined && (
            <span className="-translate-y-1 h-0 leading-none max-[400px]:hidden">
              <PercentChange
                value={metric.change}
                period="7D"
                textClassName="text-2xs leading-none"
              />
            </span>
          )}
        </>
      ) : (
        <>
          {/* Holds the label's line, so the dash sits on the amounts' line. */}
          <span aria-hidden className="text-label-value-13">
            &nbsp;
          </span>
          <span className="text-secondary">&mdash;</span>
        </>
      )}
    </div>
  )
}
