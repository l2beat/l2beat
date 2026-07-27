export function dateTimeInputToTimestamp(value: string): number {
  // datetime-local values omit seconds unless a finer step is used
  const normalized = value.length === 16 ? `${value}:00` : value
  return new Date(`${normalized}Z`).getTime() / 1000
}

export function formatUsd(value: number | undefined): string {
  if (value === undefined) return '-'
  return `$${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
}

export function formatAmount(value: number | undefined): string {
  if (value === undefined) return '-'
  return value.toLocaleString('en-US', { maximumFractionDigits: 6 })
}

export function formatId(id: string): string {
  if (id.length <= 20) return id
  return `${id.slice(0, 10)}…${id.slice(-6)}`
}
