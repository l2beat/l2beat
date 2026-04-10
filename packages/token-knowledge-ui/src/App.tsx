import { useState } from 'react'
import { api, TRPCReactProvider } from './react-query/trpc'

function InferPanel() {
  const [enabled, setEnabled] = useState(false)
  const { data, isLoading, error } = api.inferTokenCatalog.useQuery(
    undefined,
    { enabled },
  )

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Token Knowledge</h1>
      <button
        type="button"
        onClick={() => setEnabled(true)}
        disabled={isLoading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Inferring...' : 'Infer Token Catalog'}
      </button>

      {error && (
        <p className="mt-4 text-red-600">Error: {error.message}</p>
      )}

      {data && (
        <div className="mt-6">
          <p className="text-sm text-gray-500 mb-2">
            Processed {data.transferCount} transfers — inferred{' '}
            {data.facts.length} facts
          </p>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Fact</th>
                <th className="text-left p-2">Parameters</th>
              </tr>
            </thead>
            <tbody>
              {data.facts.map((fact: { atom: string; params: unknown[] }, i: number) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-mono">{fact.atom}</td>
                  <td className="p-2 font-mono">
                    {fact.params.map(String).join(', ')}
                  </td>
                </tr>
              ))}
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
