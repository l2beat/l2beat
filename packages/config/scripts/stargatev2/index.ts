import * as fs from 'fs'
import { ProjectDiscovery } from '../../src/discovery/ProjectDiscovery'
/**
 *
 * TLDR: Run socket discovery, then this with 'yarn update-socket' and copy the results to the config.jsonc and socket.ts files.
 *
 * This script reads the socket plugs list from discovery and creates two files of the discovery results:
 * 1) socket-crawl-result.json: The discovery results grouped by sibling chain slug and ranked by TVL, including non-standard plugs and vaults and vault owners
 * 2) socket-crawl-copypasta.txt: A copy-paste suggestion for the config.jsonc and socket.ts files. This file excludes 0 TVL vaults and nonstandard plugs
 * The script should be easily extendable when functions on the plugs or vaults change, like they have done in the past.
 *
 */

const discovery = new ProjectDiscovery('stargatev2', 'optimism')
const pools: string[] = discovery.getContractValue<string[]>(
  'TokenMessaging',
  'pools',
)

const nonZeroAddresses = pools.filter(
  (address) => address !== '0x0000000000000000000000000000000000000000',
)

const config: Record<
  string,
  { ignoreRelatives: string[]; ignoreInWatchMode: string[] }
> = {}
const ignoreRelatives = [
  'endpoint',
  'getAddressConfig',
  'lpToken',
  'owner',
  'token',
]
const ignoreInWatchMode = [
  'plannerFee',
  'poolBalance',
  'treasuryFee',
  'tvl',
  'getTransferGasLimit',
]

nonZeroAddresses.forEach((address) => {
  config[address] = { ignoreRelatives, ignoreInWatchMode }
})

fs.writeFileSync('config.jsonc.suggested', JSON.stringify(config, null, 2))
console.log('File written successfully')
