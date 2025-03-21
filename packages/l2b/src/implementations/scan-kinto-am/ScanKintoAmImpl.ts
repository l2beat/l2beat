import chalk from 'chalk'
import { ethers } from 'ethers'

// -------------------------
// CONFIGURATION
// -------------------------

const RPC_URL = 'https://rpc.kinto-rpc.com'
const ACCESS_MANAGER_ADDRESS = '0xacC000818e5Bbd911D5d449aA81CB5cA24024739'

// Known role constants
const roleNames: { [role: string]: string } = {
  '0': 'ADMIN_ROLE',
  '8663528507529876195': 'UPGRADER_ROLE',
  '14661544942390944024': 'SECURITY_COUNCIL_ROLE',
  '1635978423191113331': 'NIO_GOVERNOR_ROLE',
  '18446744073709551615': 'PUBLIC_ROLE',
}

// Unified address mapping
const addressNames: { [address: string]: string } = {
  // Actors
  '0x2e2b1c42e38f5af81771e65d87729e57abd1337a': 'KintoAdminMultisig',
  '0x28fc10e12a78f986c78f973fc70ed88072b34c8e': 'SecurityCouncil-L2a',
  '0x010600ff5f36c8ef3b6aaf2a88c2de85c798594a': 'NioGovernor',
  // Targets
  '0x8a4720488ca32f1223ccfe5a087e250fe3bc5d75': 'KintoWalletFactory',
  '0x5a2b641b84b0230c8e75f55d5afd27f4dbd59d5b': 'KintoAppRegistry',
  '0xf369f78e3a0492cc4e96a90dae0728a38498e9c7': 'KintoID',
  '0x793500709506652fcc61f0d2d0fda605638d4293': 'Treasury',
  '0xacc000818e5bbd911d5d449aa81cb5ca24024739': 'AccessManager',
}

// -------------------------
// HELPER FUNCTIONS
// -------------------------

function bnToNumber(value: ethers.BigNumber | number): number {
  if (typeof value === 'number') return value
  return value.toNumber()
}

function getSelector(signature: string): string {
  return ethers.utils.hexDataSlice(
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes(signature)),
    0,
    4,
  )
}

function formatAddress(address: string): string {
  address = address.toLowerCase()
  const name = addressNames[address]
  if (name) {
    return `${chalk.blue(name)} (${chalk.gray(address)})`
  }
  return chalk.gray(address)
}

// Function selector mapping
const functionSignatures: { [selector: string]: string } = {}

// Add function signatures for existing functions
functionSignatures[getSelector('upgradeAllWalletImplementations(address)')] =
  'upgradeAllWalletImplementations(address)'
functionSignatures[getSelector('upgradeTo(address)')] = 'upgradeTo(address)'
functionSignatures[getSelector('updateSystemApps(address[])')] =
  'updateSystemApps(address[])'
functionSignatures[getSelector('updateSystemContracts(address[])')] =
  'updateSystemContracts(address[])'
functionSignatures[getSelector('updateReservedContracts(address[])')] =
  'updateReservedContracts(address[])'

// Add new function signatures
functionSignatures['0xd6bb62c6'] = 'cancel(address,address,bytes)'
functionSignatures['0x94c7d7ee'] = 'consumeScheduledOp(address,bytes)'
functionSignatures['0x1cff79cd'] = 'execute(address,bytes)'
functionSignatures['0x25c471a0'] = 'grantRole(uint64,address,uint32)'
functionSignatures['0x853551b8'] = 'labelRole(uint64,string)'
functionSignatures['0xac9650d8'] = 'multicall(bytes[])'
functionSignatures['0xfe0776f5'] = 'renounceRole(uint64,address)'
functionSignatures['0xb7d2b162'] = 'revokeRole(uint64,address)'
functionSignatures['0xf801a698'] = 'schedule(address,bytes,uint48)'
functionSignatures['0xa64d95ce'] = 'setGrantDelay(uint64,uint32)'
functionSignatures['0x30cae187'] = 'setRoleAdmin(uint64,uint64)'
functionSignatures['0x52962952'] = 'setRoleGuardian(uint64,uint64)'
functionSignatures['0xd22b5989'] = 'setTargetAdminDelay(address,uint32)'
functionSignatures['0x167bd395'] = 'setTargetClosed(address,bool)'
functionSignatures['0x08d6122d'] =
  'setTargetFunctionRole(address,bytes4[],uint64)'
