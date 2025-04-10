import { ColorConfig } from './ColorConfig'
import { StructureConfig } from './StructureConfig'

// values inside this class should not be modified during the runtime
// this will result in the hash being different and break the update mechanism
export class ConfigRegistry {
  readonly config: StructureConfig
  readonly colorConfig: ColorConfig

  constructor(readonly unparsedConfig: object) {
    this.config = StructureConfig.parse(unparsedConfig)
    this.colorConfig = ColorConfig.parse(unparsedConfig)
  }

  get name(): string {
    return this.config.name
  }

  get chain(): string {
    return this.config.chain
  }
}
