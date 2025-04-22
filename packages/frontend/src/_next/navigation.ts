export function usePathname(): string {
  if (typeof window === 'undefined') {
    // @ts-expect-error how to type this?
    return globalThis.__FIX_SSR_PATHNAME__ as string
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
