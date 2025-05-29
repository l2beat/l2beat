import type { Field } from '../../store/State'

export function groupByPath(fields: Field[]) {
  const grouped: Record<string, Field[]> = {}
  for (const field of fields) {
    const parts = field.name.split('.')
    const groupingPath = parts.slice(0, -1).join('.')
    if (!grouped[groupingPath]) grouped[groupingPath] = []
    grouped[groupingPath].push(field)
  }
  return grouped
}

export type SimpleField = {
  type: 'simple'
  property: string
  fullKey: string
}

export interface ComplexField {
  type: 'complex'
  property: string
  value: (SimpleField | ComplexField)[]
}

export type ExpandedField = SimpleField | ComplexField

export function buildFieldTree(
  fields: Field[],
  staringPath?: string,
): ExpandedField[] {
  const [simpleFields, complexFields] = partition(fields, isSimpleField)

  const simple: SimpleField[] = simpleFields.map((field) => ({
    type: 'simple',
    property: field.name,
    fullKey: normalizePath(staringPath, field.name),
  }))

  const grouped = groupByFirstKey(complexFields)

  const complex: ComplexField[] = Object.entries(grouped).map(
    ([key, group]) => {
      const fullKey = normalizePath(staringPath, key)
      return {
        type: 'complex',
        property: key,
        value: buildFieldTree(group, fullKey),
      }
    },
  )

  return [...simple, ...complex]
}

function partition<T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] {
  const a: T[] = []
  const b: T[] = []
  for (const item of array) {
    predicate(item) ? a.push(item) : b.push(item)
  }
  return [a, b]
}

function groupByFirstKey(fields: Field[]): Record<string, Field[]> {
  const result: Record<string, Field[]> = {}
  for (const field of fields) {
    const parts = field.name.split('.')
    const first = parts[0] || ''
    const rest = parts.slice(1)

    let baseName = first
    let indexPart = ''

    // Extract the first array index if present
    const arrayMatch = first.match(/^(.+?)\[(\d+)\](.*)$/)
    if (arrayMatch) {
      baseName = arrayMatch[1] ?? '' // The part before the first [
      indexPart = arrayMatch[2] ?? '' // The number inside the first []
      const remainingArrayPart = arrayMatch[3] ?? '' // Any remaining array indices like [1][2]

      // Reconstruct new field name with remaining array part and dot-separated parts
      let newName = indexPart + remainingArrayPart
      if (rest.length > 0) {
        newName = newName ? `${newName}.${rest.join('.')}` : rest.join('.')
      }

      const newField: Field = {
        ...field,
        name: newName,
      }

      if (!result[baseName]) result[baseName] = []
      result[baseName]?.push(newField)
    } else {
      // No array notation, handle as before
      let newName = ''
      if (rest.length > 0) {
        newName = rest.join('.')
      }

      const newField: Field = {
        ...field,
        name: newName,
      }

      if (!result[first]) result[first] = []
      result[first]?.push(newField)
    }
  }
  return result
}

function normalizePath(base: string | undefined, part: string): string {
  if (!base) return part
  // If part is just a number, it's an array index and should be wrapped in brackets
  if (/^\d+$/.test(part)) {
    return `${base}[${part}]`
  }
  // Omit dot when appending array indices that already have brackets
  return part.startsWith('[') ? `${base}${part}` : `${base}.${part}`
}

function isSimpleField(field: Field): boolean {
  return !field.name.includes('.') && !field.name.includes('[')
}
