interface Params {
  href: string
  pathname: string
}

export function isLinkActive({ href, pathname }: Params) {
  // Strip query parameters from href for comparison
  const hrefPath = href.split('?')[0]
  if (
    hrefPath === '/home' &&
    (pathname === '/home' ||
      pathname === '/home/' ||
      pathname === '/overview' ||
      pathname === '/overview/')
  ) {
    return true
  }
  return pathname === hrefPath || pathname.startsWith(hrefPath + '/')
}
