export function validateBlip(input: unknown): boolean {
  if (!Array.isArray(input)) {
    switch (typeof input) {
      case 'string':
        return true
      case 'number':
        return true
      case 'boolean':
        return true
      default:
        return false
    }
  }

  if (input.length < 2) {
    return false
  }

  const op = input[0]
  if (typeof op !== 'string') {
    return false
  }

  switch (op) {
    case 'not': {
      if (input.length > 2) {
        return false
      }

      return input.slice(1).every((e) => validateBlip(e))
    }
    case '=':
      return input.slice(1).every((e) => validateBlip(e))
    case '!=':
      return input.slice(1).every((e) => validateBlip(e))
    case 'and':
      return input.slice(1).every((e) => validateBlip(e))
    default:
      return false
  }
}
