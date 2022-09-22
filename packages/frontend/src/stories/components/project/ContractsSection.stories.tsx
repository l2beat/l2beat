import React from 'react'

import { ContractsSection as ContractsSectionComponent } from '../../../components/project/ContractsSection'

export default {
  title: 'Components/Project/ContractsSection',
}

export function ContractsSection() {
  return (
    <div className="leading-normal p-4">
      <ContractsSectionComponent
        contracts={[
          {
            name: 'CanonicalTransactionChain',
            address: '0x5E4e65926BA27467555EB562121fac00D24E9dD2',
            description:
              'The Canonical Transaction Chain (CTC) contract is an append-only log of transactions which must be applied to the OVM state. It defines the ordering of transactions by writing them to the CTC:batches instance of the Chain Storage Container. CTC batches can only be submitted by OVM_Sequencer. The CTC also allows any account to enqueue() an L2 transaction, which the Sequencer must eventually append to the rollup state.',
            links: [],
          },
          {
            name: 'L1CrossDomainMessenger',
            address: '0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1',
            description:
              "The L1 Cross Domain Messenger (L1xDM) contract sends messages from L1 to L2, and relays messages from L2 onto L1. In the event that a message sent from L1 to L2 is rejected for exceeding the L2 epoch gas limit, it can be resubmitted via this contract's replay function.",
            links: [
              { href: '#', name: 'Implementation (Upgradable)' },
              { href: '#', name: 'Admin' },
            ],
          },
          {
            name: 'L1Escrow',
            address: '0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65',
            description:
              'DAI Vault for custom DAI Gateway managed by MakerDAO. This contract stores the following tokens: DAI.',
            links: [],
          },
        ]}
        risks={[
          {
            text: 'Funds can be stolen if a contract receives a malicious code upgrade. There is no delay on code upgrades.',
            isCritical: true,
          },
        ]}
        references={[]}
        architectureImage="/images/optimism-architecture.png"
      />
    </div>
  )
}
