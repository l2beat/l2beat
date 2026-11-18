import { encodeEventTopics, parseAbi } from 'viem'

export function toEventSelector(eventSignature: string): string {
  const abi = parseAbi([eventSignature as string])
  // biome-ignore lint/suspicious/noExplicitAny: Viem types are hell
  return encodeEventTopics({ abi } as any)[0]
}

export function errorToString(error: unknown): string {
  if (!(error instanceof Error)) {
    return JSON.stringify({ message: String(error), value: error })
  }
  try {
    return JSON.stringify(error, errorReplacer)
  } catch {
    // A cause that cannot be serialized must not hide the error itself
    return JSON.stringify({ message: error.message, stack: error.stack })
  }
}

// Error fields are not enumerable, so list them for errors at every depth
function errorReplacer(_key: string, value: unknown): unknown {
  if (typeof value === 'bigint') {
    return value.toString()
  }
  if (value instanceof Error) {
    const properties: Record<string, unknown> = {}
    for (const name of Object.getOwnPropertyNames(value)) {
      properties[name] = (value as unknown as Record<string, unknown>)[name]
    }
    return properties
  }
  return value
}
