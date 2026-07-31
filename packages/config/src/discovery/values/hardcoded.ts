/*
      ====== IMPORTANT NOTICE ======

EDIT THIS FILE ONLY WHEN YOU KNOW WHAT YOU ARE DOING

This is a file responsible for hardcoding the data into the config. 
The data is hardcoded because it is not possible to fetch it from the blockchain, using current discovery methods.

Updating this file should be a conscious decision preceded by the research.

DO NOT UPDATE THIS FILE ONLY TO FIX THE TESTS
UNDERSTAND WHAT YOU ARE DOING BEFORE YOU UPDATE THIS FILE
*/

// This is the place to insert hardcoded values
// which should be used inside project's hardcoded tests
const ETHEREUM_BLOCK_TIME_SECONDS = 12
const OP_MAINNET_SEQUENCING_WINDOW_BLOCKS = 3_600

export const HARDCODED = {
  ETHEREUM: {
    BLOCK_TIME_SECONDS: ETHEREUM_BLOCK_TIME_SECONDS,
  },
  ARBITRUM: {
    SET_SEQUENCER_COUNT: 3,
    // https://github.com/OffchainLabs/nitro/blob/master/execution/gethexec/sequencer.go
    L2_BLOCK_TIME_MILLISECONDS: 250,
    // https://github.com/OffchainLabs/nitro/blob/master/timeboost/config.go
    TIMEBOOST_EXPRESS_LANE_ADVANTAGE_MILLISECONDS: 200,
  },
  OPTIMISM: {
    // block_time and seq_window_size can be independently verified by calling
    // optimism_rollupConfig on an OP Mainnet op-node RPC. They deliberately
    // remain hardcoded because this RPC describes node configuration rather
    // than historical L1 state and is not supported by every RPC provider.
    // https://docs.optimism.io/chain-operators/guides/configuration/rollup#sequencerwindowsize
    // https://github.com/ethereum-optimism/optimism/blob/develop/op-deployer/pkg/deployer/state/deploy_config.go#L93
    // https://github.com/ethereum-optimism/optimism/blob/51eeb76efeb32b3df3e978f311188aa29f5e3e94/packages/contracts-bedrock/deploy-config/mainnet.json#LL10C26-L10C30
    L2_BLOCK_TIME_SECONDS: 2,
    SEQUENCING_WINDOW_BLOCKS: OP_MAINNET_SEQUENCING_WINDOW_BLOCKS,
    SEQUENCING_WINDOW_SECONDS:
      OP_MAINNET_SEQUENCING_WINDOW_BLOCKS * ETHEREUM_BLOCK_TIME_SECONDS,
    // https://docs.optimism.io/op-stack/features/flashblocks
    FLASHBLOCK_INTERVAL_MILLISECONDS: 250,
    // This limit is a literal in OptimismPortal2.depositTransaction and has no getter.
    // https://etherscan.io/address/0xe89f13c5ee4033b2d3cd76c9d6958efbfe26d3c2#code
    MAX_DEPOSIT_CALLDATA_BYTES: 120_000,
    // These gas amounts are literals in FaultDisputeGame.getRequiredBond().
    // Together with the discovered maxGameDepth, they define the per-depth
    // multiplier used for dispute-game bonds.
    // https://specs.optimism.io/fault-proof/stage-one/bond-incentives.html#bond-scaling
    FAULT_PROOF_BASE_GAS_CHARGED: 400_000,
    FAULT_PROOF_HIGH_GAS_CHARGED: 300_000_000,
  },
  PUBLICGOODSNETWORK: {
    // https://github.com/ethereum-optimism/optimism/pull/6261/files
    SEQUENCING_WINDOW_SECONDS: 3_600 * ETHEREUM_BLOCK_TIME_SECONDS,
  },
  KROMA: {
    // https://github.com/kroma-network/kroma/blob/dev/packages/contracts/deploy-config/mainnet.json#L9C30-L9C30
    SEQUENCING_WINDOW_SECONDS: 3_600 * ETHEREUM_BLOCK_TIME_SECONDS,
  },
  ZKSYNC: {
    PRIORITY_EXPIRATION_PERIOD: 1209600, // 14 days
  },
  ZKSPACE: {
    PRIORITY_EXPIRATION_PERIOD: 259200, // 3 days
    //https://etherscan.io/address/0x467a2B91f231D930F5eeB6B982C7666E81DA8626#code#F8#L115
    UPGRADE_NOTICE_PERIOD: 691200, // 8 days
  },
}
