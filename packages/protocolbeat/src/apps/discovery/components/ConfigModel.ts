import {
  ConfigRegistry,
  type ContractConfigSchema,
  type DiscoveryConfigSchema,
} from '@l2beat/discovery/web'
import { assign, CommentArray, parse, stringify } from 'comment-json'
import { clone } from './cloneWithComments'

export class ConfigModel {
  private readonly config: DiscoveryConfigSchema
  private readonly overrides: Record<string, ContractConfigModel> = {}
  private readonly registry: ConfigRegistry

  static fromRawJsonc(jsonc: string) {
    const parsed = parse(jsonc) as unknown as DiscoveryConfigSchema
    return new ConfigModel(parsed)
  }

  constructor(config: DiscoveryConfigSchema) {
    this.config = clone(config)

    for (const [address, contractConfig] of Object.entries(
      this.config.overrides ?? {},
    )) {
      this.overrides[address] = new ContractConfigModel(contractConfig)
    }
    this.registry = new ConfigRegistry(this.config)
  }

  peek(): DiscoveryConfigSchema {
    const cloned = clone(this.config)
    assign(cloned, { overrides: this.buildOverrides(this.overrides) })
    return cloned
  }

  hasComments(): boolean {
    return hasCommentsRecursive(this.config)
  }

  hasOverrideDefinition(id: string, key: string) {
    return this.overrides[id]?.hasDefinition(key) ?? false
  }

  toString(): string {
    return stringify(this.peek(), null, 2)
  }

  diff(other: ConfigModel) {
    return stringify(this.peek()) !== stringify(other.peek())
  }

  addToIgnoredMethods(id: string, method: string) {
    return this.patchOverride(id, (override) =>
      override.addToIgnoredMethods(method),
    )
  }

  removeFromIgnoredMethods(id: string, method: string) {
    return this.patchOverride(id, (override) =>
      override.removeFromIgnoredMethods(method),
    )
  }

  setIgnoreMethods(id: string, methods: string[]) {
    return this.patchOverride(id, (override) =>
      override.setIgnoreMethods(methods),
    )
  }

  addToIgnoredRelatives(id: string, relative: string) {
    return this.patchOverride(id, (override) =>
      override.addToIgnoredRelatives(relative),
    )
  }

  removeFromIgnoredRelatives(id: string, relative: string) {
    return this.patchOverride(id, (override) =>
      override.removeFromIgnoredRelatives(relative),
    )
  }

  setIgnoreRelatives(id: string, relatives: string[]) {
    return this.patchOverride(id, (override) =>
      override.setIgnoreRelatives(relatives),
    )
  }

  addToIgnoredInWatchMode(id: string, method: string) {
    return this.patchOverride(id, (override) =>
      override.addToIgnoredInWatchMode(method),
    )
  }

  setIgnoreInWatchMode(id: string, methods: string[]) {
    return this.patchOverride(id, (override) =>
      override.setIgnoreInWatchMode(methods),
    )
  }

  removeFromIgnoredInWatchMode(id: string, method: string) {
    return this.patchOverride(id, (override) =>
      override.removeFromIgnoredInWatchMode(method),
    )
  }

  patch(patch: Partial<DiscoveryConfigSchema>) {
    const newConfig = clone(this.config)
    assign(newConfig, patch)
    return new ConfigModel(newConfig)
  }

  patchOverride(
    id: string,
    patch: (override: ContractConfigModel) => ContractConfigModel,
  ) {
    const newOverride = patch(this.getOverride(id))
    const overrides = { ...this.overrides, [id]: newOverride }
    return this.patch({ overrides: this.buildOverrides(overrides) })
  }

  getIgnoredMethods(id: string) {
    return this.overrides[id]?.ignoreMethods
  }

  getIgnoreRelatives(id: string) {
    return this.overrides[id]?.ignoreRelatives
  }

  getIgnoreInWatchMode(id: string) {
    return this.overrides[id]?.ignoreInWatchMode
  }

  private getOverride(id: string) {
    if (!this.overrides[id]) {
      return new ContractConfigModel({} as ContractConfigSchema)
    }

    return this.overrides[id]
  }

