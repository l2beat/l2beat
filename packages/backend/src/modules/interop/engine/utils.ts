import { encodeEventTopics, parseAbi } from 'viem'

export function toEventSelector(eventSignature: string): string {
  const abi = parseAbi([eventSignature as string])
  // biome-ignore lint/suspicious/noExplicitAny: Viem types are hell
  return encodeEventTopics({ abi } as any)[0]
}

export function errorToString(error: unknown): string {
  return error instanceof Error
    ? JSON.stringify(error, Object.getOwnPropertyNames(error))
    : JSON.stringify({ message: String(error), value: error })
}
