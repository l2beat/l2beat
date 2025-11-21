import type { FieldConfigSchema } from '@l2beat/discovery'
import { assign, parse, stringify } from 'comment-json'
import { clone } from './cloneWithComments'
import { isEmpty } from './undefinedIfEmpty'

export class FieldConfigModel {
  private readonly config: FieldConfigSchema

  static fromRawJsonc(jsonc: string) {
    const parsed = parse(jsonc) as unknown as FieldConfigSchema
    return new FieldConfigModel(parsed)
  }

  constructor(config: FieldConfigSchema) {
    this.config = clone(config)
  }

  peek() {
    return clone(this.config)
  }

  toString() {
    return stringify(this.peek(), null, 2)
  }

  isEmpty() {
    return isEmpty(this.config)
  }

  setSeverity(severity: FieldConfigSchema['severity']) {
    return this.patch({ severity })
  }

  hasDefinition(key: string) {
    return this.config[key as keyof FieldConfigSchema] !== undefined
  }

  private patch(patch: Partial<FieldConfigSchema>) {
    const newConfig = clone(this.config)
    assign(newConfig, patch)
    return new FieldConfigModel(newConfig)
  }

  get severity() {
    return this.config.severity
  }
}
