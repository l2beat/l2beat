const ALWAYS_FIRST_VALUES = ['No stack', 'Ethereum', 'NotApplicable']

export function filterValuesSortFn(a: string, b: string) {
  if (ALWAYS_FIRST_VALUES.includes(a)) return -1
  if (ALWAYS_FIRST_VALUES.includes(b)) return 1
  return a.localeCompare(b)
}
