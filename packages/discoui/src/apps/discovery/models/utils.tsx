import type { Field, FieldValue } from '../../../api/types'

export function interpolateWithFields(
  content: string | undefined,
  address: string,
  fields: Field[],
): string | undefined {
  if (content === undefined) {
    return undefined
  }

  if (fields.length === 0) {
    return content
  }

  return content.replace(/\{\{\s*((\$\.?)?\w+)\s*\}\}/g, (_match, key) => {
    const value =
      key === '$.address'
        ? address
        : stringifyFieldValue(fields.find((field) => field.name === key)?.value)

    if (value === undefined) {
      return `{{ ${key} }}`
    }

    return String(value)
  })
}

// Tries its best to mimic the behavior of the discovery
function stringifyFieldValue(value: FieldValue | undefined): string {
  if (value === undefined) {
    return '<<field not found>>'
  }

  if (value.type === 'string') {
    return value.value
  }
  if (value.type === 'number') {
    return value.value
  }
  if (value.type === 'boolean') {
    return value.value.toString()
  }
  if (value.type === 'address') {
    return value.address
  }
  if (value.type === 'hex') {
    return value.value
  }
  if (value.type === 'array') {
    return value.values.map((value) => stringifyFieldValue(value)).join(', ')
  }

  // obj, empty, unknown, error
  return '<<unsupported_value>>'
}
