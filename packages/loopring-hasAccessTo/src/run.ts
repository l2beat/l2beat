import dotenv from 'dotenv'
import { providers, utils } from 'ethers'

import abi from './exchangev3.json'

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

  // gets events emmited while adding a new allowed address in SelectorBasedAccessManager
  await getEvents(provider)

  // storage lookup
  const exchangev3Address = '0x0BABA1Ad5bE3a5C0a66E7ac838a129Bf948f1eA4'
  await getStorage(provider, exchangev3Address)

  const gnosisSafeProxy = '0xDd2A08a1c1A28c1A571E098914cA10F2877D9c97'
  await getStorage(provider, gnosisSafeProxy)

  // selectors map from interface, maight be useful if a new access is granted
  await getSelectorsMap(new utils.Interface(abi))
}

const getSelectorsMap = async (iface: utils.Interface) => {
  const selectorToFunctionMap = new Map<string, string>()
  const ifaceFunctions = Object.keys(iface.functions)

  for (const ifaceFunction in ifaceFunctions) {
    selectorToFunctionMap.set(iface.getSighash(ifaceFunction), ifaceFunction)
  }

  return selectorToFunctionMap
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

  const timestamp = await (await provider.getBlock(13953023)).timestamp
  console.log(timestamp, new Date(timestamp * 1000))

  const data = events.map(({ log, event }) => ({
    blockNumber: log.blockNumber,
    address: event.args.user,
    selector: event.args.selector,
    function: knownSelectors[event.args.selector],
    allowed: event.args.allowed,
  }))

  console.table(data)
  console.log(
    data.filter((d) => d.selector === '0x53228430').map((d) => d.address),
  )
}

async function getStorage(
  provider: providers.AlchemyProvider,
  address: string,
) {
  const storage = []
  for (let i = 0; i < 26; i++) storage.push(provider.getStorageAt(address, i))

  const resolved = await Promise.all(storage)

  console.table(resolved)
}
