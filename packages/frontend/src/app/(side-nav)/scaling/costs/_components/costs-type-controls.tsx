import { RadioGroup, RadioGroupItem } from '~/components/core/radio-group'

interface Props<T extends string> {
  value: T
  onValueChange: (value: T) => void
}

export function CostsMetricControls<T extends string>({
  value,
  onValueChange,
}: Props<T>) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onValueChange}
      variant="highlighted"
    >
      <RadioGroupItem value="total">TOTAL</RadioGroupItem>
      <RadioGroupItem value="per-l2-tx">PER L2 TX</RadioGroupItem>
    </RadioGroup>
  )
}
