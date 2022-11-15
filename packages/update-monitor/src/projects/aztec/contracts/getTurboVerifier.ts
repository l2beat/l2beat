import { ContractParameters } from '../../../types'
import { addresses } from '../constants'

export function getTurboVerifier(): ContractParameters {
  return {
    name: 'TurboVerifier',
    address: addresses.turboVerifier,
    upgradeability: { type: 'immutable' },
  }
}
