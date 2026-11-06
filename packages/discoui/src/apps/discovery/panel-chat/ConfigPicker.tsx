import * as RadixSelect from '@radix-ui/react-select'
import { useState } from 'react'
import type { ApiChatConfigOption } from '../../../api/types'
import { IconChecked } from '../../../icons/IconChcked'
import { IconChevronDown } from '../../../icons/IconChevronDown'
import type { Send } from './ChatMessages'
import { useChatStore } from './chatStore'

// The model and effort the agent offers, switched between answers: the
// server refuses while the agent works.
export function ConfigPicker(props: { isWorking: boolean; send: Send }) {
  const options = useChatStore((state) => state.view.config)
  return (
    <div className="flex min-w-0 flex-1 items-center gap-1">
      {options.map((option) => (
        <ConfigSelect
          key={option.id}
          option={option}
          isWorking={props.isWorking}
          send={props.send}
        />
      ))}
    </div>
  )
}

function ConfigSelect(props: {
  option: ApiChatConfigOption
  isWorking: boolean
  send: Send
}) {
  const { option } = props
  // Shown until the agent confirms with its new options, or refuses.
  const [pending, setPending] = useState<string>()
  const value = pending ?? option.currentValue
  const current = option.values.find((entry) => entry.value === value)
  return (
    <RadixSelect.Root
      value={value}
      disabled={props.isWorking || pending !== undefined}
      onValueChange={(next) => {
        setPending(next)
        void props
          .send('config', { configId: option.id, value: next })
          .finally(() => setPending(undefined))
      }}
    >
      <RadixSelect.Trigger
        aria-label={option.name}
        title={option.name}
        className="flex h-6 min-w-0 items-center gap-1 rounded-md px-1.5 text-[11px] text-coffee-300 outline-hidden transition-colors hover:bg-coffee-700 hover:text-coffee-100 focus-visible:ring-1 focus-visible:ring-autumn-300 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <span className="truncate">{current?.name ?? value}</span>
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
