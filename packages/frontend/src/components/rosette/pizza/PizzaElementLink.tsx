import { describeRisks } from '../describeRisks'
import type { RosetteValue } from '../types'

export function PizzaElementLink({
  elementValue,
  children,
  disableSectionLinking,
  isUnderReview,
  label = describeRisks([elementValue], isUnderReview),
}: {
  elementValue: RosetteValue
  children: React.ReactNode
  disableSectionLinking?: boolean
  isUnderReview?: boolean
  label?: string
}) {
  if (disableSectionLinking || !elementValue.href) return children

  // Keyboard focus lands on the slice, not the SVG, so the slice carries its
  // own name rather than relying on the rosette's <desc>.
  return (
    <a href={elementValue.href} aria-label={label}>
      {children}
    </a>
  )
}
