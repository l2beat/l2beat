import {
  ChainId,
  EthereumAddress,
  ProjectId,
  UnixTime,
  formatSeconds,
} from '@l2beat/shared-pure'

import {
  RISK_VIEW,
  makeBridgeCompatible,
} from '../../common'
import { Badge } from '../badges'
import { Layer2 } from './types'

export const shibarium: Layer2 = {
  type: 'layer2',
  id: ProjectId('shibarium'),
  badges: [Badge.VM.EVM],
  display: {
    name: 'Shibarium',
    slug: 'shibarium',
    description: 
      'Shibarium\'s PoS (Proof-of-Stake) chain utilizes sidechains to process transactions, resulting in unparalleled transaction speed and cost efficiency. PoS also guarantees asset security by employing the reliable Plasma bridge framework and a decentralized network of PoS validators.',
    purposes: ['Universal'],
    category: 'Optimium',
    provider: 'Polygon',
    links: {
      websites: [
        'https://shib.io/',
        'https://shibarium.shib.io'
      ],
      apps: ['https://shibarium.shib.io/bridge'],
      documentation: ['https://docs.shib.io'],
      explorers: ['https://www.shibariumscan.io/'],
      repositories: ['https://github.com/shibaone/static'],
      socialMedia: [
        'https://x.com/Shibtoken',
        'https://x.com/ShibariumNet',
        'https://t.me/ShibariumTechnologies',
        'https://discord.gg/shibariumtech',
      ],
    },
  },
  stage: {
    stage: 'NotApplicable',
  },
  chainConfig: {
    name: 'shibarium',
    blockscoutV2ApiUrl: 'https://www.shibariumscan.io/api/v2',
    chainId: 109,
    explorerUrl: 'https://www.shibariumscan.io/',
    explorerApi: {
      url: 'https://www.shibariumscan.io/api',
      type: 'blockscout',
    },
    minTimestampForTvl: new UnixTime(1696917600),
    coingeckoPlatform: 'shibarium',
  },
  config: {
    escrows: [],
  },
  riskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.STATE_FP_1R,
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    exitWindow: RISK_VIEW.EXIT_WINDOW_NON_UPGRADABLE,
    sequencerFailure: RISK_VIEW.SEQUENCER_SELF_SEQUENCE(),
    proposerFailure: RISK_VIEW.PROPOSER_SELF_PROPOSE_ROOTS,
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  technology: {},
  contracts: {
    addresses: [],
    risks: [],
  },
}
