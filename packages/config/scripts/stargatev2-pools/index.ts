import * as fs from 'fs'
import { ProjectDiscovery } from '../../src/discovery/ProjectDiscovery'

/**
 *
 * -> give the desired chain as argument, output is in 'config.jsonc.suggested'
 *
 * This is a smol convenience script that reads the pools from
 * the TokenMessaging contract in discovery and spits out config.jsonc
 * snippets with the correct ignore fields. They can then be added to the stargate escrows.
 *
 */

const discovery = new ProjectDiscovery('stargatev2')

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
