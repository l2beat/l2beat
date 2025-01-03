import { ExplorerConfig } from '@l2beat/discovery/dist/utils/IEtherscanClient'
import { CliLogger } from '@l2beat/shared'
import { EthereumAddress, formatAsAsciiTable } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { getProvider } from './common/GetProvider'

const ROLE_EVENTS = [
  'event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)',
  'event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)',
]
const TOKEN_MINTER_ROLE =
  '0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6' // keccak256("MINTER_ROLE");

export async function getTokenMinterEvents(
  logger: CliLogger,
  address: EthereumAddress,
  rpcUrl: string,
  explorerUrl?: string,
  explorerApiKey?: string,
  explorerType?: string,
) {
  const explorer = {
    type: (explorerType as ExplorerConfig['type']) ?? 'etherscan',
    url: explorerUrl ?? 'ERROR',
    apiKey: explorerApiKey ?? 'ERROR',
  }
  const provider = await getProvider(rpcUrl, explorer)

  const iface = new utils.Interface(ROLE_EVENTS)
  const roleGrantedTopic = iface.getEventTopic('RoleGranted')
  const roleRevokedTopic = iface.getEventTopic('RoleRevoked')

  logger.logLine('Fetching role events...')
  const logs = await provider.getLogs(address, [
    [roleGrantedTopic, roleRevokedTopic], // Match either event
    TOKEN_MINTER_ROLE, // Filter for TOKEN_MINTER_ROLE in the first indexed parameter
  ])
  logger.logLine('Done.')

  const currentMinters = new Set<string>()

  // Process events in order they were emitted
  for (const log of logs) {
    const parsedLog = iface.parseLog(log)
    const account = parsedLog.args.account as string

    if (parsedLog.name === 'RoleGranted') {
      currentMinters.add(account)
    } else if (parsedLog.name === 'RoleRevoked') {
      currentMinters.delete(account)
    }
  }

  if (currentMinters.size === 0) {
    logger.logLine('No current TOKEN_MINTER_ROLE holders found.')
    return
  }

  const headers = ['Account']
  const values = Array.from(currentMinters).map((account) => [account])

  logger.logLine('Current TOKEN_MINTER_ROLE holders:')
  logger.logLine(formatAsAsciiTable(headers, values))
}
