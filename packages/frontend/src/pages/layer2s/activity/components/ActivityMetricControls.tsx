import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { cn } from '~/utils/cn'

interface Props<T extends string> {
  value: T
  onValueChange: (value: T) => void
  projectChart?: boolean
  className?: string
}

export function ActivityMetricControls<T extends string>({
  value,
  onValueChange,
  projectChart,
  className,
}: Props<T>) {
  return (
    <RadioGroup
      name="activityMetric"
      value={value}
      onValueChange={onValueChange}
      // Project charts use the plain switch, like LOG/LIN and the range.
      variant={projectChart ? undefined : 'highlighted'}
      className={className}
    >
      <MetricSwitchElement metric="uops" projectChart={projectChart} />
      <MetricSwitchElement metric="tps" projectChart={projectChart} />
    </RadioGroup>
  )
}

function MetricSwitchElement({
  metric,
  projectChart,
}: {
  metric: 'uops' | 'tps'
  projectChart?: boolean
}) {
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
