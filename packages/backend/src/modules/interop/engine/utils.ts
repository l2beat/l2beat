import { encodeEventTopics, parseAbi } from 'viem'

export function toEventSelector(eventSignature: string): string {
  const abi = parseAbi([eventSignature as string])
  // biome-ignore lint/suspicious/noExplicitAny: Viem types are hell
  return encodeEventTopics({ abi } as any)[0]
}

export function errorToString(error: unknown): string {
  return error instanceof Error
    ? JSON.stringify(ownProperties(error))
    : JSON.stringify({ message: String(error), value: error })
}

// An array replacer would filter nested objects too and empty out `cause`
function ownProperties(error: Error): Record<string, unknown> {
  const properties: Record<string, unknown> = {}
  for (const name of Object.getOwnPropertyNames(error)) {
    const value = (error as unknown as Record<string, unknown>)[name]
    properties[name] =
      value instanceof Error
        ? { name: value.name, message: value.message, cause: value.cause }
        : value
  }
  return properties
}
