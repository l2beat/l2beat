import { Fragment, useMemo, useState } from 'react'
import { Input } from '~/components/Input'
import { type Fact, useFacts } from '~/hooks/useFacts'
import { searchFacts } from '~/utils/searchFacts'

type Param = Fact['params'][number]
type Tone = 'plain' | 'nested'

function ParamValue({ value, tone }: { value: Param; tone: Tone }) {
  if (Array.isArray(value)) {
    return (
      <>
        <span className="text-muted-foreground">[</span>
        <ParamList params={value} tone={tone} />
        <span className="text-muted-foreground">]</span>
      </>
    )
  }

  if (value == null) {
    return <span className="text-muted-foreground italic">nil</span>
  }

  if (typeof value === 'object') {
    return (
      <>
        <span className="font-semibold text-sky-700 dark:text-sky-400">
          {value.atom}
        </span>
        <span className="text-muted-foreground">(</span>
        <ParamList params={value.params} tone="nested" />
        <span className="text-muted-foreground">)</span>
      </>
    )
  }

  if (typeof value === 'number') {
    return <span className="text-cyan-700 dark:text-cyan-400">{value}</span>
  }

  return (
    <span
      className={
        tone === 'nested'
          ? 'text-emerald-700 dark:text-emerald-400'
          : 'text-amber-700 dark:text-amber-400'
      }
    >
      {value}
    </span>
  )
}

function ParamList({ params, tone }: { params: Fact['params']; tone: Tone }) {
  return params.map((param, i) => (
    <Fragment key={i}>
      {i > 0 && <span className="text-muted-foreground">, </span>}
      <ParamValue value={param} tone={tone} />
    </Fragment>
  ))
}

export function FactsPage() {
  const { facts } = useFacts()
  const [query, setQuery] = useState('')
  const results = useMemo(() => searchFacts(facts, query), [facts, query])

  return (
    <div className="flex h-full flex-col gap-4">
      <Input
        placeholder="Search facts (* = any text)..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="min-h-0 flex-1 overflow-auto rounded-md border border-input bg-card">
        {facts.length === 0 ? (
          <p className="p-3 text-muted-foreground text-sm">
            Run inference to see facts.
          </p>
        ) : results.length === 0 ? (
          <p className="p-3 text-muted-foreground text-sm">No facts found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="sticky top-0 border-b bg-card">
                <th className="p-2 text-left">Fact</th>
                <th className="p-2 text-left">Parameters</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i} className="border-b hover:bg-accent">
                  <td className="p-2 font-mono font-semibold">{r.atom}</td>
                  <td className="p-2 font-mono">
                    <span className="text-muted-foreground">(</span>
                    <ParamList params={r.params} tone="plain" />
                    <span className="text-muted-foreground">)</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
