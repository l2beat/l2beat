import { DiscoveryCustomType, ManualProxyType } from '@l2beat/discovery-types'
import { EthereumAddress } from '@l2beat/shared-pure'
import { merge } from 'lodash'
import {
  DiscoveryContract,
  DiscoveryContractField,
  ExternalReference,
} from './RawDiscoveryConfig'

export type ContractOverrides = DiscoveryContract & {
  name?: string
  address: EthereumAddress
}

export class ContractConfig {
  constructor(
    private overrides: ContractOverrides,
    private configTypes: Record<string, DiscoveryCustomType>,
  ) {}

  pushValues(values: DiscoveryContract) {
    this.overrides = {
      name: this.overrides.name,
      address: this.overrides.address,
      ...DiscoveryContract.parse(merge({}, values, this.overrides)),
    }
  }

  get name(): string | undefined {
    return this.overrides.name
  }

  get address(): EthereumAddress {
    return this.overrides.address
  }

  get canActIndependently(): boolean | undefined {
    return this.overrides.canActIndependently ?? false
  }

  get displayName(): string | undefined {
    return this.overrides.displayName
  }

  get description(): string | undefined {
    return this.overrides.description
  }

  get extends(): string | undefined {
    return this.overrides.extends
  }

  get proxyType(): ManualProxyType | undefined {
    return this.overrides.proxyType
  }

  get manualSourcePaths(): Record<string, string> {
    return this.overrides.manualSourcePaths ?? {}
  }

  get fields(): Record<string, DiscoveryContractField> {
    return this.overrides.fields ?? {}
  }

  get ignoreMethods(): string[] {
    return this.overrides.ignoreMethods ?? []
  }

  get ignoreRelatives(): string[] {
    return this.overrides.ignoreRelatives ?? []
  }

  get ignoreDiscovery(): boolean {
    return this.overrides.ignoreDiscovery ?? false
  }

  get ignoreInWatchMode(): string[] | undefined {
    return this.overrides.ignoreInWatchMode
  }

  get references(): ExternalReference[] | undefined {
    return this.overrides.references
  }

  get methods(): Record<string, string> {
    return this.overrides.methods ?? {}
  }

  get types(): Record<string, DiscoveryCustomType> {
    const result = this.configTypes
    const contractTypes = this.overrides.types ?? {}
    for (const key in contractTypes) {
      // biome-ignore lint/style/noNonNullAssertion: we know it's there
      result[key] = contractTypes[key]!
    }

    return result
  }
}
