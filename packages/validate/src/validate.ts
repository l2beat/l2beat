export type Result<T> =
  | { success: true; data: T }
  | { success: false; path: string; message: string }

type Infer<T> = T extends Parser<infer U> ? U : never

export interface Parser<T> {
  parse: (value: unknown) => T
  safeParse: (value: unknown) => Result<T>
  optional(): OptionalParser<T>
}

export interface OptionalParser<T> extends Parser<T> {
  isOptional: true
}

export interface Validator<T> {
  validate: (value: unknown) => T
  safeValidate: (value: unknown) => Result<T>
  isValid: (value: unknown) => value is T
  parse: (value: unknown) => T
  safeParse: (value: unknown) => Result<T>
  check: (
    predicate: (value: T) => boolean | string,
    message?: string,
  ) => Validator<T>
  transform: <U>(transformer: (value: T) => U) => Parser<U>
  optional(): OptionalValidator<T>
}

export interface OptionalValidator<T> extends Validator<T> {
  isOptional: true
}

class ParserImpl<T> implements Parser<T> {
  safeParse: (value: unknown) => Result<T>
  isOptional: boolean

  constructor(safeParse: (value: unknown) => Result<T>, isOptional = false) {
    this.safeParse = safeParse
    this.isOptional = isOptional
  }

  parse(value: unknown): T {
    const result = this.safeParse(value)
    if (result.success) {
      return result.data
    } else {
      throw new Error(`At ${result.path || '@'}: ${result.message}`)
    }
  }

  optional(): OptionalParser<T> {
    return new ParserImpl(this.safeParse, true) as OptionalParser<T>
  }
}

class ValidatorImpl<T> implements Validator<T> {
  safeValidate: (value: unknown) => Result<T>
  safeParse: (value: unknown) => Result<T>
  isOptional: boolean

  constructor(
    safeValidate: (value: unknown) => Result<T>,
    safeParse?: (value: unknown) => Result<T>,
    isOptional = false,
  ) {
    this.safeValidate = safeValidate
    this.safeParse = safeParse ?? safeValidate
    this.isOptional = isOptional
  }

  validate(value: unknown): T {
    const result = this.safeValidate(value)
    if (result.success) {
      return result.data
    } else {
      throw new Error(`At ${result.path || '@'}: ${result.message}`)
    }
  }

  isValid(value: unknown): value is T {
    return this.safeValidate(value).success
  }

  parse(value: unknown): T {
    const result = this.safeParse(value)
    if (result.success) {
      return result.data
    } else {
      throw new Error(`At ${result.path || '@'}: ${result.message}`)
    }
  }

  check(predicate: (value: T) => boolean | string, message?: string) {
    return new ValidatorImpl((value: unknown): Result<T> => {
      const result = this.safeParse(value)
      if (result.success) {
        const checkResult = predicate(result.data)
        if (typeof checkResult === 'string') {
          return { success: false, path: '', message: message ?? checkResult }
        }
        if (checkResult === false) {
          return {
            success: false,
            path: '',
            message: message ?? 'Check failed.',
          }
        }
      }
      return result
    })
  }

  transform<U>(transformer: (value: T) => U): Parser<U> {
    return new ParserImpl((value: unknown): Result<U> => {
      const result = this.safeParse(value)
      if (!result.success) {
        return result
      }
      try {
        return { success: true, data: transformer(result.data) }
      } catch (e) {
        const message = e instanceof Error ? e.message : `${e}`
        return { success: false, path: '', message }
      }
    })
  }

  optional(): OptionalValidator<T> {
    return new ValidatorImpl(
      this.safeValidate,
      this.safeParse,
      true,
    ) as OptionalValidator<T>
  }
}

function whatType(value: unknown) {
  let type: string = typeof value
  if (type === 'object') {
    if (value === null) {
      type = 'null'
    } else if (Array.isArray(type)) {
      type = 'array'
    } else {
      try {
        type = Object.getPrototypeOf(type).constructor.name
      } catch {}
    }
  }
  return type
}

function failType(
  expected: string,
  actual: unknown,
): { success: false; path: string; message: string } {
  return {
    success: false,
    path: '',
    message: `Expected ${expected}, got ${whatType(actual)}.`,
  }
}

function svString(value: unknown): Result<string> {
  return typeof value === 'string'
    ? { success: true, data: value }
    : failType('string', value)
}

function string(): Validator<string> {
  return new ValidatorImpl(svString)
}

function svNumber(value: unknown): Result<number> {
  return typeof value === 'number'
    ? { success: true, data: value }
    : failType('number', value)
}

function number(): Validator<number> {
  return new ValidatorImpl(svNumber)
}

function svBoolean(value: unknown): Result<boolean> {
  return typeof value === 'boolean'
    ? { success: true, data: value }
    : failType('boolean', value)
}

function boolean(): Validator<boolean> {
  return new ValidatorImpl(svBoolean)
}

function svBigint(value: unknown): Result<bigint> {
  return typeof value === 'bigint'
    ? { success: true, data: value }
    : failType('bigint', value)
}

function bigint(): Validator<bigint> {
  return new ValidatorImpl(svBigint)
}

function svNull(value: unknown): Result<null> {
  return value === null
    ? { success: true, data: value }
    : failType('null', value)
}

