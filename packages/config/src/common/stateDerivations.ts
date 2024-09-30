import { ScalingProjectStateDerivation } from './ScalingProjectStateDerivation'

type SupportedOPStackChains =
  | 'OP_MAINNET'
  | 'BASE'
  | 'ZORA'
  | 'PGN'
  | 'MODE'
  | 'LISK'
type OPStackInfo = [string, string] // [config, genesis file]

const OPStackInfos: Record<SupportedOPStackChains, OPStackInfo> = {
  OP_MAINNET: [
    'https://github.com/ethereum-optimism/superchain-registry/blob/main/superchain/configs/mainnet/op.toml',
    'https://docs.optimism.io/builders/node-operators/configuration/base-config',
  ],
  ZORA: [
    'https://github.com/ethereum-optimism/superchain-registry/blob/main/superchain/configs/mainnet/zora.toml',
    'https://github.com/ethereum-optimism/superchain-registry/tree/main/superchain/extra/genesis/mainnet',
  ],
  PGN: [
    'https://github.com/ethereum-optimism/superchain-registry/blob/v0.1.1/superchain/configs/mainnet/pgn.yaml',
    'https://github.com/ethereum-optimism/superchain-registry/tree/main/superchain/extra/genesis/mainnet',
  ],
  BASE: [
    'https://github.com/ethereum-optimism/superchain-registry/blob/main/superchain/configs/mainnet/base.toml',
    'https://raw.githubusercontent.com/base-org/node/refs/tags/v0.8.4/mainnet/genesis-l2.json',
  ],
  MODE: [
    'https://github.com/ethereum-optimism/superchain-registry/blob/main/superchain/configs/mainnet/mode.toml',
    'https://github.com/ethereum-optimism/superchain-registry/blob/main/superchain/extra/genesis/mainnet/mode.json.gz',
  ],
  LISK: [
    'https://github.com/ethereum-optimism/superchain-registry/blob/main/superchain/configs/mainnet/lisk.toml',
    'https://github.com/ethereum-optimism/superchain-registry/blob/main/superchain/extra/genesis/mainnet/lisk.json.gz',
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
