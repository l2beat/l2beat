export function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies = Object.fromEntries(
    (cookieHeader ?? '')
      .split(';')
      .map((c) => c.trim().split('=').map(decodeURIComponent)),
  )

  return cookies
}
