import { BaseContract, ethers } from 'ethers'

export async function getLogsInBatches(
  contract: BaseContract,
  eventFilter: ethers.EventFilter,
  getLogsMaxRange: number,
  fromBlock: number,
  toBlock: number | 'latest',
): Promise<ethers.Event[]> {
  console.log('Querying logs from', fromBlock, 'to', toBlock)
  const _toBlock =
    toBlock === 'latest' ? await contract.provider.getBlockNumber() : toBlock

  if (fromBlock > _toBlock) {
    throw new Error(
      `fromBlock (${fromBlock}) can't be bigger than toBlock (${_toBlock})`,
    )
  }

  const maxRange = getLogsMaxRange
  const allLogs: ethers.Event[][] = []

  let start = fromBlock
  do {
    const curBoundaryStart = Math.floor(start / maxRange) * maxRange
    const curBoundaryEnd = curBoundaryStart + maxRange - 1 // getLogs 'to' is inclusive!
    const end = Math.min(curBoundaryEnd, _toBlock)
    const logs = await contract.queryFilter(eventFilter, start, end)
    allLogs.push(logs)
    start = end + 1
  } while (start <= _toBlock)

  return allLogs.flat()
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function getRcpHostFromArgs(): string {
  const rpcHost = process.argv[2]
  if (!rpcHost || rpcHost === '') {
    console.log('Error: please specify RPC host as first argument.')
    process.exit(1)
  }
  return rpcHost
}
