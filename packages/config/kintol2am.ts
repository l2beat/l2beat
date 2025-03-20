import { ethers } from 'ethers'

// -------------------------
// CONFIGURATION
// -------------------------

const RPC_URL = 'https://rpc.kinto-rpc.com'
const ACCESS_MANAGER_ADDRESS = '0xacC000818e5Bbd911D5d449aA81CB5cA24024739'

// Known role constants (as strings, since on–chain they are BigNumbers)
const roleNames: { [role: string]: string } = {
  '0': 'ADMIN_ROLE',
  '8663528507529876195': 'UPGRADER_ROLE',
  '14661544942390944024': 'SECURITY_COUNCIL_ROLE',
  // PUBLIC_ROLE is available too if needed
}

// Known actor names (add any extra if discovered on–chain)
const actorNames: { [address: string]: string } = {
  '0x2e2b1c42e38f5af81771e65d87729e57abd1337a': 'KintoAdminMultisig',
  '0x28fc10e12a78f986c78f973fc70ed88072b34c8e': 'SC-L2Alias',
  // ... other actors (addresses will be lowercased)
}

// Known target names
const targetNames: { [address: string]: string } = {
  '0x8a4720488ca32f1223ccfe5a087e250fe3bc5d75': 'KintoWalletFactory',
  '0x5a2b641b84b0230c8e75f55d5afd27f4dbd59d5b': 'KintoAppRegistry',
  '0xf369f78e3a0492cc4e96a90dae0728a38498e9c7': 'KintoID',
  // ... add more if needed
}

// -------------------------
// Helper: Convert value to number (if BigNumber or already a number)
// -------------------------
function bnToNumber(value: ethers.BigNumber | number): number {
  if (typeof value === 'number') return value
  return value.toNumber()
}

// -------------------------
// Helper: Compute function selector and map known signatures
// -------------------------
function getSelector(signature: string): string {
  return ethers.utils.hexDataSlice(
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes(signature)),
    0,
    4,
  )
}

const functionSignatures: { [selector: string]: string } = {}
functionSignatures[getSelector('upgradeAllWalletImplementations(address)')] =
  'upgradeAllWalletImplementations(address)'
functionSignatures[getSelector('upgradeTo(address)')] = 'upgradeTo(address)'
functionSignatures[getSelector('updateSystemApps(address[])')] =
  'updateSystemApps(address[])'
functionSignatures[getSelector('updateSystemContracts(address[])')] =
  'updateSystemContracts(address[])'
functionSignatures[getSelector('updateReservedContracts(address[])')] =
  'updateReservedContracts(address[])'

// -------------------------
// Helper: Format durations (in seconds) in human–readable form
// -------------------------
function formatDuration(seconds: number): string {
  if (seconds >= 86400 && seconds % 86400 === 0) {
    return `${seconds / 86400}d`
  } else if (seconds >= 3600 && seconds % 3600 === 0) {
    return `${seconds / 3600}h`
  }
  return `${seconds}s`
}

