import { AssetId } from '@l2beat/shared-pure'
import cx from 'classnames'
import React, { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react'

import { InfoIcon } from '../../icons'
import { ProjectSectionId } from '../../project/sectionId'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../tooltip/Tooltip'

interface Props<
  T extends {
    assetId?: AssetId
    escrows?: object[]
  },
> {
  items: T[]
  columns: ColumnConfig<T>[]
  rows?: RowConfig<T>
  type?: 'NMV' | 'EBV'
  empty?: boolean
}

export interface ColumnConfig<T> {
  name: ReactNode
  shortName?: ReactNode
  align?: 'center' | 'right'
  headClassName?: string
  noPaddingRight?: true
  idHref?: ProjectSectionId
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
>({ items, columns, rows, empty, type }: Props<T>) {
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
          <tr className="border-b border-b-black/10 dark:border-b-white/25 md:border-b-0 md:bg-black/10 dark:md:bg-white/10">
            {columns.map((column, i) => {
              return (
                <th
                  key={i}
                  className={cx(
                    'w-[20%] whitespace-pre py-2 pr-2 text-sm font-medium uppercase text-gray-500 first:rounded-l first:pl-2 last:rounded-r last:pr-2 dark:text-gray-50 first:md:pl-6 last:md:pr-6',
                    column.headClassName,
                    column.highlight && highlightedColumnClassNames,
                  )}
                >
                  <div
                    className={cx(
                      'flex flex-row items-center gap-1.5',
                      column.align === 'right' && 'justify-end',
                      column.align === 'center' && 'justify-center',
                    )}
                  >
                    <span className={cx(column.shortName && 'hidden md:block')}>
                      {column.name}
                    </span>
                    {column.shortName && (
                      <span className="md:hidden">{column.shortName}</span>
                    )}
                    {column.tooltip && (
                      <Tooltip>
                        <TooltipTrigger className="-translate-y-px md:translate-y-0">
                          <InfoIcon className="fill-current md:h-3.5 md:w-3.5" />
                        </TooltipTrigger>
                        <TooltipContent>{column.tooltip}</TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
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
                  const childClassName = cx(
                    'h-full w-full items-start pt-2 pb-2',
                    column.align === 'right' && 'justify-end',
                    column.align === 'center' && 'justify-center',
                  )
                  return (
                    <td
                      key={j}
                      className={cx(
                        'h-9 pr-2 first:rounded-l first:pl-2 last:rounded-r last:pr-2 md:h-10 md:pl-4 first:md:pl-6 last:md:pr-6',
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
        {empty && (
          <tr>
            <td colSpan={5}>
              <div className="flex h-20 w-full items-center justify-center text-[13px] font-normal text-[#70737D]">
                No {type === 'NMV' ? 'natively minted ' : 'externally bridged '}
                tokens are tracked for this chain. Request a token&nbsp;
                <a
                  href="https://forms.gle/fQFsC5g1LgG5z12T7"
                  target="_blank"
                  className="text-blue-700 underline dark:text-blue-500"
                >
                  here
                </a>
                .
              </div>
            </td>
          </tr>
        )}
      </table>
    </div>
  )
}
