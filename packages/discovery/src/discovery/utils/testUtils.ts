import { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { AnalyzedContract, AnalyzedEOA } from '../analysis/AddressAnalyzer'

export const EMPTY_ANALYZED_CONTRACT: AnalyzedContract = {
  type: 'Contract',
  address: ChainSpecificAddress.ZERO('ethereum'),
  name: '',
  deploymentTimestamp: 0,
  deploymentBlockNumber: 0,
  isVerified: false,
  proxyType: '',
  implementations: [],
  values: {},
  errors: {},
  abis: {},
  sourceBundles: [],
  extendedTemplate: undefined,
  ignoreInWatchMode: undefined,
  relatives: {},
  usedTypes: [],
}

export const EMPTY_ANALYZED_EOA: AnalyzedEOA = {
  type: 'EOA',
  address: ChainSpecificAddress.ZERO('ethereum'),
  name: undefined,
  isVerified: false,
  proxyType: 'EOA',
  implementations: [],
  values: {},
  errors: {},
  abis: {},
  sourceBundles: [],
  extendedTemplate: undefined,
  ignoreInWatchMode: undefined,
  relatives: {},
  usedTypes: [],
}
