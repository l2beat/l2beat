import type { Parser } from '@l2beat/validate'
import { assign, parse, stringify } from 'comment-json'
import {
  ContractConfigSchema,
  DiscoveryConfigSchema,
} from '../../schemas/schemas'

// TODO - what if I want to add new override ;p
// TODO - rename it to 'model' or something like that
export class ConfigEditor {
  private readonly config: DiscoveryConfigSchema
  private readonly overrides: Record<string, ContractConfigEditor> = {}
  private constructor(config: DiscoveryConfigSchema) {
    this.config = assign({}, config) as DiscoveryConfigSchema
    this.config.overrides = this.config.overrides ?? {}

    for (const [address, contractConfig] of Object.entries(
      this.config.overrides ?? {},
    )) {
      this.overrides[address] = new ContractConfigEditor(contractConfig)
    }
  }

  static fromRawJsonc(jsonc: string): ConfigEditor {
    const parsed = parse(jsonc)
    assertSchema(parsed, DiscoveryConfigSchema)
    return new ConfigEditor(parsed)
  }

  static fromRawJson(json: string): ConfigEditor {
    const parsed = JSON.parse(json)
    assertSchema(parsed, DiscoveryConfigSchema)
    return new ConfigEditor(parsed)
  }

  static fromPeak(config: DiscoveryConfigSchema): ConfigEditor {
    // TODO: mutable?
    return new ConfigEditor(config)
  }

  peak(): DiscoveryConfigSchema {
    const clone = assign({}, this.config) as DiscoveryConfigSchema

    for (const [address, contractConfig] of Object.entries(this.overrides)) {
      assign(clone.overrides, {
        [address]: contractConfig.peak(),
      })
    }

    return clone
  }

  toString(): string {
    return stringify(this.peak(), null, 2)
  }

  setIgnoreDiscovery(id: string, ignoreDiscovery: boolean): void {
    this.overrides[id]?.setIgnoreDiscovery(ignoreDiscovery)
  }

  setIgnoreInWatchMode(id: string, ignoreInWatchMode: string[]): void {
    this.overrides[id]?.setIgnoreInWatchMode(ignoreInWatchMode)
  }

  setIgnoreMethods(id: string, ignoreMethods: string[]): void {
    this.overrides[id]?.setIgnoreMethods(ignoreMethods)
  }

  setIgnoreRelatives(id: string, ignoreRelatives: string[]): void {
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

export class ContractConfigEditor {
  private readonly config: ContractConfigSchema
  constructor(config: ContractConfigSchema) {
    this.config = assign({}, config) as ContractConfigSchema
  }

  static fromRawJsonc(jsonc: string): ContractConfigEditor {
    const parsed = parse(jsonc)
    assertSchema(parsed, ContractConfigSchema)
    return new ContractConfigEditor(parsed)
  }

  static fromRawJson(json: string): ContractConfigEditor {
    const parsed = JSON.parse(json)
    assertSchema(parsed, ContractConfigSchema)
    return new ContractConfigEditor(parsed)
  }

  peak(): ContractConfigSchema {
    return this.config
  }

  toString(): string {
    return stringify(this.peak(), null, 2)
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

function assertSchema<T>(
  value: unknown,
  schema: Parser<T>,
): asserts value is T {
  schema.safeParse(value)
}
