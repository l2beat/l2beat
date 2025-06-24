import type { CellContext, ColumnDef } from '@tanstack/react-table'
import type { DaArchivedEntry } from '~/server/features/data-availability/archived/getDaArchivedEntries'
import type { DaRiskEntry } from '~/server/features/data-availability/risks/getDaRiskEntries'
import type { DaSummaryEntry } from '~/server/features/data-availability/summary/getDaSummaryEntries'

export function withSpanByBridges<T, C>(column: ColumnDef<T, C>) {
  return {
    ...column,
    meta: {
      rowSpan: spanByBridges,
      ...column.meta,
    },
  }
}

export function virtual<T, C>(column: ColumnDef<T, C>) {
  return {
    ...column,
    meta: {
      virtual: true,
      ...column.meta,
    },
  }
}

function spanByBridges<
  T extends DaSummaryEntry | DaRiskEntry | DaArchivedEntry,
>(ctx: CellContext<T, unknown>) {
  return ctx.row.original.bridges.length
}
