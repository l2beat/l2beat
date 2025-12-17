import { useState } from 'react'
import type { ApiHandlersResponse } from '../../../../../api/types'
import { Markdown } from '../../../../../components/Markdown'
import { Select } from '../../../../../components/Select'
import { Tabs } from '../../../../../components/Tabs'
import { complexMarkdownExample } from './handlerExamples'

type HandlerSelectorProps = {
  handlers: ApiHandlersResponse['handlers']
  selectedHandler: ApiHandlersResponse['handlers'][number] | undefined
  onSelectedHandlerChange: (handlerType: string) => void
}

export function HandlerSelector(props: HandlerSelectorProps) {
  const [tab, setTab] = useState<'description' | 'examples'>('description')
  return (
    <div className="flex h-full w-full flex-col">
      <Tabs.Root
        value={tab}
        onValueChange={(value) => setTab(value as 'description' | 'examples')}
        className="flex h-full flex-col"
      >
        <div className="mb-1 flex gap-2 border-coffee-400">
          <Select.Root
            value={props.selectedHandler?.type}
            onValueChange={props.onSelectedHandlerChange}
          >
            <Select.Trigger placeholder="Select handler" />
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

          <Tabs.List align="right" className="-mb-2 border-b-0">
            <Tabs.Trigger value="description" className="mb-1 border-b-none">
              Documentation
            </Tabs.Trigger>
            <Tabs.Trigger value="examples" className="mb-1 border-b-none">
              Examples
            </Tabs.Trigger>
          </Tabs.List>
        </div>
        <div className="min-h-0 flex-1 border border-coffee-400">
          <Tabs.Content value="description" className="h-full py-0">
            <div className="h-full overflow-y-auto bg-coffee-800 p-1">
              <Markdown>{complexMarkdownExample}</Markdown>
            </div>
          </Tabs.Content>
          <Tabs.Content value="examples" className="h-full py-0">
            <div className="h-full overflow-y-auto bg-coffee-800 p-1">
              <Markdown>{complexMarkdownExample}</Markdown>
            </div>
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  )
}
