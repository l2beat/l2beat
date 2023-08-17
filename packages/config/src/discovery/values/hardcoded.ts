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
    SET_VALIDATOR_COUNT: 7,
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
  ZKSYNC_2: {
    FACETS: [
      '0x8c0f38F13526fCB379a80B87F4DEbdBCC9CAEcbD',
      '0xf002dFBc52C250a2E14C148041aDB8567a0B19BD',
      '0xab458aCbD8FF9B6cF7B8a029705A02F70DCDBf7D',
      '0x9B1A10bDC4A40219544C835263b2cA3f3e689693',
      '0xA389bF185B301C8e20E79E3098e71399914035dF',
    ],
    SECURITY_COUNCIL: '0x0000000000000000000000000000000000000000',
    GOVERNOR: '0x4e4943346848c4867F81dFb37c4cA9C5715A7828',
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
