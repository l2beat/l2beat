import type { CellContext, ColumnDef } from '@tanstack/react-table'
import type { ZkCatalogEntry } from '~/server/features/zk-catalog/getZkCatalogEntries'

export function withSpanByTrustedSetups<T, C>(column: ColumnDef<T, C>) {
  return {
    ...column,
    meta: {
      rowSpan: spanByTrustedSetups,
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

function spanByTrustedSetups<T extends ZkCatalogEntry>(
  ctx: CellContext<T, unknown>,
) {
  return Object.values(ctx.row.original.trustedSetups).length
}
