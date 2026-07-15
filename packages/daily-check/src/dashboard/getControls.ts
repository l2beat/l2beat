/**
 * The daily check intentionally ignores the controls saved in Kibana and always
 * queries production. If controls need to become dynamic in the future, parse
 * the dashboard's pinned controls here and pass them in from loadControlPlane.
 */
export function getControls(): {
  filters: Record<string, unknown>[]
  descriptions: string[]
} {
  const environment = 'production'

  return {
    filters: [{ match_phrase: { environment } }],
    descriptions: [`environment: ${environment}`],
  }
}
