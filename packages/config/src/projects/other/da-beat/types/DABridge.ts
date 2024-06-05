import { ChainId, EthereumAddress, ProjectId } from '@l2beat/shared-pure'
import { ScalingProjectContractSingleAddress } from '../../../../common'

export type DABridge = {
  /**
   * The name of the data availability bridge
   */
  name: string

  /**
   * The chain ID of the data availability bridge
   */
  chain: ChainId

  /**
   * Description of the data availability bridge
   */
  description: string

  /**
   * List of projects given bridge is being used in
   */
  usedIn: ProjectId[]

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
  risks: DABridgeRisks

  /**
   * Exit window - TBD
   * @unit seconds
   */
  exitWindow: ExitWindow

  /**
   * Accessability - TBD
   */
  accessability: Accessability
}

type DABridgeRisks = {
  attestations: AttestationSecurity & { description: string }
}

type AttestationSecurity =
  | {
      type: 'SigVerified'
    }
  | {
      type: 'SigVerifiedZK'
    }
  | {
      type: 'SigVerifiedSignersNotTracked'
    }
  | {
      type: 'NotSatisfied'
    }
  | {
      type: 'NoBridge'
    }
  | {
      type: 'CommitmentFrequencySatisfied'
    }

type ExitWindow =
  | {
      type: 'ImmutableOrSCWithDelay'
    }
  | {
      type: 'EOAWithDelay'
    }
  | {
      type: 'SCInsufficientDelay'
    }
  | {
      type: 'NoDelay'
    }
  | {
      type: 'NoBridge'
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
