import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import type { AnalyzedContract } from '../analysis/AddressAnalyzer'

export const EMPTY_ANALYZED_CONTRACT: AnalyzedContract = {
  type: 'Contract',
  address: EthereumAddress.ZERO,
  name: '',
  deploymentTimestamp: UnixTime.ZERO,
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