// -------------------------
// ABI fragment (excerpted) for the AccessManager contract
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
// Main script
// -------------------------
async function main() {
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
  const accessManager = new ethers.Contract(
    ACCESS_MANAGER_ADDRESS,
    accessManagerAbi,
    provider,
  )

  // For event queries we use fromBlock 0 (adjust if you know the deployment block)
  const fromBlock = 0

  // Data structures to store relationships between roles, actors, targets, and functions
  const roleToTargetFunctions: {
    [roleId: string]: { [target: string]: Set<string> }
  } = {}

  console.log('Connecting to RPC endpoint:', RPC_URL)
  console.log('AccessManager contract:', ACCESS_MANAGER_ADDRESS)

  // -------------------------
  // 1. Fetch Role–related events to determine which accounts hold which roles.
  // -------------------------
  console.log('\nFetching role events...')
  console.log('- Querying RoleGranted events...')
  const roleGrantedEvents = await accessManager.queryFilter(
    'RoleGranted',
    fromBlock,
    'latest',
  )
  console.log(`- Found ${roleGrantedEvents.length} RoleGranted events`)

  console.log('- Querying RoleRevoked events...')
  const roleRevokedEvents = await accessManager.queryFilter(
    'RoleRevoked',
    fromBlock,
    'latest',
  )
  console.log(`- Found ${roleRevokedEvents.length} RoleRevoked events`)

  // Build a mapping: roleId => Set(account)
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
    if (accountsPerRole[roleId]) {
      accountsPerRole[roleId].delete(account)
    }
  }

  // For each account and role, call hasRole and getAccess
  console.log('- Fetching current role data for actors...')
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
      const [isMember, _execDelay] = await accessManager.hasRole(
        roleId,
        account,
      )
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
    `- Found ${Object.keys(rolesByActor).length} actors with active roles`,
  )

  // -------------------------
  // 2. Fetch Target configuration events.
  // -------------------------
  console.log('\nFetching target events...')
  console.log('- Querying TargetFunctionRoleUpdated events...')
  const targetFuncRoleEvents = await accessManager.queryFilter(
    'TargetFunctionRoleUpdated',
    fromBlock,
    'latest',
  )
  console.log(
    `- Found ${targetFuncRoleEvents.length} TargetFunctionRoleUpdated events`,
  )

  console.log('- Querying TargetAdminDelayUpdated events...')
  const targetAdminDelayEvents = await accessManager.queryFilter(
    'TargetAdminDelayUpdated',
    fromBlock,
    'latest',
  )
  console.log(
    `- Found ${targetAdminDelayEvents.length} TargetAdminDelayUpdated events`,
  )

  // Build a mapping: target address => { adminDelay, closed flag, and function roles }
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

    // Add to target data
    if (!targetData[target]) {
      targetData[target] = { adminDelay: 0, closed: false, functions: {} }
    }
    if (!targetData[target].functions[roleId]) {
      targetData[target].functions[roleId] = new Set()
    }
    targetData[target].functions[roleId].add(selector)

    // Also add to role->target->function mapping
    if (!roleToTargetFunctions[roleId]) {
      roleToTargetFunctions[roleId] = {}
    }
    if (!roleToTargetFunctions[roleId][target]) {
      roleToTargetFunctions[roleId][target] = new Set()
    }
    roleToTargetFunctions[roleId][target].add(selector)
  }

  // Process TargetAdminDelayUpdated events (to catch also pending changes)
  for (const event of targetAdminDelayEvents) {
    if (!event.args) continue
    const target = event.args.target.toLowerCase()
    if (!targetData[target]) {
      targetData[target] = { adminDelay: 0, closed: false, functions: {} }
    }
    // Use bnToNumber to handle delay and since values
    const newDelay = bnToNumber(event.args.delay)
    const effect = bnToNumber(event.args.since)
    if (!targetData[target].pendingAdminDelayChanges) {
      targetData[target].pendingAdminDelayChanges = []
    }
    targetData[target].pendingAdminDelayChanges.push({ newDelay, effect })
  }

  // For every target we encountered, query current values
  console.log('- Fetching current admin delays and closures for targets...')
  for (const target in targetData) {
    const adminDelayBN = await accessManager.getTargetAdminDelay(target)
    targetData[target].adminDelay = bnToNumber(adminDelayBN)
    const closed = await accessManager.isTargetClosed(target)
    targetData[target].closed = closed
  }
  console.log(
    `- Found configuration data for ${Object.keys(targetData).length} targets`,
  )

  // -------------------------
  // 3. Fetch queued (scheduled) operations and pending role delay changes.
  // -------------------------
  console.log('\nFetching queued operations...')
  console.log('- Querying OperationScheduled events...')
  const operationScheduledEvents = await accessManager.queryFilter(
    'OperationScheduled',
    fromBlock,
    'latest',
  )
  console.log(
    `- Found ${operationScheduledEvents.length} OperationScheduled events`,
  )

  console.log('- Querying OperationExecuted events...')
  const operationExecutedEvents = await accessManager.queryFilter(
    'OperationExecuted',
    fromBlock,
    'latest',
  )
  console.log(
    `- Found ${operationExecutedEvents.length} OperationExecuted events`,
  )

  console.log('- Querying OperationCanceled events...')
  const operationCanceledEvents = await accessManager.queryFilter(
    'OperationCanceled',
    fromBlock,
    'latest',
  )
  console.log(
    `- Found ${operationCanceledEvents.length} OperationCanceled events`,
  )

  console.log('- Querying RoleGrantDelayChanged events...')
  const roleGrantDelayChangedEvents = await accessManager.queryFilter(
    'RoleGrantDelayChanged',
    fromBlock,
    'latest',
  )
  console.log(
    `- Found ${roleGrantDelayChangedEvents.length} RoleGrantDelayChanged events`,
  )

  // Create a set of operationIds that have been executed or canceled
  const executedOrCanceled = new Set<string>()
  for (const event of operationExecutedEvents) {
    if (!event.args) continue
    executedOrCanceled.add(event.args.operationId)
  }
  for (const event of operationCanceledEvents) {
    if (!event.args) continue
    executedOrCanceled.add(event.args.operationId)
  }

  // Gather scheduled (queued) operations that are still pending.
  console.log('- Filtering pending operations...')
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
  console.log(`- Found ${scheduledOps.length} pending operations`)

  // Gather pending role grant delay changes from RoleGrantDelayChanged events.
  console.log('- Filtering pending role grant delay changes...')
  const pendingRoleGrantChanges: Array<{
    roleId: string
    newDelay: number
    effect: number
  }> = []

  // Get current timestamp
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
    `- Found ${pendingRoleGrantChanges.length} pending role grant delay changes`,
  )

  // -------------------------
  // 4. Format and print the report.
  // -------------------------

  console.log(
    '\n================ Current Roles Held by Actors ================',
  )
  if (Object.keys(rolesByActor).length === 0) {
    console.log('\nNo actors with active roles found.')
  } else {
    for (const account in rolesByActor) {
      const name = actorNames[account]
        ? `${actorNames[account]} (${account})`
        : account
      console.log(`\n${name}:`)
      for (const roleInfo of rolesByActor[account]) {
        const roleName = roleNames[roleInfo.roleId] || roleInfo.roleId
        const delayStr = `${roleInfo.executionDelay} (${formatDuration(roleInfo.executionDelay)})`
        console.log(`  ${roleName}: executionDelay: ${delayStr}`)

        // Now display the targets and functions callable by this role
        if (roleToTargetFunctions[roleInfo.roleId]) {
          console.log(`    Callable targets and functions:`)
          const targets = roleToTargetFunctions[roleInfo.roleId]
          if (Object.keys(targets).length === 0) {
            console.log(
              `      No targets or functions configured for this role`,
            )
          } else {
            for (const target in targets) {
              const targetLabel = targetNames[target]
                ? targetNames[target]
                : target
              console.log(`      Target ${targetLabel}:`)
              const functions = Array.from(targets[target]).map((sel) =>
                functionSignatures[sel] ? functionSignatures[sel] : sel,
              )
              console.log(`        Functions: ${functions.join(', ')}`)
            }
          }
        }
      }
    }
  }

  console.log(
    '\n================ Current Target Configurations ================',
  )
  if (Object.keys(targetData).length === 0) {
    console.log('\nNo target configurations found.')
  } else {
    for (const target in targetData) {
      const targetName = targetNames[target]
        ? `${targetNames[target]} (${target})`
        : target
      console.log(`\n${targetName}:`)
      console.log(
        `  targetAdminDelay: ${targetData[target].adminDelay} (${formatDuration(targetData[target].adminDelay)})`,
      )
      console.log(`  Closed: ${targetData[target].closed}`)
      console.log(`  Function Roles:`)
      if (Object.keys(targetData[target].functions).length === 0) {
        console.log(`    No function roles configured for this target`)
      } else {
        for (const roleId in targetData[target].functions) {
          const roleName = roleNames[roleId] || roleId
          // Map each selector to its known signature (if not known, show selector)
          const funcs = Array.from(targetData[target].functions[roleId]).map(
            (sel) => (functionSignatures[sel] ? functionSignatures[sel] : sel),
          )
          console.log(`    ${roleName}: ${funcs.join(', ')}`)
        }
      }
    }
  }

  console.log(
    '\n============= Queued Delay/Config Changes and Queued Actions =============',
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
        const actorLabel = actorNames[account]
          ? `${actorNames[account]} (${account})`
          : account
        console.log(
          `Actor ${actorLabel} has a scheduled change for role ${roleName}:`,
        )
        console.log(
          `  executionDelay change from ${roleInfo.executionDelay} (${formatDuration(roleInfo.executionDelay)}) to ${roleInfo.pendingDelay} (${formatDuration(
            roleInfo.pendingDelay,
          )}) effective at ${new Date(roleInfo.pendingEffect * 1000).toISOString()}`,
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
          const targetLabel = targetNames[target]
            ? `${targetNames[target]} (${target})`
            : target
          console.log(`Target ${targetLabel} scheduled adminDelay change:`)
          console.log(
            `  New targetAdminDelay: ${change.newDelay} (${formatDuration(change.newDelay)}) effective at ${new Date(change.effect * 1000).toISOString()}`,
          )
        }
      }
    }
  }
  if (!pendingAdminDelayChangesFound) {
    console.log('No pending target admin delay changes found.')
  }

  // Queued operations (scheduled calls)
  if (scheduledOps.length > 0) {
    changesFound = true
    console.log('\nQueued Operations:')
    for (const op of scheduledOps) {
      // For better readability, try to decode the selector from the data
      const selector = op.data.slice(0, 10) // first 4 bytes (10 hex characters with "0x")
      const funcSig = functionSignatures[selector] || selector
      const callerLabel = actorNames[op.caller]
        ? `${actorNames[op.caller]} (${op.caller})`
        : op.caller
      const targetLabel = targetNames[op.target]
        ? `${targetNames[op.target]} (${op.target})`
        : op.target
      console.log(`  Operation ${op.operationId}:`)
      console.log(`    Nonce: ${op.nonce}`)
      console.log(
        `    Scheduled at: ${new Date(op.schedule * 1000).toISOString()}`,
      )
      console.log(`    Caller: ${callerLabel}`)
      console.log(`    Target: ${targetLabel}`)
      console.log(`    Function: ${funcSig}`)
    }
  } else {
    console.log('No queued operations found.')
  }

  // Pending role grant delay changes (from RoleGrantDelayChanged events)
  console.log('\nPending Role Grant Delay Changes:')
  if (pendingRoleGrantChanges.length > 0) {
    changesFound = true
    for (const change of pendingRoleGrantChanges) {
      const roleName = roleNames[change.roleId] || change.roleId
      console.log(
        `  Role ${roleName} scheduled to change grant delay to ${change.newDelay} (${formatDuration(
          change.newDelay,
        )}) effective at ${new Date(change.effect * 1000).toISOString()}`,
      )
    }
  } else {
    console.log('  No pending role grant delay changes found.')
  }

  if (!changesFound) {
    console.log('\nNo pending changes or queued actions found.')
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error)
    process.exit(1)
  })
