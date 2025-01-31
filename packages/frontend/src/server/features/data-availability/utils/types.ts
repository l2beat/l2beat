import type { DaBridgeRisks, DaLayerRisks } from '@l2beat/config'

export type DaEntryRisk =
  | (DaLayerRisks & Record<keyof DaBridgeRisks, undefined>)
  | (DaBridgeRisks & Record<keyof DaLayerRisks, undefined>)
  | (DaLayerRisks & DaBridgeRisks)
