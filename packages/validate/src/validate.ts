export type Result<T> =
  | { success: true; data: T }
  | { success: false; path: string; message: string }

type Infer<T> = T extends Parser<infer U> ? U : never

export interface Parser<T> {
  parse: (value: unknown) => T
  safeParse: (value: unknown) => Result<T>
  optional(): OptionalParser<T>
  check<U extends T>(
    predicate: (value: T) => value is U,
    message?: string,
  ): Parser<U>
  check(predicate: (value: T) => boolean | string, message?: string): Parser<T>
  // default<U>(value: U): Parser<T | U>
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
  check<U extends T>(
    predicate: (value: T) => value is U,
    message?: string,
  ): Validator<U>
  check(
    predicate: (value: T) => boolean | string,
    message?: string,
  ): Validator<T>
  transform: <U>(transformer: (value: T) => U) => Parser<U>
  optional(): OptionalValidator<T>
  // default<U>(value: U): Validator<T | U>
}

export interface OptionalValidator<T> extends Validator<T> {
  isOptional: true
}

class ParserImpl<T> implements Parser<T> {
  safeParse: (value: unknown) => Result<T>
  isOptional = false
  params: [string, unknown]

  constructor(
    safeParse: (value: unknown) => Result<T>,
    params: [string, unknown],
  ) {
    this.safeParse = safeParse
    this.params = params
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
    return new ParserImpl(check(predicate, this.safeParse, message), [
      'check',
      predicate,
    ])
  }

  optional(): OptionalParser<T> {
    const impl = new ParserImpl(this.safeParse, this.params)
    impl.isOptional = true
    return impl as OptionalParser<T>
  }
}

class ValidatorImpl<T> implements Validator<T> {
  safeValidate: (value: unknown) => Result<T>
  safeParse: (value: unknown) => Result<T>
  isOptional = false
  params: [string, unknown]

  constructor(
    safeValidate: (value: unknown) => Result<T>,
    safeParse: (value: unknown) => Result<T>,
    params: [string, unknown],
  ) {
    this.safeValidate = safeValidate
    this.safeParse = safeParse ?? safeValidate
    this.params = params
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
    return new ValidatorImpl(
      check(predicate, this.safeValidate, message),
      check(predicate, this.safeParse, message),
      ['check', predicate],
    )
  }

  transform<U>(transformer: (value: T) => U): Parser<U> {
    return new ParserImpl(
      (value: unknown): Result<U> => {
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
      },
      ['transform', transformer],
    )
  }

  optional(): OptionalValidator<T> {
    const impl = new ValidatorImpl(
      this.safeValidate,
      this.safeParse,
      this.params,
    )
    impl.isOptional = true
    return impl as OptionalValidator<T>
  }
}

function check<T>(
  predicate: (value: T) => string | boolean,
  parseOrValidate: Parser<T>['safeParse'],
  message: string | undefined,
) {
  return function check(value: unknown): Result<T> {
    const result = parseOrValidate(value)
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
  return new ValidatorImpl(svString, svString, ['string', undefined])
}

function svNumber(value: unknown): Result<number> {
  return typeof value === 'number'
    ? { success: true, data: value }
    : failType('number', value)
}

function number(): Validator<number> {
  return new ValidatorImpl(svNumber, svNumber, ['number', undefined])
}

function svBoolean(value: unknown): Result<boolean> {
  return typeof value === 'boolean'
    ? { success: true, data: value }
    : failType('boolean', value)
}

function boolean(): Validator<boolean> {
  return new ValidatorImpl(svBoolean, svBoolean, ['boolean', undefined])
}

function svBigint(value: unknown): Result<bigint> {
  return typeof value === 'bigint'
    ? { success: true, data: value }
    : failType('bigint', value)
}

function bigint(): Validator<bigint> {
  return new ValidatorImpl(svBigint, svBigint, ['bigint', undefined])
}

function svNull(value: unknown): Result<null> {
  return value === null
    ? { success: true, data: value }
    : failType('null', value)
}

function _null(): Validator<null> {
  return new ValidatorImpl(svNull, svNull, ['null', undefined])
}

function svUndefined(value: unknown): Result<undefined> {
  return value === undefined
    ? { success: true, data: value }
    : failType('undefined', value)
}

function _undefined(): Validator<undefined> {
  return new ValidatorImpl(svUndefined, svUndefined, ['undefined', undefined])
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
    const result = {} as Record<string, unknown>
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
        result[key] = res.data
      }
    }
    return { success: true, data: (clone ? result : value) as Object<T> }
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
    ['object', schema],
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
    ['strictObject', schema],
  )
}

