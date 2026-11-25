import type { RosetteValue } from '../types'

export function PizzaElementLink({
  elementValue,
  children,
  disableSectionLinking,
  onFocus,
}: {
  elementValue: RosetteValue
  children: React.ReactNode
  disableSectionLinking?: boolean
  onFocus?: () => void
}) {
  if (disableSectionLinking || !elementValue.href) return children

  return (
    <a
      href={elementValue.href}
      aria-label={`${elementValue.name}: ${elementValue.value}`}
      onFocus={onFocus}
    >
      {children}
    </a>
  )
}
