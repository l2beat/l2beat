import * as Tabs from '@radix-ui/react-tabs'
import { ScalingSummaryActivityChart } from '~/components/chart/activity/ScalingSummaryActivityChart'
import { ScalingSummaryTvsChart } from '~/components/chart/tvs/ScalingSummaryTvsChart'
import type { ChartUnit } from '~/components/chart/types'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { ActivityTimeRange } from '~/server/features/scaling/activity/utils/range'
import { cn } from '~/utils/cn'
import type { TimeRange } from '~/utils/range/range'
import { motion, AnimatePresence } from 'motion/react'
import { useState, useEffect } from 'react'

interface Props {
  unit: ChartUnit
  timeRange: ActivityTimeRange & TimeRange
  className?: string
}

export function ChartTabs({ unit, timeRange, className }: Props) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  return (
    <PrimaryCard className={cn(className, 'pb-1')}>
      <Tabs.Root defaultValue="tvs">
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <Tabs.Content value="tvs" key="tvs">
              <motion.div
                initial={hasMounted ? { x: '-50%', opacity: 0.3 } : false}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '50%', opacity: 0 }}
                transition={{ duration: 0.3, type: 'spring', bounce: 0 }}
              >
                <ScalingSummaryTvsChart unit={unit} timeRange={timeRange} />
              </motion.div>
            </Tabs.Content>
            <Tabs.Content value="activity" key="activity">
              <motion.div
                initial={{ x: '50%', opacity: 0.3 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '-50%', opacity: 0 }}
                transition={{ duration: 0.3, type: 'spring', bounce: 0 }}
              >
                <ScalingSummaryActivityChart timeRange={timeRange} />
              </motion.div>
            </Tabs.Content>
          </AnimatePresence>
        </div>
        <Tabs.List className="flex gap-1.5">
          <Tabs.Trigger value="tvs" className="group w-full py-2.5">
            <div className="my-auto h-2 w-full rounded-full bg-surface-tertiary group-data-[state=active]:bg-brand" />
          </Tabs.Trigger>
          <Tabs.Trigger value="activity" className="group w-full py-2.5">
            <div className="my-auto h-2 w-full rounded-full bg-surface-tertiary group-data-[state=active]:bg-brand" />
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>
    </PrimaryCard>
  )
}
