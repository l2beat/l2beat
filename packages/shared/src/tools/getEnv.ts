export function getEnv(name: string, fallback?: string): string {
  const value = process.env[name]
  if (value !== undefined) {
    return value
  }
  if (fallback !== undefined) {
    return fallback
  }
  throw new Error(`Missing environment variable ${name}!`)
}

getEnv.optionalInteger = function optionalInteger(
  name: string,
): number | undefined {
  const value = process.env[name]
  if (value !== undefined) {
    const result = parseInt(value)
    if (result.toString() === value) {
      return result
    }
    throw new Error(`Environment variable ${name} is not an integer!`)
  }
}

getEnv.integer = function integer(name: string, fallback?: number): number {
  const value = getEnv.optionalInteger(name)
  if (value !== undefined) {
    return value
  }
  if (fallback !== undefined) {
    return fallback
  }
  throw new Error(`Missing environment variable ${name}!`)
}

getEnv.boolean = function getBooleanFromEnv(
  name: string,
  fallback?: boolean,
): boolean {
  const value = process.env[name]

  if (value !== undefined) {
    const lowerCased = value.toLowerCase()

    const trues = ['true', 'yes', '1']
    const falses = ['false', 'no', '0']

    if (trues.includes(lowerCased)) return true
    if (falses.includes(lowerCased)) return false
    const allowedValues = trues.concat(falses).join(', ')
    throw new Error(
      `Environment variable ${name} is "${value}", but must be one of ${allowedValues}!`,
    )
  }

  if (fallback !== undefined) {
    return fallback
  }
  throw new Error(`Missing environment variable ${name}!`)
}

getEnv.array = function array(name: string, fallback?: string[]): string[] {
  const value = process.env[name]
  if (value !== undefined) {
    return value.split(' ').filter((x) => x.length > 0)
  }

  if (fallback !== undefined) {
    return fallback
  }
  throw new Error(`Missing environment variable ${name}!`)
}
