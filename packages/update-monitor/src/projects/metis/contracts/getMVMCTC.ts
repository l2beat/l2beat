import { providers } from 'ethers'

import { getCallResultWithRevert } from '../../../common/getCallResult'
import { MVM_CanonicalTransaction__factory } from '../../../typechain'
import { ContractParameters } from '../../../types'
import { addresses } from '../constants'

export async function getMVMCTC(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const mvmCTS = MVM_CanonicalTransaction__factory.connect(
    addresses.mvmCanonicalTransactionChain,
    provider,
  )
  const addressManager: string = await mvmCTS.libAddressManager()
  const ownerKey: string = (await mvmCTS.CONFIG_OWNER_KEY()).toString()

  const sequencerAddress = await getCallResultWithRevert<string>(
    provider,
    addressManager,
    'function getAddress(string implementationName) view returns(address)',
    ['1088_MVM_Sequencer_Wrapper'],
  )

  const owner = await getCallResultWithRevert<string>(
    provider,
    addressManager,
    'function getAddress(string implementationName) view returns(address)',
    [ownerKey],
  )

  return {
    name: 'MVM_CanonicalChainWrapper',
    address: mvmCTS.address,
    upgradeability: { type: 'immutable' },
    values: {
      libAddressManager: addressManager,
      configOwnerKey: ownerKey,
      owner: owner,
      sequencer: sequencerAddress,
    },
  }
}
