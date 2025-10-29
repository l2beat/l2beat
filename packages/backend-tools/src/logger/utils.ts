export function safeToJSON(parameters: object): string {
  try {
    return JSON.stringify(parameters, (_k, v: unknown) =>
      typeof v === 'bigint' ? v.toString() : v,
    )
  } catch {
    return '{}'
  }
}

export function tagService(service: unknown, tag: unknown): string | undefined {
  const serviceStr = service !== undefined ? `${service}` : ''
  const tagStr = tag !== undefined ? `:${tag}` : ''
  return serviceStr + tagStr || undefined
}
