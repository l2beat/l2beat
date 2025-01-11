import { DaEconomicSecurityRisk, DaFraudDetectionRisk } from '../types'
import { DacDaLayer } from '../types/DaLayer'
import { fraxtalDABridge } from './bridges/fraxtalDABridge'

export const fraxtalDA: DacDaLayer = {
  id: 'fraxtal-da',
  type: 'DaLayer',
  kind: 'No DAC',
  systemCategory: 'custom',
  display: {
    name: 'FraxtalDA',
    slug: 'fraxtal',
    description:
      'FraxtalDA is a custom data availability solution built by the Fraxtal team.',
  },
  technology: {
    description: `
    ## Architecture
    FraxtalDA is a custom data availability solution built by the Fraxtal team. 
    The data is posted by the OP batcher to three separate locations: AWS, IPFS, and Cloudfare R2. 
    The IPFS hash is then submitted to the onchain inbox contract on Ethereum.
    FraxtalDA relies on a single DA endpoint to manage data posting between the three different locations. 

    ![FraxtalDA](/images/da-layer-technology/fraxtalDA/FraxtalDA.png#center)

    The sequencer attests to data availability by posting an IPFS hash to an onchain inbox contract on Ethereum. L2 nodes derive the L2 chain from the L1 by reading transactions commitments from this sequencer inbox.
        When reading from the inbox, the op-node verifies that the commitment hash is a valid IPFS CID. If the data corresponding to the hash is missing from IPFS, the op-node will halt, preventing further derivation of the L2 chain. 
    `,
    references: [
      {
        text: 'FraxtalDA Documentation',
        href: 'https://docs.frax.com/fraxtal/network/data-availability',
      },
      {
        text: 'Fraxtal DA Follower - Source Code',
        href: 'https://github.com/FraxFinance/fraxtal-da-follower/blob/791e849b41465e1e00377f57c8f0c49d4b13caa8/main.go',
      },
    ],
    risks: [
      {
        category: 'Funds can be lost if',
        text: `the sequencer posts an invalid data availability commitment.`,
      },
    ],
  },
  bridge: fraxtalDABridge,
  risks: {
    economicSecurity: DaEconomicSecurityRisk.Unknown,
    fraudDetection: DaFraudDetectionRisk.NoFraudDetection,
  },
}
