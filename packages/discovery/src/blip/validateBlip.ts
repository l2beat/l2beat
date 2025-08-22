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

  if (input.length === 0) return false

  const isArrayOrTValid = (arg: unknown): boolean => {
    if (typeof arg === 'string' || typeof arg === 'number') return true
    if (Array.isArray(arg))
      return arg.every((e) => typeof e === 'string' || typeof e === 'number')
    return false
  }

  const op = input[0]
  if (typeof op !== 'string') return false

  const notEmpty = input.length > 1
  switch (op) {
    case 'not':
      return input.slice(1).every((e) => validateBlip(e)) && notEmpty
    case '=':
      return input.slice(1).every((e) => validateBlip(e)) && notEmpty
    case '!=':
      return input.slice(1).every((e) => validateBlip(e)) && notEmpty
    case 'and':
      return input.slice(1).every((e) => validateBlip(e)) && notEmpty
    case 'pipe':
      return input.slice(1).every((e) => validateBlip(e)) && notEmpty
    case 'map':
      return input.length === 2 && validateBlip(input[1])
    case 'pick':
      return input.slice(1).every((e) => validateBlip(e)) && notEmpty
    case 'get':
      return (
        input
          .slice(1)
          .every((e) => typeof e === 'string' || typeof e === 'number') &&
        notEmpty
      )
    case 'set':
      if (input.length !== 3) return false
      return isArrayOrTValid(input[1]) && validateBlip(input[2])
    case 'filter':
      return input.length === 2 && validateBlip(input[1])
    case 'find':
      return input.length === 2 && validateBlip(input[1])
    case 'format':
      return input.length === 2 && typeof input[1] === 'string'
    case 'if':
      return (
        input.length === 4 &&
        validateBlip(input[1]) &&
        validateBlip(input[2]) &&
        validateBlip(input[3])
      )
    case 'delete':
      return (
        input
          .slice(1)
          .every((e) => typeof e === 'string' || typeof e === 'number') &&
        notEmpty
      )
    case 'shape':
      return (
        input.slice(1).every((e) => {
          if (typeof e === 'string') return true
          return (
            Array.isArray(e) &&
            e.length === 2 &&
            typeof e[0] === 'string' &&
            validateBlip(e[1])
          )
        }) && notEmpty
      )
    case 'to_entries':
      return input.length === 1
    case 'length':
      return input.length === 1
    default:
      return false
  }
}
