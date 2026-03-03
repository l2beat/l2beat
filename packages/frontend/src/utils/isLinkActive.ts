interface Params {
  href: string
  pathname: string
}

export function isLinkActive({ href, pathname }: Params) {
  // Strip query parameters from href for comparison
  const hrefPath = href.split('?')[0]
  return pathname === hrefPath || pathname.startsWith(hrefPath + '/')
}
