import { RadioGroup, RadioGroupItem } from '~/components/core/radio-group'

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
      value={value}
      onValueChange={onValueChange}
      variant="highlighted"
      className={className}
    >
      <RadioGroupItem value="total">TOTAL</RadioGroupItem>
      <RadioGroupItem value="per-l2-tx">PER L2 TX</RadioGroupItem>
    </RadioGroup>
  )
}
