import { bridges } from './bridges'
import { layer2s } from './layer2s'
import { layer3s } from './layer3s'
import { refactored } from './refactored'

/** @deprecated */
export const chains = [
  ...layer2s.flatMap((p) => (p.chainConfig === undefined ? [] : [p.chainConfig])),
  ...layer3s.flatMap((p) => (p.chainConfig === undefined ? [] : [p.chainConfig])),
  ...bridges.flatMap((p) => (p.chainConfig === undefined ? [] : [p.chainConfig])),
  ...refactored.flatMap((p) =>
    p.chainConfig === undefined ? [] : [p.chainConfig],
  ),
]
