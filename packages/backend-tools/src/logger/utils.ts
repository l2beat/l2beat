export function toJSON(parameters: object): string {
  return JSON.stringify(parameters, (k, v: unknown) =>
    typeof v === 'bigint' ? v.toString() : v,
  )
}

export function formatDate(date: Date): string {
  const padStart = (value: number): string => value.toString().padStart(2, '0')
  return `${padStart(date.getDate())}-${padStart(date.getMonth() + 1)}-${date.getFullYear()}`
}
