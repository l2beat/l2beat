import type { ProjectPrivacyAdversaries } from '@l2beat/config'
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
  const { protects } = adversaries.promise
  return {
    promise: adversaries.promise,
    promiseLabel:
      adversaries.fields.find((f) => f.id === protects)?.promiseLabel ??
      protects,
    cells: adversaries.adversaries.map((adversary) => {
      const cell = adversaries.cells[adversary.id]
      return {
        id: adversary.id,
        label: adversary.label,
        value: cell.value,
        sentiment: cell.sentiment,
        reason: cell.exposureShort,
      }
    }),
  }
}
