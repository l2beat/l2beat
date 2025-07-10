import type { Formula } from '@l2beat/config'
import type { Row } from '@tanstack/react-table'

export function renderFormulaSubComponent<T extends { formula: Formula }>({
  row,
}: {
  row: Row<T>
}) {
  return (
    <div className="flex flex-col py-3">
      <p className="font-normal text-xs">The amount is calculated as:</p>
      <div className="mt-0.5 flex gap-2">
        <div className="w-[3px] self-stretch bg-surface-secondary" />
        <code className="w-full bg-surface-tertiary px-4 py-3 font-medium text-xs">
          {JSON.stringify(row.original.formula, null, 2)}
        </code>
      </div>
    </div>
  )
}
