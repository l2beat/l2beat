import { providers, utils } from 'ethers'
import { getAllLogs } from '../omnichain/getAllLogs'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const SHARP_PROVER = '0xd51A3D50d4D2f99a345a66971E650EEA064DD8dF'
const SYSTEMS = [
  { name: 'Starknet', address: '0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4' },
  { name: 'Paradex', address: '0xF338cad020D506e8e3d9B4854986E0EcE6C23640' },
  { name: 'ImmutableX', address: '0x5FDCCA53617f4d2b9134B29090C87D01058e27e9' },
]

const ABI = new utils.Interface([
  'event LogMemoryPagesHashes(bytes32 programOutputFact, bytes32[] pagesHashes)',
  'event LogStateTransitionFact(bytes32 stateTransitionFact)',
  'event LogStateUpdate(uint256 globalRoot, int256 blockNumber, uint256 blockHash)',
])

const HASHES_FILE = join(__dirname, 'data/memoryHashes.json')

void main()

async function main() {
  const provider = new providers.AlchemyProvider(
    'mainnet',
    process.env.ALCHEMY_API_KEY,
  )
  const matched = await getMatched(provider)
  const transactionHash = process.argv[2]

  if (!transactionHash) {
    printStats(matched)
  } else {
    await printTransactionStats(provider, matched, transactionHash)
  }
}

async function printTransactionStats(
  provider: providers.AlchemyProvider,
  matched: { system: string; outputs: SystemOutput[] }[],
  transactionHash: string,
) {
  for (const { system, outputs } of matched) {
    const output = outputs.find((x) => x.transactionHash === transactionHash)
    const systemName =
      SYSTEMS.find((x) => x.address === system)?.name ?? 'Unknown'
    if (output) {
      if (!output.verifiedAt) {
        console.log(output)
        break
      }
      const stateUpdateBlock = await provider.getBlock(output.blockNumber)
      const proofBlock = await provider.getBlock(output.verifiedAt.blockNumber)

      const tx = await provider.getTransactionReceipt(transactionHash)
      const topic = ABI.getEventTopic('LogStateUpdate')
      const event = tx.logs
        .filter((x) => x.topics[0] === topic)
        .map((log) => ABI.parseLog(log))
        .at(0)

      const l2BlockNumber: number | undefined =
        event?.args.blockNumber.toNumber()

      let l2Timestamp: number | undefined

      if (systemName === 'Starknet' && process.env.STARKNET_API_URL) {
        const res = await fetch(process.env.STARKNET_API_URL, {
          method: 'POST',
          headers: {
            ['Content-Type']: 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'starknet_getBlockWithTxHashes',
            params: [{ block_number: l2BlockNumber }],
            id: Math.floor(Math.random() * 1000),
          }),
        })
        // biome-ignore lint/suspicious/noExplicitAny: required
        const json: any = await res.json()
        l2Timestamp = json.result.timestamp
      }

      const properties = [
        { name: 'System', value: systemName },
        { name: 'L2 Block Number', value: l2BlockNumber },
        {
          name: 'L2 Timestamp',
          value:
            l2Timestamp !== undefined
              ? new Date(l2Timestamp * 1000).toISOString()
              : undefined,
        },
        {
          name: 'Proof Timestamp',
          value: new Date(proofBlock.timestamp * 1000).toISOString(),
        },
        {
          name: 'Proof After',
          value: timeDiff(l2Timestamp, proofBlock.timestamp),
        },
        {
          name: 'State Update Timestamp',
          value: new Date(stateUpdateBlock.timestamp * 1000).toISOString(),
        },
        {
          name: 'State Update After',
          value: timeDiff(l2Timestamp, stateUpdateBlock.timestamp),
        },
      ]

      const maxLength = Math.max(...properties.map((x) => x.name.length))
      for (const { name, value } of properties) {
        console.log(name.padEnd(maxLength + 1, ' '), value ?? 'unknown')
      }
    }
  }
}

