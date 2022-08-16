import { projects } from '@l2beat/config'
import { EthereumAddress } from '@l2beat/common'
import { providers, utils } from 'ethers'

/*
range   04.05 10:00 - 07.05 14:00
align   04.05 00:00 - 07.05 14:00
        -> 10000      -> 20000
        from: 10001   to: 20000
*/

main().catch(console.error)
async function main() {
  const project = projects.find((x) => x.name === 'Optimism')
  if (!project) {
    throw new Error('Foo')
  }

  const provider = new providers.AlchemyProvider('mainnet')

  console.log(project.events)

  const event = project.events[0]

  const latest = await provider.getBlockNumber()

  const logs = await getLogs(
    provider,
    event.emitter,
    new utils.Interface([event.abi]).getEventTopic(event.name),
    12525700,
    latest
  )

  console.log(logs.length)
}


async function getLogs(provider: providers.Provider, address: EthereumAddress, topic: string, fromBlock: number, toBlock: number): Promise<providers.Log[]> {
  try {
    return await provider.getLogs({
      address: address.toString(),
      topics: [[topic]],
      fromBlock: fromBlock,
      toBlock: toBlock
    })
  } catch (e) {
    if (e instanceof Error && e.message.includes('Log response size exceeded')) {
      console.log('BISECTION', fromBlock, toBlock)
      // TODO: check that there are blocks in both ranges e.g not [1, 1], [1, 1]
      const midPoint = fromBlock + Math.floor((toBlock - fromBlock) / 2)
      const [a, b] = await Promise.all([
        getLogs(provider, address, topic, fromBlock, midPoint),
        getLogs(provider, address, topic, midPoint + 1, toBlock),
      ])
      return a.concat(b)
    } else {
      throw e
    }
  }
}

// events count
// timestamp | project | event  | count
//    1      |  arb    |  A     |   3
//    2      |  arb    |  A     |   4



//events daily
//    project  |  event  |  hourlData
//      arb    |   A     |   json