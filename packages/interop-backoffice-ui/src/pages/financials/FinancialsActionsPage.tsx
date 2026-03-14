import { AlertTriangleIcon, RefreshCwIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '~/components/core/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/core/Card'
import { AppLayout } from '~/layouts/AppLayout'
import { api } from '~/react-query/trpc'

export function FinancialsActionsPage() {
  const [statusMessage, setStatusMessage] = useState<{
    kind: 'success' | 'error'
    message: string
  }>()
  const wipeFinancials = api.plugin.wipeFinancials.useMutation()

  async function handleWipeFinancials() {
    const confirmed = window.confirm(
      'This will mark all interop transfers as unprocessed and trigger financials recomputation. Continue?',
    )
    if (!confirmed) {
      return
    }

    setStatusMessage(undefined)
    try {
      const result = await wipeFinancials.mutateAsync()
      setStatusMessage({
        kind: 'success',
        message: `Financials reset requested for ${result.updatedTransfers} transfers.`,
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred'
      setStatusMessage({
        kind: 'error',
        message,
      })
    }
  }

  return (
    <AppLayout className="min-h-screen">
      <div className="flex flex-col gap-4 p-4">
        <Card className="gap-4 border-amber-400">
          <CardHeader className="flex flex-row items-start gap-3">
            <AlertTriangleIcon className="mt-0.5 text-amber-400" />
            <div className="space-y-1">
              <CardTitle>Financials actions</CardTitle>
              <CardDescription>
                Operations for interop financial processing.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Button
                variant="default"
                size="sm"
                disabled={wipeFinancials.isPending}
                onClick={() => void handleWipeFinancials()}
                className="bg-amber-400 hover:bg-amber-300"
              >
                {wipeFinancials.isPending ? (
                  <RefreshCwIcon className="animate-spin" />
                ) : null}
                Wipe financials (mark all unprocessed)
              </Button>
            </div>
            {statusMessage ? (
              <div
                className={
                  statusMessage.kind === 'success'
                    ? 'text-green-600 text-sm'
                    : 'text-destructive text-sm'
                }
              >
                {statusMessage.message}
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
