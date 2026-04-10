import { useState } from 'react'
import { api, TRPCReactProvider } from './react-query/trpc'

function InferPanel() {
  const [enabled, setEnabled] = useState(false)
  const { data, isLoading, error } = api.inferTokenCatalog.useQuery(undefined, {
    enabled,
  })

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-4 font-bold text-2xl">Token Knowledge</h1>
      <button
        type="button"
        onClick={() => setEnabled(true)}
        disabled={isLoading}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Inferring...' : 'Infer Token Catalog'}
      </button>

      {error && <p className="mt-4 text-red-600">Error: {error.message}</p>}

      {data && (
        <div className="mt-6">
          <p className="mb-2 text-gray-500 text-sm">
            Processed {data.transferCount} transfers — inferred{' '}
            {data.facts.length} facts
          </p>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Fact</th>
                <th className="p-2 text-left">Parameters</th>
              </tr>
            </thead>
            <tbody>
              {data.facts.map(
                (fact: { atom: string; params: unknown[] }, i: number) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-mono">{fact.atom}</td>
                    <td className="p-2 font-mono">
                      {fact.params.map(String).join(', ')}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export function App() {
  return (
    <TRPCReactProvider>
      <InferPanel />
    </TRPCReactProvider>
  )
}
