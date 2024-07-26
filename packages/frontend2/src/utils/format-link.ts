export function formatLink(link: string) {
  if (link.startsWith('https://')) {
    link = link.slice('https://'.length)
  } else if (link.startsWith('http://')) {
    link = link.slice('http://'.length)
  }
  if (link.endsWith('/')) {
    link = link.slice(0, -1)
  }
  return link
}
