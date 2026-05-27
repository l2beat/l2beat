import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/core/Select'
import type { InteropTokenFramework } from '../../getInteropTokenFrameworksData'

export function FrameworkSelect({
  frameworks,
  value,
  onChange,
  excludeId,
}: {
  frameworks: InteropTokenFramework[]
  value: string | undefined
  onChange: (id: string) => void
  excludeId: string | undefined
}) {
  const selected = frameworks.find((f) => f.id === value)
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="flex h-10 min-w-0 flex-1 items-center border border-divider bg-surface-primary">
        <SelectValue placeholder="Select project">
          {selected && <FrameworkLabel framework={selected} />}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {frameworks.map((framework) => (
          <SelectItem
            key={framework.id}
            value={framework.id}
            disabled={framework.id === excludeId}
          >
            <FrameworkLabel framework={framework} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function FrameworkLabel({ framework }: { framework: InteropTokenFramework }) {
  return (
    <span className="flex w-full min-w-0 items-center gap-2">
      <img
        src={framework.iconUrl}
        alt={framework.name}
        className="size-5 shrink-0 rounded-full"
      />
      <span className="shrink-0 font-bold">{framework.label}</span>
      <span className="min-w-0 truncate font-medium text-secondary">
        {framework.name}
      </span>
    </span>
  )
}
