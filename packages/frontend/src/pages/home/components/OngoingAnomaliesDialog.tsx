import { formatSeconds } from '@l2beat/shared-pure'
import type { ReactNode } from 'react'
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
import { LiveIndicator } from '~/components/LiveIndicator'
import { useDevice } from '~/hooks/useDevice'
import { ChevronIcon } from '~/icons/Chevron'
import { anomalySubtypeToLabel } from '~/pages/layer2s/liveness/components/AnomalyIndicator'
import type {
  OngoingAnomaliesOverview,
  OngoingAnomalyCategory,
  OngoingAnomalyItem,
} from '~/server/features/layer2s/liveness/getOngoingAnomaliesOverview'

const TITLE = 'Ongoing anomalies'
const DESCRIPTION =
  'Projects that are currently not posting to Ethereum as expected'

const CATEGORIES: {
  category: OngoingAnomalyCategory
  label: string
  livenessHref: string
}[] = [
  { category: 'layer2s', label: 'Layer 2s', livenessHref: '/layer2s/liveness' },
  {
    category: 'data-availability',
    label: 'Data Availability',
    livenessHref: '/data-availability/liveness',
  },
]

interface Props {
  ongoingAnomalies: OngoingAnomaliesOverview
  trigger: ReactNode
}

export function OngoingAnomaliesDialog({ ongoingAnomalies, trigger }: Props) {
  const { isMobile } = useDevice()

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent
          className="max-h-[90dvh]"
          contentClassName="flex min-h-0 flex-col px-0 pb-0"
        >
          <DrawerHeader className="px-4 pb-2 text-left">
            <DrawerTitle>{TITLE}</DrawerTitle>
            <DrawerDescription>{DESCRIPTION}</DrawerDescription>
          </DrawerHeader>
          <div className="min-h-0 overflow-y-auto px-4 pb-4">
            <OngoingAnomaliesBody items={ongoingAnomalies.items} />
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="primary-card flex max-h-[90dvh] w-[560px] flex-col overflow-hidden bg-surface-primary p-0">
        <DialogClose className="top-5 right-5" />
        <DialogHeader className="px-6 pt-6 pb-2 text-left">
          <DialogTitle>{TITLE}</DialogTitle>
          <DialogDescription>{DESCRIPTION}</DialogDescription>
        </DialogHeader>
        <div className="min-h-0 overflow-y-auto px-6 pb-6">
          <OngoingAnomaliesBody items={ongoingAnomalies.items} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

function OngoingAnomaliesBody({ items }: { items: OngoingAnomalyItem[] }) {
  const groups = CATEGORIES.map((c) => ({
    ...c,
    items: items.filter((item) => item.category === c.category),
  })).filter((group) => group.items.length > 0)

  if (groups.length === 0) {
    return (
      <div className="py-10 text-center text-secondary">
        All tracked projects are posting as expected.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <section key={group.category} className="flex flex-col gap-3">
          <a
            href={group.livenessHref}
            className="group flex items-center justify-between gap-2 border-divider border-b pb-2"
          >
            <h3 className="font-bold text-base text-primary leading-tight">
              {group.label}
            </h3>
            <span className="flex shrink-0 items-center gap-1 font-medium text-link text-xs">
              View liveness
              <ChevronIcon className="-rotate-90 size-2.5 fill-link" />
            </span>
          </a>
          <div className="flex flex-col gap-2">
            {group.items.map((item) => (
              <OngoingAnomalyRow key={item.slug} item={item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

function OngoingAnomalyRow({ item }: { item: OngoingAnomalyItem }) {
  const missing = item.subtypes
    .map((subtype) => anomalySubtypeToLabel(subtype).toLowerCase())
    .join(', ')

  return (
    <a
      href={item.href}
      className="group flex items-center gap-3 rounded-lg bg-surface-secondary px-4 py-3 transition-colors hover:bg-surface-tertiary"
    >
      <LiveIndicator size="md" />
      <img
        src={item.iconUrl}
        alt={item.name}
        className="size-6 shrink-0 rounded-full"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-bold text-label-value-14 leading-tight transition-colors group-hover:text-link">
          {item.name}
        </span>
        <span className="truncate font-medium text-label-value-12 text-secondary leading-tight">
          No {missing}
        </span>
      </div>
      <span className="shrink-0 font-medium text-label-value-12 text-secondary tabular-nums">
        {formatSeconds(item.durationInSeconds)}
      </span>
      <ChevronIcon className="-rotate-90 size-2.5 shrink-0 fill-secondary transition-colors group-hover:fill-link" />
    </a>
  )
}
