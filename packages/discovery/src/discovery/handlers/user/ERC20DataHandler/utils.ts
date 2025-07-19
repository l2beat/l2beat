export function today(): string {
  // biome-ignore lint/style/noNonNullAssertion: it's there
  return new Date().toISOString().split('T')[0]!
}
