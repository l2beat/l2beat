import { useEffect, useRef, useState } from 'react'
import { useFacts } from '~/hooks/useFacts'
import { useLog } from '~/hooks/useLog'
import { api } from '~/react-query/trpc'
import { Button } from './Button'

export function RulesEditor() {
  const { logs, addLog } = useLog()
  const { setFacts } = useFacts()
  const logsEndRef = useRef<HTMLDivElement>(null)

  const rules = api.getRules.useQuery()
  const utils = api.useUtils()

  const [content, setContent] = useState('')
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (rules.data) setContent(rules.data.content)
  }, [rules.data])

  // biome-ignore lint/correctness/useExhaustiveDependencies: logs.length is an intentional trigger
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs.length])

  const runInfer = async () => {
    addLog('Running inference...')
    setIsRunning(true)
    try {
      const result = await utils.infer.fetch({ rules: content })
      setFacts(result.facts)
      addLog(
        `Inferred ${result.facts.length} facts from ${result.inputFactCount} inputs.`,
      )
    } catch (e) {
      addLog(`Inference error: ${e instanceof Error ? e.message : String(e)}`)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-foreground text-sm">Rules editor</h2>
        <Button
          size="sm"
          variant="secondary"
          onClick={runInfer}
          disabled={isRunning}
        >
          {isRunning ? 'Running...' : 'Run'}
        </Button>
      </div>
      <textarea
        className="min-h-0 flex-1 resize-none rounded-md border border-input bg-card p-3 font-mono text-xs leading-relaxed outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        value={content}
        onChange={(e) => setContent(e.target.value)}
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