  private buildOverrides(
    overrides: Record<string, ContractConfigModel>,
  ): Record<string, ContractConfigSchema> {
    const result: Record<string, ContractConfigSchema> = {}
    for (const [address, contractConfig] of Object.entries(overrides)) {
      if (!contractConfig.isEmpty()) {
        result[address] = contractConfig.peek()
      }
    }
    return result
  }
}

export class ContractConfigModel {
  private readonly config: ContractConfigSchema

  static fromRawJsonc(jsonc: string) {
    const parsed = parse(jsonc) as unknown as ContractConfigSchema
    return new ContractConfigModel(parsed)
  }

  constructor(config: ContractConfigSchema) {
    this.config = clone(config)
  }

  isEmpty() {
    return (
      Object.keys(this.config).length === 0 ||
      Object.values(this.config).every((value) => value === undefined)
    )
  }

  hasComments(): boolean {
    return hasCommentsRecursive(this.config)
  }

  peek(): ContractConfigSchema {
    return clone(this.config)
  }

  diff(other: ContractConfigModel) {
    // Ignore comments?
    return stringify(this.peek()) !== stringify(other.peek())
  }

  toString() {
    return stringify(this.peek(), null, 2)
  }

  hasDefinition(key: string) {
    return this.config[key as keyof ContractConfigSchema] !== undefined
  }

  addToIgnoredMethods(method: string) {
    return this.addToArray('ignoreMethods', method)
  }

  removeFromIgnoredMethods(method: string) {
    return this.removeFromArray('ignoreMethods', method)
  }

  setIgnoreMethods(methods: string[]) {
    return this.patch({ ignoreMethods: undefinedIfEmpty(methods) })
  }

  addToIgnoredRelatives(relative: string) {
    return this.addToArray('ignoreRelatives', relative)
  }

  removeFromIgnoredRelatives(relative: string) {
    return this.removeFromArray('ignoreRelatives', relative)
  }

  setIgnoreRelatives(relatives: string[]) {
    return this.patch({ ignoreRelatives: undefinedIfEmpty(relatives) })
  }

  addToIgnoredInWatchMode(method: string) {
    return this.addToArray('ignoreInWatchMode', method)
  }

  removeFromIgnoredInWatchMode(method: string) {
    return this.removeFromArray('ignoreInWatchMode', method)
  }

  setIgnoreInWatchMode(methods: string[]) {
    return this.patch({ ignoreInWatchMode: undefinedIfEmpty(methods) })
  }

  private patch(patch: Partial<ContractConfigSchema>) {
    const newConfig = clone(this.config)
    assign(newConfig, patch)
    return new ContractConfigModel(newConfig)
  }

  private addToArray(
    key: 'ignoreMethods' | 'ignoreRelatives' | 'ignoreInWatchMode',
    value: string,
  ) {
    const current = this.config[key] ?? []
    const next = new CommentArray(...current).concat(value)
    return this.patch({ [key]: next })
  }

  private removeFromArray(
    key: 'ignoreMethods' | 'ignoreRelatives' | 'ignoreInWatchMode',
    value: string,
  ) {
    const current = this.config[key] ?? []
    const next = current.filter((v) => v !== value)
    return this.patch({ [key]: undefinedIfEmpty(next) })
  }

  get ignoreInWatchMode() {
    return this.config.ignoreInWatchMode
  }

  get ignoreMethods() {
    return this.config.ignoreMethods
  }

  get ignoreRelatives() {
    return this.config.ignoreRelatives
  }
}

function undefinedIfEmpty<T>(arr: T[]): T[] | undefined {
  return arr.length === 0 ? undefined : arr
}

function hasCommentsRecursive(obj: unknown): boolean {
  if (obj === null || obj === undefined) {
    return false
  }

  if (typeof obj !== 'object') {
    return false
  }

  // Pretty lame but we always call this function with what we get from parser, so it's fine
  // Yes, each comment is a symbol.
  const symbols = Object.getOwnPropertySymbols(obj)
  if (symbols.length > 0) {
    return true
  }

  for (const value of Object.values(obj)) {
    if (hasCommentsRecursive(value)) {
      return true
    }
  }

  return false
}
