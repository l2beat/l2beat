import type { DiscoveryOutput } from '@l2beat/discovery'

export class DiscoveryOutputCache {
  cache = new Map<string, DiscoveryOutput>()

  get(projectName: string): DiscoveryOutput | undefined {
    return this.cache.get(projectName)
  }

  set(projectName: string, value: DiscoveryOutput): void {
    this.cache.set(projectName, value)
  }
}
