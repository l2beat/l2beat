import { default as classNames, default as cx } from 'classnames'
import range from 'lodash/range'
import React, { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react'

import { InfoIcon } from '../icons'
import { Link } from '../Link'
import { SectionId } from '../project/sectionId'

interface Props<T> {
  items: T[]
  columnsConfig: ColumnConfig<T>[]
  rows?: RowConfig<T>
  rerenderOnLoad?: boolean
}

export type ColumnConfig<T> =
  | (SingleColumnConfig<T> & { type?: never })
  | GroupedColumnConfig<T>

interface SingleColumnConfig<T> {
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
}

export interface GroupedColumnConfig<T> {
  type: 'group'
  columns: SingleColumnConfig<T>[]
  title?: string
}

export interface RowConfig<T> {
  getProps: (
    value: T,
    index: number,
  ) => HTMLAttributes<HTMLTableRowElement> &
    Pick<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>
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
      className={cx(
        'group/tableview mt-3 overflow-x-auto whitespace-pre text-base md:mt-6',
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
          <tr className="border-b border-b-gray-200 dark:border-b-gray-800">
            {columnsConfig.map((columnConfig, i) => {
              if (columnConfig.type === 'group') {
                return columnConfig.columns.map((col, colIndex) => (
                  <ColumnHeader
                    column={col}
                    groupOptions={{
                      isFirst: colIndex === 0,
                      isLast: colIndex === columnConfig.columns.length - 1,
                      noGroupTitle: !columnConfig.title,
                    }}
                    key={`${i}:${colIndex}`}
                  />
                ))
              }
              return <ColumnHeader column={columnConfig} key={i} />
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
                className={cx(
                  'group cursor-pointer border-b border-b-gray-200 dark:border-b-gray-800',
                  'hover:bg-black/[0.1] hover:shadow-sm dark:hover:bg-white/[0.1]',
                  rowClassName,
                )}
              >
                {columnsConfig.map((columnConfig, j) => {
                  if (columnConfig.type === 'group') {
                    return columnConfig.columns.map((col, colIndex) => (
                      <DataCell
                        columnConfig={col}
                        item={item}
                        href={href}
                        rowIndex={i}
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
          {groupedColumns && <EmptyRow columnsConfig={columnsConfig} />}
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
  groupOptions?: {
    isFirst: boolean
    isLast: boolean
    noGroupTitle: boolean
  }
}) {
  const hasPaddingRight = !props.column.noPaddingRight
  return (
    <>
      <th
        className={cx(
          'whitespace-pre py-2 text-sm font-medium uppercase text-gray-500 dark:text-gray-50',
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
        )}
      >
        <div
          className={cx(
            'flex flex-row items-center gap-1.5',
            props.column.alignRight && 'justify-end',
            props.column.alignCenter && 'justify-center',
          )}
        >
          <span className={cx(props.column.shortName && 'hidden md:block')}>
            {props.column.name}
          </span>
          {props.column.shortName && (
            <span className="md:hidden">{props.column.shortName}</span>
          )}
          {props.column.tooltip && (
            <span
              className="Tooltip -translate-y-px md:translate-y-0"
              title={props.column.tooltip}
            >
              <InfoIcon className="fill-current md:h-3.5 md:w-3.5" />
            </span>
          )}
        </div>
      </th>
      {props.groupOptions?.isLast && <th className="pr-3 md:pr-4" />}
    </>
  )
}

function DataCell<T>(props: {
  columnConfig: SingleColumnConfig<T>
  item: T
  rowIndex: number
  href?: string
  groupOptions?: {
    isFirst: boolean
    isLast: boolean
  }
}) {
  const hasPaddingRight = !props.columnConfig.noPaddingRight
  const idHref =
    props.columnConfig.idHref && props.href
      ? `${props.href}#${props.columnConfig.idHref}`
      : props.href

  const childClassName = cx(
    'h-full w-full items-center',
    props.columnConfig.alignRight && 'justify-end',
    props.columnConfig.alignCenter && 'justify-center',
  )

  return (
    <>
      <td
        className={cx(
          'h-9 md:h-14',
          props.columnConfig.minimalWidth && 'w-0',
          props.groupOptions?.isFirst && '!pl-6',
          props.groupOptions?.isLast && '!pr-6',
          hasPaddingRight &&
            !props.groupOptions?.isLast &&
            'pr-3 last:pr-0 md:pr-4',
        )}
      >
        <a href={idHref} className={cx(childClassName, 'flex')}>
          {props.columnConfig.getValue(props.item, props.rowIndex)}
        </a>
      </td>
      {props.groupOptions?.isLast && (
        <td>
          <a href={idHref} className={cx(childClassName, 'flex')} />
        </td>
      )}
    </>
  )
}

function ColGroup(props: { groupedColumns: GroupedColumn[] }) {
  return (
    <>
      {props.groupedColumns.map((groupedColumn, i) => {
        if (groupedColumn.type === 'fill') {
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
        if (groupedColumn.type === 'fill') {
          return <th key={i} />
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

function EmptyRow<T>(props: { columnsConfig: ColumnConfig<T>[] }) {
  return (
    <tr data-non-filterable>
      {props.columnsConfig.map((columnConfig, i) => {
        if (columnConfig.type === 'group') {
          return columnConfig.columns.map((_, colIndex) => {
            const isFirstInGroup = colIndex === 0
            const isLastInGroup = colIndex === columnConfig.columns.length - 1
            return (
              <>
                <td
                  key={`${i}:${colIndex}`}
                  className={classNames(
                    'h-4',
                    isFirstInGroup && 'rounded-bl-lg',
                    isLastInGroup && 'rounded-br-lg',
                  )}
                />
                {isLastInGroup && <td className="h-4" />}
              </>
            )
          })
        }
        return <td className="h-4" key={i} />
      })}
    </tr>
  )
}

type GroupedColumn =
  | {
      type: 'group'
      span: number
      title?: string
    }
  | {
      type: 'fill'
    }

function getGroupedColumns<T>(
  columnConfigs: ColumnConfig<T>[],
): GroupedColumn[] | undefined {
  if (!columnConfigs.some((columnConfig) => columnConfig.type === 'group')) {
    return undefined
  }

  return columnConfigs.flatMap((columnConfig) => {
    if (columnConfig.type === 'group') {
      return [
        {
          type: 'group',
          title: columnConfig.title,
          span: columnConfig.columns.length,
        } as const,
        {
          type: 'fill',
        } as const,
      ]
    }
    return {
      type: 'fill',
    } as const
  })
}
