import { bridges } from '../bridges'
import { layer2s } from '../layer2s'
import { layer3s } from '../layer3s'
import { refactored } from '../refactored'

/** @deprecated */
export const chains = [
  ...layer2s.map((p) => p.chainConfig).filter((x) => x !== undefined),
  ...layer3s.map((p) => p.chainConfig).filter((x) => x !== undefined),
  ...bridges.map((p) => p.chainConfig).filter((x) => x !== undefined),
  ...refactored.map((p) => p.chainConfig).filter((x) => x !== undefined),
]
