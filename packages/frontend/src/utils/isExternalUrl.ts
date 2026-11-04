// Links that leave the site open in a new tab and get an outlink icon.
export function isExternalUrl(href: string | null | undefined) {
  return href?.startsWith('http') ?? false
}
