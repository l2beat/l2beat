import { ColorConfig } from './ColorConfig'
import { PermissionConfig } from './PermissionConfig'
import { StructureConfig } from './StructureConfig'

// values inside this class should not be modified during the runtime
// this will result in the hash being different and break the update mechanism
export class ConfigRegistry {
  readonly structure: StructureConfig
  readonly color: ColorConfig
  readonly permission: PermissionConfig

  constructor(readonly unparsedConfig: object) {
    this.structure = StructureConfig.parse(unparsedConfig)
    this.color = ColorConfig.parse(unparsedConfig)
    this.permission = PermissionConfig.parse(unparsedConfig)
  }

  get name(): string {
    return this.structure.name
  }

  get chain(): string {
    return this.structure.chain
  }
}
