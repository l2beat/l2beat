import type { DiscoveryCache } from './DiscoveryCache'

export class NoCache implements DiscoveryCache {
  // biome-ignore lint/suspicious/useAwait: we know it's there
  async get(): Promise<string | undefined> {
    return undefined
  }

  async set(): Promise<void> {}
}
