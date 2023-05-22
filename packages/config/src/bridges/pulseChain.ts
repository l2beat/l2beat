import { ProjectId, UnixTime } from '@l2beat/shared'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { CONTRACTS } from '../layer2s/common'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

const discovery = new ProjectDiscovery('pulseChain')

export const pulseChain: Bridge = {
  type: 'bridge',
  id: ProjectId('pulseChain'),
  display: {
    name: 'PulseChain',
    slug: 'pulsechain',
    description: '',
    links: {
      websites: ['https://pulsechain.com/'],
    },
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        identifier: 'ForeignOmnibridge',
        sinceTimestamp: new UnixTime(1684137600),
        tokens: '*',
      }),
    ],
  },
  technology: {
    // not sure about this
    category: 'Token Bridge',
    destination: ['PulseChain'],
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description:
        'Transfers need to be signed offchain by a designed list of Validators.',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: 'Yes',
      description:
        'The code that secures the system can be changed arbitrarily and without notice.',
      sentiment: 'bad',
    },
    destinationToken: RISK_VIEW.WRAPPED,
  },
  contracts: {
    addresses: [
      discovery.getMainContractDetails(
        'ForeignOmnibridge',
        'The main Bridge contract and the escrow for the PulseChain bridge. It is used to deposit tokens to the bridge.',
      ),
      discovery.getMainContractDetails(
        'ForeignAMB',
        'The Arbitrary Message Bridge receiving messages from the Foreign Chain. It is used for processing withdrawals from the bridge.',
      ),
      discovery.getMainContractDetails(
        'BridgeValidators',
        'Contract managing the list of trusted bridge Validators.',
      ),
      discovery.getMainContractDetails(
        'WETHOmnibridgeRouter',
        'The Auxiliary contract that handles wrapped tokens.',
      ),
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
}
