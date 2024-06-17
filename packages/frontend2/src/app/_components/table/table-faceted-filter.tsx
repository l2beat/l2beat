import { assert } from '@l2beat/shared-pure'
import { type Column } from '@tanstack/react-table'
import { useState } from 'react'
import { useBreakpoint } from '~/hooks/use-is-mobile'
import ChevronIcon from '~/icons/chevron.svg'
import CloseIcon from '~/icons/close.svg'
import ExpandIcon from '~/icons/expand.svg'
import { cn } from '~/utils/cn'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../drawer'
import { Popover, PopoverContent, PopoverTrigger } from '../popover'

interface TableFacetedFilterProps<TData, TValue> {
  column: Column<TData, TValue> | undefined
  title: string
}

export function TableFacetedFilter<TData, TValue>({
  column,
  title,
}: TableFacetedFilterProps<TData, TValue>) {
  const [open, setOpen] = useState(false)
  const breakpoint = useBreakpoint()
  assert(
    column !== undefined,
    'Column cannot be undefined, probably used a wrong ID',
  )
  const facets = column.getFacetedUniqueValues() as Map<string, number>
  const options = Array.from(facets.keys())
  const selected = column.getFilterValue() as string

  if (selected) {
    return (
      <button
        autoFocus
        onClick={() => column.setFilterValue(undefined)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            column.setFilterValue(undefined)
          }
        }}
        className="cursor-pointer outline-none select-none rounded-lg bg-gray-200 p-1 font-semibold text-base transition-colors dark:bg-zinc-700 dark:hover:bg-slate-600 hover:bg-gray-400"
      >
        <div className="w-max items-center gap-1.5 rounded-md bg-white px-2 inline-flex dark:bg-black dark:group-hover:bg-gray-950">
          <span>{selected}</span>
          <div className="flex size-3 items-center justify-center rounded-sm bg-black dark:bg-white">
            <CloseIcon className="size-2.5 fill-white dark:fill-black dark:group-hover:fill-gray-950" />
          </div>
        </div>
      </button>
    )
  }

  const showDrawer = breakpoint === 'tablet' || breakpoint === 'mobile'
  if (showDrawer) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <button className="inline-flex items-center gap-1.5 whitespace-pre py-1 px-3 cursor-pointer select-none rounded-lg bg-gray-200 p-1 font-semibold text-base transition-colors dark:bg-zinc-700 dark:data-[state=selected]:hover:bg-slate-600 data-[state=selected]:hover:bg-gray-400">
            {title}
            <ExpandIcon
              width={12}
              height={12}
              className="my-auto fill-black dark:fill-white"
            />
          </button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          <Options
            options={options}
            onClick={(option) => {
              column.setFilterValue(option)
              setOpen(false)
            }}
          />
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="group inline-flex items-center gap-1.5 whitespace-pre py-1 px-3 cursor-pointer select-none rounded-lg bg-gray-200 p-1 font-semibold text-base transition-colors dark:bg-zinc-700 dark:data-[state=selected]:hover:bg-slate-600 data-[state=selected]:hover:bg-gray-400">
          {title}
          <ChevronIcon className="group-data-[state=open]:-rotate-180 ease-out duration-300 hidden transition-transform md:block fill-black dark:fill-white" />
          <ExpandIcon
            width={12}
            height={12}
            className="md:hidden my-auto fill-black dark:fill-white"
          />
        </button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col" align="start">
        <Options
          options={options}
          className="px-2.5"
          onClick={(option) => {
            column.setFilterValue(option)
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

interface OptionsProps {
  options: string[]
  onClick: (option: string) => void
  className?: string
}

function Options({ options, onClick, className }: OptionsProps) {
  return (
    <>
      {options.map((option) => (
        <button
          key={option}
          className={cn(
            'w-full outline-none text-left font-semibold text-base gap-1.5 rounded-lg py-2 transition-colors dark:hover:bg-zinc-800 hover:bg-gray-400',
            className,
          )}
          onClick={() => onClick(option)}
        >
          {option}
        </button>
      ))}
    </>
  )
}
