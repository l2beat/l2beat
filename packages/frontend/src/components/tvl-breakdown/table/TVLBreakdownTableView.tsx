import { AssetId } from '@l2beat/shared-pure'
import cx from 'classnames'
import React, { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react'

import { InfoIcon } from '../../icons'
import { SectionId } from '../../project/sectionId'

interface Props<
  T extends {
    assetId?: AssetId
    escrows?: object[]
  },
> {
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
  headClassName?: string
  noPaddingRight?: true
  idHref?: SectionId
  getValue: (value: T, index: number) => ReactNode
  tooltip?: string
  highlight?: boolean
}

export interface RowConfig<T> {
  getProps: (
    value: T,
    index: number,
  ) => HTMLAttributes<HTMLTableRowElement> &
    Pick<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>
}

export function TVLBreakdownTableView<
  T extends {
    assetId?: AssetId
    escrows?: object[]
  },
>({ items, columns, rows }: Props<T>) {
  const highlightedColumnClassNames =
    'relative after:content-[""] after:absolute after:left-0 after:top-0 after:h-full after:w-full after:-z-1 after:bg-gray-100 after:dark:bg-[#24202C]'

  return (
    <div
      className={cx(
        'overflow-x-auto whitespace-pre text-base',
        '-mx-4 w-[calc(100%_+_32px)] px-4 md:-mx-12 md:w-[calc(100%_+_96px)] md:px-12',
      )}
      data-role="table"
    >
      <table className="w-full border-collapse border-b border-b-black/10 text-left dark:border-b-white/25">
        <thead>
          <tr className="border-b border-b-black/10 dark:border-b-white/25 md:border-b-0 md:bg-black/10 dark:md:bg-gray-800">
            {columns.map((column, i) => {
              const isLastColumn = i === columns.length - 1
              return (
                <th
                  key={i}
                  className={cx(
                    'whitespace-pre py-2 pr-2 text-sm font-medium uppercase text-gray-500 first:rounded-l first:pl-2 last:rounded-r dark:text-gray-50',
                    column.minimalWidth && 'w-0',
                    isLastColumn && 'md:pr-4',
                    column.headClassName,
                    column.highlight && highlightedColumnClassNames,
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
                      <span
                        className="Tooltip -translate-y-px md:translate-y-0"
                        title={column.tooltip}
                      >
                        <InfoIcon className="fill-current md:h-3.5 md:w-3.5" />
                      </span>
                    )}
                  </div>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody className="">
          {items.map((item, i) => {
            const { className: rowClassName, ...rest } =
              rows?.getProps(item, i) ?? {}

            return (
              <tr
                key={i}
                {...rest}
                className={cx(
                  'group',
                  'border-b border-b-black/10 hover:bg-black/[0.1] hover:shadow-sm dark:border-b-gray-800 dark:hover:bg-white/[0.1] md:border-b-0',
                  rowClassName,
                  item.escrows?.length &&
                    item.escrows.length > 1 &&
                    'MultipleEscrowsRow',
                )}
                data-token={item.assetId}
              >
                {columns.map((column, j) => {
                  const isLastColumn = j === columns.length - 1

                  const childClassName = cx(
                    'h-full w-full items-start pt-2 pb-2',
                    column.alignRight && 'justify-end',
                    column.alignCenter && 'justify-center',
                    isLastColumn && 'md:pr-4',
                  )
                  return (
                    <td
                      key={j}
                      className={cx(
                        'h-9 pr-2 first:rounded-l first:pl-2 last:rounded-r md:h-10 md:pl-4',
                        column.minimalWidth && 'w-0',
                        column.highlight && highlightedColumnClassNames,
                      )}
                    >
                      <div className={cx(childClassName, 'flex')}>
                        {column.getValue(item, i)}
                      </div>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
