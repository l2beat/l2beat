export function usePathname(): string {
  if (typeof window === 'undefined') {
    // @ts-expect-error how to type this?
    const url = globalThis.globalThis.__FIX_SSR_URL__ as string
    // Remove query params
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return url.split('?')[0]!
  }
  return window.location.pathname
}

export function useRouter() {
  return {
    push: (href: string) => (window.location.href = href),
    replace: (href: string) => (window.location.href = href),
    prefetch: () => undefined,
  }
}

export function useSearchParams() {
  return new URLSearchParams()
}
