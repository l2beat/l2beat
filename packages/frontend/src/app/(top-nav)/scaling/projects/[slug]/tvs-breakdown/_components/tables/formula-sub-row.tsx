import type { Row } from '@tanstack/react-table'
import type { Formula } from '@l2beat/config'

export function renderFormulaSubComponent<T extends { formula: Formula }>({
  row,
}: { row: Row<T> }) {
  return (
    <pre style={{ fontSize: '10px' }}>
      <code>{JSON.stringify(row.original.formula, null, 2)}</code>
    </pre>
  )
}
