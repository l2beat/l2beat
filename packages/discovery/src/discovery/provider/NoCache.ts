import type { DiscoveryCache } from './DiscoveryCache'

export class NoCache implements DiscoveryCache {
  // biome-ignore lint/suspicious/useAwait: <explanation>
  async get(): Promise<string | undefined> {
    return undefined
  }

  async set(): Promise<void> {}
}
