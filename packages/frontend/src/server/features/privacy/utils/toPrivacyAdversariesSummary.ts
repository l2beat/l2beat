import type { PrivacyField, ProjectPrivacyAdversaries } from '@l2beat/config'
import type { PrivacyAdversariesSummary } from '../types'

export function toPrivacyAdversariesSummary(
  adversaries: ProjectPrivacyAdversaries,
): PrivacyAdversariesSummary {
  const field = (id: PrivacyField) =>
    adversaries.fields.find((f) => f.id === id)
  return {
    promise: adversaries.promise,
    promiseLabel:
      field(adversaries.promise.protects)?.promiseLabel ??
      adversaries.promise.protects,
    promiseSubject:
      field(adversaries.promise.protects)?.subject ??
      adversaries.promise.protects,
    cells: adversaries.adversaries.map((adversary) => {
      const cell = adversaries.cells[adversary.id]
      return {
        id: adversary.id,
        label: adversary.label,
        description: adversary.description,
        value: cell.value,
        sentiment: cell.sentiment,
        exposure: cell.exposure,
        alsoExposed: cell.alsoExposed.map((item) => ({
          ...item,
          label: field(item.field)?.label ?? item.field,
        })),
      }
    }),
  }
}
