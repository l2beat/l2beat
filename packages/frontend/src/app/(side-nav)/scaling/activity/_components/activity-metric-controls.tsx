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
    <RadioGroup value={value} onValueChange={onValueChange} variant="gradient">
      <RadioGroupItem
        value="uops"
        className="px-[6px] py-[2px] text-xl leading-5"
      >
        UOPS
      </RadioGroupItem>
      <RadioGroupItem
        value="tps"
        className="px-[6px] py-[2px] text-xl leading-5"
      >
        TPS
      </RadioGroupItem>
    </RadioGroup>
  )
}
