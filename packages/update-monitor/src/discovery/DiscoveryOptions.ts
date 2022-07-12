import { JsonFragment } from './getAbi'

export interface DiscoveryOptions {
  skipAddresses: string[]
  // address -> method names
  skipMethods: Record<string, string[] | undefined>
  // address -> abi
  addAbis: Record<string, JsonFragment[] | undefined>
}
