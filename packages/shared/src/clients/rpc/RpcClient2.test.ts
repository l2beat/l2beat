ćimport { HttpClient2 } from '../http/HttpClient2'
import { RpcClient2 } from './RpcClient2'

describe(RpcClient2.name, async () => {
  it('tests', async () => {
    const rpc = new RpcClient2({
      chain: 'ethereum',
      http: new HttpClient2(),
      url: 'https://mainnet.infura.io/v3/812678bb4cf24e038a16f2549a678837',
    })

    await rpc.getBlock(12911679, false)
  })
})
