import { providers, utils } from 'ethers'
import { getAllLogs } from '../omnichain/getAllLogs'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const SHARP_PROVER = '0xd51A3D50d4D2f99a345a66971E650EEA064DD8dF'
const SYSTEMS = [
  '0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4',
  '0xF338cad020D506e8e3d9B4854986E0EcE6C23640',
  '0x5FDCCA53617f4d2b9134B29090C87D01058e27e9',
]

const ABI = new utils.Interface([
  'event LogMemoryPagesHashes(bytes32 programOutputFact, bytes32[] pagesHashes)',
  'event LogStateTransitionFact(bytes32 stateTransitionFact)',
])

const HASHES_FILE = join(__dirname, 'data/memoryHashes.json')

void main()
async function main() {
  const provider = new providers.AlchemyProvider(
    'mainnet',
    process.env.ALCHEMY_API_KEY,
  )
  const block = await provider.getBlock('latest')
  const matched = await getMatched(provider, block)
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
  block: providers.Block,
): Promise<{ system: string; outputs: SystemOutput[] }[]> {
  const file = join(__dirname, 'data/matched.json')
  if (existsSync(file)) {
    return JSON.parse(readFileSync(file, 'utf-8'))
  } else {
    const verifiedOutputs = await getVerifiedOutputs(provider, block)
    const systemOutputs = []
    for (const system of SYSTEMS) {
      const outputs = await getSystemOutputs(provider, block, system)
      systemOutputs.push({ system, outputs: outputs.reverse() })
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
