import cx from 'classnames'
import { ReactChild } from 'react'

interface Props<T> {
  className?: string
  items: T[]
  columns: Column<T>[]
}

export interface Column<T> {
  name: string
  shortName?: string
  alignRight?: true
  getValue(value: T, index: number): ReactChild
}

export function TableView<T>({ className, items, columns }: Props<T>) {
  return (
    <div className={cx('TableView', className)}>
      <table className="TableView-Table">
        <thead className="TableView-Header">
          <tr>
            {columns.map((column, i) => (
              <th key={i} className={column.alignRight ? 'right' : undefined}>
                <span data-wide={!!column.shortName}>{column.name}</span>
                {column.shortName && (
                  <span data-narrow>{column.shortName}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="TableView-Body">
          {items.map((item, i) => (
            <tr key={i}>
              {columns.map((column, j) => (
                <td key={j} className={cx(column.alignRight && 'right')}>
                  {column.getValue(item, i)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
