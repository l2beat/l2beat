import { formatCurrency } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { CopyButton } from '~/components/CopyButton'
import { Button } from '~/components/core/Button'
import { Skeleton } from '~/components/core/Skeleton'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/core/Tabs'
import { UtcDateTime } from '~/components/core/UtcDateTime'
import { CustomLink } from '~/components/link/CustomLink'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { InsightReport } from '~/server/features/insight/InsightReport'
import { useTRPC } from '~/trpc/React'
import { HoldingsTable } from './HoldingsTable'
import { IssuerBreakdown } from './IssuerBreakdown'

const HOLDINGS_ANCHOR_ID = 'holdings'

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

  if (isPending) return <ReportSkeleton />
  if (error) {
    return (
      <Message text="Couldn't load this address: our RPC or token database didn't answer.">
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Try again
        </Button>
      </Message>
    )
  }
  if (data.status === 'indexNotReady') {
    return (
      <Message text="Our index of Ethereum token holders is being rebuilt, so this list would be incomplete. Try again later." />
    )
  }
  if (data.status === 'invalidName') {
    return (
      <Message
        text={`"${addressOrName}" isn't a valid ENS name. Check the spelling, or paste a 0x address.`}
      />
    )
  }
  if (data.status === 'notResolved') {
    return (
      <Message
        text={`${addressOrName} doesn't point to an Ethereum address. Names served offchain, like those ending in cb.id, aren't supported.`}
      />
    )
  }
  if (data.status === 'notConfigured') {
    return (
      <Message text="Insight isn't set up on this deployment: it has no RPC for the holder index (INSIGHT_ETHEREUM_RPC_URL)." />
    )
  }

  return (
    <>
      <ReportSummary report={data.report} />
      <HoldingsSection report={data.report} />
    </>
  )
}

function ReportSummary({ report }: { report: InsightReport }) {
  const reviewed = report.holdings.filter((h) => h.reviewed)
  return (
    <PrimaryCard className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div className="flex min-w-0 flex-col gap-1">
          <h2 className="break-all text-heading-24 md:text-heading-28">
            {report.ensName ?? shortenAddress(report.holder)}
          </h2>
          <div className="flex items-center gap-2 text-label-value-13 text-secondary">
            <CustomLink
              href={`https://etherscan.io/address/${report.holder}`}
              className="break-all font-mono"
            >
              {report.holder}
            </CustomLink>
            <CopyButton
              toCopy={report.holder}
              copyText="Copy address"
              iconClassName="size-3.5"
            />
          </div>
        </div>
        <div className="flex flex-col md:items-end">
          <span className="text-heading-32 tabular-nums md:text-heading-40">
            {formatCurrency(report.totalValueUsd, 'usd')}
          </span>
          <span className="text-label-value-14 text-secondary">
            in {reviewed.length} reviewed{' '}
            {reviewed.length === 1 ? 'token' : 'tokens'}
          </span>
        </div>
      </div>
      <IssuerBreakdown
        holdings={reviewed}
        totalValueUsd={report.totalValueUsd}
      />
      <p className="text-paragraph-13 text-secondary">
        Balances at block{' '}
        <CustomLink href={`https://etherscan.io/block/${report.blockNumber}`}>
          {report.blockNumber.toLocaleString('en-US')}
        </CustomLink>
        . Prices are the latest hourly ones at or before{' '}
        <UtcDateTime timestamp={report.priceTimestamp} />.
      </p>
    </PrimaryCard>
  )
}

function HoldingsSection({ report }: { report: InsightReport }) {
  const reviewed = report.holdings.filter((h) => h.reviewed)
  const unreviewed = report.holdings.filter((h) => !h.reviewed)
  return (
    <PrimaryCard
      id={HOLDINGS_ANCHOR_ID}
      className="flex scroll-mt-4 flex-col gap-4"
    >
      <Tabs name="insightHoldings" defaultValue="reviewed" className="gap-4">
        <TabsList className="self-start">
          <TabsTrigger value="reviewed" className="px-3">
            Reviewed <Count value={reviewed.length} />
          </TabsTrigger>
          <TabsTrigger value="unreviewed" className="px-3">
            Unreviewed <Count value={unreviewed.length} />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="reviewed">
          {reviewed.length > 0 ? (
            <HoldingsTable
              holdings={reviewed}
              anchorId={HOLDINGS_ANCHOR_ID}
              muteValues={false}
            />
          ) : (
            <Empty text="None of the tokens this address holds has been reviewed by us yet." />
          )}
        </TabsContent>
        <TabsContent value="unreviewed" className="flex flex-col gap-3">
          {report.unreviewedValueUsd > 0 && (
            <p className="max-w-[72ch] text-paragraph-14 text-secondary">
              We haven't reviewed these tokens. Most are airdropped to
              well-known addresses, so their{' '}
              {formatCurrency(report.unreviewedValueUsd, 'usd')} at listed
              prices is left out of the total.
            </p>
          )}
          {unreviewed.length > 0 ? (
            <HoldingsTable
              holdings={unreviewed}
              anchorId={HOLDINGS_ANCHOR_ID}
              muteValues
            />
          ) : (
            <Empty text="Every token this address holds has been reviewed." />
          )}
        </TabsContent>
      </Tabs>
      <NotChecked report={report} />
    </PrimaryCard>
  )
}

/** What the list can't show, so an empty or short list isn't over-trusted. */
function NotChecked({ report }: { report: InsightReport }) {
  return (
    <div className="flex flex-col gap-1 border-divider border-t pt-4 text-paragraph-13 text-secondary">
      <p>
        {report.untrackedTokenCount.toLocaleString('en-US')} other tokens this
        address has interacted with aren't in our token database, so we didn't
        check them. A holding may be among them.
      </p>
      <p>
        {report.emptyTrackedTokenCount.toLocaleString('en-US')} tokens it held
        before are empty now.
        {report.unreadableTokenCount > 0 &&
          ` ${report.unreadableTokenCount} returned no readable balance.`}
      </p>
    </div>
  )
}

function Count({ value }: { value: number }) {
  return (
    <span className="text-label-value-13 text-secondary tabular-nums">
      {value.toLocaleString('en-US')}
    </span>
  )
}

function Empty({ text }: { text: string }) {
  return <p className="py-6 text-paragraph-15 text-secondary">{text}</p>
}

function ReportSkeleton() {
  return (
    <>
      <PrimaryCard className="flex flex-col gap-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="h-3 w-full rounded-full" />
        <Skeleton className="h-4 w-2/3" />
      </PrimaryCard>
      <PrimaryCard className="flex flex-col gap-3">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </PrimaryCard>
    </>
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

function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}
