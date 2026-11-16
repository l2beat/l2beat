import { formatInteger } from '@l2beat/shared-pure'
import { useState } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/core/Tabs'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { cn } from '~/utils/cn'
import { InteropTokenRow, type InteropTokenRowData } from './InteropTokenRow'
import type { InteropTransferDefaults } from './InteropTransferTrigger'
import { Last24HoursBadge } from './Last24HoursBadge'

export interface TopTokensTab {
  id: string
  iconUrl: string
  label: string
}

export function InteropTopTokensWidget({
  tabsName,
  tabs,
  isLoading,
  getTabData,
  transfer,
  className,
  tabLabelClassName,
}: {
  tabsName: string
  tabs: TopTokensTab[]
  isLoading: boolean
  getTabData: (activeTab: string) => {
    activeCount: { value: number | undefined; label: string }
    rows: InteropTokenRowData[]
  }
  transfer: InteropTransferDefaults
  className?: string
  tabLabelClassName?: string
}) {
  const [activeTab, setActiveTab] = useState<string>('all')
  const { activeCount, rows } = getTabData(activeTab)

  return (
    <PrimaryCard
      className={cn('@container border-divider max-md:border-b', className)}
    >
      <div className="flex flex-wrap items-baseline gap-x-2">
        <h2 className="font-semibold text-heading-20 leading-6 tracking-[-0.01em]">
          Top tokens by volume
        </h2>
        <Last24HoursBadge />
      </div>

      <Tabs
        name={tabsName}
        value={activeTab}
        onValueChange={setActiveTab}
        className="mt-4 gap-1"
        variant="highlighted"
      >
        <TabsList className="h-auto w-fit max-w-full flex-wrap justify-start gap-1 p-1">
          <TabsTrigger
            value="all"
            className="h-7 w-auto flex-none gap-1 px-2.5 font-medium text-label-value-13"
          >
            All
          </TabsTrigger>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="h-7 w-auto flex-none gap-1 px-2.5 font-medium text-label-value-13"
            >
              <img
                src={tab.iconUrl}
                alt={tab.label}
                className="size-4 rounded-full"
              />
              <span className={tabLabelClassName}>{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="mt-1 h-4 font-normal text-label-value-13 text-secondary leading-4">
          {activeCount.value
            ? `${formatInteger(activeCount.value)} ${activeCount.label}`
            : null}
        </div>
        <TabsContent value={activeTab} className="mt-2">
          {isLoading ? (
            <RowsSkeleton />
          ) : rows.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="flex flex-col gap-3">
              {rows.map((row) => (
                <InteropTokenRow
                  key={row.tokenId}
                  token={row}
                  transfer={transfer}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </PrimaryCard>
  )
}

function RowsSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-7 w-full" />
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex min-h-40 items-center justify-center font-medium text-secondary text-sm">
      No tokens found.
    </div>
  )
}
