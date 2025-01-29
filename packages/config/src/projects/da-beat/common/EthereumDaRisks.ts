import type { TableReadyValue } from '../../../types'

const SelfVerify: TableReadyValue = {
  value: 'Self-verify',
  sentiment: 'good',
  description: `Full nodes download the full data for both transactions on the execution layer, and data blobs on the consensus layer. For a block to be considered valid, all data must be available and pass the is_data_available() check. From the rollup perspective, Ethereum's canonical chain cannot contain unavailable data commitments as full nodes self-verify the data availability of each block, discarding blocks with unavailable data.
    `,
}

const Enshrined: TableReadyValue = {
  value: 'Enshrined',
  sentiment: 'good',
  description: `Rollup users have access to all the data, as it is posted onchain on the consensus layer. On the execution layer, the rollup relies on blob data commitment (versioned hashes), which are accessible through the BLOBHASH opcode. 
The rollup smart contracts can use these blob commitments during state transition validation to reference blobs during proof verification, without requiring direct access to the raw blob data.
      `,
}

export const EthereumDaLayerRisks = {
  SelfVerify,
}

export const EthereumDaBridgeRisks = {
  Enshrined,
}
