import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/core/command'
import type { FilterableValueId } from './types'
import { filterIdToLabel } from './utils/filter-id-to-label'

interface Props {
  ids: FilterableValueId[]
  onSelect: (id: FilterableValueId) => void
}

export function TableFilterIdMenu({ ids, onSelect }: Props) {
  return (
    <Command className="border border-divider">
      <CommandInput className="h-9" placeholder="Search filters..." />
      <CommandList>
        <CommandEmpty>No filter found.</CommandEmpty>
        <CommandGroup>
          {ids.map((id) => (
            <CommandItem
              className="font-medium"
              key={id}
              value={id}
              onSelect={() => {
                onSelect(id)
              }}
            >
              {filterIdToLabel[id]}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
