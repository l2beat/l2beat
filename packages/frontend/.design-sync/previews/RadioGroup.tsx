import { RadioGroup, RadioGroupItem } from '@l2beat/frontend'

export function Default() {
  return (
    <RadioGroup name="chart-range" defaultValue="30d">
      <RadioGroupItem value="7d">7D</RadioGroupItem>
      <RadioGroupItem value="30d">30D</RadioGroupItem>
      <RadioGroupItem value="90d">90D</RadioGroupItem>
      <RadioGroupItem value="1y">1Y</RadioGroupItem>
      <RadioGroupItem value="max">MAX</RadioGroupItem>
    </RadioGroup>
  )
}

export function Highlighted() {
  return (
    <RadioGroup name="unit" variant="highlighted" defaultValue="usd">
      <RadioGroupItem value="usd">USD</RadioGroupItem>
      <RadioGroupItem value="eth">ETH</RadioGroupItem>
    </RadioGroup>
  )
}

export function WithDisabled() {
  return (
    <RadioGroup name="scale" defaultValue="linear">
      <RadioGroupItem value="linear">Linear</RadioGroupItem>
      <RadioGroupItem value="log">Log</RadioGroupItem>
      <RadioGroupItem value="stacked" disabled>
        Stacked
      </RadioGroupItem>
    </RadioGroup>
  )
}
