import clsx from 'clsx'
import { FilterIcon } from './icons/FilterIcon'
import { Popover } from './Popover'

export interface FilterButtonProps {
  values: string[]
  selected: string[] | undefined
  onValueChange: (selectedValues: string[] | undefined) => void
}

export function FilterButton({
  values,
  selected,
  onValueChange,
}: FilterButtonProps) {
  return (
    <Popover
      content={
        <SelectionContent
          values={values}
          selected={selected}
          onValueChange={onValueChange}
        />
      }
    >
      <FilterIcon
        className={clsx(
          selected !== undefined ? 'stroke-blue-500' : 'stroke-white',
          'stroke-2',
        )}
      />
    </Popover>
  )
}

function SelectionContent({
  values,
  selected,
  onValueChange,
}: FilterButtonProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex flex-row justify-around">
        <button
          onClick={() => onValueChange([])}
          className="h-8 w-16 rounded bg-zinc-700 hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          Clear
        </button>
        <button
          onClick={() => onValueChange(undefined)}
          className="h-8 w-16 rounded bg-zinc-700 hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          All
        </button>
      </div>
      <select
        className="w-full appearance-none rounded bg-zinc-700 p-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
        multiple
        onChange={(event) => {
          const selectedValues = Array.from(event.target.selectedOptions).map(
            (o) => o.value,
          )
          onValueChange(selectedValues)
        }}
      >
        {values.map((v) => (
          <option
            className="border-b"
            key={v}
            selected={(selected ?? []).includes(v)}
          >
            {v}
          </option>
        ))}
      </select>
    </div>
  )
}
