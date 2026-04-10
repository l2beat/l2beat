import { api, TRPCReactProvider } from './react-query/trpc'

function HelloWorld() {
  const { data, isLoading, error } = api.hello.useQuery()

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>
  return <p>{data?.greeting}</p>
}

export function App() {
  return (
    <TRPCReactProvider>
      <HelloWorld />
    </TRPCReactProvider>
  )
}
