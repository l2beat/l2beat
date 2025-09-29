import { formatSeconds, type UnixTime } from '@l2beat/shared-pure'
import { NotApplicableBadge } from '~/components/badge/NotApplicableBadge'
import { ChartStats, ChartStatsItem } from '~/components/core/chart/ChartStats'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/core/Dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '~/components/core/Drawer'
import { EtherscanLink } from '~/components/EtherscanLink'
import { CustomLink } from '~/components/link/CustomLink'
import { ScrollWithGradient } from '~/components/ScrollWithGradient'
import { CloseIcon } from '~/icons/Close'
import { DiffoIcon } from '~/icons/Diffo'
import { HistoryClockIcon } from '~/icons/HistoryClock'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import type { TechnologyContract } from './ContractEntry'

export interface PastUpgradesData {
  upgrades: {
    timestamp: UnixTime
    transactionHash: {
      hash: string
      href: string
    }
    implementations: {
      address: string
      href: string
      diffUrl?: string
    }[]
  }[]
  stats: {
    count: number
    avgInterval: number | null
    lastInterval: number | null
  }
}

export function PastUpgradesDialog({
  pastUpgrades,
}: {
  pastUpgrades: PastUpgradesData
}) {
  const trigger = (
    <div className="mt-2 flex items-center gap-1">
      <HistoryClockIcon className="size-3.5 fill-brand" />
      <span className="font-bold text-brand text-label-value-15 underline md:text-label-value-16">
        View past upgrades
      </span>
    </div>
  )

  const stats = (
    <ChartStats className="md:grid-cols-3 lg:grid-cols-3">
      <ChartStatsItem label="Count of upgrades" className="max-md:h-7">
        {pastUpgrades.stats.count === 0
          ? 'No upgrades'
          : pastUpgrades.stats.count}
      </ChartStatsItem>
      <ChartStatsItem label="Last upgrade" className="max-md:h-7">
        {pastUpgrades.stats.lastInterval ? (
          `${formatSeconds(pastUpgrades.stats.lastInterval)} ago`
        ) : (
          <NotApplicableBadge />
        )}
      </ChartStatsItem>
      <ChartStatsItem label="Avg upgrade interval" className="max-md:h-7">
        {pastUpgrades.stats.avgInterval ? (
          formatSeconds(pastUpgrades.stats.avgInterval)
        ) : (
          <NotApplicableBadge />
        )}
      </ChartStatsItem>
    </ChartStats>
  )

  return (
    <>
      <Dialog>
        <DialogTrigger className="max-md:hidden">{trigger}</DialogTrigger>
        <DialogContent className="flex max-h-[90dvh] w-full flex-col overflow-y-hidden bg-surface-primary md:max-w-[720px]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Past upgrades</DialogTitle>
              <DialogClose>
                <CloseIcon className="size-4 fill-primary" />
              </DialogClose>
            </div>
            <DialogDescription className="sr-only">
              List of past upgrades
            </DialogDescription>
          </DialogHeader>
          {stats}
          <ScrollWithGradient className="-mr-2 space-y-3 pr-2">
            {pastUpgrades.upgrades?.map((upgrade, i) => (
              <PastUpgradeEntry
                key={upgrade.timestamp.toString()}
                upgrade={upgrade}
                deployment={i === pastUpgrades.upgrades.length - 1}
              />
            ))}
          </ScrollWithGradient>
        </DialogContent>
      </Dialog>
      <Drawer>
        <DrawerTrigger className="md:hidden">{trigger}</DrawerTrigger>
        <DrawerContent className="max-h-[90dvh] dark:bg-surface-primary">
          <DrawerHeader className="flex items-center justify-between">
            <DrawerTitle className="font-semibold text-label-value-18">
              Past upgrades
            </DrawerTitle>
            <DrawerDescription className="sr-only">
              List of past upgrades
            </DrawerDescription>
          </DrawerHeader>
          {stats}
          <ScrollWithGradient className="mt-2 max-h-[50dvh] space-y-2">
            {pastUpgrades.upgrades?.map((upgrade, i) => (
              <PastUpgradeEntry
                key={upgrade.timestamp.toString()}
                upgrade={upgrade}
                deployment={i === pastUpgrades.upgrades.length - 1}
              />
            ))}
          </ScrollWithGradient>
        </DrawerContent>
      </Drawer>
    </>
  )
}

function PastUpgradeEntry({
  upgrade,
  deployment,
}: {
  upgrade: NonNullable<TechnologyContract['pastUpgrades']>['upgrades'][number]
  deployment?: boolean
}) {
  return (
    <div className="space-y-4 rounded-sm border border-divider bg-surface-primary p-3">
      <div className="md:grid md:grid-cols-2">
        <ValueWithTitle title={deployment ? 'Deployment time' : 'Time'}>
          <span className="font-medium text-label-value-15">
            {formatTimestamp(upgrade.timestamp, {
              mode: 'datetime',
              longMonthName: false,
            })}
          </span>
        </ValueWithTitle>
        <ValueWithTitle
          title={
            deployment ? 'Deployment transaction hash' : 'Transaction hash'
          }
          className="max-md:hidden"
        >
          <CustomLink
            href={upgrade.transactionHash.href}
            className="word-break-word font-medium text-label-value-15"
          >
            {upgrade.transactionHash.hash.slice(0, 6)}…
            {upgrade.transactionHash.hash.slice(60, 66)}
          </CustomLink>
        </ValueWithTitle>
      </div>
      <ValueWithTitle
        title={deployment ? 'Deployment transaction hash' : 'Transaction hash'}
        className="md:hidden"
      >
        <CustomLink
          href={upgrade.transactionHash.href}
          className="word-break-word font-medium text-label-value-15"
        >
          {upgrade.transactionHash.hash.slice(0, 6)}…
          {upgrade.transactionHash.hash.slice(60, 66)}
        </CustomLink>
      </ValueWithTitle>
      <ValueWithTitle title="Implementation address" className="md:mb-0">
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {upgrade.implementations.map((implementation) => (
            <div
              key={implementation.address}
              className="flex items-center gap-1.5"
            >
              <EtherscanLink
                address={implementation.address}
                href={implementation.href}
                className="text-label-value-15"
              />
              {implementation.diffUrl && (
                <DiffoLink href={implementation.diffUrl} />
              )}
            </div>
          ))}
        </div>
      </ValueWithTitle>
    </div>
  )
}

function ValueWithTitle({
  title,
  children,
  className,
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <span className="text-label-value-14 text-secondary">{title}</span>
      {children}
    </div>
  )
}

function DiffoLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      className="flex h-6 flex-row items-center gap-1.5 rounded-sm bg-linear-to-r from-[#854220] to-[#DE7B16] px-[9px] ring-brand ring-inset focus:ring-2"
    >
      <DiffoIcon className="h-[14px] w-[67px] fill-white" />
    </a>
  )
}
