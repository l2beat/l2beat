import { assert } from '@l2beat/shared-pure'
import { DaRelayerFailureRisk, DaUpgradeabilityRisk } from '../common'
import type { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { type CommitteeResult, getCommittee } from '../discovery/starkware'
import type {
  DaBridgeRisks,
  DacInfo,
  DaLayerRisks,
  DaTechnology,
  ProjectCustomDa,
} from '../types'
import { DAC } from './dac-template'

interface TemplateVars {
  dac?: Partial<DacInfo>
  risks?: Partial<DaLayerRisks & DaBridgeRisks>
  discovery?: ProjectDiscovery
}

export function StarkexDAC(template: TemplateVars): ProjectCustomDa {
  const { committeePermission, minSigners }: Partial<CommitteeResult> =
    template.discovery ? getCommittee(template.discovery) : {}

  const membersCount =
    committeePermission?.accounts.length ?? template.dac?.membersCount
  const requiredMembers = minSigners ?? template.dac?.requiredMembers

  assert(
    membersCount,
    'Members count is required, provide either discovery or dac.membersCount',
  )
  assert(
    requiredMembers,
    'Required members is required, provide either discovery or dac.requiredMembers',
  )

  const technology: DaTechnology = {
    description: `
## Architecture
![starkex architecture](/images/da-layer-technology/starkex/architecture.png#center)

The Starkware application utilizes a data availability solution that relies on a Committee Service to ensure data persistence. This architecture comprises the following components:

- **Availability Gateway**: The primary interface provided by the operator for committee members to access new batch information and submit signed availability claims.
- **Data Availability Committee (DAC)**: A group of nodes responsible for storing state data associated with each Merkle root and attesting to data availability by signing claims.
- **Data Batches**: Collections of transactions processed in batches that update the state of accounts, resulting in a new Merkle root representing the updated state.

Committee members run services that interact with the Availability Gateway to obtain information about new batches and submit their signed availability claims. Each batch includes a unique batch_id, a reference to a previous batch, and a list of account updates. 
Committee members combine this information with data from the reference batch to compute the new state and verify the Merkle root.

When the operator produces a new batch, it must be signed by a minimum number of committee members—as defined by the application's configuration—for it to be accepted onchain. 
This includes all members designated as mandatory signers. If the operator attempts to submit a batch without the required signatures, it will be rejected, thereby ensuring that data remains available and consistent.

Committee members are expected to maintain a database that stores the data associated with each batch, making use of storage solutions with a replication factor of at least 2.

## DA Bridge Architecture
![starkex bridge architecture](/images/da-bridge-technology/starkex/architectureL2.png#center)

The DA commitments are posted to the destination chain, using the Committee Verifier contract as a DA bridge.
The DA commitment consists of a data hash of the transaction batch the Committee has signed off on and a concatenation of ec-signatures by signatories.

The Committee Verifier contract verifies the signatures and the data hash and if the required threshold of Committee members has signed off on the data, the hash is stored as a registeredFact in the StarkEx contract.
In a separate transaction, the operator calls the updateState() function on the StarkEx contract to update the state.
Before the state update is accepted, the StarkEx contract verifies the transaction public inputs by calling the isValid() function, which verifies the hash derived from state update inputs matches the hash stored by the Committee Verifier contract.
`,
    risks: [
      {
        category: 'Funds can be lost if',
        text: 'a malicious committee signs a data availability attestation for an unavailable transaction batch.',
      },
    ],
    references: [
      {
        title: 'StarkEx Committee Service - Source Code',
        url: 'https://github.com/starkware-libs/starkex-data-availability-committee',
      },
    ],
  }

  return DAC({
    ...template,
    technology,
    dac: {
      membersCount: membersCount,
      requiredMembers: requiredMembers,
    },
    risks: {
      upgradeability: DaUpgradeabilityRisk.ImmutableNoSecurity,
      relayerFailure: DaRelayerFailureRisk.SelfPropose,
      ...template.risks,
    },
  })
}
