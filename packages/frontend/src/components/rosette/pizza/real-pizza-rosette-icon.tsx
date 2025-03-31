import { assert } from '@l2beat/shared-pure'
import { useRef } from 'react'
import { useEventListener } from '~/hooks/use-event-listener'
import { useOnClickOutside } from '~/hooks/use-on-click-outside'
import { useRosetteTooltipContext } from '../rosette-tooltip-context'
import type { RosetteValue } from '../types'
import { Background } from './real-elements/background'
import { risksToPizzas } from './real-elements/masks'

interface Props {
  values: RosetteValue[]
  isUnderReview?: boolean
  className?: string
  background?: 'header' | 'surface' | false
}

export function RealPizzaRosetteIcon({
  values,
  className,
  // To pass to the elements
  isUnderReview: _,
  // To pass to the elements
  background: __,
}: Props) {
  const context = useRosetteTooltipContext()
  const svgRef = useRef(null)

  const [first, second, third, fourth, fifth] = values
  const setSelectedRisk = context?.setSelectedRisk
  const selectedRisk = context?.selectedRisk

  useOnClickOutside(svgRef, () => setSelectedRisk?.(undefined))
  useEventListener('scroll', () => setSelectedRisk?.(undefined))

  assert(first && second && third && fourth && fifth, 'Invalid number of risks')

  const selectRisk = (risk: RosetteValue) => {
    setSelectedRisk?.(risk)
  }

  const { pizzas, sliceHoverPaths } = risksToPizzas(
    values,
    selectRisk,
    selectedRisk,
  )

  return (
    <svg
      width="181"
      height="180"
      viewBox="0 0 181 180"
      fill="none"
      className={className}
      ref={svgRef}
      onMouseLeave={() => setSelectedRisk?.(undefined)}
    >
      <Background />
      {/* Keys warning? */}
      {pizzas.map((pizza, i) => (
        <g key={i}>{pizza}</g>
      ))}
      {sliceHoverPaths.map((sliceHoverPath, i) => (
        <g key={i}>{sliceHoverPath}</g>
      ))}
    </svg>
  )
}
