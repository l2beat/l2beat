import type { ContractValue } from '../discovery/output/types.js'
import { BlipRuntime } from './BlipRuntime.js'
import type { BlipSexp } from './type.js'

export function executeBlip(v: ContractValue, blip: BlipSexp): ContractValue {
  const runtime = new BlipRuntime({})
  return runtime.executeBlip(v, blip)
}
