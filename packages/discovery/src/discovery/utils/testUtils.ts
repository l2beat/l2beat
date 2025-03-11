import { EthereumAddress } from '@l2beat/shared-pure'
import type { AnalyzedContract, AnalyzedEOA } from '../analysis/AddressAnalyzer'

export const EMPTY_ANALYZED_CONTRACT: AnalyzedContract = {
  type: 'Contract',
  address: EthereumAddress.ZERO,
  name: '',
  deploymentTimestamp: 0,
  deploymentBlockNumber: 0,
  derivedName: undefined,
  isVerified: false,
  proxyType: '',
  implementations: [],
  values: {},
  fieldsMeta: {},
  errors: {},
  abis: {},
  sourceBundles: [],
  extendedTemplate: undefined,
  ignoreInWatchMode: undefined,
  relatives: {},
  selfMeta: undefined,
  usedTypes: [],
}

export const EMPTY_ANALYZED_EOA: AnalyzedEOA = {
  type: 'EOA',
  address: EthereumAddress.ZERO,
  name: undefined,
  derivedName: undefined,
  isVerified: false,
  proxyType: 'EOA',
  implementations: [],
  values: {},
  fieldsMeta: {},
  errors: {},
  abis: {},
  sourceBundles: [],
  extendedTemplate: undefined,
  ignoreInWatchMode: undefined,
  relatives: {},
  selfMeta: undefined,
  usedTypes: [],
}
