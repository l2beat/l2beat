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
import { cn } from '~/utils/cn'
import type { GardenEntry } from '../getGardenData'

export function GardenTable({ entries }: { entries: GardenEntry[] }) {
  const entranceHold = useEntranceHold()
  return (
    <Table
      className={cn('min-w-[680px]', entranceHold)}
      header={<CropLettersHeader />}
    >
      <TableBody>
        {entries.map((entry, rowIndex) => (
          <TableRow key={entry.slug} highlightId={undefined}>
            <TableCell className="whitespace-nowrap max-md:first:pl-4">
              <ProjectCell entry={entry} />
            </TableCell>
            <TableCell className="py-3">
              <div className="flex gap-3.5 md:justify-center">
                {toCropEntries(entry.crops, entry.ossification).map(
                  (crop, columnIndex) => (
                    <EvaluatedCrop
                      key={crop.definition.key}
                      crop={crop}
                      delay={entranceDelay(rowIndex, columnIndex)}
                    />
                  ),
                )}
              </div>
            </TableCell>
            <TableCell align="right">
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
    <TableHeader>
      <TableHeaderRow>
        <TableHead />
        <TableHead>
          <div className="flex gap-3.5 md:mx-auto">
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
        </TableHead>
        <TableHead />
      </TableHeaderRow>
    </TableHeader>
  )
}

/** Rows ripple down the table, capped so a long table's last row is not left waiting. */
function entranceDelay(rowIndex: number, columnIndex: number) {
  const MAX_ROW_DELAY = 0.3
  return columnIndex * 0.05 + Math.min(rowIndex * 0.04, MAX_ROW_DELAY)
}

function EvaluatedCrop({ crop, delay }: { crop: CropEntry; delay: number }) {
  const { definition, evaluation } = crop
  const statusText = getCropStatusText(evaluation.status, evaluation.sentiment)
  return (
    <CropBadge
      status={evaluation.status}
      sentiment={evaluation.sentiment}
      delay={delay}
      label={`${definition.label}: ${statusText}`}
    >
      <CropEvaluationDetails entry={crop} />
    </CropBadge>
  )
}

function ProjectCell({ entry }: { entry: GardenEntry }) {
  const content = (
    <>
      <img
        src={entry.iconUrl}
        alt=""
        width={40}
        height={40}
        className="size-[34px] rounded-lg md:size-10"
      />
      <div className="flex flex-col leading-tight">
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
    return <div className="flex items-center gap-3">{content}</div>
  }
  return (
    <a href={entry.href} className="group/project flex items-center gap-3">
      {content}
    </a>
  )
}

// The change has a column of its own, empty when there is none, so amounts and the dash share a right edge.
function MetricCell({ metric }: { metric: GardenEntry['metric'] }) {
  return (
    <div className="inline-grid grid-cols-[auto_3.5rem] items-baseline gap-x-1 gap-y-px text-right">
      {metric ? (
        <>
          <span className="font-medium text-[12px] text-secondary">
            {metric.label}
          </span>
          <span className="row-start-2 font-semibold text-base text-primary tabular-nums">
            {metric.kind === 'usd'
              ? formatDollarValueNumber(metric.value)
              : formatInteger(metric.value)}
          </span>
          <span className="row-start-2 text-left">
            {metric.change !== undefined && (
              <PercentChange value={metric.change} textClassName="text-xs" />
            )}
          </span>
        </>
      ) : (
        <>
          {/* Holds the label's line, so the dash sits on the amounts' line. */}
          <span aria-hidden className="text-[12px]">
            &nbsp;
          </span>
          <span className="row-start-2 text-secondary">&mdash;</span>
        </>
      )}
    </div>
  )
}
