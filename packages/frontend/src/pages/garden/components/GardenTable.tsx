import { formatDollarValueNumber, formatInteger } from '@l2beat/shared-pure'
import { PercentChange } from '~/components/PercentChange'
import { Table, TableBody, TableCell, TableRow } from '~/components/table/Table'
import { cn } from '~/utils/cn'
import { CROP_COLUMNS } from '../crops'
import type { GardenEntry } from '../getGardenData'
import { CropBadge } from './CropBadge'

export function GardenTable({ entries }: { entries: GardenEntry[] }) {
  return (
    <Table className="min-w-[680px]">
      <TableBody>
        {entries.map((entry, rowIndex) => (
          <TableRow key={entry.slug} highlightId={undefined}>
            <TableCell className="whitespace-nowrap">
              <ProjectCell entry={entry} />
            </TableCell>
            <TableCell className="py-3">
              <div className="flex gap-3.5">
                {CROP_COLUMNS.map((column, columnIndex) => (
                  <CropBadge
                    key={column.key}
                    label={column.label}
                    note={column.note}
                    evaluation={entry.crops[column.key]}
                    delay={columnIndex * 0.09 + rowIndex * 0.05}
                  />
                ))}
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

function ProjectCell({ entry }: { entry: GardenEntry }) {
  const content = (
    <>
      <img
        src={entry.iconUrl}
        alt=""
        width={34}
        height={34}
        className="size-[34px] rounded-lg"
      />
      <div className="flex flex-col leading-tight">
        <span
          className={cn(
            'font-semibold text-primary text-sm',
            entry.href && 'group-hover/project:underline',
          )}
        >
          {entry.name}
        </span>
        <span className="text-secondary text-xs">{entry.subtitle}</span>
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

function MetricCell({ metric }: { metric: GardenEntry['metric'] }) {
  if (!metric) {
    return <span className="text-secondary">&mdash;</span>
  }
  return (
    <div className="inline-flex flex-col items-end gap-px">
      <span className="font-semibold text-[10px] text-secondary uppercase tracking-wider">
        {metric.label}
      </span>
      <span className="font-semibold text-primary text-sm tabular-nums">
        {metric.kind === 'usd'
          ? formatDollarValueNumber(metric.value)
          : formatInteger(metric.value)}
        {metric.change !== undefined && (
          <>
            {' '}
            <PercentChange value={metric.change} textClassName="text-xs" />
          </>
        )}
      </span>
    </div>
  )
}