function timeDiff(start?: number, end?: number) {
  if (start === undefined || end === undefined) {
    return 'unknown'
  }
  const seconds = end - start
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours}h ${minutes}m`
}

function printStats(matched: { system: string; outputs: SystemOutput[] }[]) {
  for (const { system, outputs } of matched) {
    const differences = outputs
      .filter((x) => !!x.verifiedAt)
      // biome-ignore lint/style/noNonNullAssertion: required
      .map((x) => x.blockNumber - x.verifiedAt!.blockNumber)
      .sort((a, b) => a - b)
    const min = differences[0]
    const max = differences[differences.length - 1]
    const avg = differences.reduce((a, b) => a + b, 0) / differences.length

    console.log(system, { min, max, avg })
  }
}

async function getMatched(
  provider: providers.AlchemyProvider,
): Promise<{ system: string; outputs: SystemOutput[] }[]> {
  const block = await provider.getBlock('latest')
  const file = join(__dirname, 'data/matched.json')
  if (existsSync(file)) {
    return JSON.parse(readFileSync(file, 'utf-8'))
  } else {
    const verifiedOutputs = await getVerifiedOutputs(provider, block)
    const systemOutputs = []
    for (const system of SYSTEMS) {
      const outputs = await getSystemOutputs(provider, block, system.address)
      systemOutputs.push({ system: system.address, outputs: outputs.reverse() })
    }

    const verifiedMap = new Map(
      verifiedOutputs.map((x) => [x.programOutputFact, x]),
    )
    for (const { outputs } of systemOutputs) {
      for (const event of outputs) {
        if (verifiedMap.has(event.stateTransitionFact)) {
          const verified = verifiedMap.get(event.stateTransitionFact)
          if (verified) {
            event.verifiedAt = verified
          }
        }
      }
    }

    const outFile = join(__dirname, 'data/matched.json')
    writeFileSync(outFile, JSON.stringify(systemOutputs, null, 2))
    return systemOutputs
  }
}

interface VerifiedOutput {
  blockNumber: number
  transactionHash: string
  programOutputFact: string
}

async function getVerifiedOutputs(
  provider: providers.AlchemyProvider,
  block: providers.Block,
): Promise<VerifiedOutput[]> {
  let hashes: providers.Log[] = []
  if (existsSync(HASHES_FILE)) {
    hashes = JSON.parse(readFileSync(HASHES_FILE, 'utf-8'))
  } else {
    const memoryHashes = await getAllLogs(provider, {
      address: SHARP_PROVER,
      topics: [ABI.getEventTopic('LogMemoryPagesHashes')],
      fromBlock: 0,
      toBlock: block.number,
    })

    writeFileSync(HASHES_FILE, JSON.stringify(memoryHashes, null, 2))
    hashes = memoryHashes
  }

  const verifiedOutputs = hashes
    .map((log) => ({ log, event: ABI.parseLog(log) }))
    .map(({ log, event }) => ({
      blockNumber: log.blockNumber,
      transactionHash: log.transactionHash,
      programOutputFact: event.args.programOutputFact,
    }))
  return verifiedOutputs
}

interface SystemOutput {
  blockNumber: number
  transactionHash: string
  stateTransitionFact: string
  verifiedAt: VerifiedOutput | undefined
}

async function getSystemOutputs(
  provider: providers.AlchemyProvider,
  block: providers.Block,
  system: string,
): Promise<SystemOutput[]> {
  const systemFile = join(__dirname, `data/system_${system}.json`)
  let systemOutputs: providers.Log[] = []

  if (existsSync(systemFile)) {
    systemOutputs = JSON.parse(readFileSync(systemFile, 'utf-8'))
  } else {
    systemOutputs = await getAllLogs(provider, {
      address: system,
      topics: [ABI.getEventTopic('LogStateTransitionFact')],
      fromBlock: 0,
      toBlock: block.number,
    })

    writeFileSync(systemFile, JSON.stringify(systemOutputs, null, 2))
  }

  return systemOutputs
    .map((log) => ({ log, event: ABI.parseLog(log) }))
    .map(({ log, event }) => ({
      blockNumber: log.blockNumber,
      transactionHash: log.transactionHash,
      stateTransitionFact: event.args.stateTransitionFact,
      verifiedAt: undefined as VerifiedOutput | undefined,
    }))
}
