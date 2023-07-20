export function tagService(
  service: string | undefined,
  tag: string | undefined,
): string | undefined {
  const concat = (service ?? '') + (tag ? `:${tag}` : '')
  return concat ? concat : undefined
}
