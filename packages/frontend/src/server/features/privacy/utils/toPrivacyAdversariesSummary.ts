import type { PrivacyField, ProjectPrivacyAdversaries } from '@l2beat/config'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { PrivacyAdversariesSummary } from '../types'

/**
 * Derived from the section rather than stored on the entry, so the hydrated
 * page ships the cells only once.
 */
export function getPrivacyAdversariesSummary(
  sections: ProjectDetailsSection[],
): PrivacyAdversariesSummary {
  const section = sections.find(
    (section) => section.type === 'PrivacyAdversariesSection',
  )
  if (!section) {
    throw new Error('Privacy project without an adversaries section')
  }
  return toPrivacyAdversariesSummary(section.props.adversaries)
}

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
