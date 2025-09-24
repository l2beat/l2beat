import type { UnixTime } from '@l2beat/shared-pure'
import { Button } from '~/components/core/Button'
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
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '~/components/core/Drawer'
import { EtherscanLink } from '~/components/EtherscanLink'
import { CustomLink } from '~/components/link/CustomLink'
import { CloseIcon } from '~/icons/Close'
import { HistoryClockIcon } from '~/icons/HistoryClock'
import { formatTimestamp } from '~/utils/dates'
import type { TechnologyContract } from './ContractEntry'

export interface PastUpgrade {
  timestamp: UnixTime
  transactionHash: {
    hash: string
    href: string
  }
  implementations: {
    address: string
    href: string
  }[]
}

export function PastUpgradesDialog({
  pastUpgrades,
}: {
  pastUpgrades: PastUpgrade[]
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
        <DialogContent className="max-h-[90dvh] w-fit bg-surface-primary md:top-1/2 md:max-w-full">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Past upgrades</DialogTitle>
              <DialogClose>
                <CloseIcon className="size-4" />
              </DialogClose>
            </div>
            <DialogDescription className="sr-only">
              List of past upgrades
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[80dvh] space-y-3 overflow-y-auto">
            {pastUpgrades?.map((upgrade) => (
              <PastUpgradeEntry
                key={upgrade.timestamp.toString()}
                upgrade={upgrade}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
      <Drawer>
        <DrawerTrigger className="md:hidden">{trigger}</DrawerTrigger>
        <DrawerContent className="max-h-[90dvh]">
          <DrawerHeader className="flex items-center justify-between">
            <DrawerTitle className="font-semibold text-label-value-18">
              Past upgrades
            </DrawerTitle>
          </DrawerHeader>
          <div className="max-h-[60dvh] space-y-2 overflow-y-auto">
            {pastUpgrades?.map((upgrade) => (
              <PastUpgradeEntry
                key={upgrade.timestamp.toString()}
                upgrade={upgrade}
              />
            ))}
          </div>
          <DrawerFooter className="flex flex-row justify-center pt-6">
            <DrawerClose asChild>
              <Button className="bg-transparent text-sm text-zinc-500 underline dark:bg-transparent">
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
}: {
  upgrade: NonNullable<TechnologyContract['pastUpgrades']>[number]
}) {
  return (
    <div className="space-y-4 rounded-sm border border-divider bg-surface-secondary p-3">
      <ValueWithTitle title="Time">
        <span className="font-medium text-label-value-15">
          {formatTimestamp(upgrade.timestamp, {
            mode: 'datetime',
            longMonthName: false,
          })}
        </span>
      </ValueWithTitle>
      <ValueWithTitle title="Transaction hash">
        <CustomLink
          href={upgrade.transactionHash.href}
          className="word-break-word font-medium text-label-value-15"
        >
          {upgrade.transactionHash.hash}
        </CustomLink>
      </ValueWithTitle>
      <ValueWithTitle title="Implementation address">
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
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-label-value-14 text-secondary">{title}</span>
      {children}
    </div>
  )
}
