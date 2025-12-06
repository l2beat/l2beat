import type { ContractConfigSchema, FieldConfigSchema } from '@l2beat/discovery'
import { assign, parse, stringify } from 'comment-json'
import { clone } from './cloneWithComments'
import { FieldConfigModel } from './FieldConfigModel'
import { hasCommentsRecursive } from './hasComments'
import { isEmpty, undefinedIfEmpty } from './undefinedIfEmpty'

export class ContractConfigModel {
  private readonly config: ContractConfigSchema
  private readonly fields: Record<string, FieldConfigModel> = {}

  static fromRawJsonc(jsonc: string) {
    const parsed = parse(jsonc) as unknown as ContractConfigSchema
    return new ContractConfigModel(parsed)
  }

  constructor(config: ContractConfigSchema) {
    this.config = clone(config)

    for (const [name, fieldConfig] of Object.entries(config.fields ?? {})) {
      this.fields[name] = new FieldConfigModel(fieldConfig)
    }
  }

  isEmpty() {
    return isEmpty(this.config)
  }

  hasComments(): boolean {
    return hasCommentsRecursive(this.config)
  }

  peek() {
    const cloned = clone(this.config)
    assign(cloned, { fields: this.buildFields(this.fields) })
    return cloned
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

  setIgnoreMethods(methods: string[]) {
    return this.patch({ ignoreMethods: undefinedIfEmpty(methods) })
  }

  setIgnoreRelatives(relatives: string[]) {
    return this.patch({ ignoreRelatives: undefinedIfEmpty(relatives) })
  }

  setIgnoreInWatchMode(methods: string[]) {
    return this.patch({ ignoreInWatchMode: undefinedIfEmpty(methods) })
  }

  setCategory(category: ContractConfigSchema['category']) {
    return this.patch({ category })
  }

  setDescription(description: ContractConfigSchema['description']) {
    return this.patch({ description })
  }

  setFieldSeverity(name: string, severity: FieldConfigSchema['severity']) {
    return this.patchField(name, (field) => field.setSeverity(severity))
  }

  private getField(name: string) {
    if (!this.fields[name]) {
      return new FieldConfigModel({} as FieldConfigSchema)
    }

    return this.fields[name]
  }

  private patch(patch: Partial<ContractConfigSchema>) {
    const newConfig = clone(this.config)
    assign(newConfig, patch)
    return new ContractConfigModel(newConfig)
  }

  private patchField(
    name: string,
    patch: (field: FieldConfigModel) => FieldConfigModel,
  ) {
    const newField = patch(this.getField(name))
    const fields = { ...this.fields, [name]: newField }
    return this.patch({ fields: this.buildFields(fields) })
  }

  private buildFields(
    fields: Record<string, FieldConfigModel>,
  ): Record<string, FieldConfigSchema> | undefined {
    const result: Record<string, FieldConfigSchema> = {}
    for (const [name, fieldConfig] of Object.entries(fields)) {
      if (!fieldConfig.isEmpty()) {
        result[name] = fieldConfig.peek()
      }
    }
    return undefinedIfEmpty(result)
  }

  getFieldSeverity(name: string) {
    return this.fields[name]?.severity
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

  get category() {
    return this.config.category
  }

  get description() {
    return this.config.description
  }
}
