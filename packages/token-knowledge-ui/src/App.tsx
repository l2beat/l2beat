import { api, TRPCReactProvider } from './react-query/trpc'

function ImportPanel() {
  const mutation = api.importFacts.useMutation()

  return (
    <div className="mb-6">
      <h2 className="mb-2 font-semibold text-lg">Import Transfer Facts</h2>
      <button
        type="button"
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
        className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
      >
        {mutation.isPending ? 'Importing...' : 'Import Facts'}
      </button>

      {mutation.error && (
        <p className="mt-2 text-red-600">Error: {mutation.error.message}</p>
      )}

      {mutation.data && (
        <p className="mt-2 text-gray-600 text-sm">
          Imported {mutation.data.imported} new facts, skipped{' '}
          {mutation.data.skipped} duplicates.
        </p>
      )}
    </div>
  )
}

function InferPanel() {
  const { data, isLoading, error, refetch } = api.infer.useQuery(undefined, {
    enabled: false,
  })

  return (
    <div>
      <h2 className="mb-2 font-semibold text-lg">Run Inference</h2>
      <button
        type="button"
        onClick={() => refetch()}
        disabled={isLoading}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Inferring...' : 'Infer Token Catalog'}
      </button>

      {error && <p className="mt-4 text-red-600">Error: {error.message}</p>}

      {data && (
        <div className="mt-6">
          <p className="mb-2 text-gray-500 text-sm">
            {data.inputFactCount} input facts — inferred {data.facts.length}{' '}
            facts
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
      <div className="mx-auto max-w-4xl p-6">
        <h1 className="mb-4 font-bold text-2xl">Token Knowledge</h1>
        <ImportPanel />
        <InferPanel />
      </div>
    </TRPCReactProvider>
  )
}
