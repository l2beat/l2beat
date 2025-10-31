import type {
  ContractConfigSchema,
  DiscoveryConfigSchema,
} from '@l2beat/discovery'
import { assign, CommentArray, parse, stringify } from 'comment-json'

export class ConfigModel {
  private readonly config: DiscoveryConfigSchema
  private readonly overrides: Record<string, ContractConfigModel> = {}

  constructor(config: DiscoveryConfigSchema) {
    this.config = assign({}, config) as DiscoveryConfigSchema

    for (const [address, contractConfig] of Object.entries(
      this.config.overrides ?? {},
    )) {
      this.overrides[address] = new ContractConfigModel(contractConfig)
    }
  }

  static fromRawJsonc(jsonc: string) {
    const parsed = parse(jsonc) as unknown as DiscoveryConfigSchema
    return new ConfigModel(parsed)
  }

  static frompeek(config: DiscoveryConfigSchema) {
    return new ConfigModel(config)
  }

  peek(): DiscoveryConfigSchema {
    const clone = assign({}, this.config) as DiscoveryConfigSchema

    const [emptyOverrides, nonEmptyOverrides] = partition(
      Object.entries(this.overrides),
      ([, entry]) => entry.isEmpty(),
    )

    for (const [address, contractConfig] of nonEmptyOverrides) {
      assign(clone.overrides, {
        [address]: contractConfig.peek(),
      })
    }

    for (const [address] of emptyOverrides) {
      delete clone.overrides?.[address]
    }

    return clone
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

  private ensure(id: string) {
    if (!this.overrides[id]) {
      this.overrides[id] = new ContractConfigModel({} as ContractConfigSchema)
    }

    return this.overrides[id]
  }

  addToIgnoredMethods(id: string, method: string) {
    this.ensure(id).addToIgnoredMethods(method)
  }

  removeFromIgnoredMethods(id: string, method: string) {
    this.ensure(id).removeFromIgnoredMethods(method)
  }

  addToIgnoredRelatives(id: string, relative: string) {
    this.ensure(id).addToIgnoredRelatives(relative)
  }

  removeFromIgnoredRelatives(id: string, relative: string) {
    this.ensure(id).removeFromIgnoredRelatives(relative)
  }

  addToIgnoredInWatchMode(id: string, method: string) {
    this.ensure(id).addToIgnoredInWatchMode(method)
  }

  removeFromIgnoredInWatchMode(id: string, method: string) {
    this.ensure(id).removeFromIgnoredInWatchMode(method)
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
}

export class ContractConfigModel {
  private readonly config: ContractConfigSchema
  constructor(config: ContractConfigSchema) {
    this.config = assign({}, config) as ContractConfigSchema
  }

  static fromRawJsonc(jsonc: string) {
    const parsed = parse(jsonc) as unknown as ContractConfigSchema
    return new ContractConfigModel(parsed)
  }

  static fromPeek(config: ContractConfigSchema) {
    return new ContractConfigModel(config)
  }

  isEmpty() {
    return (
      Object.keys(this.config).length === 0 ||
      Object.values(this.config).every((value) => value === undefined)
    )
  }

  peek() {
    return this.config
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
    this.addToArray('ignoreMethods', method)
  }

  removeFromIgnoredMethods(method: string) {
    this.removeFromArray('ignoreMethods', method)
  }

  addToIgnoredRelatives(relative: string) {
    this.addToArray('ignoreRelatives', relative)
  }

  removeFromIgnoredRelatives(relative: string) {
    this.removeFromArray('ignoreRelatives', relative)
  }

  addToIgnoredInWatchMode(method: string) {
    this.addToArray('ignoreInWatchMode', method)
  }

  removeFromIgnoredInWatchMode(method: string) {
    this.removeFromArray('ignoreInWatchMode', method)
  }

  private patch(patch: Partial<ContractConfigSchema>) {
    assign(this.config, patch)
  }

  private addToArray(
    key: 'ignoreMethods' | 'ignoreRelatives' | 'ignoreInWatchMode',
    value: string,
  ) {
    const current = this.config[key] ?? []
    const next = new CommentArray(...current).concat(value)
    this.patch({ [key]: next })
  }

  private removeFromArray(
    key: 'ignoreMethods' | 'ignoreRelatives' | 'ignoreInWatchMode',
    value: string,
  ) {
    const current = this.config[key] ?? []
    const next = current.filter((v) => v !== value)
    this.patch({ [key]: undefinedIfEmpty(next) })
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

function undefinedIfEmpty<T>(arr: T[]): T[] | undefined {
  return arr.length === 0 ? undefined : arr
}
