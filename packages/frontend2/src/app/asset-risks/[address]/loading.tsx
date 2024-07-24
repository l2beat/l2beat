import { times } from 'lodash'
import { type ClassNameValue } from 'tailwind-merge'

import {
  SortingArrowDownIcon,
  SortingArrowUpIcon,
} from '~/icons/sorting-arrows'
import { cn } from '~/utils/cn'
import { Card } from '../_components/card'
import { Disclaimer } from './_components/disclaimer'
import { FilterInput } from './_components/table/filter-input'
import { Cell } from './_components/table/table-row'
import {
  type SingleColumnConfig,
  columnsConfig,
} from './_components/table/utils/columnsConfig'

export default function Loading() {
  return (
    <main className="mx-auto w-screen max-w-[1176px] px-0 py-10 sm:px-4 md:px-12">
      <div className="flex flex-col gap-6">
        <SkeletonHeader />
        <SkeletonTable />
        <Disclaimer />
      </div>
    </main>
  )
}

function SkeletonHeader() {
  return (
    <Card className="flex flex-col gap-4 rounded-none sm:rounded-xl">
      <h1 className="text-3xl font-bold">Assets&apos; Risks</h1>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4 md:gap-2">
        <div className="col-span-2 flex flex-col gap-[5px]">
          <span className="text-xs font-bold text-zinc-500">Value</span>
          <Skeleton className="w-40" />
        </div>
        <div className="col-span-2 flex flex-col gap-[5px]">
          <span className="text-xs font-bold text-zinc-500">Wallet</span>
          <Skeleton className="w-40" />
        </div>
      </div>
    </Card>
  )
}

function SkeletonTable() {
  return (
    <Card className="overflow-x-auto rounded-none sm:rounded-xl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Assets</h2>
        <FilterInput />
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
                <SkeletonColumn column={column} key={column.name} />
              ))}
            </tr>
          </thead>
          {times(7).map((i) => (
            <tbody className="group/body" key={i}>
              <SkeletonRow key={`row-${i}`} />
            </tbody>
          ))}
        </table>
      </div>
    </Card>
  )
}

function SkeletonColumn({ column }: { column: SingleColumnConfig }) {
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

function SkeletonRow() {
  return (
    <tr
      className={cn(
        'cursor-pointer',
        'hover:bg-black/[0.05] dark:hover:bg-white/[0.1]',
        'border-b border-b-gray-200 dark:border-b-zinc-700',
        'group-hover/body:bg-black/[0.05]',
      )}
    >
      <Cell>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-24" />
        </div>
      </Cell>
      <Cell className="flex items-center gap-2">
        <Skeleton className="size-8" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-60" />
        </div>
      </Cell>
      <Cell>
        <Skeleton className="h-4 w-20" />
      </Cell>
      <Cell>
        <Skeleton className="h-4 w-24" />
      </Cell>
    </tr>
  )
}

function Skeleton({ className }: { className?: ClassNameValue }) {
  return (
    <div
      className={cn(
        'bg-zinc-300 h-6 rounded min-w-max animate-pulse',
        className,
      )}
    />
  )
}
