import chalk from 'chalk'
import { providers } from 'ethers'
import fetch from 'node-fetch'

import { CoinListPlatformResult } from './CoinListPlatformResult'
import { getAllLogs } from './getAllLogs'
import { CHECK, IGNORED } from './ignored'

const ULTRA_LIGHT_NODE_V2 = '0x4D73AdB72bC3DD368966edD0f0b2148401A178E2'
const PACKET_RECEIVED_TOPIC =
  '0x2bd2d8a84b748439fd50d79a49502b4eb5faa25b864da6a9ab5c150704be9a4d'
const CONTRACT_CREATION_BLOCK = 15416271

export async function getOmnichain(provider: providers.JsonRpcProvider) {
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
  const toUpdate: string[] = []

  const ranking: { address: string; count: number }[] = []
  for (const [address, count] of interactions.entries()) {
    ranking.push({ address, count })
  }

  console.log('\nTOP10 by amount of interactions:\n')

  ranking
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map((r) => {
      console.log(`\t${r.address} | ${r.count}`)
      if (!IGNORED.includes(r.address)) {
        toUpdate.push(r.address)
      }
    })

  const ERC20: string[] = [...interactions.keys()]

  const listRequest = `https://api.coingecko.com/api/v3/coins/list?include_platform=true`
  const listResponse = await fetch(listRequest)
  const listJson = (await listResponse.json()) as unknown
  const list = CoinListPlatformResult.parse(listJson)

  console.log('\nOmnichain tokens known to coingecko:\n')
  for (const l of list) {
    if (l.platforms.ethereum) {
      const address = l.platforms.ethereum
      const f = ERC20.find((erc) => erc === address)
      if (f !== undefined) {
        console.log(`\t${f} | ${l.id ?? ''}`)
        if (!IGNORED.includes(f)) {
          toUpdate.push(f)
        }
      }
    }
  }

  console.log('\n==================\n\n')

  if (CHECK.length > 0) {
    console.log('Check the following contracts:\n')
    CHECK.map((check) => console.log(`\t${chalk.rgb(255, 255, 0)(check)}`))
    console.log(
      '\n\tThese addresses were added to "check" list, meaning that they look promising and can potentially be tracked in the future. Please check once again whether this addresses are eligible to be added to config.',
    )
  }
  console.log('\n\n')

  console.log('Script status:\n')
  if (toUpdate.length > 0) {
    console.log('Following contracts are unconfigured:\n')
    toUpdate.map((update) => console.log(`\t${chalk.red(update)}`))
    console.log(
      '\n\tConsider updating lzOmnichain escrows or add this address to ignored inside "scripts/omnichain/ignored.ts"',
    )
  } else {
    console.log(`${chalk.green('✓')} everything up to date`)
  }
  console.log('\n\n')
}
