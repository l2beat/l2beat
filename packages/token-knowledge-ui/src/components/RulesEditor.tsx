import { useEffect, useRef, useState } from 'react'
import { useLog } from '~/hooks/useLog'
import { api } from '~/react-query/trpc'
import { Button } from './Button'

export function RulesEditor() {
  const { logs, addLog } = useLog()
  const logsEndRef = useRef<HTMLDivElement>(null)

  const rules = api.getRules.useQuery()
  const saveMutation = api.saveRules.useMutation({
    onSuccess: () => {
      addLog('Rules saved.')
      rules.refetch()
    },
    onError: (e) => addLog(`Save error: ${e.message}`),
  })
  const inferQuery = api.infer.useQuery(undefined, { enabled: false })

  const [content, setContent] = useState('')
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    if (rules.data) {
      setContent(rules.data.content)
      setDirty(false)
    }
  }, [rules.data])

  // biome-ignore lint/correctness/useExhaustiveDependencies: logs.length is an intentional trigger
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs.length])

  const runInfer = async () => {
    addLog('Running inference...')
    const result = await inferQuery.refetch()
    if (result.error) {
      addLog(`Inference error: ${result.error.message}`)
    } else if (result.data) {
      addLog(
        `Inferred ${result.data.facts.length} facts from ${result.data.inputFactCount} inputs.`,
      )
    }
  }

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-foreground text-sm">Rules editor</h2>
        <div className="flex gap-1.5">
          <Button
            size="sm"
            onClick={() => saveMutation.mutate({ content })}
            disabled={!dirty || saveMutation.isPending}
          >
            {saveMutation.isPending ? 'Saving...' : 'Save'}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={runInfer}
            disabled={inferQuery.isFetching}
          >
            {inferQuery.isFetching ? 'Running...' : 'Run'}
          </Button>
        </div>
      </div>
      <textarea
        className="min-h-0 flex-1 resize-none rounded-md border border-input bg-card p-3 font-mono text-xs leading-relaxed outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        value={content}
        onChange={(e) => {
          setContent(e.target.value)
          setDirty(true)
        }}
        spellCheck={false}
      />
      <h3 className="font-medium text-muted-foreground text-xs">Logs</h3>
      <div className="h-28 shrink-0 overflow-auto rounded-md border border-input bg-card p-2 font-mono text-muted-foreground text-xs leading-relaxed">
        {logs.map((entry, i) => (
          <div key={i}>
            <span className="text-muted-foreground/60">[{entry.time}]</span>{' '}
            {entry.message}
          </div>
        ))}
        <div ref={logsEndRef} />
      </div>
    </div>
  )
}
