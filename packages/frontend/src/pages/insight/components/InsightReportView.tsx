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
import type {
  InsightReport,
  InsightReportResult,
} from '~/server/features/insight/InsightReport'
import { useTRPC } from '~/trpc/React'
import { HoldingsTable } from './HoldingsTable'
import { IssuerBreakdown } from './IssuerBreakdown'

const HOLDINGS_ANCHOR_ID = 'holdings'

/**
 * Two columns from `xl` up: a rail with the search and who the address is,
 * and the holdings beside it, so the width carries the list instead of the
 * page growing down. Below `xl` the rail sits on top.
 */
export function InsightReportView({
  addressOrName,
  searchForm,
}: {
  addressOrName: string
  searchForm: React.ReactNode
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
  const report = data?.status === 'ok' ? data.report : undefined

  let main: React.ReactNode
  if (isPending) {
    main = <HoldingsSkeleton />
  } else if (error) {
    main = (
      <Message text="Couldn't load this address: our RPC or token database didn't answer.">
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Try again
        </Button>
      </Message>
    )
  } else if (data.status === 'ok') {
    main = <HoldingsSection report={data.report} />
  } else {
    main = <Message text={getStatusMessage(data.status, addressOrName)} />
  }

  return (
    <div className="grid items-start gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
      <PrimaryCard className="grid grid-cols-[minmax(0,1fr)] gap-5 md:max-xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:sticky xl:top-4">
        <div className="md:max-xl:col-span-2">{searchForm}</div>
        {isPending && <RailSkeleton />}
        {report && <ReportSummary report={report} />}
      </PrimaryCard>
      {main}
    </div>
  )
}

function getStatusMessage(
  status: Exclude<InsightReportResult['status'], 'ok'>,
  addressOrName: string,
): string {
  switch (status) {
    case 'indexNotReady':
      return 'Our index of Ethereum token holders is being rebuilt, so this list would be incomplete. Try again later.'
    case 'invalidName':
      return `"${addressOrName}" isn't a valid ENS name. Check the spelling, or paste a 0x address.`
    case 'notResolved':
      return `${addressOrName} doesn't point to an Ethereum address. Names served offchain, like those ending in cb.id, aren't supported.`
    case 'notConfigured':
      return "Insight isn't set up on this deployment: it has no RPC for the holder index (INSIGHT_ETHEREUM_RPC_URL)."
  }
}

/** Fragments: the rail lays them out, in one column or two. */
function ReportSummary({ report }: { report: InsightReport }) {
  const reviewed = report.holdings.filter((h) => h.reviewed)
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex min-w-0 flex-col">
          <h2 className="truncate text-heading-24">
            {report.ensName ?? shortenAddress(report.holder)}
          </h2>
          <div className="flex items-center gap-1.5 text-label-value-13">
            <CustomLink
              href={`https://etherscan.io/address/${report.holder}`}
              title={report.holder}
              className="font-mono"
            >
              {shortenAddress(report.holder)}
            </CustomLink>
            <CopyButton
              toCopy={report.holder}
              copyText="Copy address"
              iconClassName="size-3.5"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-heading-32 tabular-nums">
            {formatCurrency(report.totalValueUsd, 'usd')}
          </span>
          <span className="text-label-value-13 text-secondary">
            in {reviewed.length} reviewed{' '}
            {reviewed.length === 1 ? 'token' : 'tokens'}
          </span>
        </div>
      </div>
      <IssuerBreakdown
        holdings={reviewed}
        totalValueUsd={report.totalValueUsd}
      />
      <p className="text-paragraph-12 text-secondary md:max-xl:col-span-2">
        Balances at block{' '}
        <CustomLink href={`https://etherscan.io/block/${report.blockNumber}`}>
          {report.blockNumber.toLocaleString('en-US')}
        </CustomLink>
        . Prices are the latest hourly ones at or before{' '}
        <UtcDateTime timestamp={report.priceTimestamp} />.
      </p>
    </>
  )
}

function HoldingsSection({ report }: { report: InsightReport }) {
  const reviewed = report.holdings.filter((h) => h.reviewed)
  const unreviewed = report.holdings.filter((h) => !h.reviewed)
  return (
    <PrimaryCard
      id={HOLDINGS_ANCHOR_ID}
      className="flex min-w-0 scroll-mt-4 flex-col gap-3"
    >
      <Tabs name="insightHoldings" defaultValue="reviewed" className="gap-2">
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
        <TabsContent value="unreviewed" className="flex flex-col gap-2">
          {report.unreviewedValueUsd > 0 && (
            <p className="max-w-[72ch] pt-1 text-paragraph-13 text-secondary">
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
    <p className="border-divider border-t pt-3 text-paragraph-12 text-secondary">
      {report.untrackedTokenCount.toLocaleString('en-US')} other tokens this
      address has interacted with aren't in our token database, so we didn't
      check them; a holding may be among them.{' '}
      {report.emptyTrackedTokenCount.toLocaleString('en-US')} tokens it held
      before are empty now.
      {report.unreadableTokenCount > 0 &&
        ` ${report.unreadableTokenCount} returned no readable balance.`}
    </p>
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

function RailSkeleton() {
  return (
    <>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-9 w-32" />
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-24 w-full" />
      </div>
    </>
  )
}

function HoldingsSkeleton() {
  return (
    <PrimaryCard className="flex flex-col gap-3">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-96 w-full" />
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

function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}
