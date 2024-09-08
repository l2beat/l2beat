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
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-[104.82px]" />
            <Skeleton className="h-8 w-[106px] max-lg:hidden" />
          </div>
          <Skeleton className="h-8 w-[98.63px]" />
        </div>
        <Skeleton className="h-8 w-[106px] lg:hidden" />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <RadioGroup value={unit} onValueChange={setUnit}>
            <RadioGroupItem value="usd">USD</RadioGroupItem>
            <RadioGroupItem value="eth">ETH</RadioGroupItem>
          </RadioGroup>
          <div className="max-lg:hidden">{children}</div>
        </div>
        <RadioGroup value={scale} onValueChange={setScale}>
          <RadioGroupItem value="log">LOG</RadioGroupItem>
          <RadioGroupItem value="lin">LIN</RadioGroupItem>
        </RadioGroup>
      </div>
      <div className="lg:hidden">{children}</div>
    </div>
  )
}
