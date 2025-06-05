export type Result<T> =
  | { success: true; data: T }
  | { success: false; path: string; error: string }

export interface Parser<T> {
  parse: (value: unknown) => T
  safeParse: (value: unknown) => Result<T>
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
  transform: <U>(transformer: (value: T) => Result<U>) => Parser<U>
}

class ParserImpl<T> implements Parser<T> {
  safeParse: (value: unknown) => Result<T>

  constructor(safeParse: (value: unknown) => Result<T>) {
    this.safeParse = safeParse
  }

  parse(value: unknown): T {
    const result = this.safeParse(value)
    if (result.success) {
      return result.data
    } else {
      throw new Error(result.error)
    }
  }
}

class ValidatorImpl<T> implements Validator<T> {
  safeValidate: (value: unknown) => Result<T>
  safeParse: (value: unknown) => Result<T>

  constructor(
    safeValidate: (value: unknown) => Result<T>,
    safeParse?: (value: unknown) => Result<T>,
  ) {
    this.safeValidate = safeValidate
    this.safeParse = safeParse ?? safeValidate
  }

  validate(value: unknown): T {
    const result = this.safeValidate(value)
    if (result.success) {
      return result.data
    } else {
      throw new Error(result.error)
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
      throw new Error(result.error)
    }
  }

  check(predicate: (value: T) => boolean | string, message?: string) {
    return new ValidatorImpl((value: unknown): Result<T> => {
      const result = this.safeParse(value)
      if (result.success) {
        const checkResult = predicate(result.data)
        if (typeof checkResult === 'string') {
          return { success: false, path: '', error: message ?? checkResult }
        }
        if (checkResult === false) {
          return { success: false, path: '', error: message ?? 'Check failed.' }
        }
      }
      return result
    })
  }

  transform<U>(transformer: (value: T) => Result<U>): Parser<U> {
    return new ParserImpl((value: unknown): Result<U> => {
      const result = this.safeParse(value)
      if (!result.success) {
        return result
      }
      return transformer(result.data)
    })
  }
}

function fail(error: string): { success: false; path: string; error: string } {
  return { success: false, path: '', error }
}

function failType(
  expected: string,
  actual: unknown,
): { success: false; path: string; error: string } {
  let t: string = typeof actual
  if (t === 'object') {
    if (actual === null) {
      t = 'null'
    } else if (Array.isArray(t)) {
      t = 'array'
    } else {
      try {
        t = Object.getPrototypeOf(t).constructor.name
      } catch {}
    }
  }
  return fail(`Expected ${expected}, got: ${t}`)
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

export const v = {
  string,
  number,
  boolean,
  bigint,
  null: _null,
  undefined: _undefined,
}
