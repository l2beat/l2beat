import type { Field } from '../../store/State'

export type GroupedFields = Record<string, Field[]>

export function groupTopLevelArray(fields: Field[]): GroupedFields {
  const grouped: GroupedFields = {}

  fields.forEach((field) => {
    const arrayMatch = field.name.match(/^([^.\[]+)(?:\[(\d+)\])?(.*)$/)

    if (arrayMatch) {
      // biome-ignore lint/style/noNonNullAssertion: must be there
      const key = arrayMatch[1]!
      if (!grouped[key]) {
        grouped[key] = []
      }
      grouped[key].push(field)
    }
  })

  return grouped
}
