export function isDateOnly(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }
  const parsed = Date.parse(`${value}T00:00:00Z`)
  return (
    !Number.isNaN(parsed) && new Date(parsed).toISOString().startsWith(value)
  )
}
