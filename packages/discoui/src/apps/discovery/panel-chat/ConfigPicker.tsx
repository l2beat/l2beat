import * as RadixSelect from '@radix-ui/react-select'
import { useEffect } from 'react'
import type { ApiChatConfigOption } from '../../../api/types'
import { IconChecked } from '../../../icons/IconChcked'
import { IconChevronDown } from '../../../icons/IconChevronDown'
import { useChatStore } from './chatStore'

export interface Switch {
  configId: string
  value: string
}

// The model and effort the agent offers, switched between answers. One
// switch at a time, and no message while it lands: the server refuses both.
export function ConfigPicker(props: {
  isWorking: boolean
  switching: Switch | undefined
  setSwitching: (next: Switch | undefined) => void
  // Resolves whether the chat took the switch.
  choose: (next: Switch) => Promise<boolean>
}) {
  const options = useChatStore((state) => state.view.config)
  const { switching, setSwitching } = props
  // The new options come over the event stream, which the answer to the
  // request may beat; until they do, the picker shows the choice.
  useEffect(() => {
    const option = options.find((o) => o.id === switching?.configId)
    if (switching !== undefined && option?.currentValue === switching.value) {
      setSwitching(undefined)
    }
  }, [options, switching, setSwitching])

  return (
    <div className="flex min-w-0 flex-1 items-center gap-1">
      {options.map((option) => (
        <ConfigSelect
          key={option.id}
          option={option}
          value={
            switching?.configId === option.id
              ? switching.value
              : option.currentValue
          }
          isDisabled={props.isWorking || switching !== undefined}
          onChange={(value) => {
            const next = { configId: option.id, value }
            setSwitching(next)
            void props.choose(next).then((isTaken) => {
              if (!isTaken) setSwitching(undefined)
            })
          }}
        />
      ))}
    </div>
  )
}

function ConfigSelect(props: {
  option: ApiChatConfigOption
  value: string
  isDisabled: boolean
  onChange: (value: string) => void
}) {
  const { option } = props
  const current = option.values.find((entry) => entry.value === props.value)
  return (
    <RadixSelect.Root
      value={props.value}
      disabled={props.isDisabled}
      onValueChange={props.onChange}
    >
      <RadixSelect.Trigger
        aria-label={option.name}
        title={option.name}
        className="flex h-6 min-w-0 items-center gap-1 rounded-md px-1.5 text-[11px] text-coffee-300 outline-hidden transition-colors hover:bg-coffee-700 hover:text-coffee-100 focus-visible:ring-1 focus-visible:ring-autumn-300 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <span className="truncate">{current?.name ?? props.value}</span>
        <IconChevronDown className="size-3 shrink-0 opacity-60" />
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          side="top"
          sideOffset={4}
          className="z-1000 max-h-80 min-w-48 overflow-y-auto rounded-md border border-coffee-600 bg-coffee-800 p-1 text-coffee-200 text-xs shadow-lg"
        >
          <RadixSelect.Viewport>
            {option.values.map((entry) => (
              <RadixSelect.Item
                key={entry.value}
                value={entry.value}
                className="relative flex cursor-pointer flex-col rounded-sm py-1.5 pr-7 pl-2 outline-hidden data-highlighted:bg-coffee-600 data-highlighted:text-coffee-100"
              >
                <RadixSelect.ItemText>{entry.name}</RadixSelect.ItemText>
                {entry.description && (
                  <span className="text-[11px] text-coffee-400">
                    {entry.description}
                  </span>
                )}
                <RadixSelect.ItemIndicator className="absolute top-2 right-2">
                  <IconChecked className="size-3" />
                </RadixSelect.ItemIndicator>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  )
}
