import { type DaLayer } from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'

export function kindToType(kind: DaLayer['kind']) {
  switch (kind) {
    case 'PublicBlockchain':
      return 'Public blockchain'
    case 'DAC':
      return 'Data Availability Committee'
    default:
      return assertUnreachable(kind)
  }
}
