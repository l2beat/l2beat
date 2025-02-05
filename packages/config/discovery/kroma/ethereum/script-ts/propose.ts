import { ethers } from 'ethers'

import { getContracts, KromaContracts, KromaNetwork } from './getContracts'
import { getLogsInBatches, getRcpHostFromArgs, sleep } from './utils'

const KROMA_NETWORK: KromaNetwork = 'sepolia'
const PROPOSER_DEPOSIT = {
  mainnet: ethers.utils.parseEther('0.2'),
  sepolia: ethers.utils.parseEther('0.1'),
}
const EARLIEST_BLOCK = 4775729 // copied when writing this script
export const GET_LOGS_MAX_RANGE = 10000
const VALIDATOR_PUBLIC_ROUND_ADDRESS =
  '0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF'
const myAddr = process.env.MY_ADDRESS!

async function run() {
  console.log('Running the Kroma proposer script')
  console.log('=================================')
  const rpcHost = getRcpHostFromArgs()
  const provider = new ethers.providers.JsonRpcProvider(rpcHost)
  const wallet = new ethers.Wallet(process.env.MY_PRIVATE_KEY!, provider)
  // const wallet = new ethers.Wallet(process.env.CHALLENGER_PRIVATE_KEY!, provider)
  const contracts = getContracts(KROMA_NETWORK, wallet)

  await showBasicKromaInfo(contracts)

  let nextStep = 'continue'
  while (nextStep === 'continue') {
    nextStep = await performNextAction(contracts)
  }
}

async function performNextAction(
  contracts: KromaContracts,
): Promise<'continue' | 'stop'> {
  const proposedOutputIndex = await getProposedOutputIndex(contracts)

  if (proposedOutputIndex === undefined) {
    console.log("I haven't proposed yet.")
    await proposeRoot(contracts)
  } else {
    console.log(`I have proposed output index: ${proposedOutputIndex}`)
    await handleChallenges(proposedOutputIndex, contracts)
  }

  return 'continue'
}

async function simulateChallenge(
  outputIndex: number,
  contracts: KromaContracts,
) {
  console.log('Adding challenger to proposers list')
  await addMyselfToProposerList(contracts)

  console.log(`Simulating challenge for output index ${outputIndex}`)
  const provider = contracts.validatorPool.provider
  const block = await provider.getBlock('latest')
  const blockNumber = block.number
  const blockHash = block.hash
  const output = await contracts.l2OutputOracle.getL2Output(outputIndex - 1)
  console.log('Root:', output.outputRoot)

  const requiredSegmentsLength = (
    await contracts.colosseum.getSegmentsLength(1)
  ).toNumber()
  console.log('Required segments length:', requiredSegmentsLength)

  const segments = Array(requiredSegmentsLength)
    .fill('0x0')
    .map((x: string) => ethers.utils.hexZeroPad(x, 32))
  segments[0] = output.outputRoot

  const tx = await contracts.colosseum.createChallenge(
    outputIndex,
    blockHash,
    blockNumber,
    segments,
  )
  await tx.wait()
  process.exit(0)
}

async function handleChallenges(
  outputIndex: number,
  contracts: KromaContracts,
) {
  console.log('Finding all challenges by looking at ChallengeCreated events.')
  const challenges = await getLogsInBatches(
    contracts.colosseum,
    contracts.colosseum.filters.ChallengeCreated(outputIndex),
    GET_LOGS_MAX_RANGE,
    EARLIEST_BLOCK,
    'latest',
  )
  console.log(`Found ${challenges.length} challenges.`)

  for (const challenge of challenges) {
    const challenger = challenge.args!.challenger as string
    await handleChallenge(outputIndex, challenger, contracts)
  }

  await sleep(60 * 1000)
}

async function handleChallenge(
  outputIndex: number,
  challenger: string,
  contracts: KromaContracts,
) {
  console.log(`Handling challenge from ${challenger}`)
  const output = await contracts.l2OutputOracle.getL2Output(outputIndex - 1)

  console.log('Getting all Bisected events...')
  const bisects = await getLogsInBatches(
    contracts.colosseum,
    contracts.colosseum.filters.Bisected(outputIndex, challenger),
    GET_LOGS_MAX_RANGE,
    EARLIEST_BLOCK,
    'latest',
  )
  const weBisectedFirstTime =
    bisects.find((b) => b.args!.turn === 2) !== undefined
  const weBisectedSecondTime =
    bisects.find((b) => b.args!.turn === 4) !== undefined
  const challengerBisected =
    bisects.find((b) => b.args!.turn === 3) !== undefined

  if (weBisectedSecondTime) {
    console.log(
      "We have bisected two times, now it's their turn to provide the proof",
    )
    process.exit(0)
  }

  console.log(`We bisected first time: ${weBisectedFirstTime.toString()}`)
  console.log(`Challenger bisected: ${challengerBisected.toString()}`)

  if (weBisectedFirstTime && !challengerBisected) {
    console.log('Sleeping...')
    await sleep(10 * 1000)
    return
  }

  const currentTurn = challengerBisected ? 4 : 2
  // const currentTurn = 3
  console.log(`Current turn: ${currentTurn}`)

  const requiredSegmentsLength = (
    await contracts.colosseum.getSegmentsLength(currentTurn)
  ).toNumber()
  console.log('Required segments length:', requiredSegmentsLength)

  const segments = Array(requiredSegmentsLength)
    .fill('0x0')
    .map((x: string) => ethers.utils.hexZeroPad(x, 32))

  segments[0] = output.outputRoot
  // This assumes that the challenge was for between elements 0 and 1
  // TODO: make this bisect at the place they actually challenged

  // const dummyValue = '0x222'
  const dummyValue = currentTurn === 2 ? '0x111' : '0x333'

  segments[requiredSegmentsLength - 1] = ethers.utils.hexZeroPad(dummyValue, 32)

  console.log('Bisecting!')
  const tx = await contracts.colosseum.bisect(
    outputIndex,
    challenger,
    0,
    segments,
  )
  await tx.wait()
  await sleep(20 * 1000)
}

