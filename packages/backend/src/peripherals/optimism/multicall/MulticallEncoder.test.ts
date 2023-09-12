import { Logger } from '@l2beat/shared'
import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { providers } from 'ethers'

import { EthereumClient } from '../../ethereum/EthereumClient'
import { OptimismMulticallClient } from './OptimismMulticall'

describe('Optimism multicall encoder', () => {
  it('works', async () => {
    const ethereumProvider = new providers.JsonRpcProvider(
      'https://opt-mainnet.g.alchemy.com/v2/lb419S46mFUhtBJMJX8yrEQzh_3o82a5',
      //   'optimism',
    )
    const ethereumClient = new EthereumClient(
      ethereumProvider,
      Logger.SILENT,
      25,
    )

    const mcclient = OptimismMulticallClient.forMainnet(ethereumClient)

    const results = await mcclient.multicall(
      [
        {
          address: EthereumAddress(
            '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
          ),
          data: Bytes.fromHex(
            '0x70a08231000000000000000000000000f491d040110384dbcf7f241ffe2a546513fd873d',
          ),
        },
      ],
      109465222,
    )

    console.log(results)
  })
})
