import { ColorConfig } from './ColorConfig.js'
import { PermissionsConfig } from './PermissionConfig.js'
import { StructureConfig } from './StructureConfig.js'

// values inside this class should not be modified during the runtime
// this will result in the hash being different and break the update mechanism
export class ConfigRegistry {
  readonly structure: StructureConfig
  readonly color: ColorConfig
  readonly permission: PermissionsConfig

  constructor(readonly unparsedConfig: object) {
    this.structure = StructureConfig.parse(unparsedConfig)
    this.color = ColorConfig.parse(unparsedConfig)
    this.permission = PermissionsConfig.parse(unparsedConfig)
  }

  get name(): string {
    return this.structure.name
  }

  get archived(): boolean {
    return this.color.archived ?? false
  }
}
