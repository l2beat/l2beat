interface Params {
  href: string
  pathname: string
  exact?: boolean
}

export function isLinkActive({ href, pathname, exact }: Params) {
  // Strip query parameters from href for comparison
  const hrefPath = href.split('?')[0]
  if (exact) {
    return pathname === hrefPath
  }
  return pathname === hrefPath || pathname.startsWith(hrefPath + '/')
}
