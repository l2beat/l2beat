import type { CellContext, ColumnDef } from '@tanstack/react-table'
import type { DaRiskEntry } from '~/server/features/data-availability/risks/get-da-risk-entries'
import type { DaSummaryEntry } from '~/server/features/data-availability/summary/get-da-summary-entries'

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

function spanByBridges<T extends DaSummaryEntry | DaRiskEntry>(
  ctx: CellContext<T, unknown>,
) {
  return ctx.row.original.bridges.length
}
