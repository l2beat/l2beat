import { RadioGroup, RadioGroupItem } from '~/components/core/radio-group'
import { cn } from '~/utils/cn'

interface Props<T extends string> {
  value: T
  onValueChange: (value: T) => void
  projectChart?: boolean
}

export function ActivityMetricControls<T extends string>({
  value,
  onValueChange,
  projectChart,
}: Props<T>) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onValueChange}
      variant="highlighted"
    >
      <MetricSwitchElement metric="uops" projectChart={projectChart} />
      <MetricSwitchElement metric="tps" projectChart={projectChart} />
    </RadioGroup>
  )
}

function MetricSwitchElement({
  metric,
  projectChart,
}: { metric: 'uops' | 'tps'; projectChart?: boolean }) {
  return (
    <RadioGroupItem
      value={metric}
      className={cn(
        'h-full px-[6px] text-sm uppercase md:text-lg',
        projectChart && 'md:text-sm',
      )}
    >
      {metric}
    </RadioGroupItem>
  )
}
