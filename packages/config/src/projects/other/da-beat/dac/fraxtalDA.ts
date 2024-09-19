import { fraxtal } from '../../../layer2s/fraxtal'
import { NO_BRIDGE } from '../templates/no-bridge-template'
import { DaEconomicSecurityRisk, DaFraudDetectionRisk } from '../types'
import { DaLayer } from '../types/DaLayer'
import { toUsedInProject } from '../utils/to-used-in-project'

export const fraxtalDA: DaLayer = {
  id: 'dac',
  type: 'DaLayer',
  kind: 'DAC',
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
  technology: `
    ## Architecture
    FraxtalDA is a custom data availability solution built by the Fraxtal team. 
    The data is posted by the OP batcher to three separate locations: AWS, IPFS, and Cloudfare R2. 
    The IPFS hash is then submitted to the on-chain inbox contract on Ethereum.
    FraxtalDA relies on a single DA endpoint to manage data posting between the three different locations. 

    ![FraxtalDA](/images/da-layer-technology/fraxtalDA/FraxtalDA.png#center)
    `,
  bridges: [
    NO_BRIDGE({
      layer: 'FraxtalDA',
      description:
        'The risk profile in this page refers to scaling solutions that do not integrate with a data availability bridge.',
      technology: `No DA bridge is selected. Without a DA bridge, Ethereum has no proof of data availability for this project.\n`,
    }),
  ],
  usedIn: [...toUsedInProject([fraxtal])],
  risks: {
    economicSecurity: DaEconomicSecurityRisk.Unknown,
    fraudDetection: DaFraudDetectionRisk.NoFraudDetection,
  },
}
