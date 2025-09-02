import { createColumnHelper } from '@tanstack/react-table'
import { ProjectNameCell } from '~/components/table/cells/ProjectNameCell'
import { TableLink } from '~/components/table/TableLink'
import { getDaCommonProjectColumns } from '~/components/table/utils/common-project-columns/DaCommonProjectColumns'
import { BridgeNameCell } from '~/pages/data-availability/summary/components/table/BridgeNameCell'
import type { DaLivenessEntry } from '~/server/features/data-availability/liveness/getDaLivenessEntries'

const columnHelper = createColumnHelper<DaLivenessEntry>()

export const [indexColumn, logoColumn] = getDaCommonProjectColumns(
  columnHelper,
  (row) => `${row.href}#da-layer`,
)

const daLayerColumn = columnHelper.accessor('name', {
  header: 'DA Layer',
  cell: (ctx) => (
    <TableLink href={`${ctx.row.original.href}#da-layer`}>
      <ProjectNameCell project={ctx.row.original} />
    </TableLink>
  ),
  meta: {
    tooltip:
      'The data availability layer where the data (transaction data or state diffs) is posted.',
  },
})

const baseColumns = [indexColumn, logoColumn, daLayerColumn]

const bridgeColumn = columnHelper.display({
  id: 'bridge',
  header: 'Bridge',
  cell: (ctx) => {
    const bridge = ctx.row.original.bridges[0]
    if (!bridge) {
      return null
    }
    return <BridgeNameCell bridge={bridge} />
  },
  meta: {
    tooltip:
      'The DA bridge through which Ethereum is informed that data has been made available.',
    additionalRows: (ctx) => {
      return ctx.row.original.bridges
        .slice(1)
        .map((bridge) => <BridgeNameCell key={bridge.slug} bridge={bridge} />)
    },
  },
})

export const publicColumns = [...baseColumns, bridgeColumn]
