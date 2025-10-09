export function toYYYYMMDD(date: Date) {
  // biome-ignore lint/style/noNonNullAssertion: We know that the date is not null
  return date.toISOString().split('T')[0]!
}
