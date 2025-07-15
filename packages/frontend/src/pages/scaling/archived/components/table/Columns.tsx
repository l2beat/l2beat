import { createColumnHelper } from '@tanstack/react-table'
import compact from 'lodash/compact'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import { PizzaRosetteCell } from '~/components/rosette/pizza/PizzaRosetteCell'
import {
  TypeExplanationTooltip,
  TypeInfo,
} from '~/components/table/cells/TypeInfo'
import { getScalingCommonProjectColumns } from '~/components/table/utils/common-project-columns/ScalingCommonProjectColumns'
import { EM_DASH } from '~/consts/characters'
import type { ScalingArchivedEntry } from '~/server/features/scaling/archived/getScalingArchivedEntries'
import { formatDollarValueNumber } from '~/utils/number-format/formatDollarValueNumber'

const columnHelper = createColumnHelper<ScalingArchivedEntry>()

export function getScalingArchivedColumns(hideType?: boolean) {
  return compact([
    ...getScalingCommonProjectColumns(
      columnHelper,
      (row) => `/scaling/projects/${row.slug}`,
    ),
    columnHelper.display({
      header: 'Risks',
      cell: (ctx) => {
        const risks = ctx.row.original.risks
        if (!risks) {
          return EM_DASH
        }

        return (
          <PizzaRosetteCell
            href={`/scaling/projects/${ctx.row.original.slug}#risk-analysis`}
            values={risks}
            isUnderReview={ctx.row.original.statuses?.underReview === 'config'}
          />
        )
      },
      meta: {
        cellClassName: 'justify-center',
      },
    }),
    !hideType &&
      columnHelper.accessor('category', {
        header: 'Type',
        cell: (ctx) => (
          <TypeInfo stacks={ctx.row.original.stacks}>{ctx.getValue()}</TypeInfo>
        ),
        meta: {
          tooltip: <TypeExplanationTooltip />,
        },
      }),
    columnHelper.display({
      header: 'Purpose',
      cell: (ctx) => ctx.row.original.purposes.join(', '),
    }),
    columnHelper.accessor('totalTvs', {
      id: 'total',
      header: 'Total value secured',
      cell: (ctx) => {
        const value = ctx.getValue()
        if (value === undefined) {
          return <NoDataBadge />
        }

        return (
          <span className="font-bold md:text-base">
            {formatDollarValueNumber(value)}
          </span>
        )
      },
      sortUndefined: 'last',
      sortingFn: ({ original: a }, { original: b }) => {
        const aTvs = a.totalTvs ?? 0
        const bTvs = b.totalTvs ?? 0

        if (aTvs === bTvs) {
          return b.name.localeCompare(a.name)
        }

        return aTvs - bTvs
      },
      meta: {
        align: 'right',
        tooltip:
          'Total value secured is calculated as the sum of canonically bridged tokens, externally bridged tokens, and native tokens.',
      },
    }),
  ])
}
