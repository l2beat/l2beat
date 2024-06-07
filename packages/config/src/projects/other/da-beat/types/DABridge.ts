import { ChainId, EthereumAddress, ProjectId } from '@l2beat/shared-pure'
import { ScalingProjectContractSingleAddress } from '../../../../common'

export type DaBridge = NoDaBridge | OnChainDaBridge | DacBridge

export type NoDaBridge = CommonDaBridge & {
  type: 'NoBridge'
}

export type OnChainDaBridge = CommonDaBridge & {
  type: 'OnChain'
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

  /**
   * Risks related to given data availability bridge
   */
  risks: DaBridgeRisks
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

    /**
     * The logo of the data availability bridge.
     * Will be resolved automatically by the frontend.
     * @override if the logo has different name
     */
    logo?: string
  }

  /**
   * List of projects given bridge is being used in
   */
  usedIn: ProjectId[]
}

type DaBridgeRisks = {
  /**
   * Attestation - TBD
   */
  attestations: AttestationSecurity & { description?: string }

  /**
   * Exit window - TBD
   * @unit seconds
   */
  exitWindow: ExitWindow & { description?: string }

  /**
   * Accessability - TBD
   */
  accessability: Accessability & { description?: string }
}

type AttestationSecurity =
  | {
      type: 'SigVerified'
      areSignersTracked: boolean
    }
  | {
      type: 'SigVerifiedZK'
      areSignersTracked: boolean
    }
  | {
      type: 'NotSatisfied'
    }
  | {
      type: 'CommitmentFrequencySatisfied'
    }

type ExitWindow = {
  party: 'EOA' | 'SecurityCouncil' | 'Immutable'
  delay: number | 'NoDelay'
}

type Accessability =
  | {
      type: 'Enshrined'
    }
  | { type: 'NotEnshrined' }

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
