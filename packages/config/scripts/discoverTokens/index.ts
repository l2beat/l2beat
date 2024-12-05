import { existsSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { getEnv } from '@l2beat/backend-tools'
import { providers, utils } from 'ethers'
import { difference } from 'lodash'
import { layer2s, tokenList } from '../../src'

const BLOCK_RANGE = 200_000 // Safer block range to avoid RPC errors

const OUTPUT_PATH = path.resolve(__dirname, './discovered.json')

interface DiscoveredData {
  found: string[]
  processed: Record<string, number>
}

function getBlockRanges(
  fromBlock: number,
  toBlock: number,
): Array<[number, number]> {
  const ranges: Array<[number, number]> = []
  let currentFromBlock = fromBlock

  while (currentFromBlock < toBlock) {
    const currentToBlock = Math.min(currentFromBlock + BLOCK_RANGE, toBlock)
    ranges.push([currentFromBlock, currentToBlock])
    currentFromBlock = currentToBlock + 1
  }

  return ranges
}

function loadExistingData(): DiscoveredData {
  if (existsSync(OUTPUT_PATH)) {
    const data = JSON.parse(readFileSync(OUTPUT_PATH, 'utf-8'))
    return {
      found: data.found ?? [],
      processed: data.processed ?? {},
    }
  }
  return { found: [], processed: {} }
}

async function main() {
  const provider = getProvider()
  const escrows = layer2s
    .map((layer2) => layer2.config.escrows)
    .flat()
    .filter((e) => e.chain === 'ethereum')

  const transferTopic = utils.id('Transfer(address,address,uint256)')
  const latestBlock = await provider.getBlockNumber()
  const existingData = loadExistingData()
  const allFoundTokens = new Set(existingData.found)

  for (const escrow of escrows) {
    console.log(
      `Checking logs for escrow: ${escrow.address} - ${escrows.findIndex((e) => e.address === escrow.address) + 1}/${escrows.length}`,
    )

    const lastProcessedBlock = existingData.processed?.[escrow.address] ?? 0
    const blockRanges = getBlockRanges(lastProcessedBlock, latestBlock)
    if (blockRanges.length === 0) {
      console.log(
        `Escrow ${escrow.address} already processed up to ${lastProcessedBlock}`,
      )
      continue
    }

    const allLogs: providers.Log[] = []
    const toTopic = utils.hexZeroPad(escrow.address, 32)

    for (const [fromBlock, toBlock] of blockRanges) {
      const logs = await provider.getLogs({
        topics: [transferTopic, null, toTopic],
        fromBlock,
        toBlock,
      })
      allLogs.push(...logs)
      console.log(
        `Processed blocks ${fromBlock}-${toBlock}, found ${logs.length} logs for escrow ${escrow.address}`,
      )
    }

    console.log('Total logs found:', allLogs.length)
    const tokensFromLogs = new Set(allLogs.map((l) => l.address))
    tokensFromLogs.forEach((token) => allFoundTokens.add(token))

    const notFoundTokensAddresses = difference(
      Array.from(allFoundTokens),
      tokenList.map((t) => t.address),
    )

    existingData.found = Array.from(allFoundTokens)
    existingData.processed[escrow.address] = latestBlock

    const outputJson = JSON.stringify(existingData, null, 2)
    writeFileSync(OUTPUT_PATH, outputJson + '\n')

    console.log(
      'Tokens not found in tokenList:',
      notFoundTokensAddresses.length,
    )
  }
}

main().then(() => {
  console.log('done')
})

function getProvider() {
  const env = getEnv()
  return new providers.JsonRpcProvider(env.string('ETHEREUM_RPC_URL'))
}
