import type {
  ContractConfigSchema,
  DiscoveryConfigSchema,
  FieldConfigSchema,
} from '@l2beat/discovery'
import { assign, parse, stringify } from 'comment-json'
import { ContractConfigModel } from './ContractConfigModel'
import { clone } from './cloneWithComments'
import { hasCommentsRecursive } from './hasComments'
import { undefinedIfEmpty } from './undefinedIfEmpty'

export class ConfigModel {
  private readonly config: DiscoveryConfigSchema
  private readonly overrides: Record<string, ContractConfigModel> = {}

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

  setIgnoreMethods(id: string, methods: string[]) {
    return this.patchOverride(id, (override) =>
      override.setIgnoreMethods(methods),
    )
  }

  setIgnoreRelatives(id: string, relatives: string[]) {
    return this.patchOverride(id, (override) =>
      override.setIgnoreRelatives(relatives),
    )
  }

  setIgnoreInWatchMode(id: string, methods: string[]) {
    return this.patchOverride(id, (override) =>
      override.setIgnoreInWatchMode(methods),
    )
  }

  setContractDescription(id: string, description: string | undefined) {
    return this.patchOverride(id, (override) =>
      override.setDescription(description),
    )
  }

  setFieldSeverity(
    id: string,
    fieldName: string,
    severity: 'HIGH' | 'LOW' | undefined,
  ) {
    return this.patchOverride(id, (override) =>
      override.setFieldSeverity(fieldName, severity),
    )
  }

  getFieldSeverity(id: string, fieldName: string) {
    return this.overrides[id]?.getFieldSeverity(fieldName)
  }

  setFieldDescription(
    id: string,
    fieldName: string,
    description: FieldConfigSchema['description'],
  ) {
    return this.patchOverride(id, (override) =>
      override.setFieldDescription(fieldName, description),
    )
  }

  getFieldDescription(id: string, fieldName: string) {
    return this.overrides[id]?.getFieldDescription(fieldName)
  }

  setFieldHandler(
    id: string,
    fieldName: string,
    handler: FieldConfigSchema['handler'],
  ) {
    return this.patchOverride(id, (override) =>
      override.setFieldHandler(fieldName, handler),
    )
  }

  getFieldHandler(id: string, fieldName: string) {
    return this.overrides[id]?.getFieldHandler(fieldName)
  }

  getFieldHandlerString(id: string, fieldName: string) {
    return this.overrides[id]?.getFieldHandlerString(fieldName)
  }

  setCategory(id: string, category: ContractConfigSchema['category']) {
    return this.patchOverride(id, (override) => override.setCategory(category))
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

  getCategory(id: string) {
    return this.overrides[id]?.category
  }

  getDescription(id: string) {
    return this.overrides[id]?.description
  }

  private getOverride(id: string) {
    if (!this.overrides[id]) {
      return new ContractConfigModel({} as ContractConfigSchema)
    }

    return this.overrides[id]
  }

  private buildOverrides(
    overrides: Record<string, ContractConfigModel>,
  ): Record<string, ContractConfigSchema> | undefined {
    const result: Record<string, ContractConfigSchema> = {}
    for (const [address, contractConfig] of Object.entries(overrides)) {
      if (!contractConfig.isEmpty()) {
        result[address] = contractConfig.peek()
      }
    }

    return undefinedIfEmpty(result)
  }
}
