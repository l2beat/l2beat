import dotenv from 'dotenv'
import { providers, utils } from 'ethers'

function getEnv(key: string) {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Env variable ${key} is not present!`)
  }
  return value
}

export async function run() {
  dotenv.config()

  const alchemyApiKey = getEnv('ALCHEMY_API_KEY')
  const provider = new providers.AlchemyProvider('mainnet', alchemyApiKey)

  // gets events emitted while adding a new allowed address in SelectorBasedAccessManager
  await getEvents(provider)
}

async function getEvents(provider: providers.AlchemyProvider) {
  const exchangeOwnerAddress = '0x153CdDD727e407Cb951f728F24bEB9A5FaaA8512'

  const abi = new utils.Interface([
    'event PermissionUpdate(address indexed user, bytes4 indexed selector, bool allowed)',
  ])

  const logs = await provider.getLogs({
    fromBlock: 12087157,
    toBlock: 'latest',
    address: exchangeOwnerAddress,
    topics: [abi.getEventTopic('PermissionUpdate')],
  })
  const events = logs.map((log) => ({
    log,
    event: abi.parseLog(log),
  }))

  const knownSelectors: Record<string, string | undefined> = {
    '0x53228430':
      'submitBlocks((uint8,uint16,uint8,bytes,uint256[8],bool,bytes,bytes)[])',
    '0x09824a80': 'registerToken(address)',
  }

  const timestamp = (await provider.getBlock(13953023)).timestamp
  console.log(timestamp, new Date(timestamp * 1000))

  const data = events.map(({ log, event }) => ({
    blockNumber: log.blockNumber,
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    address: event.args.user,
    selector: event.args.selector,
    allowed: event.args.allowed,
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    function: knownSelectors[event.args.selector],
  }))

  console.table(data)
  console.log(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    data.filter((d) => d.selector === '0x53228430').map((d) => d.address),
  )
}