functionSignatures['0x18ff183c'] = 'updateAuthority(address,address)'
functionSignatures['0x8522d1b2'] = '0x8522d1b2'
functionSignatures['0xc664c714'] = '0xc664c714'
functionSignatures['0x9089e8ae'] = '0x9089e8ae'

// Function to decode operation data for known function selectors
function decodeOperationData(selector: string, data: string): string {
  try {
    const abiCoder = new ethers.utils.AbiCoder()

    // Remove the selector to get just the parameters data
    const paramsData = '0x' + data.slice(10)

    // Decode based on function selector
    switch (selector) {
      // grantRole(uint64 roleId, address account, uint32 executionDelay)
      case '0x25c471a0': {
        const [roleId, account, executionDelay] = abiCoder.decode(
          ['uint64', 'address', 'uint32'],
          paramsData,
        )

        const roleName = roleNames[roleId.toString()] || roleId.toString()
        const accountNameFormatted = formatAddress(account)

        return `grantRole(${chalk.yellow(roleName)}, ${accountNameFormatted}, ${chalk.green(executionDelay)} (${chalk.green(formatDuration(executionDelay))}))`
      }

      // revokeRole(uint64 roleId, address account)
      case '0xb7d2b162': {
        const [roleId, account] = abiCoder.decode(
          ['uint64', 'address'],
          paramsData,
        )

        const roleName = roleNames[roleId.toString()] || roleId.toString()
        const accountNameFormatted = formatAddress(account)

        return `revokeRole(${chalk.yellow(roleName)}, ${accountNameFormatted})`
      }

      // setTargetAdminDelay(address target, uint32 newDelay)
      case '0xd22b5989': {
        const [target, newDelay] = abiCoder.decode(
          ['address', 'uint32'],
          paramsData,
        )

        const targetNameFormatted = formatAddress(target)

        return `setTargetAdminDelay(${targetNameFormatted}, ${chalk.green(newDelay)} (${chalk.green(formatDuration(newDelay))}))`
      }

      // setTargetClosed(address target, bool closed)
      case '0x167bd395': {
        const [target, closed] = abiCoder.decode(
          ['address', 'bool'],
          paramsData,
        )

        const targetNameFormatted = formatAddress(target)

        return `setTargetClosed(${targetNameFormatted}, ${chalk.yellow(closed)})`
      }

      // For other functions, just return the function name
      default:
        return functionSignatures[selector] || selector
    }
  } catch (_error) {
    // If decoding fails, just return the function signature
    return functionSignatures[selector] || selector
  }
}

function formatDuration(seconds: number): string {
  if (seconds >= 86400 && seconds % 86400 === 0) {
    return `${seconds / 86400}d`
  } else if (seconds >= 3600 && seconds % 3600 === 0) {
    return `${seconds / 3600}h`
  }
  return `${seconds}s`
}

// -------------------------
// ABI fragment for AccessManager contract
// -------------------------

const accessManagerAbi = [
  'event OperationCanceled(bytes32 indexed operationId, uint32 indexed nonce)',
  'event OperationExecuted(bytes32 indexed operationId, uint32 indexed nonce)',
  'event OperationScheduled(bytes32 indexed operationId, uint32 indexed nonce, uint48 schedule, address caller, address target, bytes data)',
  'event RoleAdminChanged(uint64 indexed roleId, uint64 indexed admin)',
  'event RoleGrantDelayChanged(uint64 indexed roleId, uint32 delay, uint48 since)',
  'event RoleGranted(uint64 indexed roleId, address indexed account, uint32 delay, uint48 since, bool newMember)',
  'event RoleGuardianChanged(uint64 indexed roleId, uint64 indexed guardian)',
  'event RoleLabel(uint64 indexed roleId, string label)',
  'event RoleRevoked(uint64 indexed roleId, address indexed account)',
  'event TargetAdminDelayUpdated(address indexed target, uint32 delay, uint48 since)',
  'event TargetClosed(address indexed target, bool closed)',
  'event TargetFunctionRoleUpdated(address indexed target, bytes4 selector, uint64 indexed roleId)',
  'function ADMIN_ROLE() view returns (uint64)',
  'function PUBLIC_ROLE() view returns (uint64)',
  'function canCall(address caller, address target, bytes4 selector) view returns (bool immediate, uint32 delay)',
  'function expiration() view returns (uint32)',
  'function getAccess(uint64 roleId, address account) view returns (uint48 since, uint32 currentDelay, uint32 pendingDelay, uint48 effect)',
  'function getNonce(bytes32 id) view returns (uint32)',
  'function getRoleAdmin(uint64 roleId) view returns (uint64)',
  'function getRoleGrantDelay(uint64 roleId) view returns (uint32)',
  'function getRoleGuardian(uint64 roleId) view returns (uint64)',
  'function getSchedule(bytes32 id) view returns (uint48)',
  'function getTargetAdminDelay(address target) view returns (uint32)',
  'function getTargetFunctionRole(address target, bytes4 selector) view returns (uint64)',
  'function hasRole(uint64 roleId, address account) view returns (bool isMember, uint32 executionDelay)',
  'function hashOperation(address caller, address target, bytes data) view returns (bytes32)',
  'function isTargetClosed(address target) view returns (bool)',
  'function minSetback() view returns (uint32)',
]

