import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { type providers, utils } from 'ethers'

import type { ContractSource } from '../../../utils/IEtherscanClient'
import type { IProvider } from '../../provider/IProvider'
import { LayerZeroMultisigHandler } from './LayerZeroMultisigHandler'

// data from https://etherscan.io/tx/0x1b83d19d45aa517f56403a2fa5e4472668d612f0f65b524cc84cbf2071006b31

const SAMPLE_CONSTRUCTOR_FRAGMENT = [
  `constructor(
      uint32 _vid,
      address[] memory _messageLibs,
      address _priceFeed,
      address[] memory _signers,
      uint64 _quorum,
      address[] memory _admins
    ) {}`,
]

const SAMPLE_CONSTRUCROR_ARGS =
  '0000000000000000000000000000000000000000000000000000000000000065\
00000000000000000000000000000000000000000000000000000000000000c0\
000000000000000000000000c03f31fd86a9077785b7bcf6598ce3598fa91113\
0000000000000000000000000000000000000000000000000000000000000100\
0000000000000000000000000000000000000000000000000000000000000002\
0000000000000000000000000000000000000000000000000000000000000180\
0000000000000000000000000000000000000000000000000000000000000001\
0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2\
0000000000000000000000000000000000000000000000000000000000000003\
0000000000000000000000000d099360a069359fe7c9503ab44cbcb9eb2a7466\
00000000000000000000000094bc8ba19b4cce7aac14e2679942fc567e027c67\
000000000000000000000000ddbdc840164da20bcf6aa85c3957396c14642ab1\
0000000000000000000000000000000000000000000000000000000000000003\
0000000000000000000000005ee2b0fd8d964cb50e787db4ff176d7bbb0fd180\
0000000000000000000000005b1dad86c9c4ae282bbabbe89c5f6231c065c236\
00000000000000000000000021c3de23d98caddc406e3d31b25e807addf33633'

describe(LayerZeroMultisigHandler.name, () => {
  it('returns signers from the constructor', async () => {
    const handler = new LayerZeroMultisigHandler(
      'layerZeroMultisig',
      SAMPLE_CONSTRUCTOR_FRAGMENT,
    )

    const contractAddress = ChainSpecificAddress.random()

    const provider = mockObject<IProvider>({
      getSource: async () =>
        ({ constructorArguments: SAMPLE_CONSTRUCROR_ARGS }) as ContractSource,
      getLogs: async () => [],
    })

    const response = await handler.execute(provider, contractAddress)

    expect(response).toEqual({
      field: 'layerZeroMultisig',
      value: {
        signers: [
          '0x0D099360A069359fE7c9503ab44cbCb9eB2A7466',
          '0x94bC8Ba19b4CcE7AAc14E2679942fc567e027C67',
          '0xDdBDC840164da20bCf6AA85C3957396C14642AB1',
        ],
        quorum: 2,
      },
    })
  })

  it('considers logs', async () => {
    const handler = new LayerZeroMultisigHandler(
      'layerZeroMultisig',
      SAMPLE_CONSTRUCTOR_FRAGMENT,
    )
    const contractAddress = ChainSpecificAddress.random()

    const events = [
      'event UpdateSigner(address _signer, bool _active)',
      'event UpdateQuorum(uint64 _quorum)',
    ]
    const abi = new utils.Interface(events)
    function SignerChanged(
      account: ChainSpecificAddress,
      status: boolean,
    ): providers.Log {
      return abi.encodeEventLog(abi.getEvent('UpdateSigner'), [
        ChainSpecificAddress.address(account),
        status,
      ]) as providers.Log
    }

    function QuorumChanged(quorum: number): providers.Log {
      return abi.encodeEventLog(abi.getEvent('UpdateQuorum'), [
        quorum,
      ]) as providers.Log
    }

    const provider = mockObject<IProvider>({
      getSource: async () =>
        ({ constructorArguments: SAMPLE_CONSTRUCROR_ARGS }) as ContractSource,
      getLogs: async (_addr: ChainSpecificAddress, topics: string[]) => {
        if (topics[0] === abi.getEventTopic('UpdateSigner')) {
          return [
            SignerChanged(
              ChainSpecificAddress(
                'eth:0x0D099360A069359fE7c9503ab44cbCb9eB2A7466',
              ),
              false,
            ),
          ]
        }
        return [QuorumChanged(1)]
      },
    })

    const response = await handler.execute(provider, contractAddress)

    expect(response).toEqual({
      field: 'layerZeroMultisig',
      value: {
        signers: [
          '0x94bC8Ba19b4CcE7AAc14E2679942fc567e027C67',
          '0xDdBDC840164da20bCf6AA85C3957396C14642AB1',
        ],
        quorum: 1,
      },
    })
  })
})
