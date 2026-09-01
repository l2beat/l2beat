import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/core/Select'
import { cn } from '~/utils/cn'

export interface EntitySelectOption {
  id: string
  iconUrl: string
  label: string
  secondaryLabel?: string
}

export function InteropEntitySelect({
  options,
  value,
  onChange,
  excludeId,
  placeholder = 'Select project',
}: {
  options: EntitySelectOption[]
  value: string | undefined
  onChange: (id: string) => void
  excludeId: string | undefined
  placeholder?: string
}) {
  const selected = options.find((option) => option.id === value)
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="flex h-10 min-w-0 flex-1 items-center border border-divider bg-surface-primary">
        <SelectValue placeholder={placeholder}>
          {selected && <EntityLabel option={selected} />}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={option.id}
            value={option.id}
            disabled={option.id === excludeId}
          >
            <EntityLabel option={option} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function EntityLabel({ option }: { option: EntitySelectOption }) {
  return (
    <span className="flex w-full min-w-0 items-center gap-2">
      <img
        src={option.iconUrl}
        alt={option.secondaryLabel ?? option.label}
        className="size-5 shrink-0 rounded-full"
      />
      <span
        className={cn(
          'font-bold',
          option.secondaryLabel ? 'shrink-0' : 'min-w-0 truncate',
        )}
      >
        {option.label}
      </span>
      {option.secondaryLabel && (
        <span className="min-w-0 truncate font-medium text-secondary">
          {option.secondaryLabel}
        </span>
      )}
    </span>
  )
}
