import { useMemo, useState } from 'react'

import type { ApiHealthHint } from '../../api/types'
import { Button } from '../../components/Button'
import { InlineCode } from '../../components/Code'
import { Loader } from '../../components/Loader'
import { Markdown } from '../../components/Markdown'
import { Tabs } from '../../components/Tabs'
import { Title } from '../../components/Title'
import { IS_READONLY } from '../../config/readonly'
import { useCopy } from '../../hooks/useCopy'
import { IconTick } from '../../icons/IconTick'
import { useConfigHealth } from './hooks/useConfigHealth'

type Mode = 'pretty' | 'markdown'

export function ConfigHealthReportPage() {
  const [mode, setMode] = useState<Mode>('pretty')
  const configHealth = useConfigHealth()
  const markdownCopy = useCopy()
  const jsonCopy = useCopy()

  const healthHints = configHealth.data?.healthHints

  const markdownReport = useMemo(() => {
    if (!healthHints) return
    return formatConfigHealthReport(healthHints, new Date())
  }, [healthHints])

  const jsonReport = useMemo(() => {
    return JSON.stringify(healthHints ?? [], null, 2)
  }, [healthHints])

  if (IS_READONLY) {
    return (
      <div className="mx-auto max-w-screen-md p-4">
        <Title title="DiscoUI - Config health report" />
        <div className="border border-coffee-600 bg-coffee-800 p-4 text-sm">
          This page is only available in write-mode.
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-screen-md p-4">
      <Title title="DiscoUI - Config health report" />

      <div className="mb-4 flex gap-4">
        <div className="flex-1">
          <h1 className="font-bold text-lg">Config Health</h1>
          <p className="text-coffee-400 text-sm">
            This report shows if there are excessive ignore rules in the config
            (compared to the ABI).
          </p>
        </div>

        <div className="flex-1 space-y-2">
          <Button
            className="w-full text-2xs"
            variant="solid"
            disabled={configHealth.isPending}
            onClick={() => void configHealth.generate()}
          >
            {configHealth.isPending ? (
              <div className="flex items-center gap-2">
                <Loader className="size-2" />
                Generating
              </div>
            ) : (
              'Generate'
            )}
          </Button>

          <Button
            className="w-full text-2xs"
            disabled={!markdownReport}
            onClick={() => markdownCopy.copy(markdownReport ?? '')}
          >
            {markdownCopy.copied ? (
              <IconTick className="text-aux-green" />
            ) : (
              'Copy Markdown'
            )}
          </Button>

          <Button
            className="w-full text-2xs"
            disabled={!healthHints}
            onClick={() => jsonCopy.copy(jsonReport)}
          >
            {jsonCopy.copied ? (
              <IconTick className="text-aux-green" />
            ) : (
              'Copy JSON'
            )}
          </Button>
        </div>
      </div>

      {configHealth.isError && (
        <div className="mb-3 border border-aux-red bg-aux-red/10 p-3 text-aux-red text-sm">
          Failed to generate report:
          <pre className="mt-2 overflow-auto">{String(configHealth.error)}</pre>
        </div>
      )}

      {healthHints && (
        <div className="space-y-2">
          <Tabs.Root value={mode} onValueChange={(v) => setMode(v as Mode)}>
            <Tabs.List align="right" className="-mb-2 border-b-0">
              <Tabs.Trigger value="pretty">Pretty</Tabs.Trigger>
              <Tabs.Trigger value="markdown">Markdown</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="pretty">
              <PrettyHealthHints hints={healthHints} />
            </Tabs.Content>

            <Tabs.Content value="markdown">
              <Markdown className="border border-coffee-200 bg-coffee-900 p-2">
                {markdownReport ?? ''}
              </Markdown>
            </Tabs.Content>
          </Tabs.Root>
        </div>
      )}
      {!healthHints && (
        <div className="text-coffee-400 text-xs">No generated report yet</div>
      )}
    </div>
  )
}

function PrettyHealthHints(props: { hints: ApiHealthHint[] }) {
  const { configGroups, templateGroups } = useMemo(() => {
    const configGroups = new Map<string, ApiHealthHint[]>()
    const templateGroups = new Map<string, ApiHealthHint[]>()

    for (const hint of props.hints) {
      if (hint.source === 'config') {
        const key = hint.target.project
        configGroups.set(key, [...(configGroups.get(key) ?? []), hint])
      } else {
        const key = hint.target.templateId
        templateGroups.set(key, [...(templateGroups.get(key) ?? []), hint])
      }
    }

    return { configGroups, templateGroups }
  }, [props.hints])

  const configEntries = [...configGroups.entries()].sort(([a], [b]) =>
    a.localeCompare(b),
  )
  const templateEntries = [...templateGroups.entries()].sort(([a], [b]) =>
    a.localeCompare(b),
  )

  return (
    <div className="space-y-4">
      <PrettySection
        title="Config hints"
        emptyText="No config hints."
        groups={configEntries.map(([title, hints]) => ({
          title,
          hints: hints
            .slice()
            .sort((a, b) =>
              a.source === 'config' && b.source === 'config'
                ? a.target.entry.localeCompare(b.target.entry)
                : 0,
            ),
        }))}
      />

      <PrettySection
        title="Template hints"
        emptyText="No template hints."
        groups={templateEntries.map(([title, hints]) => ({
          title,
          hints,
        }))}
      />
    </div>
  )
}

function PrettySection(props: {
  title: string
  emptyText: string
  groups: Array<{ title: string; hints: ApiHealthHint[] }>
}) {
  const total = props.groups.reduce((acc, g) => acc + g.hints.length, 0)

  return (
    <div className="border border-coffee-200 bg-coffee-900 p-3">
      <div className="flex items-center justify-between">
        <div className="font-medium">{props.title}</div>
        <div className="text-2xs text-coffee-400">{total} items</div>
      </div>

      {props.groups.length === 0 ? (
        <div className="mt-2 text-2xs text-coffee-400">{props.emptyText}</div>
      ) : (
        <div className="mt-3 space-y-3">
          {props.groups.map((group) => (
            <div key={group.title} className="border border-coffee-200/50 p-2">
              <div className="flex items-center justify-between">
                <div className="font-mono text-xs">{group.title}</div>
                <div className="text-2xs text-coffee-400">
                  {group.hints.length} item{group.hints.length === 1 ? '' : 's'}
                </div>
              </div>

              <div className="mt-2 space-y-2">
                {group.hints.map((hint, i) => (
                  <HintCard key={`${group.title}:${i}`} hint={hint} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function HintCard(props: { hint: ApiHealthHint }) {
  const excess = props.hint.excess
  const rows: [string, string[] | undefined][] = [
    ['ignoreInWatchMode', excess.ignoreInWatchMode],
    ['ignoreMethods', excess.ignoreMethods],
    ['ignoreRelatives', excess.ignoreRelatives],
  ]

  return (
    <div className="bg-coffee-800/30 p-2">
      {props.hint.source === 'config' && (
        <span className="font-mono text-2xs">{props.hint.target.entry}</span>
      )}

      <div className="mt-2 space-y-2">
        {rows
          .filter(([, values]) => values && values.length > 0)
          .map(([label, values]) => (
            <div key={label}>
              <div className="text-2xs text-coffee-400">{label}</div>
              <div className="mt-1 flex flex-wrap gap-1">
                {values?.map((v) => (
                  <InlineCode key={v} content={v} />
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

function formatConfigHealthReport(
  hints: ApiHealthHint[],
  generatedAt: Date,
): string {
  const sorted = [...hints].sort((a, b) => {
    const aKey =
      a.source === 'config'
        ? `${a.target.entry}`
        : `template:${a.target.templateId}`
    const bKey =
      b.source === 'config'
        ? `${b.target.entry}`
        : `template:${b.target.templateId}`
    return aKey.localeCompare(bKey)
  })

  const configHints = sorted.filter((h) => h.source === 'config')
  const templateHints = sorted.filter((h) => h.source === 'template')

  const lines: string[] = []
  lines.push('# Discovery config health report')
  lines.push('')
  lines.push(`Generated at: ${generatedAt.toISOString()}`)
  lines.push('')
  lines.push(`Total hints: ${sorted.length}`)
  lines.push(`- config: ${configHints.length}`)
  lines.push(`- template: ${templateHints.length}`)
  lines.push('')

  for (const hint of sorted) {
    const title =
      hint.source === 'config'
        ? `config ${hint.target.project}:${hint.target.entry}`
        : `template ${hint.target.templateId}`
    lines.push(`## ${title}`)

    const rows: Array<[string, string[] | undefined]> = [
      ['ignoreInWatchMode', hint.excess.ignoreInWatchMode],
      ['ignoreMethods', hint.excess.ignoreMethods],
      ['ignoreRelatives', hint.excess.ignoreRelatives],
    ]

    for (const [key, values] of rows) {
      if (!values || values.length === 0) continue
      lines.push(`- ${key}:`)
      for (const v of values) {
        lines.push(`  - ${v}`)
      }
    }

    lines.push('')
  }

  return lines.join('\n')
}
