import type {
  ScalingProjectRisk,
  ScalingProjectRiskCategory,
} from '@l2beat/config'

export function groupRisks(
  risks: (ScalingProjectRisk & { referencedId: string })[],
) {
  const categories: ScalingProjectRiskCategory[] = [
    'Funds can be stolen if',
    'Funds can be lost if',
    'Funds can be frozen if',
    'Users can be censored if',
    'MEV can be extracted if',
    'Withdrawals can be delayed if',
  ]

  let nextStart = 1
  return categories
    .map((name) => {
      const start = nextStart
      const items = risks
        .filter((x) => x.category === name)
        .map((x, i, a) => ({
          text: i !== a.length - 1 ? x.text.slice(0, -1) + ',' : x.text,
          referencedId: x.referencedId,
          isCritical: !!x.isCritical,
        }))
      nextStart += items.length
      return { start, name, items }
    })
    .filter((x) => x.items.length > 0)
}
