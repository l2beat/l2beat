export interface DiscoveryOptions {
  skipAddresses: string[]
  // address -> method names
  skipMethods: Record<string, string[] | undefined>
}
