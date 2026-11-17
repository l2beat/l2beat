import { Checkbox } from '~/components/core/Checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/core/Popover'
import { selectTriggerClassnames } from '~/components/core/Select'
import { ChevronIcon } from '~/icons/Chevron'
import type { InteropHistoryProtocol } from '~/server/features/layer2s/interop/history/types'
import { cn } from '~/utils/cn'

interface Props {
  protocols: InteropHistoryProtocol[]
  /** All protocols when undefined. */
  selected: string[] | undefined
  onChange: (selected: string[] | undefined) => void
}

export function HistoryProtocolFilter({
  protocols,
  selected,
  onChange,
}: Props) {
  const isSelected = (id: string) => !selected || selected.includes(id)
  const toggle = (id: string) => {
    const current = selected ?? protocols.map((p) => p.id)
    const next = current.includes(id)
      ? current.filter((p) => p !== id)
      : [...current, id]
    onChange(next.length === protocols.length ? undefined : next)
  }

  return (
    <Popover>
      <PopoverTrigger className={cn(selectTriggerClassnames, 'gap-1.5')}>
        {selected
          ? `${selected.length} of ${protocols.length} protocols`
          : 'All protocols'}
        <ChevronIcon className="size-3 fill-current" />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="flex max-h-96 w-72 flex-col gap-1 overflow-y-auto"
      >
        <div className="mb-1 flex gap-3 font-medium text-label-value-13">
          <button
            type="button"
            className="text-link underline"
            onClick={() => onChange(undefined)}
          >
            Select all
          </button>
          <button
            type="button"
            className="text-link underline"
            onClick={() => onChange([])}
          >
            Clear
          </button>
        </div>
        {protocols.map((protocol) => (
          <Checkbox
            key={protocol.id}
            name={`historyProtocol-${protocol.id}`}
            checked={isSelected(protocol.id)}
            onCheckedChange={() => toggle(protocol.id)}
          >
            <span className="flex items-center gap-1.5">
              {protocol.iconUrl && (
                <img src={protocol.iconUrl} alt="" className="size-4" />
              )}
              {protocol.name}
              {!protocol.isListed && (
                <span className="text-secondary"> (retired id)</span>
              )}
            </span>
          </Checkbox>
        ))}
      </PopoverContent>
    </Popover>
  )
}
