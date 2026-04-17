import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/core/Card'
import { ErrorState } from '~/components/ErrorState'
import { LoadingState } from '~/components/LoadingState'
import { AppLayout } from '~/layouts/AppLayout'
import { api } from '~/react-query/trpc'

export function MemoryPage() {
  const { data, error, isPending } = api.status.memory.useQuery(undefined, {
    refetchInterval: 2_500,
  })

  return (
    <AppLayout className="min-h-screen">
      <div className="flex flex-col gap-4">
        <Card className="gap-4">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>Memory</CardTitle>
              <CardDescription>Current backend memory usage</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {isPending && <LoadingState />}
            {data && !error && (
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                <dt className="text-muted-foreground">RSS</dt>
                <dd className="font-mono">{data.rss}</dd>
                <dt className="text-muted-foreground">Heap total</dt>
                <dd className="font-mono">{data.heapTotal}</dd>
                <dt className="text-muted-foreground">Heap used</dt>
                <dd className="font-mono">{data.heapUsed}</dd>
                <dt className="text-muted-foreground">External</dt>
                <dd className="font-mono">{data.external}</dd>
                <dt className="text-muted-foreground">Array buffers</dt>
                <dd className="font-mono">{data.arrayBuffers}</dd>
              </dl>
            )}
            {error && <ErrorState cause={error.message} />}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
