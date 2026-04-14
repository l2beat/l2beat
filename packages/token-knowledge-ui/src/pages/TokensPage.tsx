import { useState } from 'react'
import { Button } from '~/components/Button'
import { Input } from '~/components/Input'
import { api } from '~/react-query/trpc'

export function TokensPage() {
  const [query, setQuery] = useState('')
  const search = api.searchTokens.useQuery({ query }, { enabled: false })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <label className="shrink-0 font-medium text-muted-foreground text-sm">
          Token info
        </label>
        <Input
          placeholder="Address, symbol, or chain..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && query && search.refetch()}
        />
        <Button
          onClick={() => search.refetch()}
          disabled={!query || search.isFetching}
        >
          Find
        </Button>
      </div>

      <div>
        <h3 className="mb-2 font-medium text-muted-foreground text-sm">
          Results:
        </h3>
        {search.isFetching && (
          <p className="text-muted-foreground text-sm">Searching...</p>
        )}
        {search.data && search.data.results.length === 0 && (
          <p className="text-muted-foreground text-sm">No results found.</p>
        )}
        {search.data && search.data.results.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Fact</th>
                <th className="p-2 text-left">Parameters</th>
              </tr>
            </thead>
            <tbody>
              {search.data.results.map((r, i) => (
                <tr key={i} className="border-b hover:bg-accent">
                  <td className="p-2 font-mono">{r.fact}</td>
                  <td className="p-2 font-mono">{r.params.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
