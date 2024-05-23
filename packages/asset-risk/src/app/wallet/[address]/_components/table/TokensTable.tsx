'use client'

import { ScalingProjectRisk, Stage } from '@l2beat/config'
import { Dispatch, SetStateAction, useState } from 'react'
import {
  SortingArrowDownIcon,
  SortingArrowUpIcon,
} from '~/app/assets/SortingArrows'
import { Card } from '~/components/Card'
import { cn } from '~/utils/cn'
import { FilterInput } from './FilterInput'
import { TableRow } from './TableRow'
import {
  SingleColumnConfig,
  Sorting,
  columnsConfig,
} from './utils/columnsConfig'

export type Token = {
  token: {
    id: string
    name: string
    decimals: number
    symbol: string
    iconUrl?: string
    bridge?: string | null
  }
  chain: {
    id: number
    name: string
    risks: ScalingProjectRisk[]
    stage:
      | 'Validium'
      | 'Optimium'
      | 'NotApplicable'
      | 'UnderReview'
      | Stage
      | undefined
  }
  balance: bigint | null
}

interface TokensTableProps {
  tokens: Token[]
}

type SortingState = {
  selected: string
  type: 'asc' | 'desc'
} & Sorting

export function TokensTable(props: TokensTableProps) {
  const [sorting, setSorting] = useState<Partial<SortingState>>({
    selected: 'VALUE',
    rule: 'numeric',
    getOrderValue: ({ balance }) => Number(balance),
    type: 'desc',
  })
  const [filter, setFilter] = useState<string>('')

  let tokens = props.tokens
  if (sorting.selected) {
    tokens = tokens.sort((a, b) => {
      if (!sorting.getOrderValue) return 0
      const valueA = sorting.getOrderValue(a, 0)
      const valueB = sorting.getOrderValue(b, 0)
      if (sorting.rule === 'numeric') {
        if (typeof valueA !== 'number' || typeof valueB !== 'number') return 0
        return sorting.type === 'asc'
          ? Number(valueA) - Number(valueB)
          : Number(valueB) - Number(valueA)
      } else {
        if (typeof valueA !== 'string' || typeof valueB !== 'string') return 0
        return sorting.type === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA)
      }
    })
  }

  if (filter) {
    tokens = tokens.filter((token) =>
      token.token.name.toLowerCase().includes(filter.toLowerCase()),
    )
  }

  return (
    <Card className="rounded-none sm:rounded-xl overflow-x-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Assets</h2>
        <FilterInput filter={filter} setFilter={setFilter} />
      </div>
      <div
        className={cn(
          'mt-3 overflow-x-auto whitespace-pre pb-3 text-base md:mt-6',
          '-mx-4 w-[calc(100%_+_32px)] px-4 md:-mx-6 md:w-[calc(100%_+_48px)] md:px-6',
        )}
      >
        <table className="w-full border-collapse text-left">
          <thead className="border-b border-b-gray-200 dark:border-b-zinc-700">
            <tr>
              {columnsConfig.map((column) => (
                <TableColumnHeader
                  key={column.name}
                  column={column}
                  sorting={sorting}
                  setSorting={setSorting}
                />
              ))}
            </tr>
          </thead>
          {tokens.map((token) => (
            <tbody
              className="group/body"
              key={`${token.chain.id}-${token.token.id}`}
            >
              <TableRow token={token} />
            </tbody>
          ))}
        </table>
      </div>
    </Card>
  )
}

export function TableColumnHeader({
  column,
  sorting,
  setSorting,
}: {
  column: SingleColumnConfig
  sorting: Partial<SortingState>
  setSorting: Dispatch<SetStateAction<Partial<SortingState>>>
}) {
  const state = sorting.selected === column.name ? sorting.type : undefined

  const handleSort = () => {
    if (column.sorting) {
      if (sorting.selected === column.name) {
        setSorting({
          selected: column.name,
          type: sorting.type === 'asc' ? 'desc' : 'asc',
          ...column.sorting,
        })
      } else {
        setSorting({
          selected: column.name,
          type: 'asc',
          ...column.sorting,
        })
      }
    }
  }

  return (
    <th
      className={cn(
        'whitespace-pre py-2 pl-2 align-bottom text-sm font-medium uppercase text-gray-500 dark:text-gray-50',
        'pr-3 last:pr-0 md:pr-4',
        'first:pl-[18px] last:pr-[18px]',
        column.className,
      )}
    >
      <div
        className={cn(
          'group/sorting-arrows flex select-none items-end gap-1.5',
          column.sorting && 'cursor-pointer',
        )}
        data-state={state}
        onClick={handleSort}
      >
        {column.sorting && (
          <div className="flex translate-y-[-4.5px] flex-col">
            <SortingArrowUpIcon
              className={cn(
                'mb-0.5 fill-gray-500 transition-all',
                'group-data-[state=asc]/sorting-arrows:fill-black dark:group-data-[state=asc]/sorting-arrows:fill-white',
                'group-data-[state=desc]/sorting-arrows:group-hover/sorting-arrows:fill-black group-data-[state=desc]/sorting-arrows:group-hover/sorting-arrows:opacity-70 dark:group-data-[state=desc]/sorting-arrows:group-hover/sorting-arrows:fill-white dark:group-data-[state=desc]/sorting-arrows:group-hover/sorting-arrows:opacity-60',
              )}
            />
            <SortingArrowDownIcon
              className={cn(
                'fill-gray-500 transition-all',
                'group-data-[state=desc]/sorting-arrows:fill-black dark:group-data-[state=desc]/sorting-arrows:fill-white',
                'group-hover/sorting-arrows:fill-black group-data-[state=asc]/sorting-arrows:group-hover/sorting-arrows:opacity-70 dark:group-hover/sorting-arrows:fill-white dark:group-data-[state=asc]/sorting-arrows:group-hover/sorting-arrows:opacity-60',
              )}
            />
          </div>
        )}
        <div className={cn('flex flex-row items-end gap-1.5')}>
          {column.name}
        </div>
      </div>
    </th>
  )
}
