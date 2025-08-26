import { EthereumAddress, Hash256 } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
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
  {
    hash: Hash256.random(),
    to: EthereumAddress.random(),
    // https://etherscan.io/tx/0x1dd16029b80586794734b4b56c0e07141d15fab037561ed9225a5141c1de74b2
    input:
      '0x01010001f90b18f90211f901cbf9018380820001f9015bf842a012bbba0b8207ba812d7fe31ca2d94425627ced4ac2897d7a265147393b93d660a0075a405e47626a100124e81ba0ea20f5f626c179958eb73ec9111953ecab0fcdf888f842a023ac87a893b4489952126f421a58dbca8d230b268bbdfdab9b01707c50d0c230a0135c425e65a1263f4c3c7b1e179d570a68c6d22f6d06740f4ba94ade7fc7cc51f842a02a721a1239cf63bcdd029fc430ed5936fed1ec0d65d83f1b67d26ef2fffdbbf7a0213be8f38884e6ee39681214440ab1e9b2b623fda1a6d8b27cd084c48c131a29f888f842a0112d889979d5e77f97399a2198026a5a4caccd910e422a07f1d5549ff453a4dda01b6893181b05345ff69c530b14f7af1b26ba9698b68761f607504e9fee04ed8df842a02b008d8efc597d6280100131f636a39ac92a5ec3a88c0bc33f35806b35f92b86a00757abe94af1d1ad6eae756e0b0930df2c94b89b7eb522dceb8a767b9f6a6ce0820200a064c7c9c7db2541aef9bf967e9dffd7c534ef469972dcbe8c83d4ff1115c228fcb8412b4611e5a11e9b3a9efe3910cd151af02d110f01a26b539a8759fc7132fa1d121638ebc2e83daf0f1bbb872b2e048749cc1d5f691159c18a6d9dca0f7b8b1f5301c18080b8400d73c8191f5a8568d4505cb4d02113abf02cf842edff5e3c3d1fb685138a767b2098689db8539dcc487cb8230cc00b0df7ab3b7f679dc03de53d97c62ca255ebe6a0d399aa3fb4201680ffc77fc86485b2f364c693d4f655864ad0635df9e2fe2c8c84016068d9f908d7db0c0380030406048002808006080202800604040701028002020204f9072af842a00a142991c351c4129d50c0f98b1449787ff0540b2fbb4fff210514bac060855ea00c8ffc07fc766d78f86a02c9bfcbd459e30f1ced65d95316a595c32b515dfe78f842a005fadc54d49aa4000192fca34705ec1133c8cbc9bc968884a5cddf6d3f8bcaa0a0151cfd872eb90a0a0a2c4be3792fb3d4e94f61b3fbd80deb405f6a088d99614bf842a027c831ff620778acda5d104b110f0866b4083cd553ad15579d1238111907d098a02c2727974dbfb148f6e87a74038750a3e711a5bed33fdc9c437f4684c83d3ed7f842a02ab19905aa9af2f823c4e1e4983075ccf760f7e71eb4f0eb4e9a5efd8f80215ea0173c341970b5db3362c532f5c6cb244cd31c32c5819919dad91028551e7cbb8bf842a00ff6b11f871d916ffa1a44d77c6019a455dcfcf6392d84118dfea158ab4c4c65a018a4db731c65491c59956457e56dbd9d04daaf83bdeb073b0106c12e848c628cf842a004f5e23794b9f83ae327ccf44958c8ef8d73d71bae10d2c96f501c9376f150a1a018a40cbca1c6811d52c8164c8a99ed0166f6271e8796b9b588d42995c681b15df842a02f35c3211f25733a1260f4a5ccba5591139ce704e67fcd766e214314d2129281a013e4a438b1b17236ed24afb24ec22ecbe335da447211514ee3c5c977e6b62a94f841a00d7ffe3162570bbf0e5069f7c46a8120afd016fcc7c0ed17de3fc2b455f0c6b29f5e83bc2a22475498421bbb39c0fce2cb8f9c54040beb3f87bc9965655d5512f842a02195aeec3986ce4275bae9e050f0597eb2a3c11e8688e0f5256c4d5e183f6c45a02e9cebb82ddd39e0904df935858e9c76bee3203220af042ffb8a94a35d21a78df842a02156caa92915944254a0af78bfe2272a4eb0a483a5bb0e8e02ccee48b5782098a01095aacf244a4cec7944233365f4573b05351f39f85a3087864d5a6075875338f842a006fdd2f7ce67c1db543528f3d71046b9112fd6384249b82f1708eb36b96f58a1a004fe9b338c07ba59c6b7facd9867fd9e3e7c32c08b0e4bab01dc8cd6b01d13baf842a00c0a64f58fc50d092740f317f307defc4b5d538c0b250c14bc6d395d28a05156a015af03dc169cfda5d1371879b619091bd8168fecc89dbfa17cfd5927728e0958f842a007c3c4fab48aa41e8114af131fd547213b69d753df9872c54ab487b8ca86bcb6a01d0e6c7a1b2479c2cda9f788b4616f93e5be75dabc94aa1f60fdbeaefbe17d11f842a02ef8dec706c8e25347afd014e6265592dbdd4de6e58098dd9702b44a074a635ea0177ed72037af1e0f9f13e1aab8d4574913c9116e5f0cb1d9f77b1462c9c139b1f842a00aaed32093001368e9baa024d400b7e9fea010946d7e918d83a7fd40cc882e02a02578b78fb9a2d54ab910f6c0b321df1493ccc717182aebd24002b1bc7ab6fd70f842a001c439b055052b1d1da6a38ce038445a054773501a9c5b391370487363221ff8a02ecf2e033a057eb457484fc10715730b0fa37238c794dec48848078753d4187df842a01f2eb4256f1a31d7ccdb751eb55c35007827eec5ea10b9385d050997920c7614a001510a9bb411eac281644caa5903c2908a6d3484f181f5d74315481e8fb1ca80f842a02686c87e81afbffb940c5a09044b48352f01e54ca003ebdca496b23410af4ddba005ff0f5ff958ad8247bc63bc59dc1c962ba28cd2da39620ba524d08efa35b428f842a021dd73712c1e3b9ac282e8ce72cc9ef4cc24766f5ac4f04beaf9f000b3ee663ba00ea4b73cd64457c01b27dbb0916aeed9ec5dc4dbed131f9dc4c72f35ded3873ef842a0201dfd2381b199f9322709fb6b3ab97ff67318bc7d21b3a5f02431d6827a0b67a012f6796fd48da65772cb869fb20141564f23157f9eca2b6585c33b79374b5d9af841a005e4b0f808d68fa2ec85210efb4535da80c46aee566d2f3447400723eb796f0c9fc4640a9158c27ad8b70aa7c3b227a8a4ed627cc8516870cb248cda90fe6d0bf842a015da7d4d2a7e8d2f2a83b38f7d959b34207f1bbed1f9e309b2beccdd39dba36da024112ce992afa1e396fa4478ce6d59e69e3ecbafc94e5376c0f375eb467955aff842a02e571669ea43c4b350caffcd688bc7f4c0640bfaea09ca74cef6ee261a4c3365a001e750189048ad13939fe6e33c38bcb4abf0189cd484952d71be2af2a24f7f8df842a00a3fa08ad8d8b331a13c1992b9696a885349e28b4b32a1654b74f9c717070fe0a009df373fc26e4c652ec107153c215e7d6a0d47a113b27425f2533f2196588dc4f842a009a2daca58030ce409e825b98ab0c32516184e2e679bc60df375d3695137a7faa02308b6e524e09b600841e46ceaee24bda7292385a13719b0c359a22ee72c9ef9f842a00c6362552f8a9057b9514c684a1040206621200588b6990bce7a5c60d748260ba0166899842f16eaf547f8ecfc288c38bfa5133240d2c8e9e6b5c40d9cb6105243f842a03033b25787763d2ac5775c4e0c06585b35de9a9ba7c586d425e7cdcedd8a922da010ee1f4585e105eeb368145318c39bb5dd10bbdb049889434bc587c616174e38f887f842a001216798ecdeda83f3216f00d0aad31407b1875eaa674aa140ece113e9e0d54fa015dacab513591039ae2ba534c6527b97142bbbd6dcea79454ee67ec7afd5491ff8419f7291f6d48352238f321791ba34e8f5cab8b45ee53f4466c2c9369028bc7118a00cb13082796b1cea90cf316e76ff00605a343cea613473f6b2bfe453b3a1427af888f842a01f92dc7bb6db9097f1f2be4c4a6f0c7e6b49451b495f7fa2bf0a82864727a6daa024146320b30488d58f9a49573fcd9499171f709e14105ba0fb60ce969c8b54abf842a002b6ecbb2ba624c85ac61af925c20b0d163bee111912f33997bfbbaa7ffbcceaa026b8f94d45ad87cc4d7a6a21f57ce5ecdd01bceaa799960c4f3fa85a0a0ef8aff842a014b1fff08dca145a6bbb78f869331be3463c1f1c0b7706e5802565cfcca20e6aa027da26e96ae37daac8f457e9c41441e88bc9b4f2f477c3e46b1e125825071dd8c682026382033bc68203ea820457e8ce81c40d8007820106690711820124d8053980140404010d0d170a38070714020717070d0a572305820001',
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
  it('should return false if byte-check fails for all sequencer transactions', async () => {
    const invalidTransactions = [
      {
        hash: Hash256.random(),
        to: EthereumAddress.random(),
        input: '0x',
      },
    ]

    const provider = getProvider()

    const isUsingEigenDA = await checkForEigenDA(provider, invalidTransactions)
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

    const provider = getProvider()

    expect(checkForEigenDA(provider, invalidTransactions)).not.toBeRejected()
  })

  it('should return true for valid v1 commitments', async () => {
    const v1Txs: Transaction[] = [aevoSequencerTransactions[0]!]

    const providerToSwitchTo = getProvider({
      getEvents: async () =>
        confirmedBatchHeaderHashes.map((cbhh) => ({
          log: {} as providers.Log,
          event: { batchHeaderHash: cbhh.blobBatchMetadata },
        })),
    })

    const provider = getProvider({
      switchChain: async () => providerToSwitchTo,
    })

    const result = await checkForEigenDA(provider, v1Txs)
    expect(result).toEqual(true)
  })

  it('should return true for valid v2 commitments', async () => {
    const v2Txs: Transaction[] = [aevoSequencerTransactions[2]!] // third tx is v2

    const provider = getProvider()

    const result = await checkForEigenDA(provider, v2Txs)
    expect(result).toEqual(true)
  })

  it('should return true for valid v1 and v2 commitments', async () => {
    const mixedTxs: Transaction[] = [
      aevoSequencerTransactions[0]!, // v1
      aevoSequencerTransactions[2]!, // v2
    ]

    const providerToSwitchTo = getProvider({
      getEvents: async () =>
        confirmedBatchHeaderHashes.map((cbhh) => ({
          log: {} as providers.Log,
          event: { batchHeaderHash: cbhh.blobBatchMetadata },
        })),
    })

    const provider = getProvider({
      switchChain: mockFn().resolvesTo(providerToSwitchTo),
    })

    const result = await checkForEigenDA(provider, mixedTxs)
    expect(result).toEqual(true)
  })

  it('should return true if commitments have been confirmed', async () => {
    const providerToSwitchTo = getProvider({
      getEvents: async () =>
        confirmedBatchHeaderHashes.map((cbhh) => ({
          log: {} as providers.Log,
          event: { batchHeaderHash: cbhh.blobBatchMetadata },
        })),
    })

    const provider = getProvider({
      switchChain: mockFn().resolvesTo(providerToSwitchTo),
    })

    const isUsingEigenDA = await checkForEigenDA(
      provider,
      aevoSequencerTransactions,
    )
    expect(isUsingEigenDA).toEqual(true)
  })
})

function getProvider(options?: Partial<IProvider>): IProvider {
  return mockObject<IProvider & { then: undefined }>({
    chain: 'ethereum',
    blockNumber: 1,
    // no clue
    then: undefined,
    ...options,
  })
}
