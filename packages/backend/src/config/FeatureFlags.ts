export class FeatureFlags {
  private readonly enabled = new Set<string>()
  private readonly disabled = new Set<string>()
  private readonly resolved = new Map<string, boolean>()

  constructor(private readonly input: string) {
    const items = input
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
    for (const item of items) {
      if (item.startsWith('!')) {
        this.disabled.add(item.substring(1))
      } else {
        this.enabled.add(item)
      }
    }
  }

  with(item: string): FeatureFlags {
    return new FeatureFlags(`${this.input},${item}`)
  }

  isEnabled(item: string): boolean {
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
      } else if (this.enabled.has(key)) {
        return true
      }
    }
    if (this.enabled.has('*')) {
      return true
    }
    return false
  }

  getResolved(): { feature: string; enabled: boolean }[] {
    return Array.from(this.resolved.entries())
      .map(([feature, enabled]) => ({ feature, enabled }))
      .sort((a, b) => a.feature.localeCompare(b.feature))
  }
}
