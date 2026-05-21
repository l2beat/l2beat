interface Params {
  href: string
  pathname: string
  /** When true, only an exact pathname match counts as active. */
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
