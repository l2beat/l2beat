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

import { ProjectPermissionedAccount } from '../../common'

export const HARDCODED_PERMISSIONS: Record<
  string,
  Record<string, ProjectPermissionedAccount[]>
> = {
  arbitrum: {
    SEQUENCER: [
      {
        address: EthereumAddress('0xC1b634853Cb333D3aD8663715b08f41A3Aec47cc'),
        type: 'EOA',
      },
    ],
    VALIDATORS: [
      {
        address: EthereumAddress('0x758C6bB08B3ea5889B5cddbdeF9A45b3a983c398'),
        type: 'Contract',
      },
      {
        address: EthereumAddress('0xf59caf75e8A4bFBA4e6e07aD86C7E498E4d2519b'),
        type: 'Contract',
      },
      {
        address: EthereumAddress('0x6Fb914de4653eC5592B7c15F4d9466Cbd03F2104'),
        type: 'EOA',
      },
      {
        address: EthereumAddress('0x0fF813f6BD577c3D1cDbE435baC0621BE6aE34B4'),
        type: 'EOA',
      },
      {
        address: EthereumAddress('0x56D83349c2B8DCF74d7E92D5b6B33d0BADD52D78'),
        type: 'Contract',
      },
      {
        address: EthereumAddress('0xB0CB1384e3f4a9a9b2447e39b05e10631E1D34B0'),
        type: 'Contract',
      },
      {
        address: EthereumAddress('0x610Aa279989F440820e14248BD3879B148717974'),
        type: 'EOA',
      },
      {
        address: EthereumAddress('0xdDf2F71Ab206C0138A8eceEb54386567D5abF01E'),
        type: 'EOA',
      },
      {
        address: EthereumAddress('0x54c0D3d6C101580dB3be8763A2aE2c6bb9dc840c'),
        type: 'EOA',
      },
      {
        address: EthereumAddress('0xF8D3E1cF58386c92B27710C6a0D8A54c76BC6ab5'),
        type: 'EOA',
      },
      {
        address: EthereumAddress('0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5'),
        type: 'Contract',
      },
      {
        address: EthereumAddress('0xAB1A39332e934300eBCc57B5f95cA90631a347FF'),
        type: 'EOA',
      },
      {
        address: EthereumAddress('0x7CF3d537733F6Ba4183A833c9B021265716cE9d0'),
        type: 'Contract',
      },
    ],
  },
}

export const TESTS_HARDCODED = {
  ARBITRUM_SET_VALIDATOR_COUNT: 7,
  ARBITRUM_SET_SEQUENCER_COUNT: 3,
}
