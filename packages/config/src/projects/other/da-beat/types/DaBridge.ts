import { ChainId, ProjectId } from '@l2beat/shared-pure'
import {
  ScalingProjectContracts,
  ScalingProjectPermission,
} from '../../../../common'
import { DaAccessibilityRisk } from './DaAccessibilityRisk'
import { DaAttestationSecurityRisk } from './DaAttestationSecurityRisk'
import { DaExitWindowRisk } from './DaExitWindowRisk'

export type DaBridge = NoDaBridge | OnChainDaBridge | DacBridge

export type NoDaBridge = CommonDaBridge & {
  type: 'NoBridge'
}

export type OnChainDaBridge = CommonDaBridge & {
  type: 'OnChainBridge'
  /**
   * The chain name the data availability bridge lives on
   */
  chain: string

  /**
   * Data about related permissions - preferably from discovery
   */
  permissions: ScalingProjectPermission[]

  /**
   * Data about the contracts used in the bridge - preferably from discovery
   */
  contracts: ScalingProjectContracts
}

export type DacBridge = CommonDaBridge & {
  type: 'DAC'

  /**
   * The chain the DAC attests data on.
   */
  chain: ChainId

  /**
   * Total number of members in the DAC.
   */
  totalMembers: number

  /**
   * Minimum number of members required to sign and attest the data.
   */
  requiredMembers: number

  /**
   * Data about related permissions - preferably from discovery
   */
  permissions: ScalingProjectPermission[]

  /**
   * Data about the contracts used in the bridge - preferably from discovery
   */
  contracts: ScalingProjectContracts
}

type CommonDaBridge = {
  /**
   * Unique identifier of the data availability bridge
   */
  id: string
  display: {
    /**
     * The name of the data availability bridge
     */
    name: string
    /**
     * Slug of the data availability bridge
     */
    slug: string
    /**
     * Description of the data availability bridge
     */
    description: string
  }
  /**
   * The technology used by the data availability bridge. [MARKDOWN]
   */
  technology: string
  /**
   * List of projects given bridge is being used in
   */
  usedIn: ProjectId[]
  /**
   * Risks related to given data availability bridge
   */
  risks: DaBridgeRisks
}

export type DaBridgeRisks = {
  /**
   * Attestation - TBD
   */
  attestations: DaAttestationSecurityRisk

  /**
   * Exit window - TBD
   * @unit seconds
   */
  exitWindow: DaExitWindowRisk

  /**
   * Accessibility - TBD
   */
  accessibility: DaAccessibilityRisk
}
