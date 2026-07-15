interface PinnedControl {
  order?: number
  type?: string
  config?: {
    field_name?: string
    selected_options?: string[]
    exclude?: boolean
    exists_selected?: boolean
  }
}

/** Converts the dashboard's saved controls into ES filter clauses. */
export function parseControls(pinnedPanels: unknown): {
  filters: Record<string, unknown>[]
  descriptions: string[]
  unsupported: string[]
} {
  const filters: Record<string, unknown>[] = []
  const descriptions: string[] = []
  const unsupported: string[] = []

  const panels = (pinnedPanels as { panels?: Record<string, PinnedControl> })
    ?.panels
  const controls = Object.values(panels ?? {}).sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  )
  for (const control of controls) {
    const config = control.config
    if (control.type !== 'options_list_control' || !config?.field_name) {
      unsupported.push(`dashboard control of type "${control.type}"`)
      continue
    }
    const field = config.field_name
    let clause: Record<string, unknown> | undefined
    let description: string | undefined
    if (config.exists_selected) {
      clause = { exists: { field } }
      description = `${field}: exists`
    } else if (config.selected_options && config.selected_options.length > 0) {
      const options = config.selected_options
      clause =
        options.length === 1
          ? { match_phrase: { [field]: options[0] } }
          : {
              bool: {
                should: options.map((option) => ({
                  match_phrase: { [field]: option },
                })),
                minimum_should_match: 1,
              },
            }
      description = `${field}: ${options.join(', ')}`
    } else {
      continue
    }
    if (config.exclude) {
      clause = { bool: { must_not: [clause] } }
      description = `NOT ${description}`
    }
    filters.push(clause)
    descriptions.push(description)
  }

  return { filters, descriptions, unsupported }
}
