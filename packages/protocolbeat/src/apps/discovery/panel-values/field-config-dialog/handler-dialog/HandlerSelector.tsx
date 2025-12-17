import { useState } from 'react'
import type { ApiHandlersResponse } from '../../../../../api/types'
import { Select } from '../../../../../components/Select'
import { Tabs } from '../../../../../components/Tabs'

type HandlerSelectorProps = {
  handlers: ApiHandlersResponse['handlers']
  selectedHandler: ApiHandlersResponse['handlers'][number] | undefined
  onSelectedHandlerChange: (handlerType: string) => void
}

export function HandlerSelector(props: HandlerSelectorProps) {
  const [tab, setTab] = useState<'description' | 'examples'>('description')
  return (
    <div className="max-h-[40vh]">
      <Tabs.Root
        value={tab}
        onValueChange={(value) => setTab(value as 'description' | 'examples')}
      >
        <div className="flex flex-0 items-center justify-center gap-2 border-coffee-400">
          <Select.Root
            value={props.selectedHandler?.type}
            onValueChange={props.onSelectedHandlerChange}
          >
            <Select.Trigger placeholder="Select handler" className="h-full" />
            <Select.Content>
              <Select.Group>
                {props.handlers.map((handler) => (
                  <Select.Item key={handler.type} value={handler.type}>
                    {handler.type}
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Content>
          </Select.Root>

          <Tabs.List align="right">
            <Tabs.Trigger value="description">Description</Tabs.Trigger>
            <Tabs.Trigger value="examples">Examples</Tabs.Trigger>
          </Tabs.List>
        </div>
        <div className="min-h-full border border-coffee-400">
          <Tabs.Content value="description">
            <pre>{props.selectedHandler?.docs}</pre>
            desc
          </Tabs.Content>
          <Tabs.Content value="examples">
            <pre>{props.selectedHandler?.examples.join('\n')}</pre>
            examples
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  )
}