function _null(): Validator<null> {
  return new ValidatorImpl(svNull)
}

function svUndefined(value: unknown): Result<undefined> {
  return value === undefined
    ? { success: true, data: value }
    : failType('undefined', value)
}

function _undefined(): Validator<undefined> {
  return new ValidatorImpl(svUndefined)
}

type Simplify<T> = { [KeyType in keyof T]: T[KeyType] } & {}

type Object<T> = Simplify<
  {
    [K in keyof T as T[K] extends { isOptional: true }
      ? never
      : K]: T[K] extends Parser<infer U> ? U : never
  } & {
    [K in keyof T as T[K] extends { isOptional: true }
      ? K
      : never]?: T[K] extends Parser<infer U> ? U : never
  }
>

function svpObject<T extends object>(
  schema: T,
  clone: boolean,
  strict: boolean,
) {
  return function svpObject(value: unknown): Result<Object<T>> {
    if (typeof value !== 'object' || value === null || Array.isArray(object)) {
      return failType('object', value)
    }
    if (strict) {
      for (const key in object) {
        if (!(key in schema)) {
          return {
            success: false,
            path: `.${key}`,
            message: 'Strict violation, unexpected key found.',
          }
        }
      }
    }
    const objectResult: Record<string, unknown> = {}
    for (const key in schema) {
      const validator = schema[key] as ValidatorImpl<unknown>
      if (validator.isOptional && !(key in value)) {
        continue
      }
      const prop = (value as { [record: string]: unknown })[key]
      const res = clone
        ? validator.safeParse(prop)
        : validator.safeValidate(prop)
      if (res.success === false) {
        res.path = `.${key}${res.path}`
        return res
      }
      if (clone) {
        // biome-ignore lint/style/noNonNullAssertion: Safe because we check
        objectResult![key] = res.data
      }
    }
    return { success: true, data: (clone ? objectResult : value) as Object<T> }
  }
}

function object<T extends { [key: string]: Validator<unknown> }>(
  schema: T,
): Validator<Object<T>>
function object<T extends { [key: string]: Parser<unknown> }>(
  schema: T,
): Parser<Object<T>>
function object<T extends object>(schema: T): Parser<Object<T>> {
  return new ValidatorImpl(
    svpObject(schema, false, false),
    svpObject(schema, true, false),
  )
}

function strictObject<T extends { [key: string]: Validator<unknown> }>(
  schema: T,
): Validator<Object<T>>
function strictObject<T extends { [key: string]: Parser<unknown> }>(
  schema: T,
): Parser<Object<T>>
function strictObject<T extends object>(schema: T): Parser<Object<T>> {
  return new ValidatorImpl(
    svpObject(schema, false, true),
    svpObject(schema, true, true),
  )
}

function svpArray<T>(validator: Validator<T>, clone: boolean) {
  return function svpArray(value: unknown): Result<T[]> {
    if (!Array.isArray(value)) {
      return failType('array', value)
    }
    const arrayResult: T[] = []
    for (let i = 0; i < value.length; i++) {
      const item = value[i]
      const res = clone
        ? validator.safeParse(item)
        : validator.safeValidate(item)
      if (res.success === false) {
        res.path = `[${i}]${res.path}`
        return res
      }
      if (clone) {
        arrayResult.push(res.data)
      }
    }
    return { success: true, data: clone ? arrayResult : value }
  }
}

function array<T>(element: Validator<T>): Validator<T[]>
// @ts-ignore We allow this error for simplicity of use
function array<T>(element: Parser<T>): Parser<T[]>
function array<T>(element: Validator<T>): Validator<T[]> {
  return new ValidatorImpl(svpArray(element, false), svpArray(element, true))
}

function svpLiteral<T extends string | number | boolean | bigint>(value: T) {
  return function svpLiteral(_value: unknown): Result<T> {
    if (_value === value) {
      return { success: true, data: value }
    }
    return {
      success: false,
      path: '',
      message: `Expected exactly ${value}, got ${whatType(_value)}.`,
    }
  }
}

function literal<T extends string | number | boolean | bigint>(
  value: T,
): Validator<T> {
  return new ValidatorImpl(svpLiteral(value), svpLiteral(value))
}

function svpUnion<
  T extends [Validator<unknown>, Validator<unknown>, ...Validator<unknown>[]],
>(elements: T, clone: boolean) {
  return function svpUnion(value: unknown): Result<Infer<T[number]>> {
    for (const element of elements) {
      const result = clone
        ? element.safeParse(value)
        : element.safeValidate(value)
      if (result.success) {
        return result as Result<Infer<T[number]>>
      }
    }
    return {
      success: false,
      path: '',
      message: `None of the variants matched, got ${whatType(value)}.`,
    }
  }
}

function union<
  T extends [Validator<unknown>, Validator<unknown>, ...Validator<unknown>[]],
>(elements: T): Validator<Infer<T[number]>> {
  return new ValidatorImpl(svpUnion(elements, false), svpUnion(elements, true))
}

export const v = {
  string,
  number,
  boolean,
  bigint,
  null: _null,
  undefined: _undefined,
  object,
  strictObject,
  array,
  literal,
  union,
  // tuple
  // union
  // enum
  // record
}

// biome-ignore lint/style/noNamespace: Needed to mimick z.infer
export namespace v {
  export type infer<T> = Infer<T>
}
