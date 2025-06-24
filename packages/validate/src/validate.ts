export type Result<T> =
  | { success: true; data: T }
  | { success: false; path: string; message: string; data?: never }

type Infer<T> = T extends Parser<infer U> ? U : never

export interface Parser<T> {
  parse: (value: unknown) => T
  safeParse: (value: unknown) => Result<T>
  check<U extends T>(
    predicate: (value: T) => value is U,
    message?: string,
  ): Parser<U>
  check(predicate: (value: T) => boolean | string, message?: string): Parser<T>
  transform: <U>(transformer: (value: T) => U) => Parser<U>
  default(
    value: Exclude<T, null | undefined>,
  ): Parser<Exclude<T, null | undefined>>
  catch(value: T): Parser<T>
  optional(): OptionalParser<T | undefined>
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
  default(
    value: Exclude<T, null | undefined>,
  ): Parser<Exclude<T, null | undefined>>
  catch(value: T): Parser<T>
  optional(): OptionalValidator<T | undefined>
}

export interface OptionalValidator<T> extends Validator<T> {
  isOptional: true
}

const CANNOT_VALIDATE = () => {
  throw new Error('Cannot call validate on a parser object.')
}

export type ImpMeta =
  | { type: 'unknown' }
  | { type: 'string' }
  | { type: 'number' }
  | { type: 'bigint' }
  | { type: 'undefined' }
  | { type: 'null' }
  | { type: 'boolean' }
  | { type: 'enum'; values: unknown[] }
  | { type: 'object'; schema: Record<string, Imp<unknown>>; strict: boolean }
  | { type: 'literal'; value: unknown }
  | { type: 'array'; element: Imp<unknown> }
  | { type: 'union'; values: Imp<unknown>[] }
  | { type: 'optional'; parent: Imp<unknown> }
  | { type: 'record'; key: Imp<unknown>; value: Imp<unknown> }
  | { type: 'default'; value: unknown; parent: Imp<unknown> }
  | { type: 'catch'; value: unknown; parent: Imp<unknown> }
  | {
      type: 'check'
      // biome-ignore lint/suspicious/noExplicitAny: We need it here
      predicate: (value: any) => boolean | string
      parent: Imp<unknown>
    }
  | {
      type: 'transform'
      // biome-ignore lint/suspicious/noExplicitAny: We need it here
      transformer: (value: any) => any
      parent: Imp<unknown>
    }
  | { type: 'lazy'; make: () => Imp<unknown> }
  | { type: 'tuple'; schema: Imp<unknown>[] }

export class Imp<T> implements Validator<T>, Parser<T> {
  meta: ImpMeta
  safeValidate: (value: unknown) => Result<T>
  safeParse: (value: unknown) => Result<T>
  isOptional = false

  constructor(
    meta: ImpMeta,
    safeValidate: (value: unknown) => Result<T>,
    safeParse: (value: unknown) => Result<T>,
  ) {
    this.meta = meta
    this.safeValidate = safeValidate
    this.safeParse = safeParse
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
    return new Imp(
      { type: 'check', predicate, parent: this },
      svpCheck(predicate, this.safeValidate, message),
      svpCheck(predicate, this.safeParse, message),
    )
  }

  transform<U>(transformer: (value: T) => U): Parser<U> {
    return new Imp(
      { type: 'transform', transformer, parent: this },
      CANNOT_VALIDATE,
      spTransform(this.safeParse, transformer),
    )
  }

  default(
    value: Exclude<T, null | undefined>,
  ): Parser<Exclude<T, null | undefined>> {
    return new Imp(
      { type: 'default', value, parent: this },
      CANNOT_VALIDATE,
      spDefault(this.safeParse, value),
    )
  }

  catch(value: T): Parser<T> {
    return new Imp(
      { type: 'catch', value, parent: this },
      CANNOT_VALIDATE,
      spCatch(this.safeParse, value),
    )
  }

  optional(): OptionalValidator<T | undefined> {
    const imp = new Imp(
      { type: 'optional', parent: this },
      svpOptional(this.safeValidate),
      svpOptional(this.safeParse),
    )
    imp.isOptional = true
    return imp as OptionalValidator<T>
  }
}

