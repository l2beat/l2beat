import { createColumnHelper } from '@tanstack/react-table'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import { PizzaRosetteCell } from '~/components/rosette/pizza/PizzaRosetteCell'
import { ProofSystemCell } from '~/components/table/cells/ProofSystemCell'
import { TypeInfo } from '~/components/table/cells/TypeInfo'
import { getLayer2sCommonProjectColumns } from '~/components/table/common-project-columns/Layer2sCommonProjectColumns'
import { EM_DASH } from '~/consts/characters'
import type { Layer2sArchivedEntry } from '~/server/features/layer2s/archived/getLayer2sArchivedEntries'
import { formatDollarValueNumber } from '~/utils/number-format/formatDollarValueNumber'

const columnHelper = createColumnHelper<Layer2sArchivedEntry>()

export const layer2sArchivedColumns = [
  ...getLayer2sCommonProjectColumns(
    columnHelper,
    (row) => `/layer2s/projects/${row.slug}`,
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
          href={`/layer2s/projects/${ctx.row.original.slug}#risk-analysis`}
          values={risks}
          isUnderReview={ctx.row.original.statuses?.underReview === 'config'}
        />
      )
    },
    meta: {
      cellClassName: 'justify-center',
    },
  }),
  columnHelper.accessor('type', {
    header: 'Type',
    cell: (ctx) => (
      <TypeInfo stacks={ctx.row.original.stacks}>{ctx.getValue()}</TypeInfo>
    ),
  }),
  columnHelper.accessor('proofSystem', {
    header: 'Proof system',
    cell: (ctx) => <ProofSystemCell {...ctx.row.original} />,
    meta: {
      tooltip:
        'The type of proof system that the project uses to prove its state: either Optimistic (assumed valid unless challenged) or Validity (cryptographically proven upfront)',
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
        'Total value secured is calculated as the sum of canonically bridged tokens, externally bridged tokens, and native tokens, shown together with a percentage change compared to 7D ago.',
    },
  }),
]
