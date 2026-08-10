import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/core/Select'
import type { InteropChainWithIcon } from './types'

export function ChainSelect({
  chains,
  value,
  onChange,
  excludeId,
}: {
  chains: InteropChainWithIcon[]
  value: string
  onChange: (id: string) => void
  excludeId: string
}) {
  const selected = chains.find((c) => c.id === value)
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-9 flex-1 border border-divider bg-surface-primary">
        <SelectValue>{selected && <ChainLabel chain={selected} />}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {chains.map((chain) => (
          <SelectItem
            key={chain.id}
            value={chain.id}
            disabled={chain.id === excludeId}
          >
            <ChainLabel chain={chain} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function ChainLabel({ chain }: { chain: InteropChainWithIcon }) {
  return (
    <span className="flex items-center gap-2">
      <img src={chain.iconUrl} alt="" className="size-5 rounded-full" />
      <span className="truncate font-bold">{chain.name}</span>
    </span>
  )
}
