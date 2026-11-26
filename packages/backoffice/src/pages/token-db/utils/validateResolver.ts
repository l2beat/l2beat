import { assert } from '@l2beat/shared-pure'
import type { ImpDefinition, Validator } from '@l2beat/validate'
import type { FieldErrors, FieldValues, Resolver } from 'react-hook-form'

export function validateResolver<Input extends FieldValues, Context, Output>(
  schema: Validator<Input> & { definition?: ImpDefinition },
): Resolver<Input, Context, Output | Input> {
  return (input) => {
    assert(schema.definition, 'Definition is required')

    const errors = getErrors(schema, input)
    if (errors.length > 0) {
      return {
        values: {},
        errors: Object.fromEntries(
          errors.map((err) => [
            err.key,
            { type: 'validation' as const, message: err.message },
          ]),
        ) as FieldErrors<Input>,
      }
    }

    return { values: input, errors: {} }
  }
}

function getErrors(
  schema: Validator<unknown> & { definition?: ImpDefinition },
  input: FieldValues | FieldValues[],
  keyPrefix?: string,
): { key: string; message: string }[] {
  assert(schema.definition, 'Definition is required')
  const result = schema.safeValidate(input)
  if (result.success) {
    return []
  }

  const innerSchema = unwrapSchema(schema)
  assert(innerSchema.definition, 'Definition is required')

  if (
    innerSchema.definition.type === 'object' &&
    isObject(input) &&
    result.path
  ) {
    const errors: { key: string; message: string }[] = []
    const objectInput = input as FieldValues

    for (const key in innerSchema.definition.schema) {
      const keySchema = innerSchema.definition.schema[key]
      assert(keySchema, 'Key schema is required')
      const err = getErrors(
        keySchema,
        objectInput[key],
        keyPrefix ? `${keyPrefix}.${key}` : key,
      )
      errors.push(...err)
    }

    if (errors.length > 0) {
      return errors
    }
  }

  if (
    innerSchema.definition.type === 'array' &&
    isArray(input) &&
    result.path
  ) {
    const errors: { key: string; message: string }[] = []

    for (const [index, item] of Object.entries(input)) {
      const itemSchema = innerSchema.definition.element
      const err = getErrors(
        itemSchema,
        item,
        keyPrefix ? `${keyPrefix}.${index}` : index,
      )
      errors.push(...err)
    }

    if (errors.length > 0) {
      return errors
    }
  }

  return createErrors(result, keyPrefix)
}

function isArray(input: unknown): input is FieldValues[] {
  return Array.isArray(input)
}

function isObject(input: unknown): input is FieldValues {
  return typeof input === 'object' && input !== null && !isArray(input)
}

function unwrapSchema(
  schema: Validator<unknown> & { definition?: ImpDefinition },
): Validator<unknown> & { definition?: ImpDefinition } {
  assert(schema.definition, 'Definition is required')

  switch (schema.definition.type) {
    case 'optional':
    case 'default':
    case 'catch':
    case 'check':
    case 'transform':
      return unwrapSchema(schema.definition.parent)
    case 'lazy':
      return unwrapSchema(schema.definition.get())
    default:
      return schema
  }
}

function createErrors(
  result: { path: string; message: string },
  keyPrefix?: string,
): { key: string; message: string }[] {
  const key = toErrorKey(keyPrefix, result.path)
  if (!key) {
    return []
  }

  return [{ key, message: result.message }]
}

function toErrorKey(keyPrefix?: string, resultPath = ''): string | undefined {
  const normalizedPath = resultPath
    .replace(/\[(\d+)\]/g, '.$1')
    .replace(/^\./, '')

  if (keyPrefix && normalizedPath) {
    return `${keyPrefix}.${normalizedPath}`
  }

  if (keyPrefix) {
    return keyPrefix
  }

  return normalizedPath || undefined
}
