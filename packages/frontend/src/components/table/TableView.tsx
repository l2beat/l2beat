import isObject from 'lodash/isObject'
import range from 'lodash/range'
import React from 'react'

import { cn } from '../../utils/cn'
import { InfoIcon } from '../icons'
import { Link } from '../Link'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'
import { SortingArrows } from './SortingArrows'
import { ColumnConfig, RowConfig, SingleColumnConfig } from './types'

interface Props<T> {
  items: T[]
  columnsConfig: ColumnConfig<T>[]
  rows?: RowConfig<T>
  rerenderOnLoad?: boolean
}

export function TableView<T>({
  items,
  columnsConfig,
  rows,
  rerenderOnLoad,
}: Props<T>) {
  const groupedColumns = getGroupedColumns(columnsConfig)

  return (
    <div
      className={cn(
        'group/tableview mt-3 overflow-x-auto whitespace-pre pb-3 text-base md:mt-6',
        '-mx-4 w-[calc(100%_+_32px)] px-4 md:-mx-12 md:w-[calc(100%_+_96px)] md:px-12',
      )}
      data-role="table"
      data-rerender-on-load={rerenderOnLoad}
    >
      <table className="w-full border-collapse text-left group-data-[state=empty]/tableview:hidden">
        {groupedColumns && <ColGroup groupedColumns={groupedColumns} />}
        <thead>
          {groupedColumns && (
            <GroupedColumnsHeaders groupedColumns={groupedColumns} />
          )}
          <tr className="border-b border-b-gray-200 dark:border-b-zinc-700">
            {columnsConfig.map((columnConfig, i) => {
              const isLastColumn = i === columnsConfig.length - 1
              if (columnConfig.type === 'group') {
                return columnConfig.columns.map((col, colIndex) => (
                  <ColumnHeader
                    column={col}
                    isLastColumn={isLastColumn}
                    groupOptions={{
                      isFirst: colIndex === 0,
                      isLast: colIndex === columnConfig.columns.length - 1,
                      noGroupTitle: !columnConfig.title,
                    }}
                    key={`${i}:${colIndex}`}
                  />
                ))
              }
              return (
                <ColumnHeader
                  column={columnConfig}
                  isLastColumn={isLastColumn}
                  key={i}
                />
              )
            })}
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => {
            const {
              href,
              className: rowClassName,
              ...rest
            } = rows?.getProps(item, i) ?? {}
            return (
              <tr
                key={i}
                {...rest}
                className={cn(
                  'group/table-row cursor-pointer border-b border-b-gray-200 dark:border-b-zinc-700',
                  'hover:bg-black/[0.05] hover:shadow-sm dark:hover:bg-white/[0.1]',
                  rowClassName,
                )}
              >
                {columnsConfig.map((columnConfig, j) => {
                  const isLastColumn = j === columnsConfig.length - 1
                  if (columnConfig.type === 'group') {
                    return columnConfig.columns.map((col, colIndex) => (
                      <DataCell
                        columnConfig={col}
                        item={item}
                        href={href}
                        rowIndex={i}
                        isLastColumn={isLastColumn}
                        groupOptions={{
                          isFirst: colIndex === 0,
                          isLast: colIndex === columnConfig.columns.length - 1,
                        }}
                        key={`${j}:${colIndex}`}
                      />
                    ))
                  }
                  return (
                    <DataCell
                      columnConfig={columnConfig}
                      isLastColumn={isLastColumn}
                      item={item}
                      href={href}
                      rowIndex={i}
                      key={j}
                    />
                  )
                })}
              </tr>
            )
          })}
          {groupedColumns && <EmptyRow groupedColumns={groupedColumns} />}
        </tbody>
      </table>
      <div className="hidden flex-col items-center justify-center rounded-b-lg bg-blue-700 bg-opacity-15 pt-10 pb-10 group-data-[state=empty]/tableview:flex">
        <span className="mb-4 text-2xl font-semibold">No results</span>
        <span className="mb-6">There are no results meeting the criteria</span>
        <Link className="ProjectFilters-ResetButton cursor-pointer">
          Reset all filters
        </Link>
      </div>
    </div>
  )
}

