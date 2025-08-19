import type { Formula } from '@l2beat/config'
import type { Row } from '@tanstack/react-table'

export function renderFormulaSubComponent<T extends { formula: Formula }>({
  row,
}: {
  row: Row<T>
}) {
  return (
    <div className="flex flex-col py-3">
      <p className="font-normal text-xs">The value is calculated as:</p>
      <code className="mt-0.5 w-full whitespace-pre bg-surface-secondary px-4 py-3 font-medium text-xs">
        {JSON.stringify(row.original.formula, null, 2)}
      </code>
    </div>
  )
}
