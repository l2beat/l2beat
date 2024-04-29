export function toJSON(parameters: object): string {
  return JSON.stringify(parameters, (k, v: unknown) =>
    typeof v === 'bigint' ? v.toString() : v,
  )
}
