import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react'
import { Button } from '~/components/core/Button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/core/Command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/core/Popover'
import { cn } from '~/utils/cn'

export interface MultiSelectComboboxOption {
  value: string
  label?: string
}

interface MultiSelectComboboxProps {
  options: MultiSelectComboboxOption[]
  selected: string[]
  onChange: (next: string[]) => void
  /** Trigger label shown when nothing is selected, e.g. "All chains". */
  placeholder: string
  /** Noun used for the "{n} {pluralNoun}" trigger label, e.g. "chains". */
  pluralNoun: string
  searchPlaceholder?: string
  emptyText?: string
  className?: string
}

export function MultiSelectCombobox({
  options,
  selected,
  onChange,
  placeholder,
  pluralNoun,
  searchPlaceholder = 'Search...',
  emptyText = 'No results found.',
  className,
}: MultiSelectComboboxProps) {
  const triggerLabel =
    selected.length === 0
      ? placeholder
      : selected.length === 1
        ? (options.find((option) => option.value === selected[0])?.label ??
          selected[0])
        : `${selected.length} ${pluralNoun}`

  const toggle = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value],
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          className={cn('w-[180px] justify-between font-normal', className)}
        >
          <span className="truncate">{triggerLabel}</span>
          <ChevronsUpDownIcon className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0" align="end">
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {selected.length > 0 && (
                <CommandItem
                  value="__clear__"
                  onSelect={() => onChange([])}
                  className="text-muted-foreground"
                >
                  Clear filter
                </CommandItem>
              )}
              {options.map((option) => {
                const isSelected = selected.includes(option.value)
                return (
                  <CommandItem
                    value={option.value}
                    key={option.value}
                    onSelect={() => toggle(option.value)}
                  >
                    {option.label ?? option.value}
                    <CheckIcon
                      className={cn(
                        'ml-auto',
                        isSelected ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
