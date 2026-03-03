import { useState } from 'react'
import type { ApiHandlersResponse } from '../../../../../api/types'
import { Markdown } from '../../../../../components/Markdown'
import { Select } from '../../../../../components/Select'
import { Tabs } from '../../../../../components/Tabs'
import { complexMarkdownExample } from './handlerExamples'
import { schemaToMarkdown } from './schemaToMarkdown'

type HandlerSelectorProps = {
  handlers: ApiHandlersResponse['handlers']
  selectedHandler: ApiHandlersResponse['handlers'][number] | undefined
  onSelectedHandlerChange: (handlerType: string) => void
}

export function HandlerSelector(props: HandlerSelectorProps) {
  const [tab, setTab] = useState('schema')
  return (
    <div className="flex h-full w-full flex-col">
      <Tabs.Root
        value={tab}
        onValueChange={(value) => setTab(value)}
        className="flex h-full flex-col"
      >
        <div className="mb-1 flex flex-col gap-2 border-coffee-400">
          <Select.Root
            value={props.selectedHandler?.type ?? ''}
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
            <Tabs.Trigger value="manual" className="mb-1 border-b-none">
              Editor manual
            </Tabs.Trigger>
            <Tabs.Trigger value="docs" className="mb-1 border-b-none">
              Docs & Examples
            </Tabs.Trigger>
            <Tabs.Trigger value="schema" className="mb-1 border-b-none">
              Schema
            </Tabs.Trigger>
          </Tabs.List>
        </div>
        <div className="min-h-0 flex-1 border border-coffee-400">
          <Tabs.Content value="manual" className="h-full py-0">
            <div className="h-full overflow-y-auto bg-coffee-800 p-1">
              <Markdown>{getEditorManualMarkdown()}</Markdown>
            </div>
          </Tabs.Content>
          <Tabs.Content value="docs" className="h-full py-0">
            <div className="h-full overflow-y-auto bg-coffee-800 p-1">
              <Markdown>{complexMarkdownExample}</Markdown>
            </div>
          </Tabs.Content>

          <Tabs.Content value="schema" className="h-full py-0">
            <div className="h-full overflow-y-auto bg-coffee-800 p-1">
              <Markdown>
                {schemaToMarkdown(props.selectedHandler?.schema)}
              </Markdown>
            </div>
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  )
}

function getEditorManualMarkdown() {
  return `
  ### Editor manual

  - Definitions are validated against a \`schema\` - switching between handlers will update the schema in the editor so you can see the errors and intellisense.
  - Editor is using \`jsonc\` syntax - you can use comments and multi-line strings.
  - You've added a handler and can't see it in the list? Make sure you've re-built the discovery package and restarted the server.
  `
}
