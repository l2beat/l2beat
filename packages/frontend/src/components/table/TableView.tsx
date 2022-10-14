import cx from 'classnames'
import React, { HTMLAttributes, ReactNode } from 'react'

interface Props<T> {
  items: T[]
  columns: ColumnConfig<T>[]
  rows?: RowConfig<T>
}

export interface ColumnConfig<T> {
  name: ReactNode
  shortName?: ReactNode
  alignRight?: true
  minimalWidth?: true
  getValue: (value: T, index: number) => ReactNode
  tooltip?: string
}

export interface RowConfig<T> {
  getProps: (value: T, index: number) => HTMLAttributes<HTMLTableRowElement>
}

export function TableView<T>({ items, columns, rows }: Props<T>) {
  return (
    <div
      className={cx(
        'overflow-x-auto whitespace-pre text-base',
        '-mx-4 w-[calc(100%_+_32px)] md:-mx-12 md:w-[calc(100%_+_96px)] px-4 md:px-12',
      )}
    >
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-b-gray-200 dark:border-b-gray-800">
            {columns.map((column, i) => (
              <th
                key={i}
                className={cx(
                  'font-medium uppercase py-2 text-sm text-gray-700 dark:text-gray-300 whitespace-pre align-bottom',
                  column.alignRight && 'text-right',
                  column.minimalWidth && 'w-0',
                  i !== columns.length - 1 && 'pr-3 md:pr-4',
                )}
              >
                <span
                  className={cx('inline-block', column.tooltip && 'Tooltip')}
                  title={column.tooltip}
                >
                  <span className={cx(column.shortName && 'hidden md:block')}>
                    {column.name}
                  </span>
                  {column.shortName && (
                    <span className="md:hidden">{column.shortName}</span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="">
          {items.map((item, i) => (
            <tr
              key={i}
              {...rows?.getProps(item, i)}
              className={cx(
                'border-b border-b-gray-200 dark:border-b-gray-800',
                'hover:bg-gray-100 dark:hover:bg-gray-900 hover:shadow-sm',
                rows?.getProps(item, i).className,
              )}
            >
              {columns.map((column, j) => (
                <td
                  key={j}
                  className={cx(
                    'h-9 md:h-10',
                    column.alignRight && 'text-right',
                    column.minimalWidth && 'w-0',
                    j !== columns.length - 1 && 'pr-3 md:pr-4',
                  )}
                >
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
