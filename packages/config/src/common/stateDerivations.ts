import type { ProjectScalingStateDerivation } from '../types'

type SupportedOPStackChains =
  | 'OP_MAINNET'
  | 'BASE'
  | 'ZORA'
  | 'PGN'
  | 'MODE'
  | 'LISK'
  | 'HASHKEY'
  | 'ARENAZ'
  | 'SONEIUM'
  | 'SWELL'
  | 'WORLD'
  | 'SHAPE'
  | 'UNICHAIN'
  | 'INK'
  | 'SNAXCHAIN'
  | 'METAL'
  | 'SUPERSEED'
  | 'POLYNOMIAL'
  | 'MINT'
  | 'SNAXCHAIN'
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
    'https://github.com/ethereum-optimism/superchain-registry/blob/main/superchain/extra/genesis/mainnet/mode.json.zst',
  ],
  LISK: [
    'https://github.com/ethereum-optimism/superchain-registry/blob/main/superchain/configs/mainnet/lisk.toml',
    'https://github.com/ethereum-optimism/superchain-registry/blob/main/superchain/extra/genesis/mainnet/lisk.json.zst',
  ],
  HASHKEY: [
    'https://github.com/ethereum-optimism/superchain-registry/blob/main/superchain/configs/mainnet/hashkeychain.toml',
    'https://github.com/ethereum-optimism/superchain-registry/blob/main/superchain/extra/genesis/mainnet/hashkeychain.json.zst',
  ],
  ARENAZ: [
    'https://github.com/ethereum-optimism/superchain-registry/blob/main/superchain/configs/mainnet/arena-z.toml',
    'https://github.com/ethereum-optimism/superchain-registry/blob/main/superchain/extra/genesis/mainnet/arena-z.json.zst',
  ],
  SONEIUM: [
    'https://github.com/ethereum-optimism/superchain-registry/blob/main/superchain/configs/mainnet/soneium.toml',
    'https://github.com/ethereum-optimism/superchain-registry/blob/main/superchain/extra/genesis/mainnet/soneium.json.zst',
  ],
  SWELL: [
    'https://github.com/ethereum-optimism/superchain-registry/blob/main/superchain/configs/mainnet/swell.toml',
    'https://github.com/ethereum-optimism/superchain-registry/blob/main/superchain/extra/genesis/mainnet/swell.json.zst',
  ],
  WORLD: [
    'https://github.com/ethereum-optimism/superchain-registry/blob/main/superchain/configs/mainnet/worldchain.toml',
    'https://github.com/ethereum-optimism/superchain-registry/blob/main/superchain/extra/genesis/mainnet/worldchain.json.zst',
  ],
  SHAPE: [
    'https://github.com/ethereum-optimism/superchain-registry/blob/main/superchain/configs/mainnet/shape.toml',
    'https://github.com/ethereum-optimism/superchain-registry/blob/main/superchain/extra/genesis/mainnet/shape.json.zst',
  ],
  UNICHAIN: [
    'https://github.com/ethereum-optimism/superchain-registry/blob/main/superchain/configs/mainnet/unichain.toml',
    'https://github.com/ethereum-optimism/superchain-registry/blob/main/superchain/extra/genesis/mainnet/unichain.json.zst',
  ],
  INK: [
    'https://github.com/ethereum-optimism/superchain-registry/blob/main/superchain/configs/mainnet/ink.toml',
    'https://github.com/ethereum-optimism/superchain-registry/blob/main/superchain/extra/genesis/mainnet/ink.json.zst',
  ],
  SNAXCHAIN: [
    'https://github.com/ethereum-optimism/superchain-registry/blob/main/superchain/configs/mainnet/snax.toml',
    'https://github.com/ethereum-optimism/superchain-registry/blob/main/superchain/extra/genesis/mainnet/snax.json.zst',
  ],
  METAL: [
    'https://github.com/ethereum-optimism/superchain-registry/blob/main/superchain/configs/mainnet/metal.toml',
    'https://github.com/ethereum-optimism/superchain-registry/blob/main/superchain/extra/genesis/mainnet/metal.json.zst',
  ],
  SUPERSEED: [
    'https://api.conduit.xyz/file/v1/optimism/rollup/superseed-mainnet-0',
    'https://api.conduit.xyz/file/v1/optimism/genesis/superseed-mainnet-0',
  ],
  POLYNOMIAL: [
    'https://api.conduit.xyz/file/v1/optimism/rollup/polynomial-mainnet-0',
    'https://api.conduit.xyz/file/v1/optimism/genesis/polynomial-mainnet-0',
  ],
  MINT: [
    'https://api.conduit.xyz/file/v1/optimism/rollup/mint-mainnet-0',
    'https://api.conduit.xyz/file/v1/optimism/genesis/mint-mainnet-0',
  ],
}

function OPSTACK(chain: SupportedOPStackChains): ProjectScalingStateDerivation {
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
