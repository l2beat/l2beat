import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'

interface Props<T extends string> {
  value: T
  onValueChange: (value: T) => void
  className?: string
}

export function CostsMetricControls<T extends string>({
  value,
  onValueChange,
  className,
}: Props<T>) {
  return (
    <RadioGroup
      name="costsMetric"
      value={value}
      onValueChange={onValueChange}
      variant="highlighted"
      className={className}
    >
      <RadioGroupItem value="per-l2-uop">PER L2 USER OP</RadioGroupItem>
      <RadioGroupItem value="total">TOTAL</RadioGroupItem>
    </RadioGroup>
  )
}
