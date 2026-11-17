import { formatCurrency } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { Button } from '~/components/core/Button'
import { Skeleton } from '~/components/core/Skeleton'
import { UtcDateTime } from '~/components/core/UtcDateTime'
import { CustomLink } from '~/components/link/CustomLink'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { InsightReport } from '~/server/features/insight/InsightReport'
import { useTRPC } from '~/trpc/React'
import { HoldingsTable } from './HoldingsTable'

export function InsightReportView({
  addressOrName,
}: {
  addressOrName: string
}) {
  const trpc = useTRPC()
  const { data, error, isPending, refetch } = useQuery(
    trpc.insight.report.queryOptions(
      { addressOrName },
      // An invalid address fails the same way every time; a failed RPC call
      // is retried from the button, so the visitor sees it failed.
      { retry: false, refetchOnWindowFocus: false },
    ),
  )

  if (isPending) {
    return (
      <PrimaryCard className="flex flex-col gap-3">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </PrimaryCard>
    )
  }
  if (error) {
    return (
      <Message text={error.message}>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Try again
        </Button>
      </Message>
    )
  }
  if (data.status === 'indexNotReady') {
    return (
      <Message text="The holder index of Ethereum is being built or rebuilt, so the list of tokens would be incomplete. Try again later." />
    )
  }
  if (data.status === 'invalidName') {
    return <Message text={`"${addressOrName}" is not a valid ENS name.`} />
  }
  if (data.status === 'notResolved') {
    return (
      <Message
        text={`${addressOrName} does not resolve to an address on Ethereum. Names resolved offchain (CCIP-read) are not followed.`}
      />
    )
  }
  if (data.status === 'notConfigured') {
    return (
      <Message text="This deployment has no RPC for the holder index (INSIGHT_ETHEREUM_RPC_URL)." />
    )
  }

  return (
    <>
      <ReportSummary report={data.report} />
      <PrimaryCard>
        <HoldingsTable holdings={data.report.holdings} />
      </PrimaryCard>
    </>
  )
}

function ReportSummary({ report }: { report: InsightReport }) {
  return (
    <PrimaryCard className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="flex flex-col">
          {report.ensName && (
            <span className="text-heading-20">{report.ensName}</span>
          )}
          <span className="break-all font-mono text-label-value-14">
            {report.holder}
          </span>
        </div>
        <span className="text-heading-24">
          {formatCurrency(report.totalValueUsd, 'usd')}
        </span>
      </div>
      <ul className="flex list-disc flex-col gap-1 pl-5 text-paragraph-14 text-secondary">
        <li>
          {report.holdings.length} tokens with a balance, read at block{' '}
          <CustomLink href={`https://etherscan.io/block/${report.blockNumber}`}>
            {report.blockNumber.toLocaleString('en-US')}
          </CustomLink>
          . The total counts only tokens with a price.
        </li>
        <li>
          Prices are the latest hourly ones at or before{' '}
          <UtcDateTime timestamp={report.priceTimestamp} />, at most 3 hours
          older.
        </li>
        <li>
          Not checked: {report.untrackedTokenCount.toLocaleString('en-US')}{' '}
          tokens this address has touched that are not in our token database, so
          a holding may be missing from this list.
        </li>
        <li>
          {report.emptyTrackedTokenCount.toLocaleString('en-US')} known tokens
          were touched but are no longer held.
          {report.unreadableTokenCount > 0 &&
            ` The balance of ${report.unreadableTokenCount} could not be read.`}
        </li>
      </ul>
    </PrimaryCard>
  )
}

function Message({
  text,
  children,
}: {
  text: string
  children?: React.ReactNode
}) {
  return (
    <PrimaryCard className="flex flex-col items-start gap-3 text-paragraph-15">
      {text}
      {children}
    </PrimaryCard>
  )
}
