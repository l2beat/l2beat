/*
      ====== IMPORTANT NOTICE ======

EDIT THIS FILE ONLY WHEN YOU KNOW WHAT YOU ARE DOING

This is a file responsible for hardcoding the data into the config. 
The data is hardcoded because it is not possible to fetch it from the blockchain, using current discovery methods.

Updating this file should be a conscious decision preceded by the research.

DO NOT UPDATE THIS FILE ONLY TO FIX THE TESTS
UNDERSTAND WHAT YOU ARE DOING BEFORE YOU UPDATE THIS FILE
*/

import { ARBITRUM_HARDCODED } from './projects/arbitrumHardcoded'

// This is the entry point for hardcoding values in the config
// only HARDCODED object should be imported in project's config

export const HARDCODED = {
  ARBITRUM: ARBITRUM_HARDCODED,
}
