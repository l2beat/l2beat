import { RefreshCwIcon } from 'lucide-react'
import { Badge } from '~/components/core/Badge'
import { Button } from '~/components/core/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/core/Card'
import { LoadingState } from '~/components/LoadingState'
import { AppLayout } from '~/layouts/AppLayout'
import { api } from '~/react-query/trpc'
import { SummarySubnav } from '../components/SummarySubnav'
import { TransfersTable } from '../table/transfers/TransfersTable'
import { formatDollars } from '../table/transfers/utils'
import type { SummaryTransferRow } from '../table/types'

export function SummaryTransfersPage() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    api.summary.transfers.useQuery()

  const rows: SummaryTransferRow[] = data ?? []
  const totalTransfers = rows.reduce((sum, row) => sum + row.count, 0)
  const totalSrcValue = rows.reduce((sum, row) => sum + row.srcValueSum, 0)
  const totalDstValue = rows.reduce((sum, row) => sum + row.dstValueSum, 0)
  const totalPairs = rows.reduce((sum, row) => sum + row.chains.length, 0)

  return (
    <AppLayout className="min-h-screen">
      <div className="flex flex-col gap-4 p-4">
        <SummarySubnav />

        <Card className="gap-4">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>Summary: Transfers</CardTitle>
              <CardDescription>
                Transfer stats with chain-pair drill-down.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void refetch()}
              disabled={isFetching}
            >
              <RefreshCwIcon className={isFetching ? 'animate-spin' : ''} />
              Refresh
            </Button>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge variant="secondary">{rows.length} transfer types</Badge>
            <Badge variant="secondary">{totalTransfers} total transfers</Badge>
            <Badge variant="secondary">
              {formatDollars(totalSrcValue)} source value
            </Badge>
            <Badge variant="secondary">
              {formatDollars(totalDstValue)} destination value
            </Badge>
            <Badge variant="secondary">{totalPairs} chain pairs</Badge>
          </CardContent>
        </Card>

        <Card className="gap-0 py-0">
          <CardContent className="px-0">
            {isLoading ? <LoadingState className="m-6" /> : null}
            {isError ? (
              <div className="px-6 py-4 text-destructive text-sm">
                Failed to load summary transfers: {error.message}
              </div>
            ) : null}
            {!isLoading && !isError ? (
              <TransfersTable
                data={rows}
                enableCsvExport
                enablePairsCsvExport
              />
            ) : null}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
