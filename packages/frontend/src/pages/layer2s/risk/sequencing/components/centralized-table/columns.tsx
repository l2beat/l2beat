import { createColumnHelper } from '@tanstack/react-table'
import {
  CENTRALIZED_SEQUENCING_FIELD_KEYS,
  CENTRALIZED_SEQUENCING_FIELDS,
} from '~/components/projects/sections/sequencing/centralizedSequencingFields'
import { TableValueCell } from '~/components/table/cells/TableValueCell'
import { getL2CommonProjectColumns } from '~/components/table/common-project-columns/L2CommonProjectColumns'
import {
  adjustTableValue,
  sortTableValues,
} from '~/components/table/sorting/sortTableValues'
import type { L2RiskCentralizedSequencingEntry } from '~/server/features/layer2s/risks/sequencing/getL2RiskSequencingEntries'

const columnHelper = createColumnHelper<L2RiskCentralizedSequencingEntry>()

function getSequencingHref(entry: L2RiskCentralizedSequencingEntry) {
  return `/layer2s/projects/${entry.slug}#sequencing`
}

export const l2CentralizedSequencingColumns = [
  ...getL2CommonProjectColumns(columnHelper, getSequencingHref),
  ...CENTRALIZED_SEQUENCING_FIELD_KEYS.map((key) =>
    columnHelper.accessor((entry) => adjustTableValue(entry[key]), {
      id: key,
      header: CENTRALIZED_SEQUENCING_FIELDS[key].header,
      cell: (ctx) => <TableValueCell value={ctx.row.original[key]} />,
      meta: { tooltip: CENTRALIZED_SEQUENCING_FIELDS[key].tooltip },
      sortDescFirst: true,
      sortingFn: (a, b) => sortTableValues(a.original[key], b.original[key]),
    }),
  ),
]
