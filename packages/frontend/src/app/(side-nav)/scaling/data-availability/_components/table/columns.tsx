import { createColumnHelper } from '@tanstack/react-table'
import { TableValueCell } from '~/components/table/cells/table-value-cell'
import {
  TypeExplanationTooltip,
  TypeInfo,
} from '~/components/table/cells/type-info'
import {
  adjustTableValue,
  sortTableValues,
} from '~/components/table/sorting/sort-table-values'
import { getScalingCommonProjectColumns } from '~/components/table/utils/common-project-columns/scaling-common-project-columns'
import type { ScalingDaEntry } from '~/server/features/scaling/data-availability/get-scaling-da-entries'

const columnHelper = createColumnHelper<ScalingDaEntry>()

export const columns = [
  ...getScalingCommonProjectColumns(columnHelper),
  columnHelper.accessor('category', {
    header: 'Type',
    meta: {
      tooltip: <TypeExplanationTooltip />,
    },
    cell: (ctx) => (
      <TypeInfo stack={ctx.row.original.stack}>{ctx.getValue()}</TypeInfo>
    ),
    sortingFn: (a, b) => {
      const categoryCompare = a.original.category.localeCompare(
        b.original.category,
      )
      if (categoryCompare !== 0) {
        return categoryCompare
      }

      const stackCompare = (a.original.stack ?? '').localeCompare(
        b.original.stack ?? '',
      )
      return stackCompare
    },
  }),
  columnHelper.accessor((e) => adjustTableValue(e.dataAvailability.layer), {
    header: 'DA Layer',
    meta: {
      tooltip:
        'The data availability layer where the data (transaction data or state diffs) is published.',
    },
    cell: (ctx) => (
      <TableValueCell value={ctx.row.original.dataAvailability.layer} />
    ),
    sortDescFirst: true,
    sortUndefined: 'last',
    sortingFn: (a, b) =>
      sortTableValues(
        a.original.dataAvailability.layer,
        b.original.dataAvailability.layer,
      ),
  }),
  columnHelper.accessor((e) => adjustTableValue(e.dataAvailability.bridge), {
    header: 'DA Bridge',
    meta: {
      tooltip:
        'The DA bridge used for informing Ethereum contracts if data has been made available.',
    },
    cell: (ctx) => (
      <TableValueCell value={ctx.row.original.dataAvailability.bridge} />
    ),
    sortDescFirst: true,
    sortUndefined: 'last',
    sortingFn: (a, b) =>
      sortTableValues(
        a.original.dataAvailability.bridge,
        b.original.dataAvailability.bridge,
      ),
  }),
  columnHelper.accessor((e) => adjustTableValue(e.dataAvailability.mode), {
    header: 'Type of data',
    cell: (ctx) => (
      <TableValueCell value={ctx.row.original.dataAvailability.mode} />
    ),
    sortUndefined: 'last',
    sortingFn: (a, b) =>
      sortTableValues(
        a.original.dataAvailability.mode,
        b.original.dataAvailability.mode,
      ),
  }),
]
