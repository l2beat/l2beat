import { Dispatch, SetStateAction } from 'react'
import { LensIcon } from '~/app/assets/LensIcon'
import { cn } from '~/utils/cn'

interface FilterInputProps {
  filter?: string
  setFilter?: Dispatch<SetStateAction<string>>
}

export function FilterInput(props: FilterInputProps) {
  return (
    <div className="relative">
      <input
        value={props.filter}
        onChange={
          props.setFilter
            ? (e) => props.setFilter && props.setFilter(e.currentTarget.value)
            : undefined
        }
        placeholder="Search for asset"
        className={cn(
          'text-xs text-zinc-500 bg-white dark:bg-zinc-900 dark:text-white placeholder:text-zinc-500',
          'rounded-lg px-3 py-2',
          'border border-[#C0C1C7] focus:border-gray-500 outline-none',
          'transition-colors duration-100',
          'w-[min(50vw,250px)]',
        )}
      />
      <div className="absolute right-2.5 top-2.5 cursor-pointer">
        <LensIcon />
      </div>
    </div>
  )
}
