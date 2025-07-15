// No state on purpose - one way only
export function useQueryParam(key: string): string {
  const url = new URL(window.location.href)
  return url.searchParams.get(key) ?? ''
}
export function useFlagFromQueryParam(key: string): boolean {
  return useQueryParam(key) === 'true'
}
