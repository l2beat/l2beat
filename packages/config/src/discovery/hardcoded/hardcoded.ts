/*
                      ====== IMPORTANT NOTICE ======

EDIT THIS FILE ONLY WHEN YOU KNOW WHAT YOU ARE DOING

This is a file responsible for hardcoding the data into the config. 
The data is hardcoded because it is not possible to fetch it from the blockchain, using current discovery methods.

Updating this file should be a conscious decision preceded by the research.

DO NOT UPDATE THIS FILE ONLY TO FIX THE TESTS
UNDERSTAND WHAT YOU ARE DOING BEFORE YOU UPDATE THIS FILE
*/

import { ContractValue } from '@l2beat/shared'

export const HARDCODED: Record<string, Record<string, ContractValue>> = {
  arbitrum: {
    SET_VALIDATOR_COUNT: 7,
    SET_IS_BATCH_POSTER_COUNT: 3,
    SEQUENCER: '0xC1b634853Cb333D3aD8663715b08f41A3Aec47cc',
  },
}
