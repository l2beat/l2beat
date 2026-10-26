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
  // Plain and pretty formats print this as is, outside safeToJSON. Each part
  // is redacted alone, as `:tag` after a URL would read as part of its path.
  const serviceStr = service !== undefined ? redactUrls(`${service}`) : ''
  const tagStr = tag !== undefined ? `:${redactUrls(`${tag}`)}` : ''
  return serviceStr + tagStr || undefined
}
