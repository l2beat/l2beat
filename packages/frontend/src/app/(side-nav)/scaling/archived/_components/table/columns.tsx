import { createColumnHelper } from '@tanstack/react-table'
import { UpcomingBadge } from '~/components/badge/upcoming-badge'
import { PizzaRosetteCell } from '~/components/rosette/pizza/pizza-rosette-cell'
import { ProjectNameCell } from '~/components/table/cells/project-name-cell'
import { TypeExplanationTooltip } from '~/components/table/cells/type-cell'
import { TypeCell } from '~/components/table/cells/type-cell'
import { getCommonProjectColumns } from '~/components/table/common-project-columns'
import { EM_DASH } from '~/consts/characters'
import { type ScalingArchivedEntry } from '~/server/features/scaling/archived/get-scaling-archived-entries'
import { formatCurrency } from '~/utils/format'

const columnHelper = createColumnHelper<ScalingArchivedEntry>()

export const scalingArchivedColumns = [
  ...getCommonProjectColumns(columnHelper),
  columnHelper.accessor('name', {
    cell: (ctx) => <ProjectNameCell project={ctx.row.original} />,
  }),
  columnHelper.accessor('risks', {
    cell: (ctx) => {
      const risks = ctx.getValue()
      if (!risks) {
        return EM_DASH
      }

      return (
        <PizzaRosetteCell
          values={risks}
          isUnderReview={ctx.row.original.isUnderReview}
        />
      )
    },
    enableSorting: false,
    meta: {
      cellClassName: 'justify-center',
      tooltip: 'Risks associated with this project.',
    },
  }),
  columnHelper.accessor('category', {
    header: 'Type',
    cell: (ctx) => (
      <TypeCell provider={ctx.row.original.provider}>{ctx.getValue()}</TypeCell>
    ),
    meta: {
      tooltip: <TypeExplanationTooltip />,
    },
  }),
  columnHelper.accessor('purposes', {
    header: 'Purpose',
    cell: (ctx) => ctx.getValue().join(', '),
    enableSorting: false,
    meta: {
      tooltip: 'Functionality supported by this project.',
    },
  }),
  columnHelper.accessor('totalTvl', {
    id: 'total',
    header: 'Total',
    cell: (ctx) => {
      const value = ctx.getValue()
      if (value === undefined) {
        return <UpcomingBadge />
      }

      return (
        <span className="text-base font-bold md:text-lg">
          {formatCurrency(value, 'usd', {
            showLessThanMinimum: false,
          })}
        </span>
      )
    },
    sortingFn: ({ original: a }, { original: b }) => {
      const aTvl = a.totalTvl ?? 0
      const bTvl = b.totalTvl ?? 0

      if (aTvl === bTvl) {
        return b.name.localeCompare(a.name)
      }

      return aTvl - bTvl
    },
    meta: {
      align: 'right',
      tooltip:
        'Total value locked in escrow contracts on Ethereum displayed together with a percentage changed compared to 7D ago. Some projects may include externally bridged and natively minted assets.',
    },
  }),
]
