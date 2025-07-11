import { DaUpgradeabilityRisk } from '../common'
import type { DacInfo, DaTechnology, ProjectCustomDa } from '../types'
import { DAC } from './dac-template'

interface TemplateVars {
  dac: DacInfo
}

export function PolygoncdkDAC(template: TemplateVars): ProjectCustomDa {
  const technology: DaTechnology = {
    description: `
## Architecture
![polygoncdk architecture](/images/da-layer-technology/polygoncdk/architecture${template.dac.membersCount}.png#center)

Polygon CDK validiums utilize a data availability solution that relies on a Data Availability Committee (DAC) to ensure data integrity and manage off-chain transaction data. 
This architecture comprises the following components:
- **Operator**: A trusted entity that collects transactions, computes hash values for the transaction batch, and then requests and collects signatures from Committee members.
- **Data Availability Committee (DAC)**: A group of nodes responsible for validating batch data against the hash values provided by the operator (sequencer), ensuring the data accurately represents the transactions.
- **PolygonCommittee Contract**: Contract responsible for managing the data committee members list.

Each DAC node independently validates the batch data, ensuring it matches the received hash values. 
Upon successful validation, DAC members store the hash values locally and generate signatures endorsing the batch's integrity. 
The sequencer collects these signatures and submits the transactions batch hash together with the aggregated signature on Ethereum.
The PolygonCommittee contract is used during batch sequencing to verify that the signature posted by the sequencer was signed off by the DAC members stored in the contract.

## DA Bridge Architecture
![polygoncdk bridge architecture](/images/da-bridge-technology/polygoncdk/architectureL2.png#center)

The DA commitments are posted to the destination chain through the sequencer inbox, using the inbox as a DA bridge.
The DA commitment consists of a data availability message provided as transaction input, made up of a byte array containing the signatures and all the addresses of the committee in ascending order.
The sequencer distributes the data and collects signatures from Committee members offchain. Only the DA message is posted by the sequencer to the destination chain inbox (the DA bridge).
A separate contract, the PolygonCommittee contract, is used to manage the committee members list and verify the signatures before accepting the DA commitment.
    `,
    risks: [
      {
        category: 'Funds can be lost if',
        text: 'a malicious committee signs a data availability attestation for an unavailable transaction batch.',
      },
      {
        category: 'Funds can be lost if',
        text: 'the bridge contract or its dependencies receive a malicious code upgrade. There is no delay on code upgrades.',
      },
    ],
    references: [
      {
        title: 'Polygon CDK Validium Documentation',
        url: 'https://docs.polygon.technology/cdk/architecture/cdk-validium/#data-availability-committee-dac',
      },
    ],
  }

  return DAC({
    ...template,
    technology,
    risks: {
      upgradeability: DaUpgradeabilityRisk.LowOrNoDelay(0),
    },
  })
}
