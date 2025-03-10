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
export const HARDCODED = {
  ARBITRUM: {
    SET_SEQUENCER_COUNT: 3,
  },
  OPTIMISM: {
    // https://github.com/ethereum-optimism/optimism/blob/51eeb76efeb32b3df3e978f311188aa29f5e3e94/packages/contracts-bedrock/deploy-config/mainnet.json#LL10C26-L10C30
    SEQUENCING_WINDOW_SECONDS: 3600 * 12, // blocks * blocktime
  },
  PUBLICGOODSNETWORK: {
    // https://github.com/ethereum-optimism/optimism/pull/6261/files
    SEQUENCING_WINDOW_SECONDS: 3600 * 12, // blocks * blocktime
  },
  KROMA: {
    // https://github.com/kroma-network/kroma/blob/dev/packages/contracts/deploy-config/mainnet.json#L9C30-L9C30
    SEQUENCING_WINDOW_SECONDS: 3600 * 12, // blocks * blocktime
  },
  STARGATE: {
    // if any of those change, please update stargate.ts. It will probably also require updating the discovery config, to make sure we discover the new oracles and relayers
    ORACLE_COUNT: 2,
    RELAYER_COUNT: 1,
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