async function showBasicKromaInfo(contracts: KromaContracts) {
  const proposerCount = await contracts.validatorPool.validatorCount()
  const curProposer = await contracts.validatorPool.nextValidator()
  const roundDuration = await contracts.validatorPool.ROUND_DURATION()
  console.log(`Current proposer count: ${proposerCount.toString()}`)
  console.log(`Current proposer: ${curProposer}`)
  console.log(`Round duration: ${roundDuration.toString()}`)
}

async function getProposedOutputIndex(
  contracts: KromaContracts,
): Promise<number | undefined> {
  console.log('Checking if I already proposed by looking at Bonded events')
  const myBondedEvents = await getLogsInBatches(
    contracts.validatorPool,
    contracts.validatorPool.filters.Bonded(myAddr),
    GET_LOGS_MAX_RANGE,
    EARLIEST_BLOCK,
    'latest',
  )

  if (myBondedEvents.length > 1) {
    throw new Error(
      'Making multiple proposals is currently not supported by this script',
    )
  }

  const event = myBondedEvents[0] as ethers.Event | undefined
  if (event === undefined) {
    return undefined
  }
  return event.args!.outputIndex as number
}

async function proposeRoot(contracts: KromaContracts) {
  await addMyselfToProposerList(contracts)
  await waitToBecomeProposerOrPublicRound(contracts)
  await submitOutputRoot(contracts)
}

async function addMyselfToProposerList(contracts: KromaContracts) {
  if (await contracts.validatorPool.isValidator(myAddr)) {
    console.log('I am already on the proposer list.')
    return
  }
  console.log('Adding myself to proposer list.')
  const value = PROPOSER_DEPOSIT[KROMA_NETWORK]
  const tx = await contracts.validatorPool.deposit({ value })
  await tx.wait()
  if (!(await contracts.validatorPool.isValidator(myAddr))) {
    throw new Error('Failed to add myself to proposer list')
  }
}

async function waitToBecomeProposerOrPublicRound(contracts: KromaContracts) {
  console.log('Waiting to become proposer or a public round...')
  let proposer = await contracts.validatorPool.nextValidator()

  while (proposer !== myAddr && proposer !== VALIDATOR_PUBLIC_ROUND_ADDRESS) {
    console.log(`${new Date().toISOString()} Current proposer: ${proposer}`)
    await sleep(10 * 1000)
    proposer = await contracts.validatorPool.nextValidator()
  }

  console.log(
    proposer === myAddr ? 'I am the proposer!' : "It's a public round.",
  )
}

async function submitOutputRoot(contracts: KromaContracts) {
  console.log('Preparing to submit output root...')
  const provider = contracts.validatorPool.provider
  const nextL2BlockNumber = await contracts.l2OutputOracle.nextBlockNumber()
  const block = await provider.getBlock('latest')
  const blockNumber = block.number
  const blockHash = block.hash

  const expectedTimestamp =
    await contracts.l2OutputOracle.computeL2Timestamp(nextL2BlockNumber)

  const waitUntil = expectedTimestamp.toNumber() + 1 // +1 second for clock drift
  while (Date.now() / 1000 < waitUntil) {
    console.log(
      `Waiting for timestamp ${expectedTimestamp.toString()} (it's ${
        Date.now() / 1000
      })`,
    )
    await sleep(1 * 1000)
  }

  const dummyOutputRoot = ethers.utils.hexZeroPad('0x1234567890', 32)

  console.log('Submitting output...')
  const tx = await contracts.l2OutputOracle.submitL2Output(
    dummyOutputRoot,
    nextL2BlockNumber,
    blockHash,
    blockNumber,
    {
      gasLimit: 300000, // to not run out of gas
    },
  )
  console.log('Done! Waiting until transaction is mined...')
  await tx.wait()
  await sleep(20 * 1000)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
