export function getEnv(name: string, fallback?: string) {
  const value = process.env[name]
  if (value !== undefined) {
    return value
  }
  if (fallback !== undefined) {
    return fallback
  }
  throw new Error(`Missing environment variable ${name}!`)
}

getEnv.integer = function (name: string, fallback?: number) {
  const value = process.env[name]
  if (value !== undefined) {
    const result = parseInt(value)
    if (result.toString() === value) {
      return result
    }
    throw new Error(`Environment variable ${name} is not an integer!`)
  }
  if (fallback !== undefined) {
    return fallback
  }
  throw new Error(`Missing environment variable ${name}!`)
}
