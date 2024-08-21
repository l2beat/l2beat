import { RadioGroup, RadioGroupItem } from '~/app/_components/radio-group'
import { Skeleton } from '~/app/_components/skeleton'
import { useIsClient } from '~/hooks/use-is-client'

export function TvlChartUnitAndScaleControls({
  unit,
  scale,
  setUnit,
  setScale,
}: {
  unit: string
  scale: string
  setUnit: (value: 'usd' | 'eth') => void
  setScale: (value: string) => void
}) {
  const isClient = useIsClient()

  if (!isClient) {
    return (
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-8 w-[104.82px]" />
        <Skeleton className="h-8 w-[98.63px]" />
      </div>
    )
  }
  return (
    <div className="flex items-center justify-between gap-2">
      <RadioGroup value={unit} onValueChange={setUnit}>
        <RadioGroupItem value="usd">USD</RadioGroupItem>
        <RadioGroupItem value="eth">ETH</RadioGroupItem>
      </RadioGroup>
      <RadioGroup value={scale} onValueChange={setScale}>
        <RadioGroupItem value="log">LOG</RadioGroupItem>
        <RadioGroupItem value="lin">LIN</RadioGroupItem>
      </RadioGroup>
    </div>
  )
}
