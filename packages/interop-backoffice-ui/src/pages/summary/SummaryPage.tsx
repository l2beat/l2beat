import { Link } from 'react-router-dom'
import { Button } from '~/components/core/Button'
import { AppLayout } from '~/layouts/AppLayout'
import { api } from '~/react-query/trpc'

export function SummaryPage() {
  const { data, isLoading, isError } = api.hello.hi.useQuery()
  return (
    <AppLayout>
      <div className="flex h-screen w-full flex-col items-center justify-center gap-3">
        <div className="flex flex-col items-center justify-center gap-2">
          <h1 className="font-bold text-2xl">Summary Page</h1>
          {isLoading && 'Loading...'}
          {isError && 'Error :('}
          {data}
        </div>

        <Button>
          <Link to="/">Go back to the home page</Link>
        </Button>
      </div>
    </AppLayout>
  )
}
