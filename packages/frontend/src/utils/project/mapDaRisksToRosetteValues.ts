import type { DaBridgeRisks } from '@l2beat/config'
import type { RosetteValue } from '~/components/rosette/types'
import type { AdjustedDaLayerRisks } from '~/server/features/data-availability/utils/getDaLayerRisks'

export function mapLayerRisksToRosetteValues(
  risks: AdjustedDaLayerRisks,
): RosetteValue[] {
  const values: RosetteValue[] = []
  if (risks.daLayer) {
    values.push({ name: 'DA Layer', ...risks.daLayer })
  }
  if (risks.economicSecurity) {
    values.push({ name: 'Economic security', ...risks.economicSecurity })
  }
  if (risks.fraudDetection) {
    values.push({ name: 'Fraud detection', ...risks.fraudDetection })
  }
  return values
}

export function mapBridgeRisksToRosetteValues(
  risks: DaBridgeRisks,
): RosetteValue[] {
  const values: RosetteValue[] = []
  if (risks.daBridge) {
    values.push({ name: 'DA Bridge', ...risks.daBridge })
  }
  if (risks.committeeSecurity) {
    values.push({ name: 'Committee security', ...risks.committeeSecurity })
  }
  if (risks.upgradeability) {
    values.push({ name: 'Upgradeability', ...risks.upgradeability })
  }
  if (risks.relayerFailure) {
    values.push({ name: 'Relayer failure', ...risks.relayerFailure })
  }
  return values
}
