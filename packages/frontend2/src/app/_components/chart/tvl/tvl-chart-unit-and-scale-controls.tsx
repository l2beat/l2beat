import { type ReactNode } from 'react'
import { RadioGroup, RadioGroupItem } from '~/app/_components/radio-group'
import { Skeleton } from '~/app/_components/skeleton'
import { useIsClient } from '~/hooks/use-is-client'
import { type ChartScale, type ChartUnit } from '../types'

interface Props {
  unit: ChartUnit
  scale: ChartScale
  setUnit: (value: ChartUnit) => void
  setScale: (value: ChartScale) => void
  children?: ReactNode
}

export function TvlChartUnitAndScaleControls({
  unit,
  scale,
  setUnit,
  setScale,
  children,
}: Props) {
  const isClient = useIsClient()

  if (!isClient) {
    return (
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-8 w-[104.82px]" />
        <Skeleton className="h-8 w-[98.63px]" />
      </div>
    )
  }

  const unitControls = (
    <RadioGroup value={unit} onValueChange={setUnit}>
      <RadioGroupItem value="usd">USD</RadioGroupItem>
      <RadioGroupItem value="eth">ETH</RadioGroupItem>
    </RadioGroup>
  )

  return (
    <div className="flex items-center justify-between gap-2">
      {children ? (
        <div className="mr-4 flex items-center gap-x-4 gap-y-2">
          {unitControls}
          {children}
        </div>
      ) : (
        unitControls
      )}
      <RadioGroup value={scale} onValueChange={setScale}>
        <RadioGroupItem value="log">LOG</RadioGroupItem>
        <RadioGroupItem value="lin">LIN</RadioGroupItem>
      </RadioGroup>
    </div>
  )
}