function ColumnHeader<T>(props: {
  column: SingleColumnConfig<T>
  isLastColumn: boolean
  groupOptions?: {
    isFirst: boolean
    isLast: boolean
    noGroupTitle: boolean
  }
}) {
  const title = (
    <div className="flex items-center gap-1">
      {props.column.icon}
      <span className={cn(props.column.shortName && 'hidden md:block')}>
        {props.column.name}
      </span>
      {props.column.shortName && (
        <span className="md:hidden">{props.column.shortName}</span>
      )}
    </div>
  )

  const hasPaddingRight = !props.column.noPaddingRight
  return (
    <>
      <th
        className={cn(
          'whitespace-pre py-2 align-bottom text-sm font-medium uppercase text-gray-500 dark:text-gray-50',
          props.column.minimalWidth && 'w-0',
          hasPaddingRight &&
            !props.groupOptions?.isLast &&
            'pr-3 last:pr-0 md:pr-4',
          props.groupOptions?.isFirst && '!pl-6',
          props.groupOptions?.isLast && '!pr-6',
          props.groupOptions?.noGroupTitle &&
            props.groupOptions.isFirst &&
            'rounded-tl-lg',
          props.groupOptions?.noGroupTitle &&
            props.groupOptions.isLast &&
            'rounded-tr-lg',
          props.groupOptions?.noGroupTitle && 'pt-4',
          props.column.headClassName,
          props.column.className,
        )}
      >
        <div
          className={cn(
            'flex flex-row items-center gap-1.5',
            props.column.align === 'right' && 'justify-end',
            props.column.align === 'center' && 'justify-center',
          )}
        >
          {props.column.sorting ? (
            <SortingArrows
              name={props.column.name}
              rule={props.column.sorting.rule}
              defaultState={props.column.sorting.defaultState}
              orderKey={props.column.sorting.defaultOrderKey}
            >
              {title}
            </SortingArrows>
          ) : (
            title
          )}

          {props.column.tooltip && (
            <Tooltip>
              <TooltipTrigger className="-translate-y-px md:translate-y-0">
                <InfoIcon className="fill-current md:h-3.5 md:w-3.5" />
              </TooltipTrigger>
              <TooltipContent>{props.column.tooltip}</TooltipContent>
            </Tooltip>
          )}
        </div>
      </th>
      {props.groupOptions?.isLast && !props.isLastColumn && (
        <th className="w-4" />
      )}
    </>
  )
}

function DataCell<T>(props: {
  columnConfig: SingleColumnConfig<T>
  item: T
  isLastColumn: boolean
  rowIndex: number
  href: string | undefined
  groupOptions?: {
    isFirst: boolean
    isLast: boolean
  }
}) {
  const value = props.columnConfig.getValue(props.item, props.rowIndex)
  if (!value && props.columnConfig.removeCellOnFalsyValue) {
    return null
  }

  const hasPaddingRight = !props.columnConfig.noPaddingRight
  const idHref =
    props.columnConfig.idHref && props.href
      ? `${props.href}#${props.columnConfig.idHref}`
      : props.href
  const orderValue = props.columnConfig.sorting?.getOrderValue(
    props.item,
    props.rowIndex,
  )

  const orderAttributes = getOrderValueAttributes(orderValue)
  return (
    <>
      <td
        className={cn(
          'group/data-cell h-9 md:h-14',
          props.columnConfig.minimalWidth && 'w-0',
          props.groupOptions?.isFirst && '!pl-6',
          props.groupOptions?.isLast && '!pr-6',
          props.columnConfig.className,
        )}
        colSpan={props.columnConfig.colSpan?.(props.item)}
        {...orderAttributes}
      >
        <a
          href={idHref}
          className={cn(
            'h-full w-full items-center',
            props.columnConfig.align === 'right' && 'justify-end',
            props.columnConfig.align === 'center' && 'justify-center',
            hasPaddingRight &&
              !props.groupOptions?.isLast &&
              'pr-3 group-last/data-cell:last:pr-0 md:pr-4',
            'flex',
          )}
        >
          {value}
        </a>
      </td>
      {props.groupOptions?.isLast && !props.isLastColumn && (
        <td className="h-9 md:h-14">
          <a href={idHref} className="flex h-full w-4 items-center" />
        </td>
      )}
    </>
  )
}

