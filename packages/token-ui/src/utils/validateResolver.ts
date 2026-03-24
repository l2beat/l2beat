import { assert } from '@l2beat/shared-pure'
import type { Validator } from '@l2beat/validate'
import type { ImpMeta } from 'node_modules/@l2beat/validate/dist/esm/validate'
import type { FieldErrors, FieldValues, Resolver } from 'react-hook-form'

export function validateResolver<Input extends FieldValues, Context, Output>(
  schema: Validator<Input> & { meta?: ImpMeta },
): Resolver<Input, Context, Output | Input> {
  return (input) => {
    assert(schema.meta, 'Meta is required')

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
  schema: Validator<unknown> & { meta?: ImpMeta },
  input: FieldValues | FieldValues[],
  keyPrefix?: string,
): { key: string; message: string }[] {
  assert(schema.meta, 'Meta is required')
  const result = schema.safeValidate(input)
  if (result.success) {
    return []
  }

  const innerSchema = unwrapSchema(schema)
  assert(innerSchema.meta, 'Meta is required')

  if (innerSchema.meta.type === 'object' && isObject(input) && result.path) {
    const errors: { key: string; message: string }[] = []
    const objectInput = input as FieldValues

    for (const key in innerSchema.meta.schema) {
      const keySchema = innerSchema.meta.schema[key]
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

  if (innerSchema.meta.type === 'array' && isArray(input) && result.path) {
    const errors: { key: string; message: string }[] = []

    for (const [index, item] of Object.entries(input)) {
      const itemSchema = innerSchema.meta.element
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
  schema: Validator<unknown> & { meta?: ImpMeta },
): Validator<unknown> & { meta?: ImpMeta } {
  assert(schema.meta, 'Meta is required')

  switch (schema.meta.type) {
    case 'optional':
    case 'default':
    case 'catch':
    case 'check':
    case 'transform':
      return unwrapSchema(schema.meta.parent)
    case 'lazy':
      return unwrapSchema(schema.meta.get())
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
