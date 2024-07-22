import { type DaLayer } from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'

export function kindToType(kind: DaLayer['kind']) {
  switch (kind) {
    case 'public-blockchain':
      return 'Public blockchain'
    case 'dac':
      return 'Data Availability Committee'
    default:
      return assertUnreachable(kind)
  }
}
