export function useRouter() {
  return {
    push: (href: string) => (window.location.href = href),
  }
}
