import type { RouterOutputs } from '@l2beat/token-knowledge'
import { useState } from 'react'
import { Button } from '~/components/Button'
import { Input } from '~/components/Input'
import { api } from '~/react-query/trpc'

type Param = RouterOutputs['searchFacts']['results'][number]['params'][number]

function paramToString(p: Param): string {
  if (typeof p === 'object') {
    const inner = (p.params as Param[]).map(paramToString).join(', ')
    return inner ? `${p.atom}(${inner})` : p.atom
  }
  return String(p)
}

export function FactsPage() {
  const [input, setInput] = useState('')
  const [query, setQuery] = useState('')
  const search = api.searchFacts.useQuery({ query })

  const handleSearch = () => setQuery(input)

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center gap-3">
        <Input
          placeholder="Search facts (regex)..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={search.isFetching}>
          Find
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto rounded-md border border-input bg-card">
        {search.isFetching && (
          <p className="p-3 text-muted-foreground text-sm">Searching...</p>
        )}
        {search.data && search.data.results.length === 0 && (
          <p className="p-3 text-muted-foreground text-sm">No facts found.</p>
        )}
        {search.data && search.data.results.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="sticky top-0 border-b bg-card">
                <th className="p-2 text-left">Fact</th>
                <th className="p-2 text-left">Parameters</th>
              </tr>
            </thead>
            <tbody>
              {search.data.results.map((r, i) => (
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
