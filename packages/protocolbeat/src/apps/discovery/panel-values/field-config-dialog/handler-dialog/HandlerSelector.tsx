import { useState } from 'react'
import type { ApiHandlersResponse } from '../../../../../api/types'
import { Markdown } from '../../../../../components/Markdown'
import { Select } from '../../../../../components/Select'
import { Tabs } from '../../../../../components/Tabs'
import { formatJson } from '../../../../../utils/formatJson'
import { schemaToMarkdown } from './schemaToMarkdown'

type HandlerSelectorProps = {
  handlers: ApiHandlersResponse['handlers']
  selectedHandler: ApiHandlersResponse['handlers'][number] | undefined
  onSelectedHandlerChange: (handlerType: string) => void
}

export function HandlerSelector(props: HandlerSelectorProps) {
  const [tab, setTab] = useState('docs')
  const docs = formatDocs(props.selectedHandler?.docs)
  const examples = formatExamples(props.selectedHandler?.examples ?? [])
  const schema = schemaToMarkdown(props.selectedHandler?.schema)
  const text = [docs, schema, examples].join('\n\n')
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
              <Markdown>{text}</Markdown>
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

function formatDocs(description: string | undefined): string {
  const lines = []
  lines.push('### Description\n\n')
  if (description) {
    lines.push(description.trim())
    lines.push('\n\n')
  } else {
    lines.push('No description available available')
  }
  return lines.join('\n\n')
}

function formatExamples(
  examples: {
    title: string
    description?: string
    code: string
  }[],
): string {
  const lines = []

  lines.push('### Examples\n\n')

  if (examples.length > 0) {
    for (const example of examples) {
      lines.push(`${example.title}\n\n`)
      if (example.description) {
        lines.push(`> ${example.description}\n\n`)
      }
      const formattedCode = tryFormattingJson(example.code)
      lines.push(`\`\`\`jsonc\n${formattedCode}\n\`\`\`\n<br/>`)
    }
  } else {
    lines.push('No examples available')
  }

  return lines.join('\n\n')
}

function getEditorManualMarkdown() {
  return `
  ### Editor manual

  - Definitions are validated against a \`schema\` - switching between handlers will update the schema in the editor so you can see the errors and intellisense.
  - Editor is using \`jsonc\` syntax - you can use comments and multi-line strings.
  - You've added a handler and can't see it in the list? Make sure you've re-built the discovery package and restarted the server.
  `
}

function tryFormattingJson(maybeJson: string): string {
  try {
    return formatJson(JSON.parse(maybeJson.trim()), {
      indentSize: 2,
      lineSize: 30,
    })
  } catch {
    return maybeJson.trim()
  }
}
