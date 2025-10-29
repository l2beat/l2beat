import type {
  ContractConfigSchema,
  DiscoveryConfigSchema,
} from '@l2beat/discovery'
import { assign, parse, stringify } from 'comment-json'

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

  isDirty(): boolean {
    return stringify(this.peak()) !== stringify(this.config)
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

  diff(other: ConfigModel): boolean {
    return stringify(this.peak()) !== stringify(other.peak())
  }

  private ensure(id: string) {
    if (!this.overrides[id]) {
      this.overrides[id] = new ContractConfigModel({} as ContractConfigSchema)
    }

    return this.overrides[id]
  }

  private with(patch: Partial<DiscoveryConfigSchema>): ConfigModel {
    return new ConfigModel(assign(this.peak(), patch))
  }

  setIgnoreInWatchMode(id: string, ignoreInWatchMode: string[]) {
    const override = this.ensure(id)

    const newOverride = override.setIgnoreInWatchMode(ignoreInWatchMode)

    return this.with(assign(this.overrides, { [id]: newOverride.peak() }))
  }

  setIgnoreMethods(id: string, ignoreMethods: string[]) {
    const override = this.ensure(id)

    const newOverride = override.setIgnoreMethods(ignoreMethods)

    return this.with(assign(this.overrides, { [id]: newOverride.peak() }))
  }

  setIgnoreRelatives(id: string, ignoreRelatives: string[]) {
    const override = this.ensure(id)

    const newOverride = override.setIgnoreRelatives(ignoreRelatives)

    return this.with(assign(this.overrides, { [id]: newOverride.peak() }))
  }

  getIgnoreInWatchMode(id: string): string[] {
    return this.overrides[id]?.ignoreInWatchMode ?? []
  }

  getIgnoreMethods(id: string): string[] {
    return this.overrides[id]?.ignoreMethods ?? []
  }

  getIgnoreRelatives(id: string): string[] {
    return this.overrides[id]?.ignoreRelatives ?? []
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

  isDirty(): boolean {
    return stringify(this.peak()) !== stringify(this.config)
  }

  isEmpty(): boolean {
    return Object.keys(this.config).length === 0
  }

  peak(): ContractConfigSchema {
    return this.config
  }

  diff(other: ContractConfigModel): boolean {
    return stringify(this.peak()) !== stringify(other.peak())
  }

  toString(): string {
    return stringify(this.peak(), null, 2)
  }

  hasDefinition(key: string): boolean {
    return this.config[key as keyof ContractConfigSchema] !== undefined
  }

  private with(patch: Partial<ContractConfigSchema>): ContractConfigModel {
    return new ContractConfigModel(assign(this.config, patch))
  }

  setIgnoreInWatchMode(ignoreInWatchMode: string[]) {
    const value = ignoreInWatchMode.length > 0 ? ignoreInWatchMode : undefined
    return this.with({ ignoreInWatchMode: value })
  }

  setIgnoreMethods(ignoreMethods: string[]) {
    const value = ignoreMethods.length > 0 ? ignoreMethods : undefined
    return this.with({ ignoreMethods: value })
  }

  setIgnoreRelatives(ignoreRelatives: string[]) {
    const value = ignoreRelatives.length > 0 ? ignoreRelatives : undefined
    return this.with({ ignoreRelatives: value })
  }

  get ignoreInWatchMode(): string[] {
    return this.config.ignoreInWatchMode ?? []
  }

  get ignoreMethods(): string[] {
    return this.config.ignoreMethods ?? []
  }

  get ignoreRelatives(): string[] {
    return this.config.ignoreRelatives ?? []
  }
}

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
