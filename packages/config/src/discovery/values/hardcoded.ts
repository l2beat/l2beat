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
  ZKSYNC_2: {
    FACETS: [
      '0xF1fB730b7f8E8391B27B91f8f791e10E4a53CEcc',
      '0x6df4A6D71622860dcc64C1FD9645d9a5BE96f088',
      '0x2a2d6010202B93E727b61a60dfC1d5CF2707c1CE',
      '0x389a081BCf20e5803288183b929F08458F1d863D',
      '0xb2097DBe4410B538a45574B1FCD767E2303c7867',
    ],
    SECURITY_COUNCIL: '0x0000000000000000000000000000000000000000',
    GOVERNOR: '0x4e4943346848c4867F81dFb37c4cA9C5715A7828',
  },
}