// -------------------------
// MAIN FUNCTION
// -------------------------

export async function runScanKintoAm(): Promise<void> {
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
  const accessManager = new ethers.Contract(
    ACCESS_MANAGER_ADDRESS,
    accessManagerAbi,
    provider,
  )

  const fromBlock = 0

  // Data structure: role -> target -> functions
  const roleToTargetFunctions: {
    [roleId: string]: { [target: string]: Set<string> }
  } = {}

  console.log(chalk.blue('Connecting to RPC endpoint:'), chalk.gray(RPC_URL))
  console.log(
    chalk.blue('AccessManager contract:'),
    chalk.gray(ACCESS_MANAGER_ADDRESS),
  )

  // 1. Fetch Role-related events
  console.log(chalk.bold('\nFetching role events...'))
  console.log(chalk.magenta('- Querying RoleGranted events...'))
  const roleGrantedEvents = await accessManager.queryFilter(
    'RoleGranted',
    fromBlock,
    'latest',
  )
  console.log(
    chalk.green(`- Found ${roleGrantedEvents.length} RoleGranted events`),
  )

  console.log(chalk.magenta('- Querying RoleRevoked events...'))
  const roleRevokedEvents = await accessManager.queryFilter(
    'RoleRevoked',
    fromBlock,
    'latest',
  )
  console.log(
    chalk.green(`- Found ${roleRevokedEvents.length} RoleRevoked events`),
  )

  // Build a mapping: roleId -> Set(account)
  const accountsPerRole: { [role: string]: Set<string> } = {}
  for (const event of roleGrantedEvents) {
    if (!event.args) continue
    const roleId = event.args.roleId.toString()
    const account = event.args.account.toLowerCase()
    if (!accountsPerRole[roleId]) accountsPerRole[roleId] = new Set()
    accountsPerRole[roleId].add(account)
  }
  for (const event of roleRevokedEvents) {
    if (!event.args) continue
    const roleId = event.args.roleId.toString()
    const account = event.args.account.toLowerCase()
    accountsPerRole[roleId]?.delete(account)
  }

  console.log(chalk.magenta('- Fetching current role data for actors...'))
  const rolesByActor: {
    [account: string]: Array<{
      roleId: string
      executionDelay: number
      since: number
      pendingDelay: number
      pendingEffect: number
    }>
  } = {}

  for (const roleId in accountsPerRole) {
    for (const account of accountsPerRole[roleId]) {
      const [isMember] = await accessManager.hasRole(roleId, account)
      if (isMember) {
        const accessData = await accessManager.getAccess(roleId, account)
        const since = bnToNumber(accessData[0])
        const currentDelay = bnToNumber(accessData[1])
        const pendingDelay = bnToNumber(accessData[2])
        const effect = bnToNumber(accessData[3])
        if (!rolesByActor[account]) rolesByActor[account] = []
        rolesByActor[account].push({
          roleId,
          executionDelay: currentDelay,
          since,
          pendingDelay,
          pendingEffect: effect,
        })
      }
    }
  }
  console.log(
    chalk.green(
      `- Found ${Object.keys(rolesByActor).length} actors with active roles`,
    ),
  )

  // 2. Fetch Target configuration events.
  console.log(chalk.bold('\nFetching target events...'))
  console.log(chalk.magenta('- Querying TargetFunctionRoleUpdated events...'))
  const targetFuncRoleEvents = await accessManager.queryFilter(
    'TargetFunctionRoleUpdated',
    fromBlock,
    'latest',
  )
  console.log(
    chalk.green(
      `- Found ${targetFuncRoleEvents.length} TargetFunctionRoleUpdated events`,
    ),
  )

  console.log(chalk.magenta('- Querying TargetAdminDelayUpdated events...'))
  const targetAdminDelayEvents = await accessManager.queryFilter(
    'TargetAdminDelayUpdated',
    fromBlock,
    'latest',
  )
  console.log(
    chalk.green(
      `- Found ${targetAdminDelayEvents.length} TargetAdminDelayUpdated events`,
    ),
  )

  interface TargetData {
    adminDelay: number
    closed: boolean
    functions: { [roleId: string]: Set<string> }
    pendingAdminDelayChanges?: Array<{ newDelay: number; effect: number }>
  }
  const targetData: { [target: string]: TargetData } = {}

  // Process TargetFunctionRoleUpdated events
  for (const event of targetFuncRoleEvents) {
    if (!event.args) continue
    const target = event.args.target.toLowerCase()
    const selector = event.args.selector
    const roleId = event.args.roleId.toString()

    if (!targetData[target]) {
      targetData[target] = { adminDelay: 0, closed: false, functions: {} }
    }
    if (!targetData[target].functions[roleId]) {
      targetData[target].functions[roleId] = new Set()
    }
    targetData[target].functions[roleId].add(selector)

    if (!roleToTargetFunctions[roleId]) {
      roleToTargetFunctions[roleId] = {}
    }
    if (!roleToTargetFunctions[roleId][target]) {
      roleToTargetFunctions[roleId][target] = new Set()
    }
    roleToTargetFunctions[roleId][target].add(selector)
  }

  // Process TargetAdminDelayUpdated events
  for (const event of targetAdminDelayEvents) {
    if (!event.args) continue
    const target = event.args.target.toLowerCase()
    if (!targetData[target]) {
      targetData[target] = { adminDelay: 0, closed: false, functions: {} }
    }
    const newDelay = bnToNumber(event.args.delay)
    const effect = bnToNumber(event.args.since)
    if (!targetData[target].pendingAdminDelayChanges) {
      targetData[target].pendingAdminDelayChanges = []
    }
    targetData[target].pendingAdminDelayChanges.push({ newDelay, effect })
  }

  console.log(
    chalk.magenta(
      '- Fetching current admin delays and closures for targets...',
    ),
  )
  for (const target in targetData) {
    const adminDelayBN = await accessManager.getTargetAdminDelay(target)
    targetData[target].adminDelay = bnToNumber(adminDelayBN)
    const closed = await accessManager.isTargetClosed(target)
    targetData[target].closed = closed
  }
  console.log(
    chalk.green(
      `- Found configuration data for ${Object.keys(targetData).length} targets`,
    ),
  )

  // 3. Fetch queued operations and pending role delay changes.
  console.log(chalk.bold('\nFetching queued operations...'))
  console.log(chalk.magenta('- Querying OperationScheduled events...'))
  const operationScheduledEvents = await accessManager.queryFilter(
    'OperationScheduled',
    fromBlock,
    'latest',
  )
  console.log(
    chalk.green(
      `- Found ${operationScheduledEvents.length} OperationScheduled events`,
    ),
  )

  console.log(chalk.magenta('- Querying OperationExecuted events...'))
  const operationExecutedEvents = await accessManager.queryFilter(
    'OperationExecuted',
    fromBlock,
    'latest',
  )
  console.log(
    chalk.green(
      `- Found ${operationExecutedEvents.length} OperationExecuted events`,
    ),
  )

  console.log(chalk.magenta('- Querying OperationCanceled events...'))
  const operationCanceledEvents = await accessManager.queryFilter(
    'OperationCanceled',
    fromBlock,
    'latest',
  )
  console.log(
    chalk.green(
      `- Found ${operationCanceledEvents.length} OperationCanceled events`,
    ),
  )

  console.log(chalk.magenta('- Querying RoleGrantDelayChanged events...'))
  const roleGrantDelayChangedEvents = await accessManager.queryFilter(
    'RoleGrantDelayChanged',
    fromBlock,
    'latest',
  )
  console.log(
    chalk.green(
      `- Found ${roleGrantDelayChangedEvents.length} RoleGrantDelayChanged events`,
    ),
  )

  const executedOrCanceled = new Set<string>()
  for (const event of operationExecutedEvents) {
    if (!event.args) continue
    executedOrCanceled.add(event.args.operationId)
  }
  for (const event of operationCanceledEvents) {
    if (!event.args) continue
    executedOrCanceled.add(event.args.operationId)
  }

  console.log(chalk.magenta('- Filtering pending operations...'))
  const scheduledOps: Array<{
    operationId: string
    nonce: number
    schedule: number
    caller: string
    target: string
    data: string
  }> = []
  for (const event of operationScheduledEvents) {
    if (!event.args) continue
    const opId = event.args.operationId
    if (!executedOrCanceled.has(opId)) {
      scheduledOps.push({
        operationId: opId,
        nonce: bnToNumber(event.args.nonce),
        schedule: bnToNumber(event.args.schedule),
        caller: event.args.caller.toLowerCase(),
        target: event.args.target.toLowerCase(),
        data: event.args.data,
      })
    }
  }
  console.log(chalk.green(`- Found ${scheduledOps.length} pending operations`))

  console.log(chalk.magenta('- Filtering pending role grant delay changes...'))
  const pendingRoleGrantChanges: Array<{
    roleId: string
    newDelay: number
    effect: number
  }> = []
  const currentTimestamp = Math.floor(Date.now() / 1000)
  for (const event of roleGrantDelayChangedEvents) {
    if (!event.args) continue
    const effect = bnToNumber(event.args.since)
    if (effect > currentTimestamp) {
      pendingRoleGrantChanges.push({
        roleId: event.args.roleId.toString(),
        newDelay: bnToNumber(event.args.delay),
        effect,
      })
    }
  }
  console.log(
    chalk.green(
      `- Found ${pendingRoleGrantChanges.length} pending role grant delay changes`,
    ),
  )

  // 4. Format and print the report.
  console.log(
    chalk.bold(
      '\n================ Current Roles Held by Actors ================',
    ),
  )
  if (Object.keys(rolesByActor).length === 0) {
    console.log(chalk.red('\nNo actors with active roles found.'))
  } else {
    for (const account in rolesByActor) {
      console.log(`\n${formatAddress(account)}:`)
      for (const roleInfo of rolesByActor[account]) {
        const roleName = roleNames[roleInfo.roleId] || roleInfo.roleId
        const delayStr = `${chalk.green(roleInfo.executionDelay)} (${chalk.green(formatDuration(roleInfo.executionDelay))})`
        console.log(
          `  ${chalk.yellow(roleName)}: ${chalk.magenta('executionDelay')}: ${delayStr}`,
        )

        if (roleToTargetFunctions[roleInfo.roleId]) {
          console.log('    Callable targets and functions:')
          const targets = roleToTargetFunctions[roleInfo.roleId]
          if (Object.keys(targets).length === 0) {
            console.log(
              chalk.red(
                '      No targets or functions configured for this role',
              ),
            )
          } else {
            for (const target in targets) {
              console.log(`      Target ${formatAddress(target)}:`)
              const functions = Array.from(targets[target]).map((sel) =>
                functionSignatures[sel]
                  ? chalk.gray(functionSignatures[sel])
                  : chalk.gray(sel),
              )
              console.log(`        Functions: ${functions.join(', ')}`)
            }
          }
        }
      }
    }
  }

  console.log(
    chalk.bold(
      '\n================ Current Target Configurations ================',
    ),
  )
  if (Object.keys(targetData).length === 0) {
    console.log(chalk.red('\nNo target configurations found.'))
  } else {
    for (const target in targetData) {
      console.log(`\n${formatAddress(target)}:`)
      console.log(
        `  ${chalk.magenta('targetAdminDelay')}: ${chalk.green(targetData[target].adminDelay)} (${chalk.green(formatDuration(targetData[target].adminDelay))})`,
      )
      console.log(`  Closed: ${chalk.yellow(targetData[target].closed)}`)
      console.log('  Function Roles:')
      if (Object.keys(targetData[target].functions).length === 0) {
        console.log(
          chalk.red('    No function roles configured for this target'),
        )
      } else {
        for (const roleId in targetData[target].functions) {
          const roleName = roleNames[roleId] || roleId
          const funcs = Array.from(targetData[target].functions[roleId]).map(
            (sel) =>
              functionSignatures[sel]
                ? chalk.gray(functionSignatures[sel])
                : chalk.gray(sel),
          )
          console.log(`    ${chalk.yellow(roleName)}: ${funcs.join(', ')}`)
        }
      }
    }
  }

  console.log(
    chalk.bold(
      '\n============= Queued Delay/Config Changes and Queued Actions =============',
    ),
  )
  let changesFound = false

  // Pending role execution delay changes for actors:
  for (const account in rolesByActor) {
    for (const roleInfo of rolesByActor[account]) {
      if (
        roleInfo.pendingDelay > 0 &&
        roleInfo.pendingEffect > currentTimestamp
      ) {
        changesFound = true
        const roleName = roleNames[roleInfo.roleId] || roleInfo.roleId
        console.log(
          `\nActor ${formatAddress(account)} has a scheduled change for role ${chalk.yellow(roleName)}:`,
        )
        console.log(
          `  ${chalk.magenta('executionDelay')} change from ${chalk.green(roleInfo.executionDelay)} (${chalk.green(formatDuration(roleInfo.executionDelay))}) to ${chalk.green(roleInfo.pendingDelay)} (${chalk.green(
            formatDuration(roleInfo.pendingDelay),
          )}) effective at ${chalk.green(new Date(roleInfo.pendingEffect * 1000).toISOString())}`,
        )
      }
    }
  }

  // Pending target admin delay changes:
  let pendingAdminDelayChangesFound = false
  for (const target in targetData) {
    if (targetData[target].pendingAdminDelayChanges) {
      for (const change of targetData[target].pendingAdminDelayChanges) {
        if (change.effect > currentTimestamp) {
          changesFound = true
          pendingAdminDelayChangesFound = true
          console.log(
            `\nTarget ${formatAddress(target)} scheduled targetAdminDelay change:`,
          )
          console.log(
            `  New ${chalk.magenta('targetAdminDelay')}: ${chalk.green(change.newDelay)} (${chalk.green(formatDuration(change.newDelay))}) effective at ${chalk.green(new Date(change.effect * 1000).toISOString())}`,
          )
        }
      }
    }
  }
  if (!pendingAdminDelayChangesFound) {
    console.log(chalk.red('No pending target admin delay changes found.'))
  }

  // Queued operations (scheduled calls)
  if (scheduledOps.length > 0) {
    changesFound = true
    console.log(chalk.bold('\nQueued Operations:'))
    for (const op of scheduledOps) {
      const selector = op.data.slice(0, 10) // first 4 bytes (10 hex characters with "0x")
      const decodedFunction = decodeOperationData(selector, op.data)

      console.log(`\nOperation ${chalk.cyan(op.operationId)}:`)
      console.log(`    Nonce: ${chalk.yellow(op.nonce)}`)
      console.log(
        `    Scheduled for: ${chalk.green(new Date(op.schedule * 1000).toISOString())}`,
      )
      console.log(`    Caller: ${formatAddress(op.caller)}`)
      console.log(`    Target: ${formatAddress(op.target)}`)
      console.log(`    Function: ${chalk.gray(decodedFunction)}`)
    }
  } else {
    console.log(chalk.red('No queued operations found.'))
  }

  // Pending role grant delay changes:
  console.log(chalk.bold('\nPending Role Grant Delay Changes:'))
  if (pendingRoleGrantChanges.length > 0) {
    changesFound = true
    for (const change of pendingRoleGrantChanges) {
      const roleName = roleNames[change.roleId] || change.roleId
      console.log(
        `  Role ${chalk.yellow(roleName)} scheduled to change grant delay to ${chalk.green(change.newDelay)} (${chalk.green(formatDuration(change.newDelay))}) effective at ${chalk.green(new Date(change.effect * 1000).toISOString())}`,
      )
    }
  } else {
    console.log(chalk.red('  No pending role grant delay changes found.'))
  }

  if (!changesFound) {
    console.log(chalk.red('\nNo pending changes or queued actions found.'))
  }
}
