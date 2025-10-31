import type {
  ContractConfigSchema,
  DiscoveryConfigSchema,
} from '@l2beat/discovery'
import { assign, parse, stringify } from 'comment-json'

// TODO - what if I want to add new override ;p
export class ConfigModel {
  private readonly config: DiscoveryConfigSchema
  private readonly overrides: Record<string, ContractConfigModel> = {}
  private constructor(config: DiscoveryConfigSchema) {
    this.config = assign({}, config) as DiscoveryConfigSchema
    this.config.overrides = this.config.overrides ?? {}

    for (const [address, contractConfig] of Object.entries(
      this.config.overrides ?? {},
    )) {
      this.overrides[address] = new ContractConfigModel(contractConfig)
    }
  }

  static fromRawJsonc(jsonc: string): ConfigModel {
    const parsed = parse(jsonc) as unknown as DiscoveryConfigSchema
    return new ConfigModel(parsed)
  }

  static fromRawJson(json: string): ConfigModel {
    const parsed = JSON.parse(json) as DiscoveryConfigSchema
    // assertSchema(parsed, DiscoveryConfigSchema)
    return new ConfigModel(parsed)
  }

  static fromPeak(config: DiscoveryConfigSchema): ConfigModel {
    // TODO: mutable?
    return new ConfigModel(config)
  }

  peak(): DiscoveryConfigSchema {
    const clone = assign({}, this.config) as DiscoveryConfigSchema

    const [emptyOverrides, nonEmptyOverrides] = partition(
      Object.entries(this.overrides),
      ([, entry]) => entry.isEmpty(),
    )

    for (const [address, contractConfig] of nonEmptyOverrides) {
      assign(clone.overrides, {
        [address]: contractConfig.peak(),
      })
    }

    for (const [address] of emptyOverrides) {
      delete clone.overrides?.[address]
    }

    return clone
  }

  hasOverrideDefinition(id: string, key: string): boolean {
    return this.overrides[id]?.hasDefinition(key) ?? false
  }

  toString(): string {
    return stringify(this.peak(), null, 2)
  }

  ensure(id: string) {
    if (!this.overrides[id]) {
      this.overrides[id] = new ContractConfigModel({} as ContractConfigSchema)
    }
  }

  setIgnoreDiscovery(id: string, ignoreDiscovery: boolean): void {
    this.ensure(id)
    this.overrides[id]?.setIgnoreDiscovery(ignoreDiscovery)
  }

  setIgnoreInWatchMode(id: string, ignoreInWatchMode: string[]): void {
    this.ensure(id)
    this.overrides[id]?.setIgnoreInWatchMode(ignoreInWatchMode)
  }

  setIgnoreMethods(id: string, ignoreMethods: string[]): void {
    this.ensure(id)
    this.overrides[id]?.setIgnoreMethods(ignoreMethods)
  }

  setIgnoreRelatives(id: string, ignoreRelatives: string[]): void {
    this.ensure(id)
    this.overrides[id]?.setIgnoreRelatives(ignoreRelatives)
  }

  getIgnoreDiscovery(id: string): boolean {
    return this.overrides[id]?.getIgnoreDiscovery() ?? false
  }

  getIgnoreInWatchMode(id: string): string[] {
    return this.overrides[id]?.getIgnoreInWatchMode() ?? []
  }

  getIgnoreMethods(id: string): string[] {
    return this.overrides[id]?.getIgnoreMethods() ?? []
  }

  getIgnoreRelatives(id: string): string[] {
    return this.overrides[id]?.getIgnoreRelatives() ?? []
  }
}

export class ContractConfigModel {
  private readonly config: ContractConfigSchema
  constructor(config: ContractConfigSchema) {
    this.config = assign({}, config) as ContractConfigSchema
  }

  static fromRawJsonc(jsonc: string): ContractConfigModel {
    const parsed = parse(jsonc) as unknown as ContractConfigSchema
    // assertSchema(parsed, ContractConfigSchema)
    return new ContractConfigModel(parsed)
  }

  static fromRawJson(json: string): ContractConfigModel {
    const parsed = JSON.parse(json)
    // assertSchema(parsed, ContractConfigSchema)
    return new ContractConfigModel(parsed)
  }

  static fromPeak(config: ContractConfigSchema): ContractConfigModel {
    return new ContractConfigModel(config)
  }

  isEmpty(): boolean {
    return Object.keys(this.config).length === 0
  }

  peak(): ContractConfigSchema {
    return this.config
  }

  toString(): string {
    return stringify(this.peak(), null, 2)
  }

  hasDefinition(key: string): boolean {
    return this.config[key as keyof ContractConfigSchema] !== undefined
  }

  setIgnoreDiscovery(ignoreDiscovery: boolean): void {
    const value = ignoreDiscovery ? true : undefined
    assign(this.config, { ignoreDiscovery: value })
  }

  setIgnoreInWatchMode(ignoreInWatchMode: string[]): void {
    const value = ignoreInWatchMode.length > 0 ? ignoreInWatchMode : undefined
    assign(this.config, { ignoreInWatchMode: value })
  }

  setIgnoreMethods(ignoreMethods: string[]): void {
    const value = ignoreMethods.length > 0 ? ignoreMethods : undefined
    assign(this.config, { ignoreMethods: value })
  }

  setIgnoreRelatives(ignoreRelatives: string[]): void {
    const value = ignoreRelatives.length > 0 ? ignoreRelatives : undefined
    assign(this.config, { ignoreRelatives: value })
  }

  getIgnoreDiscovery(): boolean {
    return this.config.ignoreDiscovery
  }

  getIgnoreInWatchMode(): string[] {
    return this.config.ignoreInWatchMode ?? []
  }

  getIgnoreMethods(): string[] {
    return this.config.ignoreMethods ?? []
  }

  getIgnoreRelatives(): string[] {
    return this.config.ignoreRelatives ?? []
  }
}

// function assertSchema<T>(
//   value: unknown,
//   schema: Parser<T>,
// ): asserts value is T {
//   schema.safeParse(value)
// }

function partition<T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] {
  return array.reduce<[T[], T[]]>(
    (acc, item) => {
      if (predicate(item)) {
        acc[0].push(item)
      } else {
        acc[1].push(item)
      }
      return acc
    },
    [[], []],
  )
}
