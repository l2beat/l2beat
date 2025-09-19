import type { RosetteValue } from '../types'

export function PizzaElementLink({
  elementValue,
  children,
  disableSectionLinking,
}: {
  elementValue: RosetteValue
  children: React.ReactNode
  disableSectionLinking?: boolean
}) {
  if (disableSectionLinking || !elementValue.href) return children

  return <a href={elementValue.href}>{children}</a>
}
