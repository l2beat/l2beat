import { config as dotenv } from 'dotenv'

export function getEnv(overrides?: Record<string, string | undefined>): Env {
  dotenv()
  return new Env({ ...process.env, ...overrides })
}

export class Env {
  constructor(private readonly env: Record<string, string | undefined>) {}

  private resolve(
    key: string | string[],
  ): { value: string; key: string } | undefined {
    if (Array.isArray(key)) {
      for (const k of key) {
        const value = this.env[k]
        if (value !== undefined) {
          return { value, key: k }
        }
      }
      return undefined
    }
    const value = this.env[key]
    return value !== undefined ? { value, key } : value
  }

  static key(...inputs: string[]): string {
    return inputs.join('_').replace(/-/g, '').toUpperCase()
  }

  string(key: string | string[], fallback?: string): string {
    const value = this.optionalString(key)
    if (value !== undefined) {
      return value
    }
    if (fallback !== undefined) {
      return fallback
    }
    throwMissingEnvVar(key)
  }

  optionalString(key: string | string[]): string | undefined {
    return this.resolve(key)?.value
  }

  integer(key: string | string[], fallback?: number): number {
    const value = this.optionalInteger(key)
    if (value !== undefined) {
      return value
    }
    if (fallback !== undefined) {
      return fallback
    }
    throwMissingEnvVar(key)
  }

  optionalInteger(key: string | string[]): number | undefined {
    const resolved = this.resolve(key)
    if (resolved) {
      const result = Number.parseInt(resolved.value)
      if (result.toString() === resolved.value) {
        return result
      }
      throw new Error(`Environment variable ${resolved.key} is not an integer!`)
    }
  }

  boolean(key: string | string[], fallback?: boolean): boolean {
    const value = this.optionalBoolean(key)
    if (value !== undefined) {
      return value
    }
    if (fallback !== undefined) {
      return fallback
    }
    throwMissingEnvVar(key)
  }

  optionalBoolean(key: string | string[]): boolean | undefined {
    const resolved = this.resolve(key)
    if (resolved) {
      const lowerCased = resolved.value.toLowerCase()

      const trueValues = ['true', 'yes', '1']
      const falseValues = ['false', 'no', '0']

      if (trueValues.includes(lowerCased)) return true
      if (falseValues.includes(lowerCased)) return false

      throw new Error(
        `Environment variable ${resolved.key} is not a boolean value!`,
      )
    }
  }
}

function throwMissingEnvVar(keys: string | string[]): never {
  if (Array.isArray(keys)) {
    throw new Error(
      `Missing at least one required environment variable. Please provide one of the following: ${keys.join(
        ', ',
      )}`,
    )
  }
  throw new Error(`Missing environment variable: ${keys}`)
}
