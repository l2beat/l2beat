import { type DaLayer } from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'

export function kindToType(kind: DaLayer['kind']) {
  switch (kind) {
    case 'PublicBlockchain':
      return 'Public blockchain'
    case 'DAC':
      return 'Data Availability Committee'
    case 'DA Service':
      return 'DA Service'
    case 'No DA':
      return 'No DA'
    default:
      return assertUnreachable(kind)
  }
}
