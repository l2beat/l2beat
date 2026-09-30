import { v } from '@l2beat/validate'
import {
  _ConfigLayer,
  ContractLayer,
  FieldLayer,
} from '../discovery/config/ConfigLayer'

export const FieldConfigSchema = FieldLayer
export type FieldConfigSchema = v.infer<typeof FieldConfigSchema>

export const ContractConfigSchema = ContractLayer
export type ContractConfigSchema = v.infer<typeof ContractConfigSchema>

export const DiscoveryConfigSchema = v.object({
  import: v.array(v.string()).optional(),
  ..._ConfigLayer,
  name: v.string().check((x) => x.length > 0),
})
export type DiscoveryConfigSchema = v.infer<typeof DiscoveryConfigSchema>
