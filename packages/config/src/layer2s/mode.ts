import { EthereumAddress, formatSeconds, UnixTime } from '@l2beat/shared-pure'

import { DERIVATION } from '../common'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { HARDCODED } from '../discovery/values/hardcoded'
import { OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING } from './common/liveness'
import { opStack } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('mode')

const FINALIZATION_PERIOD_SECONDS = discovery.getContractValue<number>(
  'L2OutputOracle',
  'FINALIZATION_PERIOD_SECONDS',
)

const upgradeability = {
  upgradableBy: ['ProxyAdmin'],
  upgradeDelay: 'No delay',
}

export const mode: Layer2 = opStack({
  discovery,
  display: {
    name: 'Mode Network',
    slug: 'mode',
    warning:
      'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
    description:
      'Mode is the Ethereum L2 designed for builders and users to grow as the network grows.',
    purposes: ['Universal'],
    links: {
      websites: ['https://mode.network/'],
      apps: [],
      documentation: ['https://docs.mode.network/'],
      explorers: ['https://sepolia.explorer.mode.network/'],
      repositories: [],
      socialMedia: [
        'https://twitter.com/modenetwork',
        'https://discord.gg/modenetworkofficial',
        'https://mode.mirror.xyz/',
        'https://t.me/ModeNetworkOfficial',
      ],
    },
  },
  upgradeability,
  l1StandardBridgeEscrow: EthereumAddress(
    '0x735aDBbE72226BD52e818E7181953f42E3b0FF21',
  ),
  sequencerAddress: EthereumAddress(
    discovery.getContractValue('SystemConfig', 'batcherHash'),
  ),
  inboxAddress: EthereumAddress('0x24e59d9d3bd73ccc28dc54062af7ef7bff58bd67'),
  genesisTimestamp: new UnixTime(1700125343),

  l2OutputOracle: discovery.getContract('L2OutputOracle'),
  portal: discovery.getContract('OptimismPortal'),
  //stateDerivation: DERIVATION.OPSTACK('MODE'),
  isNodeAvailable: true,
  milestones: [
    {
      name: 'Mode Network Launch',
      link: 'https://twitter.com/ourZORA/status/1671602234994622464',
      date: '2024-06-29T00:00:00Z',
      description: 'Mode Network is live on mainnet.',
    },
  ],
  knowledgeNuggets: [],
  roleOverrides: {
    batcherHash: 'Sequencer',
    PROPOSER: 'Proposer',
    GUARDIAN: 'Guardian',
    CHALLENGER: 'Challenger',
  },
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'ModeMultisig',
      'This address is the owner of the following contracts: ProxyAdmin, SystemConfig. It is also designated as a Guardian of the OptimismPortal, meaning it can halt withdrawals. It can upgrade the bridge implementation potentially gaining access to all funds, and change the sequencer, state root proposer or any other system component (unlimited upgrade power).',
    ),
    ...discovery.getMultisigPermission(
      'ChallengerMultisig',
      'This address is the permissioned challenger of the system. It can delete non finalized roots without going through the fault proof process.',
    ),
  ],
  nonTemplateContracts: [
    discovery.getContractDetails('L1ERC721Bridge', {
      description:
        'The L1ERC721Bridge contract is the main entry point to deposit ERC721 tokens from L1 to L2.',
      ...upgradeability,
    }),
  ],
  nonTemplateEscrows: [],
})
