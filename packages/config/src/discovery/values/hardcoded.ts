/*
      ====== IMPORTANT NOTICE ======

EDIT THIS FILE ONLY WHEN YOU KNOW WHAT YOU ARE DOING

This is a file responsible for hardcoding the data into the config. 
The data is hardcoded because it is not possible to fetch it from the blockchain, using current discovery methods.

Updating this file should be a conscious decision preceded by the research.

DO NOT UPDATE THIS FILE ONLY TO FIX THE TESTS
UNDERSTAND WHAT YOU ARE DOING BEFORE YOU UPDATE THIS FILE
*/

import { EthereumAddress } from '@l2beat/shared'

// This is the place to insert hardcoded values
// which should be used inside project's hardcoded tests

export const HARDCODED = {
  ARBITRUM: {
    SET_VALIDATOR_COUNT: 7,
    SET_SEQUENCER_COUNT: 3,
  },
}

// project key needs to equal its ProjectId
// TODO: enforce keys to equal RiskView entries
export const HARDCODED_RISK_VIEW: Record<
  string,
  Record<string, EthereumAddress[]>
> = {
  arbitrum: {
    sequencerFailure: [
      EthereumAddress('0xD03bFe2CE83632F4E618a97299cc91B1335BB2d9'),
    ],
  },
}
