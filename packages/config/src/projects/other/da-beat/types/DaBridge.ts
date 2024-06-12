import { ChainId, EthereumAddress, ProjectId } from '@l2beat/shared-pure'
import { ScalingProjectContractSingleAddress } from '../../../../common'
import { DaAccessibilityRisk } from './DaAccessibilityRisk'
import { DaAttestationSecurityRisk } from './DaAttestationSecurityRisk'
import { DaExitWindowRisk } from './DaExitWindowRisk'

export type DaBridgeKind = (typeof DaBridgeKind)[keyof typeof DaBridgeKind]

const OnChainBridge = {
  type: 'OnChainBridge',
  display: 'On-chain bridge',
} as const

const DAC = {
  type: 'DAC',
  display: 'DAC',
} as const

const NoBridge = {
  type: 'NoBridge',
  display: 'No bridge',
} as const

export const DaBridgeKind = {
  OnChainBridge,
  DAC,
  NoBridge,
}

export type DaBridge = NoDaBridge | OnChainDaBridge | DacBridge

export type NoDaBridge = CommonDaBridge & {
  kind: typeof NoBridge
}

export type OnChainDaBridge = CommonDaBridge & {
  kind: typeof OnChainBridge

  /**
   * The chain ID of the data availability bridge
   */
  chain: ChainId

  /**
   * Data about related permissions - preferably from discovery
   */
  permissions: Permissions[]

  /**
   * Data about the contracts used in the bridge - preferably from discovery
   */
  contracts: ScalingProjectContractSingleAddress
}

export type DacBridge = CommonDaBridge & {
  kind: typeof DAC

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
}

type CommonDaBridge = {
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
   * Accessability - TBD
   */
  accessibility: DaAccessibilityRisk
}

type Permissions = {
  /**
   * List of the accounts
   */
  accounts: PermissionedAccount[]

  /**
   * Name of this group
   */
  name: string

  /**
   * Description of the permissions
   */
  description: string

  /**
   * Name of the chain of these addresses. Optional for backwards compatibility
   */
  chain?: string

  /**
   * List of source code permalinks and useful materials
   */
  references?: Reference[]
}

interface PermissionedAccount {
  address: EthereumAddress
  type: 'EOA' | 'MultiSig' | 'Contract'
}

interface Reference {
  /**
   * Short text describing link contents
   */
  text: string

  /**
   * URL of the link, preferably https
   */
  href: string
}
