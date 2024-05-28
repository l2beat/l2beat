import { times } from 'lodash'
import { ClassNameValue } from 'tailwind-merge'
import {
  SortingArrowDownIcon,
  SortingArrowUpIcon,
} from '~/app/assets/SortingArrows'
import { Card } from '~/components/Card'
import { cn } from '~/utils/cn'
import { Disclaimer } from './_components/Disclaimer'
import { FilterInput } from './_components/table/FilterInput'
import { Cell } from './_components/table/TableRow'
import {
  SingleColumnConfig,
  columnsConfig,
} from './_components/table/utils/columnsConfig'

export default function Loading() {
  return (
    <main className="max-w-[1176px] w-screen px-0 sm:px-4 md:px-12 mx-auto py-10">
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
      <h1 className="font-bold text-3xl">Assets&apos; Risks</h1>
      <Skeleton className="w-full h-3" />
      <Skeleton className="w-3/4 h-3" />
      <div className="grid grid-cols-1 md:gap-2 gap-3 md:grid-cols-4">
        <div className="flex flex-col gap-[5px] col-span-2">
          <span className="text-zinc-500 font-bold text-xs">Value</span>
          <Skeleton className="w-40" />
        </div>
        <div className="flex flex-col gap-[5px] col-span-2">
          <span className="text-zinc-500 font-bold text-xs">Wallet</span>
          <Skeleton className="w-40" />
        </div>
      </div>
    </Card>
  )
}

function SkeletonTable() {
  return (
    <Card className="rounded-none sm:rounded-xl overflow-x-auto">
      <div className="flex justify-between items-center">
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
          <Skeleton className="w-28 h-4" />
          <Skeleton className="w-24 h-3" />
        </div>
      </Cell>
      <Cell className="flex items-center gap-2">
        <Skeleton className="size-8" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="w-60 h-3" />
        </div>
      </Cell>
      <Cell>
        <Skeleton className="w-20 h-4" />
      </Cell>
      <Cell>
        <Skeleton className="w-24 h-4" />
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
