import type {
  ContractConfigSchema,
  DiscoveryConfigSchema,
  FieldConfigSchema,
} from '@l2beat/discovery'
import { type ChainSpecificAddress, formatJson } from '@l2beat/shared-pure'
import { assign, parse, stringify } from 'comment-json'
import { removeJSONTrailingCommas } from '../../../utils/removeJSONTrailingCommas'
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

  // Takes ownership of `config`: both callers hand over a fresh parse or a
  // fresh clone, so cloning again here only doubled the parse cost.
  private constructor(config: DiscoveryConfigSchema) {
    this.config = config

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

  toFileContents(): string {
    const text = this.toString()
    if (this.hasComments()) {
      return text
    }
    return formatJson(JSON.parse(removeJSONTrailingCommas(text)))
  }

  diff(other: ConfigModel) {
    return stringify(this.peek()) !== stringify(other.peek())
  }

  updateInitialAddresses(change: {
    add: ChainSpecificAddress[]
    remove: ChainSpecificAddress[]
  }) {
    const addresses = clone(this.config.initialAddresses)
    for (let index = addresses.length - 1; index >= 0; index--) {
      if (change.remove.includes(addresses[index] as ChainSpecificAddress)) {
        addresses.splice(index, 1)
      }
    }
    for (const address of change.add) {
      if (!addresses.includes(address)) {
        addresses.push(address)
      }
    }
    return this.patch({ initialAddresses: addresses })
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
    severity: 'HIGH' | 'MEDIUM' | 'LOW' | undefined,
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

  getFieldPermissions(id: string, fieldName: string) {
    return this.overrides[id]?.getFieldPermissions(fieldName)
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

  getFieldEdit(id: string, fieldName: string) {
    return this.overrides[id]?.getFieldEdit(fieldName)
  }

  getFieldEditString(id: string, fieldName: string) {
    return this.overrides[id]?.getFieldEditString(fieldName)
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
