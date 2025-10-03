import type { Validator } from '@l2beat/validate'
import type { FieldErrors, FieldValues, Resolver } from 'react-hook-form'

export function validateResolver<Input extends FieldValues, Context, Output>(
  schemasObj: {
    [K in keyof Input]: Validator<Input[K]>
  },
): Resolver<Input, Context, Output | Input> {
  return (input) => {
    const errors: Partial<
      Record<keyof Input, { type: 'validation'; message: string }>
    > = {}

    for (const key in schemasObj) {
      const schema = schemasObj[key]
      const result = schema.safeValidate(input[key])
      if (!result.success) {
        errors[key] = {
          type: 'validation' as const,
          message: result.message,
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      return {
        values: {},
        errors: errors as FieldErrors<Input>,
      }
    }

    return { values: input, errors: {} }
  }
}
