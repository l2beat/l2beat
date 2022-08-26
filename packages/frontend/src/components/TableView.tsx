import cx from 'classnames'
import React, { ReactNode } from 'react'

interface Props<T> {
  className?: string
  items: T[]
  columns: Column<T>[]
}

export interface Column<T> {
  name: ReactNode
  shortName?: ReactNode
  alignRight?: true
  getValue: (value: T) => ReactNode
}

export function TableView<T>({ className, items, columns }: Props<T>) {
  return (
    <div className={cx('TableView', className)}>
      <table className="TableView-Table">
        <thead className="TableView-Header">
          <tr>
            <th>No.</th>
            {columns.map((column, i) => (
              <th key={i} className={column.alignRight ? 'right' : undefined}>
                <span data-wide={column.shortName ? true : undefined}>
                  {column.name}
                </span>
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
              <td>{i + 1}.</td>
              {columns.map((column, j) => (
                <td key={j} className={column.alignRight ? 'right' : undefined}>
                  {column.getValue(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
