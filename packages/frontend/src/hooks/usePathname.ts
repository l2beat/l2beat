export function usePathname(): string {
  if (typeof window === 'undefined') {
    // @ts-expect-error how to type this?
    const url = globalThis.__FIX_SSR_URL__ as string
    // Remove query params
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return url.split('?')[0]!
  }
  return window.location.pathname
}
