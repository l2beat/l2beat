import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ESCROW } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer3 } from '../../types'
import { Badge } from '../badges'
import { AnytrustDAC } from '../da-beat/templates/anytrust-template'
import { orbitStackL3 } from '../layer2s/templates/orbitStack'

const discovery = new ProjectDiscovery('inevm', 'arbitrum')

export const inevm: Layer3 = orbitStackL3({
  addedAt: new UnixTime(1730991877), // 2024-11-07T15:04:37+00:00
  additionalPurposes: ['Interoperability'],
  additionalBadges: [Badge.RaaS.Caldera, Badge.DA.DAC],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  display: {
    name: 'inEVM',
    slug: 'inevm',
    description:
      'inEVM is an Orbit stack Optimium built by the Injective team, complementing their Cosmos L1 and Wormhole integration with an EVM-based Layer 3 for Ethereum interoperability.',
    links: {
      websites: ['https://inevm.com/'],
      apps: ['https://inevm.bridge.caldera.xyz/', 'https://inevmbridge.com/'],
      documentation: ['https://docs.inevm.com/'],
      explorers: ['https://inevm.calderaexplorer.xyz/'],
      socialMedia: ['https://x.com/injective'],
    },
  },
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: EthereumAddress('0x173B8dd6960d8922DCF7eD29E245B1041Fcf71Ae'),
      name: 'ERC20Gateway',
      description:
        'Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.',
      tokens: '*',
    }),
    discovery.getEscrowDetails({
      address: EthereumAddress('0x173B8dd6960d8922DCF7eD29E245B1041Fcf71Ae'),
      name: 'CustomGateway',
      description:
        'Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.',
      ...ESCROW.CANONICAL_EXTERNAL,
      tokens: '*',
    }),
  ],
  // gasTokens: ['INJ'],
  // associatedTokens: ['INJ'] // not adding it because it seems to be minted randomly on arbitrum
  rpcUrl: 'https://inevm.calderachain.xyz/http',
  discovery,
  bridge: discovery.getContract('ERC20Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  customDa: AnytrustDAC({ discovery }),
})
