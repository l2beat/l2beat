import { redactUrls } from './redactUrls'

// Every transport serializes through here, so this is where URLs lose their
// secrets, even inside third-party error messages and object keys.
export function safeToJSON(parameters: object): string {
  try {
    return redactUrls(
      JSON.stringify(parameters, (_k, v: unknown) =>
        typeof v === 'bigint' ? v.toString() : v,
      ),
    )
  } catch {
    return '{}'
  }
}

export function tagService(service: unknown, tag: unknown): string | undefined {
  const serviceStr = service !== undefined ? `${service}` : ''
  const tagStr = tag !== undefined ? `:${tag}` : ''
  // Plain and pretty formats print this as is, outside safeToJSON
  return redactUrls(serviceStr + tagStr) || undefined
}
