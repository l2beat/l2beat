import type { Row } from '@tanstack/react-table'
import type { Formula } from '@l2beat/config'

export function renderFormulaSubComponent<T extends { formula: Formula }>({
  row,
}: { row: Row<T> }) {
  return (
    <div className="flex flex-col py-3">
      <p className="text-xs font-normal">The amount is calculated as:</p>
      <div className="mt-0.5 flex gap-2">
        <div className="w-[3px] self-stretch bg-surface-secondary" />
        <code className="w-full bg-surface-tertiary px-4 py-3 text-xs font-medium">
          {JSON.stringify(row.original.formula, null, 2)}
        </code>
      </div>
    </div>
  )
}
