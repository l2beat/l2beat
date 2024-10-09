import { Logger } from '@l2beat/backend-tools'
import { HttpClient2 } from '../http/HttpClient2'
import { RpcClient2 } from './RpcClient2'

describe(RpcClient2.name, () => {
  it('t', async function () {
    this.timeout(100_000_000)
    const rpc = new RpcClient2({
      http: new HttpClient2(),
      logger: Logger.SILENT,
      chain: 'ethereum',
      url: 'https://palpable-thrumming-waterfall.quiknode.pro/11c6d072f10558c25687c48d751b25d5ccc22a16/',
      callsPerMinute: 360,
    })

    for (let i = 0; i < 100; i++) {
      const b = await rpc.getBlock(100_000 + i, false)
      console.log(Number(b.number), b.transactions.length, b.hash)
    }
  })
})
