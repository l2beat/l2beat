import { EthereumAddress, Hash256 } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type { providers } from 'ethers'
import type { Transaction } from '../../../../utils/IEtherscanClient'
import type { IProvider } from '../../../provider/IProvider'
import { checkForEigenDA } from './eigen-verification'

const aevoSequencerTransactions: Transaction[] = [
  {
    hash: Hash256.random(),
    to: EthereumAddress.random(),
    // https://etherscan.io/tx/0x75b9e0d7bbe4b6f265afc2fbb56ee948b574c31bfd8eec16a649037237950782
    input:
      '0x01010000f9021bf852f842a018072cf36b236a1a92db45f81cdd589c3889996772c93101dd47ed0997ccdf11a0004bae8a6252d8469c640d3a52e0e982787b40cb8394335eb170aff2f84614ec820800cac480213704c401213704f901c4830146b78201c9f875eca020c70b25cd39f324e9064caeaf97f2ac2fdab6025336c89ca2d50b2f9598114782000182636484014e68a2a0b2d09801a6feecce06c2b84e552c7a7f1aee9bd8348d6be74d89a3b57762e2d00084014e68e4a0df1d667026f338772b1f107264cb55714ebfd57d8a1b5a43b724f29a02f1518ab90140de4b7579289a46c5302702a980e4f0e0e1b23d42782abf5b240196c26065bee995fb1f341c7e21b0b9a86f064e1a464a4cf66984c46bce79e367fce4022d89c47f2cecce7ee3033bb2fbd803be87f394cf6f6f8a90f67e1b1919ebd287dd8a727136a9ae42e60304b2eae56b91def1a56777e31bc8334875f683cd23333481baf29bc4fb61649f108ef1775d8254a3512b9a63450c98fad46faae0a295eb64f1ae061a950598f44bf1e4a5ceed02de8b3f9851337af9c8cfb7663e9f77a2796a6c15320b477d1db750593463c81e539e56551074a5f1b267c73abef63dd0395d6568b2a2d083f581de1af2d3d3de023e96409edb7bc7e51ae9e159935519092092050c4338a2688f3e193fb424bafcc7c927a75190ecbef5c65c1f87e87a6601f338e96e16458a566b57cfa3eb5f687f513a10424a8b01827161563a7f9c8048820001',
  },
  {
    hash: Hash256.random(),
    to: EthereumAddress.random(),
    // https://etherscan.io/tx/0x351d4593880fafc2d28635e7f93ce51816a48d7c972a4cfe613a59017f25dc1e
    input:
      '0x01010000f90219f852f842a015f52694ba34327e6bcf9b94e8eb088032ed988d9f3605fcd757b080ce15e78ca001553e8253721f113beffe2472681bc353d2df825d9ece278fbccb45c7d9af83820400cac480213702c401213702f901c2830146b147f875eca05c340ec1898fa2e297f64ec6c619e2863d020833c565cc02799100265a77c7e182000182636484014e6777a08c48d554c2f79b5bd2a9f2950d8eed7cadf427eeb6832492bca6f81dd7420b530084014e67bea06b5abdab3a7583b9f4ed861c048a6994f2e9a0ef2a110ff28368744560eabc8eb901409e2702dea7c7389d3f201dec43384e0f295effaf108af04565a4f73f10e60b3bf3ace4f710f32cc893363e631ba3cec7a61803f0b3a8315ac2904c53627854e88c051203df67cea85fc22dee67bdd31a0e6ed0857dcd89a7460f092683d9bb70f4f7e16ccc443a01c0f35f1b490da2c756e2257c8cc0e1a50366cac7786565d991e2d6e4606ee9444b673a747a7dae386ef818e03813d7e8859201e8cd27faaac0a091b1fb308bab1c42a32a5678d741c5ae2219608f89b764ed5ebf123141596e6b828e7fd7f8a8f7b2ea042911581b450b7c261a3487f254d3aa84333023a9a33c8acc18ae3c253801a4aa2e778b54e07e226ea41c606ceed6a4d6e89a3681de21a0f93c3686dbda693db38fa3625ea97dac40db51b67aa35abc7af66b99ef0b4221be2bc2a2a85f62774770cd31a9a8505c6ea18e8da7948ac7cb10fb7a77820001',
  },
]

const confirmedBatchHeaderHashes = [
  {
    blobBatchId: 83633,
    blobBatchMetadata:
      '0x6b5abdab3a7583b9f4ed861c048a6994f2e9a0ef2a110ff28368744560eabc8e',
  },
  {
    blobBatchId: 83639,
    blobBatchMetadata:
      '0xdf1d667026f338772b1f107264cb55714ebfd57d8a1b5a43b724f29a02f1518a',
  },
]

describe(checkForEigenDA.name, () => {
  it('should return false if byte-check failes for all sequencer transactions', async () => {
    const invalidTransactions = [
      {
        hash: Hash256.random(),
        to: EthereumAddress.random(),
        input: '0x',
      },
    ]

    const baseProviderMock = mockObject<IProvider>({
      chain: 'ethereum',
      blockNumber: 1,
    })

    const isUsingEigenDA = await checkForEigenDA(
      baseProviderMock,
      invalidTransactions,
    )
    expect(isUsingEigenDA).toEqual(false)
  })

  it('should not throw if byte-check passes but we encounter malformed input', async () => {
    const invalidTransactions = [
      {
        hash: Hash256.random(),
        to: EthereumAddress.random(),
        input: '0x010100', // missing commitment
      },
    ]

    const baseProviderMock = mockObject<IProvider>({
      chain: 'ethereum',
      blockNumber: 1,
    })

    expect(
      checkForEigenDA(baseProviderMock, invalidTransactions),
    ).not.toBeRejected()
  })

  type Thenable<T> = PromiseLike<T> | T

  it('should return true if commitments have been confirmed', async () => {
    const switchableProvider = mockObject<Thenable<IProvider>>({
      chain: 'ethereum',
      blockNumber: 1,
      getEvents: async () =>
        confirmedBatchHeaderHashes.map((cbhh) => ({
          log: {} as providers.Log,
          event: {
            batchHeaderHash: cbhh.blobBatchMetadata,
          },
        })),
      then: undefined,
      switchChain: async () => {
        return new Promise((resolve) => resolve(switchableProvider))
      },
    })

    const isUsingEigenDA = await checkForEigenDA(
      switchableProvider as IProvider,
      aevoSequencerTransactions,
    )
    expect(isUsingEigenDA).toEqual(true)
  })
})