function svpArray<T>(valueValidator: Validator<T>, clone: boolean) {
  return function svpArray(value: unknown): Result<T[]> {
    if (!Array.isArray(value)) {
      return failType('array', value)
    }
    const arrayResult: T[] = []
    for (let i = 0; i < value.length; i++) {
      const item = value[i]
      const res = clone
        ? valueValidator.safeParse(item)
        : valueValidator.safeValidate(item)
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
  return new ValidatorImpl(svpArray(element, false), svpArray(element, true), [
    'array',
    element,
  ])
}

function svpLiteral<T extends string | number | boolean | bigint>(
  valueValidator: T,
) {
  return function svpLiteral(value: unknown): Result<T> {
    if (value === valueValidator) {
      return { success: true, data: valueValidator }
    }
    return {
      success: false,
      path: '',
      message: `Expected exactly ${valueValidator}, got ${whatType(value)}.`,
    }
  }
}

function literal<T extends string | number | boolean | bigint>(
  value: T,
): Validator<T> {
  return new ValidatorImpl(svpLiteral(value), svpLiteral(value), [
    'literal',
    value,
  ])
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
      message: `None of the union variants matched, got ${whatType(value)}.`,
    }
  }
}

function union<
  T extends [Validator<unknown>, Validator<unknown>, ...Validator<unknown>[]],
>(elements: T): Validator<Infer<T[number]>>
function union<
  T extends [Parser<unknown>, Parser<unknown>, ...Parser<unknown>[]],
>(elements: T): Parser<Infer<T[number]>>
function union<
  T extends [Validator<unknown>, Validator<unknown>, ...Validator<unknown>[]],
>(elements: T): Validator<Infer<T[number]>> {
  return new ValidatorImpl(
    svpUnion(elements, false),
    svpUnion(elements, true),
    ['union', elements],
  )
}

function svpRecord<K extends string | number, V>(
  keyValidator: Validator<K>,
  valueValidator: Validator<V>,
  clone: boolean,
) {
  let enumKeys: (string | number)[] | undefined
  if (
    keyValidator instanceof ValidatorImpl &&
    !(valueValidator instanceof ValidatorImpl && valueValidator.isOptional) &&
    keyValidator.params[0] === 'enum'
  ) {
    enumKeys = keyValidator.params[1] as (string | number)[]
  }

  return function svpRecord(value: unknown): Result<Record<K, V>> {
    if (typeof value !== 'object' || value === null || Array.isArray(object)) {
      return failType('object', value)
    }
    const result = {} as Record<K, V>
    if (enumKeys) {
      for (const key of enumKeys) {
        if (!(key in value)) {
          return {
            success: false,
            path: '',
            message: `Enum key ${key} not found.`,
          }
        }
      }
    }
    for (const key in value) {
      const keyRes = clone
        ? keyValidator.safeParse(key)
        : keyValidator.safeValidate(key)
      if (!keyRes.success) {
        keyRes.path = `.${key}${keyRes.path}`
        return keyRes
      }

      const prop = (value as { [record: string]: unknown })[key]
      const propRes = clone
        ? valueValidator.safeParse(prop)
        : valueValidator.safeValidate(prop)
      if (!propRes.success) {
        propRes.path = `.${key}${propRes.path}`
        return propRes
      }

      if (clone) {
        result[keyRes.data] = propRes.data
      }
    }
    return { success: true, data: clone ? result : (value as Record<K, V>) }
  }
}

function record<K extends string | number, V>(
  key: Validator<K>,
  value: Validator<V>,
): Validator<Record<K, V>>
// @ts-ignore We allow this error for simplicity of use
function record<K extends string | number, V>(
  key: Parser<K>,
  value: Parser<V>,
): Parser<Record<K, V>>
function record<K extends string | number, V>(
  key: Validator<K>,
  value: Validator<V>,
): Validator<Record<K, V>> {
  return new ValidatorImpl(
    svpRecord(key, value, false),
    svpRecord(key, value, true),
    ['record', [key, value]],
  )
}

function svEnum<T extends string | number>(values: T[]) {
  return function svEnum(value: unknown): Result<T> {
    if (values.includes(value as T)) {
      return { success: true, data: value as T }
    }
    return {
      success: false,
      path: '',
      message: `None of the enum variants matched, got ${whatType(value)}.`,
    }
  }
}

function _enum<T extends string | number>(values: T[]): Validator<T> {
  const sv = svEnum(values)
  return new ValidatorImpl(sv, sv, ['enum', values])
}

function svUnknown(value: unknown): Result<unknown> {
  return { success: true, data: value }
}

function unknown(): Validator<unknown> {
  return new ValidatorImpl(svUnknown, svUnknown, ['unknown', undefined])
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
  record,
  enum: _enum,
  // tuple
  unknown,
}

// biome-ignore lint/style/noNamespace: Needed to mimick z.infer
export namespace v {
  export type infer<T> = Infer<T>
}
