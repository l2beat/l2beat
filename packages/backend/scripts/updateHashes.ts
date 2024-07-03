import { ConfigReader } from '@l2beat/discovery'
import { updateDiffHistoryHash } from '../src/modules/update-monitor/utils/hashing'

const reader = new ConfigReader()
const chains = [
  'ethereum',
  'arbitrum',
  'optimism',
  'polygonpos',
  'bsc',
  //  "avalanche" //
  //  "celo" //
  'linea',
  'base',
  "polygonzkevm",
  //  "gnosis" //
  //  "zksync2" //
  //  "sepolia" //
  'scroll',
  'mantle',
  'metis',
  //  "bobanetwork" //
  //  "mode" //
]

async function updateHashes() {
  for (const chain of chains) {
    for (const project of reader.readAllProjectsForChain(chain)) {
      console.log(`Updating hash for ${project} on ${chain}`)
      await updateDiffHistoryHash(
        `./discovery/${project}/${chain}/diffHistory.md`,
        project,
        chain,
      )
    }
  }
}

updateHashes()
