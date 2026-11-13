import * as Tabs from '@radix-ui/react-tabs'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { cn } from '~/utils/cn'

interface Props {
  charts: [React.ReactNode, React.ReactNode]
  className?: string
}

const TABS = [
  { value: 'tvs', label: 'Value secured' },
  { value: 'activity', label: 'Activity' },
] as const

/** Below lg, the summary's two charts in one card, switched by name. */
export function ChartTabs({ charts, className }: Props) {
  return (
    <PrimaryCard className={cn(className, 'pb-1')}>
      <Tabs.Root defaultValue="tvs">
        <Tabs.Content value="tvs">{charts[0]}</Tabs.Content>
        <Tabs.Content value="activity">{charts[1]}</Tabs.Content>
        <Tabs.List className="mt-3 flex border-divider border-t">
          {TABS.map((tab) => (
            <Tabs.Trigger
              key={tab.value}
              value={tab.value}
              className="-mt-px flex h-10 flex-1 items-center justify-center border-transparent border-t-2 font-medium text-label-value-13 text-secondary transition-colors hover:text-primary data-[state=active]:border-brand data-[state=active]:text-primary"
            >
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </Tabs.Root>
    </PrimaryCard>
  )
}