function svpCheck<T>(
  predicate: (value: T) => string | boolean,
  parseOrValidate: (value: unknown) => Result<T>,
  message: string | undefined,
) {
  return function svpCheck(value: unknown): Result<T> {
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

function spTransform<T, U>(
  safeParse: (value: unknown) => Result<T>,
  transformer: (value: T) => U,
) {
  return function spTransform(value: unknown): Result<U> {
    const result = safeParse(value)
    if (!result.success) return result
    try {
      return { success: true, data: transformer(result.data) }
    } catch (e) {
      const message = e instanceof Error ? e.message : `${e}`
      return { success: false, path: '', message }
    }
  }
}

function spDefault<T, U>(
  safeParse: (value: unknown) => Result<T>,
  fallback: U,
) {
  return function spDefault(
    value: unknown,
  ): Result<Exclude<T, null | undefined> | U> {
    if (value === null || value === undefined) {
      return { success: true, data: structuredClone(fallback) }
    }
    const result = safeParse(value)
    if (result.success && (result.data === null || result.data === undefined)) {
      return { success: true, data: structuredClone(fallback) }
    }
    return result as Result<Exclude<T, null | undefined>>
  }
}

function spCatch<T, U>(safeParse: (value: unknown) => Result<T>, fallback: U) {
  return function spCatch(value: unknown): Result<T | U> {
    const result = safeParse(value)
    if (!result.success) {
      return { success: true, data: structuredClone(fallback) }
    }
    return result
  }
}

function svpOptional<T>(safeParse: (value: unknown) => Result<T>) {
  return function svpOptional(value: unknown): Result<T | undefined> {
    if (value === undefined) {
      return { success: true, data: undefined }
    }
    return safeParse(value)
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
  return new Imp({ type: 'string' }, svString, svString)
}

function svNumber(value: unknown): Result<number> {
  return typeof value === 'number'
    ? { success: true, data: value }
    : failType('number', value)
}

function number(): Validator<number> {
  return new Imp({ type: 'number' }, svNumber, svNumber)
}

function svBoolean(value: unknown): Result<boolean> {
  return typeof value === 'boolean'
    ? { success: true, data: value }
    : failType('boolean', value)
}

function boolean(): Validator<boolean> {
  return new Imp({ type: 'boolean' }, svBoolean, svBoolean)
}

function svBigint(value: unknown): Result<bigint> {
  return typeof value === 'bigint'
    ? { success: true, data: value }
    : failType('bigint', value)
}

function bigint(): Validator<bigint> {
  return new Imp({ type: 'bigint' }, svBigint, svBigint)
}

function svNull(value: unknown): Result<null> {
  return value === null
    ? { success: true, data: value }
    : failType('null', value)
}

function _null(): Validator<null> {
  return new Imp({ type: 'null' }, svNull, svNull)
}

function svUndefined(value: unknown): Result<undefined> {
  return value === undefined
    ? { success: true, data: value }
    : failType('undefined', value)
}

function _undefined(): Validator<undefined> {
  return new Imp({ type: 'undefined' }, svUndefined, svUndefined)
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
      const validator = schema[key] as Imp<unknown>
      const prop = (value as { [record: string]: unknown })[key]
      if (prop === undefined) {
        if (validator.isOptional) {
          continue
        }
        if (
          validator.meta.type === 'default' ||
          validator.meta.type === 'catch'
        ) {
          result[key] = structuredClone(validator.meta.value)
          continue
        }
      }
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
function object<T extends object>(schema: T): Imp<Object<T>> {
  return new Imp(
    {
      type: 'object',
      strict: false,
      schema: schema as Record<string, Imp<unknown>>,
    },
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
function strictObject<T extends object>(schema: T): Imp<Object<T>> {
  return new Imp(
    {
      type: 'object',
      strict: true,
      schema: schema as Record<string, Imp<unknown>>,
    },
    svpObject(schema, false, true),
    svpObject(schema, true, true),
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

// @ts-ignore: This is correct
function array<T>(element: Validator<T>): Validator<T[]>
function array<T>(element: Parser<T>): Parser<T[]>
function array<T>(element: Imp<T>): Imp<T[]> {
  return new Imp(
    { type: 'array', element },
    svpArray(element, false),
    svpArray(element, true),
  )
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
  return new Imp(
    { type: 'literal', value },
    svpLiteral(value),
    svpLiteral(value),
  )
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
>(values: T): Validator<Infer<T[number]>>
function union<
  T extends [Parser<unknown>, Parser<unknown>, ...Parser<unknown>[]],
>(values: T): Parser<Infer<T[number]>>
function union<T extends [Imp<unknown>, Imp<unknown>, ...Imp<unknown>[]]>(
  values: T,
): Imp<Infer<T[number]>> {
  return new Imp(
    { type: 'union', values },
    svpUnion(values, false),
    svpUnion(values, true),
  )
}

function svpRecord<K extends string | number, V>(
  keyValidator: Validator<K>,
  valueValidator: Validator<V>,
  clone: boolean,
) {
  let enumKeys: (string | number)[] | undefined
  if (
    keyValidator instanceof Imp &&
    !(valueValidator instanceof Imp && valueValidator.isOptional) &&
    keyValidator.meta.type === 'enum'
  ) {
    enumKeys = keyValidator.meta.values as (string | number)[]
  }

  return function svpRecord(value: unknown): Result<Record<K, V>> {
    if (typeof value !== 'object' || value === null || Array.isArray(object)) {
      return failType('object', value)
    }
    const result = {} as Record<K, V>
    if (enumKeys) {
      for (const key of enumKeys) {
        if (!(key in value)) {
          const validator = valueValidator as Imp<V>
          if (
            validator.meta.type === 'default' ||
            validator.meta.type === 'catch'
          ) {
            result[key as K] = structuredClone(validator.meta.value as V)
            continue
          }
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

// @ts-ignore: This is correct
function record<K extends string | number, V>(
  key: Validator<K>,
  value: Validator<V>,
): Validator<Record<K, V>>
function record<K extends string | number, V>(
  key: Parser<K>,
  value: Parser<V>,
): Parser<Record<K, V>>
function record<K extends string | number, V>(
  key: Imp<K>,
  value: Imp<V>,
): Imp<Record<K, V>> {
  return new Imp(
    { type: 'record', key, value },
    svpRecord(key, value, false),
    svpRecord(key, value, true),
  )
}

function svEnum<T extends string | number>(values: readonly T[]) {
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

function _enum<const T extends string | number>(values: T[]): Validator<T> {
  const sv = svEnum(values)
  return new Imp({ type: 'enum', values }, sv, sv)
}

function svUnknown(value: unknown): Result<unknown> {
  return { success: true, data: value }
}

function unknown(): Validator<unknown> {
  return new Imp({ type: 'unknown' }, svUnknown, svUnknown)
}

type Tuple<T extends unknown[]> = T extends []
  ? []
  : T extends [infer X, ...infer XS]
    ? X extends OptionalParser<infer U>
      ? [U?, ...Tuple<XS>]
      : X extends Parser<infer U>
        ? [U, ...Tuple<XS>]
        : never
    : never

function svpTuple<T extends [] | [Validator<unknown>, ...Validator<unknown>[]]>(
  schema: T,
  clone: boolean,
) {
  let requiredLength = schema.length
  for (let i = schema.length - 1; i >= 0; i--) {
    const imp = schema[i] as Imp<unknown>
    if (
      imp.isOptional ||
      imp.meta.type === 'default' ||
      imp.meta.type === 'catch'
    ) {
      requiredLength--
    } else {
      break
    }
  }
  let defaultLength = schema.length
  for (let i = schema.length - 1; i >= 0; i--) {
    const imp = schema[i] as Imp<unknown>
    if (imp.isOptional) {
      defaultLength--
    } else {
      break
    }
  }

  return function svpTuple(value: unknown): Result<Tuple<T>> {
    if (!Array.isArray(value)) {
      return failType('array', value)
    }
    if (value.length < requiredLength || value.length > schema.length) {
      return {
        success: false,
        path: '',
        message: `Invalid array length, got ${value.length}.`,
      }
    }

    const arrayResult: unknown[] = []
    for (let i = 0; i < Math.max(value.length, defaultLength); i++) {
      // biome-ignore lint/style/noNonNullAssertion: It's there
      const validator = schema[i]! as Imp<unknown>
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
    return { success: true, data: (clone ? arrayResult : value) as Tuple<T> }
  }
}

function tuple<T extends [] | [Validator<unknown>, ...Validator<unknown>[]]>(
  schema: T,
): Validator<Tuple<T>>
function tuple<T extends [] | [Parser<unknown>, ...Parser<unknown>[]]>(
  schema: T,
): Parser<Tuple<T>>
function tuple<T extends [] | [Imp<unknown>, ...Imp<unknown>[]]>(
  schema: T,
): Imp<Tuple<T>> {
  return new Imp(
    { type: 'tuple', schema },
    svpTuple(schema, false),
    svpTuple(schema, true),
  )
}

// @ts-ignore: This is correct
function lazy<T>(make: () => Validator<T>): Validator<T>
function lazy<T>(make: () => Parser<T>): Parser<T>
function lazy<T>(make: () => Imp<T>): Imp<T> {
  let imp: Imp<T> | undefined
  return new Imp<T>(
    { type: 'lazy', make },
    (value) => {
      if (!imp) imp = make()
      return imp.safeValidate(value)
    },
    (value) => {
      if (!imp) imp = make()
      return imp.safeParse(value)
    },
  )
}

// @ts-ignore
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
  tuple,
  unknown,
  lazy,
}

// biome-ignore lint/style/noNamespace: Needed to mimick z.infer
export namespace v {
  export type infer<T> = Infer<T>
}
