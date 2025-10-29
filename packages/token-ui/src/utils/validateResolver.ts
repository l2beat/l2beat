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
  const errors: { key: string; message: string }[] = []
  assert(schema.meta, 'Meta is required')

  if (schema.meta.type === 'object') {
    for (const key in schema.meta.schema) {
      const keySchema = schema.meta.schema[key]
      assert(keySchema, 'Key schema is required')
      assert(!isArray(input), 'Input must be an object')
      const err = getErrors(
        keySchema,
        input[key],
        keyPrefix ? `${keyPrefix}.${key}` : key,
      )
      errors.push(...err)
    }
    return errors
  }

  if (schema.meta.type === 'array') {
    assert(isArray(input), 'Input must be an array')

    for (const [index, item] of Object.entries(input)) {
      const itemSchema = schema.meta.element
      const err = getErrors(
        itemSchema,
        item,
        keyPrefix ? `${keyPrefix}.${index}` : index,
      )
      errors.push(...err)
    }
    return errors
  }

  const result = schema.safeValidate(input)
  if (!result.success) {
    assert(keyPrefix, 'Key prefix is required')
    errors.push({
      key: keyPrefix,
      message: result.message,
    })
  }

  return errors
}

function isArray(input: unknown): input is FieldValues[] {
  return Array.isArray(input)
}
