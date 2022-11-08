import { ContractParameters } from '../../../types'
import { addresses } from '../constants'

export function getAztecFeeDistributor(): ContractParameters {
  return {
    name: 'AztecFeeDistributor',
    address: addresses.feeDistributor,
    upgradeability: { type: 'immutable' },
  }
}
