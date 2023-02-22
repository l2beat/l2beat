import { providers } from 'ethers'
import fetch from 'node-fetch'

import { getAllLogs } from './getAllLogs'

const ULTRA_LIGHT_NODE_V2 = '0x4D73AdB72bC3DD368966edD0f0b2148401A178E2'
const PACKET_RECEIVED_TOPIC =
  '0x2bd2d8a84b748439fd50d79a49502b4eb5faa25b864da6a9ab5c150704be9a4d'
const CONTRACT_CREATION_BLOCK = 15416271

interface LZData {
  address: string
  deployer: string
  deployedAt: number
  name: string
  count: number
  tvl: number
}

export async function getLZ(provider: providers.JsonRpcProvider) {
  const filter = {
    address: ULTRA_LIGHT_NODE_V2,
    topics: [PACKET_RECEIVED_TOPIC],
    fromBlock: CONTRACT_CREATION_BLOCK,
    toBlock: await provider.getBlockNumber(),
  }

  console.log('fetching data...')
  const logs = await getAllLogs(provider, filter)

  const interactions = new Map<string, number>()
  logs.map((l) => {
    const current = interactions.get('0x' + l.topics[2].slice(26))
    if (current === undefined) {
      interactions.set('0x' + l.topics[2].slice(26), 1)
    } else {
      interactions.set('0x' + l.topics[2].slice(26), current + 1)
    }
  })

  const response = await fetch(
    'https://api.etherscan.io/api?module=contract&action=getcontractcreation&contractaddresses=' +
      address +
      '&apikey=' +
      process.env.ETHERSCAN_KEY,
  )
  const data = await response.json() as unknown as { result: { txHash: string }[] }

  const txHash = data.result[0].txHash

  console.log(interactions)
}
