import { RefreshCwIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '~/components/core/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/core/Card'
import { ErrorState } from '~/components/ErrorState'
import { AppLayout } from '~/layouts/AppLayout'
import { api } from '~/react-query/trpc'

export function FinancialActionsPage() {
  const refreshFinancials = api.financials.refresh.useMutation({
    onSuccess: (data) => {
      toast.success('Financials refresh requested', {
        description: `${data.updatedTransfers} transfers marked as unprocessed.`,
      })
    },
    onError: (error) => {
      toast.error('Financials refresh failed', {
        description: error.message,
      })
    },
  })

  return (
    <AppLayout className="min-h-screen">
      <div className="flex flex-col gap-4">
        <Card className="gap-4">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>Financial actions</CardTitle>
              <CardDescription>
                Operational actions for interop financials.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <section className="space-y-4 rounded-lg border p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="font-medium text-sm">Refresh financials</h2>
                  <p className="text-muted-foreground text-sm">
                    Marks every interop transfer as unprocessed so the
                    financials loop recalculates them.
                  </p>
                </div>
                <Button
                  onClick={() => refreshFinancials.mutate()}
                  disabled={refreshFinancials.isPending}
                >
                  <RefreshCwIcon
                    className={
                      refreshFinancials.isPending ? 'animate-spin' : ''
                    }
                  />
                  {refreshFinancials.isPending
                    ? 'Requesting refresh...'
                    : 'Refresh financials'}
                </Button>
              </div>
              {refreshFinancials.error ? (
                <ErrorState cause={refreshFinancials.error.message} />
              ) : null}
            </section>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
