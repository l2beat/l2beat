export function usePathname(): string {
  if (typeof window === 'undefined') {
    return 'globalThis.__SSR_DATA__.pathname'
  }
  return window.location.pathname
}

export function useRouter() {
  return {
    push: (href: string) => (window.location.href = href),
    replace: (href: string) => (window.location.href = href),
  }
}

export function useSearchParams() {
  return new URLSearchParams()
}
