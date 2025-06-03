import type { ReactNode } from 'react'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { Skeleton } from '~/components/core/Skeleton'
import { useIsClient } from '~/hooks/useIsClient'
import type { ChartUnit } from '../types'

interface Props {
  unit: ChartUnit
  setUnit: (value: ChartUnit) => void
  children?: ReactNode
}

export function TvsChartUnitControls({ unit, setUnit, children }: Props) {
  const isClient = useIsClient()

  return (
    <div className="flex flex-wrap items-center gap-1">
      {isClient ? (
        <RadioGroup name="tvsChartUnit" value={unit} onValueChange={setUnit}>
          <RadioGroupItem value="usd">USD</RadioGroupItem>
          <RadioGroupItem value="eth">ETH</RadioGroupItem>
        </RadioGroup>
      ) : (
        <Skeleton className="h-8 w-[104.82px]" />
      )}
      {children && <div>{children}</div>}
    </div>
  )
}
