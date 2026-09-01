import type { ReactNode } from 'react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/core/Tabs'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'

export function InteropDominanceCompareCard({
  name,
  dominanceLabel,
  className,
  dominanceClassName,
  compareClassName,
  dominance,
  compare,
}: {
  name: string
  dominanceLabel: string
  className?: string
  dominanceClassName?: string
  compareClassName?: string
  dominance: ReactNode
  compare: ReactNode
}) {
  return (
    <PrimaryCard className={className}>
      <Tabs name={name} defaultValue="dominance" variant="highlighted">
        <TabsList className="w-full">
          <TabsTrigger value="dominance">{dominanceLabel}</TabsTrigger>
          <TabsTrigger value="compare">Compare Mode</TabsTrigger>
        </TabsList>
        <TabsContent value="dominance" className={dominanceClassName}>
          {dominance}
        </TabsContent>
        <TabsContent value="compare" className={compareClassName}>
          {compare}
        </TabsContent>
      </Tabs>
    </PrimaryCard>
  )
}
