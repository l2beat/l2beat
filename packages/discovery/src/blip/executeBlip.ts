import type { ContractValue } from '../discovery/output/types'
import { BlipRuntime } from './BlipRuntime'
import type { BlipEnv, BlipSexp } from './type'

export function executeBlip(
  v: ContractValue,
  blip: BlipSexp,
  env: BlipEnv = {},
): ContractValue {
  const runtime = new BlipRuntime({}, env)
  return runtime.executeBlip(v, blip)
}
