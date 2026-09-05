import type { ReactNode } from 'react'
import type { Column } from '../../shared/types'
import { Cell } from './IdChip'

export function FactsTable({
  columns,
  rows,
  selected,
  hovered,
  onHover,
  onSelect,
  extra,
  extraHeader,
  onNodeClick,
  limit = 400,
}: {
  columns: Column[]
  rows: string[][]
  selected?: number
  hovered?: number
  onHover?: (i: number | undefined) => void
  onSelect?: (i: number) => void
  extra?: (i: number) => ReactNode
  extraHeader?: ReactNode
  /** Base relations: what to do when an AST node id is clicked (default: highlight it in the source). */
  onNodeClick?: (id: number) => void
  limit?: number
}) {
  const shown = rows.slice(0, limit)
  return (
    <table className="facts" onMouseLeave={() => onHover?.(undefined)}>
      <thead>
        <tr>
          {extra && <th>{extraHeader}</th>}
          {columns.map((c) => (
            <th key={c.name}>
              {c.name}
              <span className="ty">{c.type}</span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {shown.map((row, i) => (
          <tr
            key={row.join('\t')}
            className={`${selected === i ? 'selected' : ''} ${hovered === i ? 'hover' : ''}`}
            onMouseEnter={() => onHover?.(i)}
            onClick={() => onSelect?.(i)}
          >
            {extra && <td className="why">{extra(i)}</td>}
            {row.map((v, j) => (
              <td
                key={j}
                className={columns[j]?.type === 'number' ? 'num' : ''}
              >
                <Cell
                  value={v}
                  type={columns[j]?.type}
                  column={columns[j]}
                  onNodeClick={onNodeClick}
                />
              </td>
            ))}
          </tr>
        ))}
        {rows.length > limit && (
          <tr>
            <td colSpan={columns.length + (extra ? 1 : 0)} className="muted">
              … {rows.length - limit} more rows not shown
            </td>
          </tr>
        )}
        {rows.length === 0 && (
          <tr>
            <td colSpan={columns.length + (extra ? 1 : 0)} className="muted">
              no rows
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}
