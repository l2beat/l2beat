import { redactUrls } from './redactUrls'

// Every transport serializes through here, so this is where URLs lose their
// secrets, even inside third-party error messages.
export function safeToJSON(parameters: object): string {
  try {
    return JSON.stringify(parameters, (_k, v: unknown) => {
      if (typeof v === 'string') return redactUrls(v)
      if (typeof v === 'bigint') return v.toString()
      return v
    })
  } catch {
    return '{}'
  }
}

export function tagService(service: unknown, tag: unknown): string | undefined {
  const serviceStr = service !== undefined ? `${service}` : ''
  const tagStr = tag !== undefined ? `:${tag}` : ''
  return serviceStr + tagStr || undefined
}
