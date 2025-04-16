import type { ContractValue } from '../discovery/output/types'
import { BlipRuntime } from './BlipRuntime'
import type { BlipSexp } from './type'

export function executeBlip(v: ContractValue, blip: BlipSexp): ContractValue {
  const runtime = new BlipRuntime({})
  return runtime.executeBlip(v, blip)
}
