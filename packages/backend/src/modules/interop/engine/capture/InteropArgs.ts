export const InteropArgs = {
  serialize: serializeInteropArgs,
  deserialize: deserializeInteropArgs,
}

function serializeInteropArgs(args: unknown): unknown {
  if (typeof args === 'bigint') {
    return `BigInt(${args.toString()})`
  }
  if (Array.isArray(args)) {
    return args.map(serializeInteropArgs)
  }
  if (args !== null && typeof args === 'object') {
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(args)) {
      result[key] = serializeInteropArgs(value)
    }
    return result
  }
  return args
}

function deserializeInteropArgs(args: unknown): unknown {
  if (
    typeof args === 'string' &&
    args.startsWith('BigInt(') &&
    args.endsWith(')')
  ) {
    const value = args.slice(7, -1)
    return BigInt(value)
  }
  if (Array.isArray(args)) {
    return args.map(deserializeInteropArgs)
  }
  if (args !== null && typeof args === 'object') {
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(args)) {
      result[key] = deserializeInteropArgs(value)
    }
    return result
  }
  return args
}
