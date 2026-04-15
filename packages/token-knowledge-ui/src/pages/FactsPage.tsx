import { useMemo, useState } from 'react'
import { Input } from '~/components/Input'
import { useFacts } from '~/hooks/useFacts'
import { paramToString, searchFacts } from '~/utils/searchFacts'

export function FactsPage() {
  const { facts } = useFacts()
  const [query, setQuery] = useState('')
  const results = useMemo(() => searchFacts(facts, query), [facts, query])

  return (
    <div className="flex h-full flex-col gap-4">
      <Input
        placeholder="Search facts (regex)..."
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
                  <td className="p-2 font-mono">{r.atom}</td>
                  <td className="p-2 font-mono">
                    {r.params.map(paramToString).join(', ')}
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
