import type { Result, Validator } from '@l2beat/validate'
import type { FieldErrors, FieldValues, Resolver } from 'react-hook-form'

export function l2beatResolver<Input extends FieldValues, Context, Output>(
  schema: Validator<Input>,
  schemaOptions?: object,
  resolverOptions: {
    mode?: 'async' | 'sync'
    raw?: boolean
  } = {},
): Resolver<Input, Context, Output | Input> {
  return (input) => {
    const result = schema.safeParse(input)
    if (!result.success) {
      return {
        values: {},
        errors: toError<Input>(result),
      }
    }
    return { values: result.data, errors: {} }
  }
}

function toError<Input extends FieldValues>(
  result: Extract<Result<Input>, { success: false }>,
): FieldErrors<Input> {
  // biome-ignore lint/style/noNonNullAssertion: We know that the path is not empty
  const path = result.path.split('.')[1]!
  return {
    [path]: {
      type: 'validation',
      message: result.message,
    },
  } as FieldErrors<Input>
}

type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

type X = Prettify<FieldErrors<FieldValues>>

export const x: X = {
  a: {
    type: 'validation',
  },
}
