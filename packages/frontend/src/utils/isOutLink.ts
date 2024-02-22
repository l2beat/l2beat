export function isOutLink(href: string | undefined | null) {
  if (!href) return false
  return /^https?:\/\//.test(href)
}
