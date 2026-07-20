export interface ProjectUpdatesQuery {
  selectedUpdateId?: string
  updatesPage?: number
}

export function getProjectUpdatesQuery(query: unknown): ProjectUpdatesQuery {
  if (typeof query !== 'object' || query === null) {
    return {}
  }

  const values = query as Record<string, unknown>
  const selectedUpdateId =
    typeof values.update === 'string' ? values.update : undefined
  const page =
    typeof values.updatesPage === 'string'
      ? Number(values.updatesPage)
      : undefined
  const updatesPage =
    page !== undefined && Number.isSafeInteger(page) && page > 0
      ? page - 1
      : undefined

  return { selectedUpdateId, updatesPage }
}
