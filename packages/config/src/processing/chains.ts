import type { ChainConfig } from '../types'
import { bridges } from './bridges'
import { layer2s } from './layer2s'
import { layer3s } from './layer3s'
import { refactored } from './refactored'

const getChainConfigs = (projects: Array<{ chainConfig?: ChainConfig }>) =>
  projects.flatMap(({ chainConfig }) => (chainConfig ? [chainConfig] : []))

/** @deprecated */
export const chains = [
  ...getChainConfigs(layer2s),
  ...getChainConfigs(layer3s),
  ...getChainConfigs(bridges),
  ...getChainConfigs(refactored),
]
