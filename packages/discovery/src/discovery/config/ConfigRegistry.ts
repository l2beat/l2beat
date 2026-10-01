import { type ColorConfig, resolveColorConfig } from './ColorConfig'
import type { ConfigLayer } from './ConfigLayer'
import {
  type PermissionsConfig,
  resolvePermissionsConfig,
} from './PermissionConfig'
import { resolveStructureConfig, type StructureConfig } from './StructureConfig'

// values inside this class should not be modified during the runtime
// this will result in the hash being different and break the update mechanism
export class ConfigRegistry {
  readonly structure: StructureConfig
  readonly color: ColorConfig
  readonly permission: PermissionsConfig

  constructor(layer: ConfigLayer) {
    this.structure = resolveStructureConfig(layer)
    this.color = resolveColorConfig(layer)
    this.permission = resolvePermissionsConfig(layer)
    deepFreeze(this.structure)
    deepFreeze(this.color)
    deepFreeze(this.permission)
  }

  get name(): string {
    return this.structure.name
  }

  get archived(): boolean {
    return this.color.archived ?? false
  }
}

function deepFreeze(value: unknown): void {
  const pending = [value]
  while (pending.length > 0) {
    const item = pending.pop()
    if (typeof item !== 'object' || item === null || Object.isFrozen(item)) {
      continue
    }
    Object.freeze(item)
    pending.push(...Object.values(item))
  }
}
