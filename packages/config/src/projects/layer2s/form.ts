import { UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer2 } from '../../types'
import { opStackL2 } from './templates/opStack'

const discovery = new ProjectDiscovery('form');

export const form: Layer2 = opStackL2({
  addedAt: new UnixTime(1733419991), // Thu, 05 Dec 2024 17:33:11 GMT
  discovery,
  display: {
    name: 'Form',
    slug: 'form',
    description:
      'Form is an Optimistic Rollup utilizing the OP Stack. The Form L2 is focused on bringing mass adoption and interoperability to the SocialFi category.',
    category: 'Optimistic Rollup',
    stack: 'OP Stack',
    links: {
      websites: ['https://form.network'],
      apps: ['https://bridge.form.network'],
      documentation: ['https://docs.form.network'],
      explorers: ['https://explorer.form.network'],
      repositories: ['https://github.com/form-network'],
      socialMedia: [
        'https://x.com/0xform',
        'https://discord.com/invite/formnetwork',
        'https://t.me/formnetwork',
      ],
    },
  },
  chainConfig: {
    name: 'form',
    chainId: 478,
    explorerUrl: 'https://explorer.form.network/',
    explorerApi: {
      url: 'https://explorer.form.network/api/v2',
      type: 'blockscout',
    },
    blockscoutV2ApiUrl: 'https://explorer.form.network/api/v2',
    minTimestampForTvl: new UnixTime(1733419991),
  },
  genesisTimestamp: new UnixTime(1733419991),
  rpcUrl: 'https://rpc.form.network/http',
  isNodeAvailable: true,
  associatedTokens: ['FORM'],
  riskView: {
    stateValidation: {
      value: "Optimistic",
      description: "Fraud proofs are under development. Users need to trust block proposer to submit valid state roots.",
      sentiment: "warning",
      secondLine: "7d challenge period"
    },
    dataAvailability: {
      value: "On Chain",
      description: "All transaction data is posted to Ethereum L1.",
      sentiment: "good"
    },
    exitWindow: {
      value: "7 days",
      description: "Users have 7 days to exit if they detect an invalid state root.",
      sentiment: "warning"
    },
    sequencerFailure: {
      value: "Self sequence",
      description: "In case of sequencer failure, users can force transactions via L1.",
      sentiment: "good",
      secondLine: "12h delay"
    },
    proposerFailure: {
      value: "Force exit",
      description: "Users can force exit through L1 if state roots are not being published.",
      sentiment: "warning"
    }
  },
})
