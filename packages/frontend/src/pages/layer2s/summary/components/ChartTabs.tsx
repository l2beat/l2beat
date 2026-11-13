import * as Tabs from '@radix-ui/react-tabs'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { cn } from '~/utils/cn'

interface Props {
  charts: [React.ReactNode, React.ReactNode]
  /** Names the two charts for screen readers, in the order of `charts`. */
  labels?: [string, string]
  className?: string
}

export function ChartTabs({
  charts,
  labels = ['Value secured chart', 'Activity chart'],
  className,
}: Props) {
  return (
    <PrimaryCard className={cn(className, 'pb-1')}>
      <Tabs.Root defaultValue="tvs">
        <Tabs.Content value="tvs">{charts[0]}</Tabs.Content>
        <Tabs.Content value="activity">{charts[1]}</Tabs.Content>
        <Tabs.List className="flex gap-1.5">
          <Tabs.Trigger
            value="tvs"
            aria-label={labels[0]}
            className="group w-full py-2.5"
          >
            <div className="my-auto h-2 w-full rounded-full bg-surface-tertiary group-data-[state=active]:bg-primary" />
          </Tabs.Trigger>
          <Tabs.Trigger
            value="activity"
            aria-label={labels[1]}
            className="group w-full py-2.5"
          >
            <div className="my-auto h-2 w-full rounded-full bg-surface-tertiary group-data-[state=active]:bg-primary" />
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>
    </PrimaryCard>
  )
}
