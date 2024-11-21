import { RadioGroup, RadioGroupItem } from '~/components/core/radio-group'

interface Props<T extends string> {
  value: T
  onValueChange: (value: T) => void
}

export function ActivityMetricControls<T extends string>({
  value,
  onValueChange,
}: Props<T>) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onValueChange}
      variant="highlighted"
    >
      <RadioGroupItem value="uops" className="px-[6px] text-sm md:text-lg">
        UOPS
      </RadioGroupItem>
      <RadioGroupItem value="tps" className="px-[6px] text-sm md:text-lg">
        TPS
      </RadioGroupItem>
    </RadioGroup>
  )
}
