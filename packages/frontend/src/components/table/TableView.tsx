import cx from 'classnames'
import React, { HTMLAttributes, ReactNode } from 'react'

import { InfoIcon } from '../icons'

interface Props<T> {
  items: T[]
  columns: ColumnConfig<T>[]
  rows?: RowConfig<T>
}

export interface ColumnConfig<T> {
  name: ReactNode
  shortName?: ReactNode
  alignRight?: true
  alignCenter?: true
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
        '-mx-4 w-[calc(100%_+_32px)] px-4 md:-mx-12 md:w-[calc(100%_+_96px)] md:px-12',
      )}
      data-role="table"
    >
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-b-gray-200 dark:border-b-gray-800">
            {columns.map((column, i) => (
              <th
                key={i}
                className={cx(
                  'whitespace-pre py-2 text-sm font-medium uppercase text-gray-700 dark:text-gray-600',
                  column.minimalWidth && 'w-0',
                  i !== columns.length - 1 && 'pr-3 md:pr-4',
                )}
              >
                <div
                  className={cx(
                    'flex flex-row items-center gap-1.5',
                    column.alignRight && 'justify-end',
                    column.alignCenter && 'justify-center',
                  )}
                >
                  <span className={cx(column.shortName && 'hidden md:block')}>
                    {column.name}
                  </span>
                  {column.shortName && (
                    <span className="md:hidden">{column.shortName}</span>
                  )}
                  {column.tooltip && (
                    <span className="Tooltip" title={column.tooltip}>
                      <InfoIcon className="fill-current" />
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="">
          {items.map((item, i) => {
            return (
              <tr
                key={i}
                {...rows?.getProps(item, i)}
                className={cx(
                  'group cursor-pointer border-b border-b-gray-200 dark:border-b-gray-800',
                  'hover:bg-gray-100 hover:shadow-sm dark:hover:bg-gray-900',
                  rows?.getProps(item, i).className,
                )}
              >
                {columns.map((column, j) => (
                  <td
                    key={j}
                    className={cx(
                      'h-9 md:h-10',
                      column.alignRight && 'text-right',
                      column.alignCenter && 'text-center',
                      column.minimalWidth && 'w-0',
                      j !== columns.length - 1 && 'pr-3 md:pr-4',
                    )}
                  >
                    {column.getValue(item, i)}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
