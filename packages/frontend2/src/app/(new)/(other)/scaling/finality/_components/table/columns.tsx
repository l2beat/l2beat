import { createColumnHelper } from '@tanstack/react-table'
import Image from 'next/image'
import { Badge } from '~/app/_components/badge/badge'
import { IndexCell } from '~/app/_components/table/cells/index-cell'
import { ProjectNameCell } from '~/app/_components/table/cells/project-name-cell'
import {
  TypeCell,
  TypeColumnTooltip,
} from '~/app/_components/table/cells/type-cell'
import { type ScalingFinalityEntry } from '~/server/features/scaling/finality/types'
import { FinalityDurationCell } from './FinalityDurationCell'

const columnHelper = createColumnHelper<ScalingFinalityEntry>()

export const scalingFinalityColumns = [
  columnHelper.accessor((_, index) => index + 1, {
    header: '#',
    cell: (ctx) => <IndexCell>{ctx.row.index + 1}</IndexCell>,
    meta: {
      headClassName: 'w-0',
    },
    size: 44.55,
  }),
  columnHelper.display({
    id: 'logo',
    cell: (ctx) => (
      <Image
        className="min-w-[18px] min-h-[18px]"
        src={`/icons/${ctx.row.original.slug}.png`}
        width={18}
        height={18}
        alt={`${ctx.row.original.name} logo`}
      />
    ),
    // size: 26,
    // meta: {
    //   headClassName: 'w-0',
    //   cellClassName: 'lg:!pr-0',
    // },
  }),
  columnHelper.accessor('name', {
    cell: (ctx) => (
      <ProjectNameCell
        project={ctx.row.original}
        type={ctx.row.original.type}
      />
    ),
  }),
  columnHelper.accessor('category', {
    header: 'Type',
    cell: (ctx) => (
      <TypeCell provider={ctx.row.original.provider}>{ctx.getValue()}</TypeCell>
    ),
    meta: {
      tooltip: <TypeColumnTooltip />,
    },
  }),
  columnHelper.accessor('dataAvailabilityMode', {
    header: 'DA Mode',
    cell: (ctx) => ctx.getValue()?.replace(' ', ' ') ?? <span>&mdash;</span>,
    meta: {
      cellClassName: 'whitespace-nowrap',
      tooltip:
        'The type shows whether projects are posting transaction data batches or state diffs to the L1.',
    },
  }),
  columnHelper.accessor('data', {
    header: 'Past day avg.\nTime to inclusion',
    cell: (ctx) => {
      const data = ctx.getValue()
      return data ? (
        <FinalityDurationCell
          scope="timeToInclusion"
          warning={data.timeToInclusion.warning}
          timings={data.timeToInclusion}
          syncStatus={data.syncStatus}
        />
      ) : (
        <Badge type="gray">COMING SOON</Badge>
      )
    },
    meta: {
      tooltip:
        'The average time it would take for an L2 transaction to be included on the L1. Please note, this is an approximate estimation and is different than Time to finality since it ignores the overhead time to reach L1 finality after L1 inclusion.',
    },
  }),
  columnHelper.accessor('data', {
    header: 'State update\ndelay',
    cell: (ctx) => {
      const data = ctx.getValue()
      return data?.stateUpdateDelay ? (
        data.stateUpdateDelay.averageInSeconds === 0 ? (
          'None'
        ) : (
          <FinalityDurationCell
            scope="stateUpdateDelay"
            warning={data.stateUpdateDelay.warning}
            timings={data.stateUpdateDelay}
            syncStatus={data.syncStatus}
          />
        )
      ) : (
        <Badge type="gray">COMING SOON</Badge>
      )
    },
    meta: {
      tooltip:
        'Time interval between time to inclusion and state root submission.',
    },
  }),
  columnHelper.accessor('finalizationPeriod', {
    header: 'Execution Delay',
    cell: (ctx) => <span>{ctx.getValue()}</span>,
    meta: {
      headClassName: 'w-0',
      tooltip:
        'Time interval between state root submission and state root finalization. For Optimistic Rollups, this usually corresponds to the challenge period, whereas for ZK Rollups, it might be added as a safety precaution.',
    },
    size: 100,
  }),
]
