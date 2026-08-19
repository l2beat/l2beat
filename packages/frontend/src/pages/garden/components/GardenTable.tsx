import { formatDollarValueNumber, formatInteger } from '@l2beat/shared-pure'
import { NotApplicableBadge } from '~/components/badge/NotApplicableBadge'
import { PercentChange } from '~/components/PercentChange'
import { IndexCell } from '~/components/table/cells/IndexCell'
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
import { CROP_COLUMNS } from '../crops'
import type { GardenEntry, GardenProjectType } from '../getGardenData'
import { CropBadge } from './CropBadge'

const TYPE_TAG: Record<
  GardenProjectType,
  { label: string; className: string }
> = {
  l1: {
    label: 'L1',
    className: 'text-[#2B2F3A] bg-[#DDE1EA] border-[#98A2B6]',
  },
  l2: {
    label: 'L2',
    className: 'text-[#0C3D66] bg-[#BEDBFF] border-[#4E94D9]',
  },
  l3: {
    label: 'L3',
    className: 'text-[#0F3F3A] bg-[#BFEFE5] border-[#45B8A7]',
  },
  privacy: {
    label: 'Privacy',
    className: 'text-[#3F1E6D] bg-[#C7B8FF] border-[#8D78D9]',
  },
  defi: {
    label: 'DeFi',
    className: 'text-[#5C1F45] bg-[#FFC7E8] border-[#D978B4]',
  },
}

/** Links to the project page when it has one, otherwise renders plain. */
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

export function GardenTable({ entries }: { entries: GardenEntry[] }) {
  return (
    <Table className="min-w-[680px]">
      <TableHeader>
        <TableHeaderRow>
          <TableHead className="w-0" align="right">
            #
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Crops</TableHead>
          <TableHead align="right">Key metrics</TableHead>
        </TableHeaderRow>
        <TableHeaderRow>
          <th colSpan={100} className="mx-0.5 h-0.5 rounded-full bg-divider" />
        </TableHeaderRow>
      </TableHeader>
      <TableBody>
        {entries.map((entry, rowIndex) => (
          <TableRow key={entry.slug} highlightId={undefined}>
            <TableCell>
              <IndexCell>{rowIndex + 1}</IndexCell>
            </TableCell>
            <TableCell className="whitespace-nowrap">
              <ProjectCell entry={entry} />
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1.5">
                {entry.types.map((type) => (
                  <span
                    key={type}
                    className={cn(
                      'inline-flex select-none items-center whitespace-nowrap rounded border px-1.5 py-0.5 font-medium text-xs',
                      TYPE_TAG[type].className,
                    )}
                  >
                    {TYPE_TAG[type].label}
                  </span>
                ))}
              </div>
            </TableCell>
            <TableCell className="py-3">
              <div className="flex gap-3.5">
                {CROP_COLUMNS.map((column, columnIndex) => (
                  <CropBadge
                    key={column.key}
                    letter={column.letter}
                    label={column.label}
                    evaluation={entry.crops[column.key]}
                    delay={columnIndex * 0.09 + rowIndex * 0.05}
                  />
                ))}
              </div>
            </TableCell>
            <TableCell align="right">
              {entry.tvs === undefined ? (
                <span className="text-secondary">&mdash;</span>
              ) : entry.tvs.kind === 'notApplicable' ? (
                <NotApplicableBadge />
              ) : (
                <div className="inline-flex flex-col items-end gap-px">
                  <span className="font-semibold text-[10px] text-secondary uppercase tracking-wider">
                    {entry.tvs.label}
                  </span>
                  <span className="font-semibold text-primary text-sm tabular-nums">
                    {entry.tvs.kind === 'usd'
                      ? formatDollarValueNumber(entry.tvs.value)
                      : formatInteger(entry.tvs.value)}
                    {entry.tvs.change !== undefined && (
                      <>
                        {' '}
                        <PercentChange
                          value={entry.tvs.change}
                          textClassName="text-xs"
                        />
                      </>
                    )}
                  </span>
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
