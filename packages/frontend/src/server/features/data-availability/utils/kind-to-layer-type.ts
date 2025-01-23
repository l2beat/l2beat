import {
  type BlockchainDaLayer,
  type DaServiceDaLayer,
  type DacDaLayer,
  type EthereumDaLayer,
} from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'

type LayerKind =
  | BlockchainDaLayer
  | EthereumDaLayer
  | DaServiceDaLayer
  | DacDaLayer

export function kindToType(kind: LayerKind['kind']) {
  switch (kind) {
    case 'PublicBlockchain':
    case 'EthereumDaLayer':
      return 'Public blockchain'
    case 'DAC':
      return 'Data Availability Committee'
    case 'DA Service':
      return 'DA Service'
    case 'No DAC':
      return 'No DAC'
    default:
      return assertUnreachable(kind)
  }
}
