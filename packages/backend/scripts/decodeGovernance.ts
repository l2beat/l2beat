import {
  AddressAnalyzer,
  ConfigReader,
  DiscoveryLogger,
  DiscoveryProvider,
  EtherscanLikeClient,
  getChainConfig,
  HandlerExecutor,
  HttpClient,
  MulticallClient,
  ProxyDetector,
  SourceCodeService,
} from '@l2beat/discovery'
import { EthereumAddress } from '@l2beat/shared-pure'
import chalk from 'chalk'
import { ethers, providers, utils } from 'ethers'
import * as z from 'zod'

type ScheduledTransaction = z.infer<typeof ScheduledTransaction>
const ScheduledTransaction = z.object({
  id: z.string(),
  target: z.string(),
  value: z.number(),
  data: z.string(),
  delay: z.number(),
})

type Timelock = z.infer<typeof Timelock>
const Timelock = z.object({
  name: z.string(),
  values: z.object({
    RETRYABLE_TICKET_MAGIC: z.string(),
    scheduledTransactions: z.array(ScheduledTransaction),
  }),
})

const iface = new utils.Interface([
  'function execute(address upgrade, bytes upgradeCallData) payable',
  'function perform() public',
  'function perform(address _securityCouncil, address[] memory _updatedMembers, uint256 _nonce) external returns (bool res)',
])

void main().catch((e) => {
  console.log(e)
})

async function main() {
  console.log(chalk.yellow('Decode Arbitrum Governance'))
  const configReader = new ConfigReader()
  const discovery = await configReader.readDiscovery('arbitrum', 'ethereum')

  const rawTimeLock = discovery.contracts.find(
    (c) => c.name === 'L1ArbitrumTimelock',
  )
  const timelock = Timelock.parse(rawTimeLock)
  // console.log(timelock)

  let updateId: string = ''
  for (const tx of timelock.values.scheduledTransactions) {
    if (updateId !== tx.id) {
      updateId = tx.id
      console.log(`\nUpdate id: ${tx.id}`)
    }
    await decodeTransaction(tx, timelock)
  }
}

async function decodeTransaction(tx: ScheduledTransaction, timelock: Timelock) {
  let result: string
  if (tx.target === timelock.values.RETRYABLE_TICKET_MAGIC) {
    result = await decodeInboxCall(tx)
  } else {
    if (tx.target !== '0x3ffFbAdAF827559da092217e474760E2b2c3CeDd') {
      throw new Error(`Unknown tx target ${tx.target}`)
    }
    result = await decodeExecuteCall('ethereum', tx.data)
  }
  console.log('  - ' + result)
}

// eslint-disable-next-line @typescript-eslint/require-await
async function decodeExecuteCall(
  chain: string,
  executeCalldata: string,
): Promise<string> {
  const parsed = iface.parseTransaction({ data: executeCalldata })
  // console.log(parsed.functionFragment.name)
  // console.log(
  //   parsed.functionFragment.inputs.map(
  //     (i) => `${i.name}: ${parsed.args[i.name]}`,
  //   ),
  // )
  const addrToCall = EthereumAddress(parsed.args['upgrade'] as string)
  const contractName = await discoverContractName(chain, addrToCall)
  const calldata = parsed.args['upgradeCallData'] as string
  const decodedCalldata = decodeCalldata(calldata)
  return `[${chain}] ${contractName}.${decodedCalldata}`
}

function decodeCalldata(calldata: string): string {
  // TODO: use ABI from discovery
  const r = iface.parseTransaction({
    data: calldata,
  })
  const result = [r.functionFragment.name, '(']
  result.push(
    r.functionFragment.inputs
      .map((i) => `${i.name}: ${r.args[i.name]}`)
      .join(', '),
  )
  result.push(')')
  return result.join('')
}

function inboxToChain(inboxAddress: EthereumAddress): string {
  switch (inboxAddress.toString()) {
    case '0xc4448b71118c9071Bcb9734A0EAc55D18A153949':
      return 'nova'
    case '0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f':
      return 'arbitrum'
    default:
      throw new Error(`Unknown inbox address ${inboxAddress.toString()}`)
  }
}

async function decodeInboxCall(tx: ScheduledTransaction) {
  const res = ethers.utils.defaultAbiCoder.decode(
    [
      'address targetInbox',
      'address l2Target',
      'uint256 l2Value',
      'uint256 gasLimit',
      'uint256 maxFeePerGas',
      'bytes memory l2Calldata',
    ],
    tx.data,
  )
  const targetInbox = EthereumAddress(res.targetInbox as string)
  const chain = inboxToChain(targetInbox)
  // const l2AddrToCall = EthereumAddress(res.l2Target as string)
  // TODO: get abi from response
  const l2Calldata = res.l2Calldata as string
  const decodedCalldata = await decodeExecuteCall(chain, l2Calldata)
  return decodedCalldata
}

async function discoverContractName(
  chain: string,
  address: EthereumAddress,
): Promise<string> {
  const chainConfig = getChainConfig(chain)
  const logger = DiscoveryLogger.SILENT
  const http = new HttpClient()
  const etherscanClient = EtherscanLikeClient.createForDiscovery(
    http,
    chainConfig.etherscanUrl,
    chainConfig.etherscanApiKey,
    chainConfig.etherscanUnsupported,
  )
  const provider = new providers.StaticJsonRpcProvider(chainConfig.rpcUrl)

  const discoveryProvider = new DiscoveryProvider(
    provider,
    etherscanClient,
    logger,
    chainConfig.rpcGetLogsMaxRange,
  )
  const proxyDetector = new ProxyDetector(discoveryProvider, logger)
  const sourceCodeService = new SourceCodeService(discoveryProvider)
  const multicallClient = new MulticallClient(
    discoveryProvider,
    chainConfig.multicall,
  )
  const handlerExecutor = new HandlerExecutor(
    discoveryProvider,
    multicallClient,
    logger,
  )

  const addressAnalyzer = new AddressAnalyzer(
    discoveryProvider,
    proxyDetector,
    sourceCodeService,
    handlerExecutor,
    logger,
  )

  const blockNumber = await provider.getBlockNumber()

  const { analysis } = await addressAnalyzer.analyze(
    address,
    undefined,
    blockNumber,
    logger,
  )

  const contractName = analysis.type === 'EOA' ? 'EOA' : analysis.name
  return contractName
}
