import type { DiscoveryOutput } from '@l2beat/discovery'

export class DiscoveryOutputCache {
  cache = new Map<string, DiscoveryOutput>()

  get(projectName: string, chain: string): DiscoveryOutput | undefined {
    return this.cache.get(this.getKey(projectName, chain))
  }

  set(projectName: string, chain: string, value: DiscoveryOutput): void {
    this.cache.set(this.getKey(projectName, chain), value)
  }

  private getKey(projectName: string, chain: string): string {
    return `${chain}:${projectName}`
  }
}
