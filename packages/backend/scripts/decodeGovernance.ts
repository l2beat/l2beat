import { ConfigReader } from '@l2beat/discovery'
import chalk from 'chalk'
import { ethers, utils } from 'ethers'
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
  console.log(timelock)

  for (const tx of timelock.values.scheduledTransactions) {
    decodeTransaction(tx, timelock)
  }
}

function decodeTransaction(tx: ScheduledTransaction, timelock: Timelock) {
  if (tx.target === timelock.values.RETRYABLE_TICKET_MAGIC) {
    decodeInboxCall(tx)
  } else {
    if (tx.target !== '0x3ffFbAdAF827559da092217e474760E2b2c3CeDd') {
      throw new Error(`Unknown tx target ${tx.target}`)
    }
    const parsed = iface.parseTransaction({ data: tx.data })
    // console.log(parsed.functionFragment.name)
    // console.log(
    //   parsed.functionFragment.inputs.map(
    //     (i) => `${i.name}: ${parsed.args[i.name]}`,
    //   ),
    // )
    const r = iface.parseTransaction({
      data: parsed.args['upgradeCallData'] as string,
    })
    const result = ['ETHEREUM: ', r.functionFragment.name, '(']
    result.push(
      r.functionFragment.inputs
        .map((i) => `${i.name}: ${r.args[i.name]}`)
        .join(', '),
    )
    result.push(')')
    console.log(result.join('') + '\n')
  }
}

function decodeInboxCall(tx: ScheduledTransaction) {
  console.log('Inbox call')
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
  console.log(res)
}
