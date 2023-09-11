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
      '0x7444DE636699F080cA1C033528D2bB3705B391Ce',
      '0x2E64926BE35412f7710A3E097Ba076740bF97CC0',
      '0xdC7c3D03845EfE2c4a9E758A70a68BA6bba9FaC4',
      '0x62aA95ac4740A367746A664C4C69034d52E968EF',
      '0x7Ed066718Dfb1b2B04D94780Eca92b67ECF3330b',
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
