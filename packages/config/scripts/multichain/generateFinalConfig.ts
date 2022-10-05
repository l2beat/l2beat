import { IntermediateConfig } from './generateIntermediateConfig'

export function generateFinalConfig(config: IntermediateConfig) {
  return {
    final: true,
  }
}
