import * as Tabs from '@radix-ui/react-tabs'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { cn } from '~/utils/cn'

interface Props {
  charts: [React.ReactNode, React.ReactNode]
  className?: string
}

export function ChartTabs({ charts, className }: Props) {
  return (
    <PrimaryCard className={cn(className, 'pb-1')}>
      <Tabs.Root defaultValue="tvs">
        <Tabs.Content value="tvs">{charts[0]}</Tabs.Content>
        <Tabs.Content value="activity">{charts[1]}</Tabs.Content>
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
