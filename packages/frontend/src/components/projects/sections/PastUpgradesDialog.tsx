import { formatSeconds, type UnixTime } from '@l2beat/shared-pure'
import { Button } from '~/components/core/Button'
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
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '~/components/core/Drawer'
import { EtherscanLink } from '~/components/EtherscanLink'
import { CustomLink } from '~/components/link/CustomLink'
import { CloseIcon } from '~/icons/Close'
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
    }[]
  }[]
  stats: {
    count: number
    avgInterval: number
    lastInterval: number
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

  return (
    <>
      <Dialog>
        <DialogTrigger className="max-md:hidden">{trigger}</DialogTrigger>
        <DialogContent className="flex max-h-[90dvh] w-full flex-col overflow-y-hidden bg-surface-primary md:top-1/2 md:max-w-[720px]">
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
          <ChartStats className="md:grid-cols-3 lg:grid-cols-3">
            <ChartStatsItem label="Count of upgrades" className="max-md:h-7">
              {pastUpgrades.stats.count}
            </ChartStatsItem>
            <ChartStatsItem label="Avg update interval" className="max-md:h-7">
              {formatSeconds(pastUpgrades.stats.avgInterval)}
            </ChartStatsItem>
            <ChartStatsItem label="Last upgrade" className="max-md:h-7">
              {formatSeconds(pastUpgrades.stats.lastInterval)}
            </ChartStatsItem>
          </ChartStats>
          <div className="-mr-2 flex-1 space-y-3 overflow-y-auto pr-2">
            {pastUpgrades.upgrades?.map((upgrade, i) => (
              <PastUpgradeEntry
                key={upgrade.timestamp.toString()}
                upgrade={upgrade}
                deployment={i === pastUpgrades.upgrades.length - 1}
              />
            ))}
          </div>
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
          <div className="max-h-[60dvh] space-y-2 overflow-y-auto">
            {pastUpgrades.upgrades?.map((upgrade, i) => (
              <PastUpgradeEntry
                key={upgrade.timestamp.toString()}
                upgrade={upgrade}
                deployment={i === pastUpgrades.upgrades.length - 1}
              />
            ))}
          </div>
          <DrawerFooter className="flex flex-row justify-center pt-6">
            <DrawerClose asChild>
              <Button className="bg-transparent text-secondary text-sm underline dark:bg-transparent">
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
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
    <div className="space-y-4 rounded-sm border border-divider bg-surface-group p-3">
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
          title="Implementation address"
          className="max-md:hidden"
        >
          <div className="flex gap-1">
            {upgrade.implementations.map((implementation) => (
              <EtherscanLink
                key={implementation.address}
                address={implementation.address}
                href={implementation.href}
                className="text-label-value-15"
              />
            ))}
          </div>
        </ValueWithTitle>
      </div>
      <ValueWithTitle
        title={deployment ? 'Deployment transaction hash' : 'Transaction hash'}
        className="md:mb-0"
      >
        <CustomLink
          href={upgrade.transactionHash.href}
          className="word-break-word font-medium text-label-value-15"
        >
          {upgrade.transactionHash.hash}
        </CustomLink>
      </ValueWithTitle>
      <ValueWithTitle title="Implementation address" className="md:hidden">
        <div className="flex gap-1">
          {upgrade.implementations.map((implementation) => (
            <EtherscanLink
              key={implementation.address}
              address={implementation.address}
              href={implementation.href}
              className="text-label-value-15"
            />
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