function ColGroup(props: { groupedColumns: GroupedColumn[] }) {
  return (
    <>
      {props.groupedColumns.map((groupedColumn, i) => {
        if (groupedColumn.type === 'single') {
          return (
            <colgroup key={i}>
              <col />
            </colgroup>
          )
        }
        return (
          <colgroup key={i} className="bg-gray-100 dark:bg-zinc-800">
            {range(groupedColumn.span).map((_, i) => (
              <col key={i} />
            ))}
          </colgroup>
        )
      })}
    </>
  )
}

function GroupedColumnsHeaders(props: { groupedColumns: GroupedColumn[] }) {
  return (
    <tr className="uppercase leading-none">
      {props.groupedColumns.map((groupedColumn, i) => {
        if (groupedColumn.type === 'single') {
          return <th key={i} className={groupedColumn.className} />
        }
        if (!groupedColumn.title) {
          return (
            <th
              key={i}
              colSpan={groupedColumn.span}
              className="bg-white dark:bg-neutral-900"
            />
          )
        }
        return (
          <th
            colSpan={groupedColumn.span}
            key={i}
            className="rounded-t-lg px-6 pt-4"
          >
            {groupedColumn.title}
          </th>
        )
      })}
    </tr>
  )
}

function EmptyRow(props: { groupedColumns: GroupedColumn[] }) {
  return (
    <tr data-non-filterable>
      {props.groupedColumns.map((groupedColumn, i) => {
        if (groupedColumn.type === 'group') {
          return (
            <td
              key={`${i}`}
              colSpan={groupedColumn.span}
              className="h-4 rounded-b-lg"
            />
          )
        }
        return <td className={cn('h-4', groupedColumn.className)} key={i} />
      })}
    </tr>
  )
}

type GroupedColumn =
  | {
      type: 'group'
      span: number
      title?: React.ReactNode
    }
  | {
      type: 'single'
      className?: string
    }

function getGroupedColumns<T>(
  columnConfigs: ColumnConfig<T>[],
): GroupedColumn[] | undefined {
  if (!columnConfigs.some((columnConfig) => columnConfig.type === 'group')) {
    return undefined
  }

  return columnConfigs.flatMap((columnConfig, i) => {
    if (columnConfig.type === 'group') {
      const isLastColumn = i === columnConfigs.length - 1
      return [
        {
          type: 'group',
          title: columnConfig.title,
          span: columnConfig.columns.length,
        } as const,
        ...(!isLastColumn
          ? [
              {
                type: 'single',
              } as const,
            ]
          : []),
      ]
    }
    return {
      type: 'single',
      className: columnConfig.className,
    } as const
  })
}

function getOrderValueAttributes(
  orderValue:
    | string
    | number
    | Record<string, string | number | undefined>
    | undefined,
) {
  if (orderValue === undefined) {
    return
  }

  return {
    ...(isObject(orderValue)
      ? Object.entries(orderValue).reduce<Record<string, string>>(
          (acc, [key, value]) => {
            if (value) {
              acc[`data-order-value-${key.toLowerCase()}`] = value.toString()
            }
            return acc
          },
          {},
        )
      : {
          'data-order-value': orderValue.toString(),
        }),
  }
}
