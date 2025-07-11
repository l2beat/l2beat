export interface ResolvedFeatureFlag {
  feature: string
  enabled: boolean
  used: boolean
}

export class FeatureFlags {
  private readonly enabled = new Set<string>()
  private readonly disabled = new Set<string>()
  private readonly resolved = new Map<string, boolean>()
  private readonly input: string

  constructor(input: string) {
    const items = input
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
    this.input = items.join(',')

    for (const item of items) {
      if (item.startsWith('!')) {
        this.disabled.add(item.substring(1))
      } else {
        this.enabled.add(item)
      }
    }
  }

  append(input: string): FeatureFlags {
    return new FeatureFlags(`${this.input},${input}`)
  }

  isEnabled(...keys: string[]): boolean {
    const item = keys.join('.')
    const result = this.resolved.get(item) ?? this.resolve(item)
    this.resolved.set(item, result)
    return result
  }

  private resolve(item: string): boolean {
    const terms = item.split('.')
    for (let i = terms.length; i >= 1; i--) {
      const key = terms.slice(0, i).join('.')
      if (this.disabled.has(key)) {
        return false
      }
      if (this.enabled.has(key)) {
        return true
      }

      const starKey = terms
        .slice(0, i - 1)
        .concat('*')
        .join('.')
      if (this.disabled.has(starKey)) {
        return false
      }
      if (this.enabled.has(starKey)) {
        return true
      }
    }
    return false
  }

  getResolved(): ResolvedFeatureFlag[] {
    const resolved = Array.from(this.resolved.entries()).map(
      ([feature, enabled]) => ({ feature, enabled, used: true }),
    )

    const enabled = Array.from(this.enabled)
      .filter(
        (feature) => !feature.includes('*') && !this.resolved.has(feature),
      )
      .map((feature) => ({ feature, enabled: true, used: false }))

    const disabled = Array.from(this.disabled)
      .filter(
        (feature) => !feature.includes('*') && !this.resolved.has(feature),
      )
      .map((feature) => ({ feature, enabled: false, used: false }))

    return resolved
      .concat(enabled)
      .concat(disabled)
      .sort((a, b) => a.feature.localeCompare(b.feature))
  }
}
