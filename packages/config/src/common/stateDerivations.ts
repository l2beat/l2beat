import { ScalingProjectStateDerivation } from './ScalingProjectStateDerivation'

type SupportedOPStackChains = 'OP_MAINNET' | 'BASE' | 'ZORA' | 'PGN'
type OPStackInfo = [string, string] // [config, genesis file]

const OPStackInfos: Record<SupportedOPStackChains, OPStackInfo> = {
  OP_MAINNET: [
    'https://github.com/ethereum-optimism/superchain-registry/blob/main/superchain/configs/mainnet/op.yaml',
    'https://community.optimism.io/docs/useful-tools/networks/#parameters-for-node-operators',
  ],
  ZORA: [
    'https://github.com/ethereum-optimism/superchain-registry/blob/main/superchain/configs/mainnet/zora.yaml',
    'https://github.com/ethereum-optimism/superchain-registry/tree/main/superchain/extra/genesis/mainnet',
  ],
  PGN: [
    'https://github.com/ethereum-optimism/superchain-registry/blob/main/superchain/configs/mainnet/pgn.yaml',
    'https://github.com/ethereum-optimism/superchain-registry/tree/main/superchain/extra/genesis/mainnet',
  ],
  BASE: [
    'https://github.com/ethereum-optimism/superchain-registry/blob/main/superchain/configs/mainnet/base.yaml',
    'https://raw.githubusercontent.com/base-org/node/main/mainnet/genesis-l2.json ',
  ],
}

function OPSTACK(chain: SupportedOPStackChains): ScalingProjectStateDerivation {
  const [config, genesis] = OPStackInfos[chain]
  return {
    nodeSoftware: `The rollup node is composed of two software components: [op-node](https://github.com/ethereum-optimism/optimism/tree/develop/op-node), implementing consensus related logic, and [op-geth](https://github.com/ethereum-optimism/op-geth), implementing execution logic. The configuration file can be found [here](${config}).`,
    compressionScheme:
      'Data batches are compressed using the [zlib](https://github.com/madler/zlib) algorithm with best compression level.',
    genesisState: `The genesis file can be found [here](${genesis}).`,
    dataFormat:
      "The format specification of Sequencer's data batches can be found [here](https://blog.oplabs.co/reproduce-bedrock-migration/).",
  }
}

export const DERIVATION = {
  OPSTACK,
}
