import { fraxtal } from '../../../layer2s/fraxtal'
import { DaEconomicSecurityRisk, DaFraudDetectionRisk } from '../types'
import { DaLayer } from '../types/DaLayer'
import { toUsedInProject } from '../utils/to-used-in-project'
import { fraxtalDABridge } from './bridges/fraxtalDABridge'

export const fraxtalDA: DaLayer = {
  id: 'dac',
  type: 'DaLayer',
  kind: 'No DAC',
  systemCategory: 'custom',
  display: {
    name: 'FraxtalDA',
    slug: 'fraxtal',
    description:
      'FraxtalDA is a custom data availability solution built by the Fraxtal team.',
    links: {
      websites: ['https://frax.com/'],
      apps: ['https://app.frax.finance/'],
      documentation: ['https://docs.frax.com/'],
      explorers: ['https://fraxscan.com/'],
      repositories: ['https://github.com/FraxFinance'],
      socialMedia: [
        'https://discord.com/invite/UJVtDTFRaA',
        'https://twitter.com/fraxfinance',
        'https://t.me/fraxfinance',
      ],
    },
  },
  technology: {
    description: `
    ## Architecture
    FraxtalDA is a custom data availability solution built by the Fraxtal team. 
    The data is posted by the OP batcher to three separate locations: AWS, IPFS, and Cloudfare R2. 
    The IPFS hash is then submitted to the on-chain inbox contract on Ethereum.
    FraxtalDA relies on a single DA endpoint to manage data posting between the three different locations. 

    ![FraxtalDA](/images/da-layer-technology/fraxtalDA/FraxtalDA.png#center)

    The sequencer attests to data availability by posting an IPFS hash to an on-chain inbox contract on Ethereum. L2 nodes derive the L2 chain from the L1 by reading transactions commitments from this sequencer inbox.
        When reading from the inbox, the op-node verifies that the commitment hash is a valid IPFS CID. If the data corresponding to the hash is missing from IPFS, the op-node will halt, preventing further derivation of the L2 chain. 
    `,
  },
  bridges: [
    fraxtalDABridge,
  ],
  usedIn: [...toUsedInProject([fraxtal])],
  risks: {
    economicSecurity: DaEconomicSecurityRisk.Unknown,
    fraudDetection: DaFraudDetectionRisk.NoFraudDetection,
  },
}
