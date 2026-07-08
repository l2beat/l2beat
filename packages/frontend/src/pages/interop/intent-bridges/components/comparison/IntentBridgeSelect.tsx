import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/core/Select'
import type { InteropIntentBridge } from '../../getInteropIntentBridgesData'

export function IntentBridgeSelect({
  bridges,
  value,
  onChange,
  excludeId,
}: {
  bridges: InteropIntentBridge[]
  value: string | undefined
  onChange: (id: string) => void
  excludeId: string | undefined
}) {
  const selected = bridges.find((bridge) => bridge.id === value)
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="flex h-10 min-w-0 flex-1 items-center border border-divider bg-surface-primary">
        <SelectValue placeholder="Select project">
          {selected && <BridgeLabel bridge={selected} />}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {bridges.map((bridge) => (
          <SelectItem
            key={bridge.id}
            value={bridge.id}
            disabled={bridge.id === excludeId}
          >
            <BridgeLabel bridge={bridge} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function BridgeLabel({ bridge }: { bridge: InteropIntentBridge }) {
  return (
    <span className="flex w-full min-w-0 items-center gap-2">
      <img
        src={bridge.iconUrl}
        alt={bridge.name}
        className="size-5 shrink-0 rounded-full"
      />
      <span className="min-w-0 truncate font-bold">{bridge.name}</span>
    </span>
  )
}
