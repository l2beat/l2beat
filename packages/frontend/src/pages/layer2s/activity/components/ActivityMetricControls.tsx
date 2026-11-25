import type { ReactNode } from 'react'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'

interface Props<T extends string> {
  value: T
  onValueChange: (value: T) => void
  /** No longer changes the look; the compare page still passes it. */
  projectChart?: boolean
  className?: string
  /** Items for the values `T` has besides these two */
  children?: ReactNode
}

export function ActivityMetricControls<T extends string>({
  value,
  onValueChange,
  className,
  children,
}: Props<T>) {
  return (
    <RadioGroup
      name="activityMetric"
      value={value}
      onValueChange={onValueChange}
      variant="highlighted"
      className={className}
    >
      <RadioGroupItem value="uops">UOPS</RadioGroupItem>
      <RadioGroupItem value="tps">TPS</RadioGroupItem>
      {children}
    </RadioGroup>
  )
}
