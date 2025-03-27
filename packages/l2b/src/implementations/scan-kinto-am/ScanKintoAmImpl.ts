import chalk from 'chalk'
import { ethers } from 'ethers'

// =========================
// CONFIGURATION
// =========================

const RPC_URL = 'https://rpc.kinto-rpc.com'
const ACCESS_MANAGER_ADDRESS = '0xacC000818e5Bbd911D5d449aA81CB5cA24024739'
const KINTO_ID_ADDRESS = '0xf369f78e3a0492cc4e96a90dae0728a38498e9c7' // Use address from addressNames
const KINTO_WALLET_EXAMPLE_ADDRESS =
  '0x2e2b1c42e38f5af81771e65d87729e57abd1337a' // Kinto Multisig 2 as example
const SECURITY_COUNCIL_ADDRESS = '0x28fc10e12a78f986c78f973fc70ed88072b34c8e' // From addressNames

// Minimum required delay: 12 days in seconds
const MIN_DELAY_SECONDS = 1036800

// Known role constants and their names
const roleNames: Record<string, string> = {
  '0': 'ADMIN_ROLE',
  '8663528507529876195': 'UPGRADER_ROLE',
  '14661544942390944024': 'SECURITY_COUNCIL_ROLE',
  '1635978423191113331': 'NIO_GOVERNOR_ROLE',
  '18446744073709551615': 'PUBLIC_ROLE',
}

// Roles that require the minimum delay for non-SecurityCouncil actors
const CRITICAL_ROLES_FOR_DELAY = new Set<string>([
  roleNames['0'], // ADMIN_ROLE
  roleNames['8663528507529876195'], // UPGRADER_ROLE
  roleNames['14661544942390944024'], // SECURITY_COUNCIL_ROLE
])

// Targets that require the minimum admin delay
const CRITICAL_TARGETS_FOR_ADMIN_DELAY = new Set<string>([
  '0x8a4720488ca32f1223ccfe5a087e250fe3bc5d75', // KintoWalletFactory
  '0x5a2b641b84b0230c8e75f55d5afd27f4dbd59d5b', // KintoAppRegistry
  KINTO_ID_ADDRESS, // KintoID
])

// Unified address mapping (lowercase keys)
const addressNames: Record<string, string> = {
  // Actors
  '0x2e2b1c42e38f5af81771e65d87729e57abd1337a': 'Kinto Multisig 2',
  [SECURITY_COUNCIL_ADDRESS.toLowerCase()]: 'SecurityCouncil',
  '0x010600ff5f36c8ef3b6aaf2a88c2de85c798594a': 'NioGovernor',
  // Targets
  '0x8a4720488ca32f1223ccfe5a087e250fe3bc5d75': 'KintoWalletFactory',
  '0x5a2b641b84b0230c8e75f55d5afd27f4dbd59d5b': 'KintoAppRegistry',
  [KINTO_ID_ADDRESS.toLowerCase()]: 'KintoID',
  '0x793500709506652fcc61f0d2d0fda605638d4293': 'Treasury',
  [ACCESS_MANAGER_ADDRESS.toLowerCase()]: 'AccessManager',
  [KINTO_WALLET_EXAMPLE_ADDRESS.toLowerCase()]: 'Kinto Multisig 2 (Wallet)', // Used for RECOVERY_TIME example
}

// Function selector mapping (lowercase keys)
const functionSignatures: Record<string, string> = {
  // Upgrade functions
  [ethers.utils
    .id('upgradeAllWalletImplementations(address)')
    .substring(0, 10)]: 'upgradeAllWalletImplementations(address)',
  [ethers.utils.id('upgradeTo(address)').substring(0, 10)]:
    'upgradeTo(address)',
  [ethers.utils.id('updateSystemApps(address[])').substring(0, 10)]:
    'updateSystemApps(address[])',
  [ethers.utils.id('updateSystemContracts(address[])').substring(0, 10)]:
    'updateSystemContracts(address[])',
  [ethers.utils.id('updateReservedContracts(address[])').substring(0, 10)]:
    'updateReservedContracts(address[])',

  // AccessManager functions
  '0xd6bb62c6': 'cancel(address,address,bytes)',
  '0x94c7d7ee': 'consumeScheduledOp(address,bytes)',
  '0x1cff79cd': 'execute(address,bytes)',
  '0x25c471a0': 'grantRole(uint64,address,uint32)',
  '0x853551b8': 'labelRole(uint64,string)',
  '0xac9650d8': 'multicall(bytes[])',
  '0xfe0776f5': 'renounceRole(uint64,address)',
  '0xb7d2b162': 'revokeRole(uint64,address)',
  '0xf801a698': 'schedule(address,bytes,uint48)',
  '0xa64d95ce': 'setGrantDelay(uint64,uint32)',
  '0x30cae187': 'setRoleAdmin(uint64,uint64)',
  '0x52962952': 'setRoleGuardian(uint64,uint64)',
  '0xd22b5989': 'setTargetAdminDelay(address,uint32)',
  '0x167bd395': 'setTargetClosed(address,bool)',
  '0x08d6122d': 'setTargetFunctionRole(address,bytes4[],uint64)',
  '0x18ff183c': 'updateAuthority(address,address)',

  // External Delays
  '0xd00bb535': 'EXIT_WINDOW_PERIOD()', // KintoID
  '0x8b1b3b45': 'RECOVERY_TIME()', // KintoWallet
}

// =========================
// ABI FRAGMENTS
// =========================

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

const kintoIdAbi = ['function EXIT_WINDOW_PERIOD() view returns (uint256)']

const kintoWalletAbi = ['function RECOVERY_TIME() view returns (uint256)']

// =========================
// TYPES
// =========================

interface RoleMemberInfo {
  roleId: string
  executionDelay: number
  since: number // Timestamp when role was granted/updated
  pendingDelay: number
  pendingEffect: number // Timestamp when pendingDelay becomes effective
}

interface RoleData {
  id: string
  name: string
  currentGrantDelay: number
  pendingGrantDelay?: {
    newDelay: number
    effect: number
  }
  admin?: string // Role ID
  guardian?: string // Role ID
  members: Map<string, RoleMemberInfo> // account address -> RoleMemberInfo
}

interface TargetFunctionInfo {
  roleId: string
  roleName: string
  selectors: Set<string> // function selectors
}

interface TargetData {
  address: string
  name: string
  adminDelay: number
  closed: boolean
  functionsByRole: Map<string, TargetFunctionInfo> // roleId -> TargetFunctionInfo
  pendingAdminDelayChanges: Array<{ newDelay: number; effect: number }>
}

interface ScheduledOperation {
  operationId: string
  nonce: number
  schedule: number // Timestamp
  caller: string
  target: string
  data: string
}

interface ComplianceIssue {
  type: string // e.g., 'Actor Execution Delay', 'Target Admin Delay', 'External Delay'
  item: string // e.g., 'Kinto Multisig 2 (ADMIN_ROLE)', 'KintoWalletFactory', 'KintoID.EXIT_WINDOW_PERIOD'
  currentValue: number
  requiredValue: number
  details?: string
}

// =========================
// HELPER FUNCTIONS
// =========================

function bnToNumber(value: ethers.BigNumber | number): number {
  if (typeof value === 'number') return value
  // Use toString() for potentially large numbers, though delays are usually safe for toNumber()
  try {
    return value.toNumber()
  } catch (e: unknown) {
    const valueStr = value.toString()
    console.warn(
      chalk.yellow(
        `Warning: BigNumber too large for toNumber(), using potentially imprecise conversion: ${valueStr}`,
      ),
    )
    if (e instanceof Error) {
      console.warn(chalk.yellow(`       Original error: ${e.message}`))
    }
    return Number(valueStr)
  }
}

function formatAddress(address: string): string {
  const lowerAddress = address.toLowerCase()
  const name = addressNames[lowerAddress]
  if (name) {
    return `${chalk.blue(name)} (${chalk.gray(lowerAddress)})`
  }
  return chalk.gray(lowerAddress)
}

function formatDuration(seconds: number): string {
  if (seconds < 0) return chalk.red('Invalid Duration')
  if (seconds === 0) return '0s'

  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  const parts: string[] = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`) // Show 0s if duration is 0

  return parts.join(' ')
}

function formatTimestamp(timestamp: number): string {
  if (timestamp === 0) return 'Never'
  return new Date(timestamp * 1000).toISOString()
}

function formatSelector(selector: string): string {
  const signature = functionSignatures[selector.toLowerCase()]
  return signature ? chalk.gray(signature) : chalk.gray(selector)
}

function decodeOperationData(selector: string, data: string): string {
  try {
    const abiCoder = ethers.utils.defaultAbiCoder
    const lowerSelector = selector.toLowerCase()

    // Remove the selector (0x + 8 hex chars = 10 chars)
    const paramsData = '0x' + data.slice(10)

    switch (lowerSelector) {
      case '0x25c471a0': {
        // grantRole(uint64 roleId, address account, uint32 executionDelay)
        const [roleIdBN, account, executionDelay] = abiCoder.decode(
          ['uint64', 'address', 'uint32'],
          paramsData,
        )
        const roleId = roleIdBN.toString()
        const roleName = roleNames[roleId] || roleId
        const formattedDelay = `${chalk.magenta(executionDelay)} (${chalk.magenta(formatDuration(executionDelay))})`
        return `grantRole(${chalk.yellow(roleName)}, ${formatAddress(account)}, ${formattedDelay})`
      }
      case '0xb7d2b162': {
        // revokeRole(uint64 roleId, address account)
        const [roleIdBN, account] = abiCoder.decode(
          ['uint64', 'address'],
          paramsData,
        )
        const roleId = roleIdBN.toString()
        const roleName = roleNames[roleId] || roleId
        return `revokeRole(${chalk.yellow(roleName)}, ${formatAddress(account)})`
      }
      case '0xd22b5989': {
        // setTargetAdminDelay(address target, uint32 newDelay)
        const [target, newDelay] = abiCoder.decode(
          ['address', 'uint32'],
          paramsData,
        )
        const formattedDelay = `${chalk.magenta(newDelay)} (${chalk.magenta(formatDuration(newDelay))})`
        return `setTargetAdminDelay(${formatAddress(target)}, ${formattedDelay})`
      }
      case '0x167bd395': {
        // setTargetClosed(address target, bool closed)
        const [target, closed] = abiCoder.decode(
          ['address', 'bool'],
          paramsData,
        )
        return `setTargetClosed(${formatAddress(target)}, ${chalk.yellow(closed)})`
      }
      case '0xa64d95ce': {
        // setGrantDelay(uint64 roleId, uint32 newDelay)
        const [roleIdBN, newDelay] = abiCoder.decode(
          ['uint64', 'uint32'],
          paramsData,
        )
        const roleId = roleIdBN.toString()
        const roleName = roleNames[roleId] || roleId
        const formattedDelay = `${chalk.magenta(newDelay)} (${chalk.magenta(formatDuration(newDelay))})`
        return `setGrantDelay(${chalk.yellow(roleName)}, ${formattedDelay})`
      }
      default:
        return functionSignatures[lowerSelector] || lowerSelector
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.warn(
      chalk.yellow(
        `Could not decode data for selector ${selector}: ${errorMessage}`,
      ),
    )
    return functionSignatures[selector.toLowerCase()] || selector
  }
}

// =========================
// DATA FETCHING FUNCTIONS
// =========================

async function fetchEvents(
  contract: ethers.Contract,
  eventName: string,
  fromBlock: number | string = 0,
  toBlock: number | string = 'latest',
): Promise<ethers.Event[]> {
  console.log(chalk.magenta(`- Querying ${eventName} events...`))
  try {
    const events = await contract.queryFilter(eventName, fromBlock, toBlock)
    console.log(chalk.green(`- Found ${events.length} ${eventName} events`))
    return events
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(
      chalk.red(`Error fetching ${eventName} events: ${errorMessage}`),
    )
    return []
  }
}

async function fetchRoleData(
  accessManager: ethers.Contract,
  fromBlock: number,
): Promise<{
  rolesData: Map<string, RoleData>
  rolesByActor: Map<string, RoleMemberInfo[]>
}> {
  console.log(chalk.bold('\nFetching role events and data...'))

  const rolesData = new Map<string, RoleData>()
  const rolesByActor = new Map<string, RoleMemberInfo[]>()
  const accountsPerRole = new Map<string, Set<string>>() // roleId -> Set<account>

  // Fetch all relevant events in parallel
  const eventNames = [
    'RoleGranted',
    'RoleRevoked',
    'RoleAdminChanged',
    'RoleGuardianChanged',
    'RoleGrantDelayChanged',
  ]
  const eventResults = await Promise.all(
    eventNames.map((name) => fetchEvents(accessManager, name, fromBlock)),
  )
  const [
    roleGrantedEvents,
    roleRevokedEvents,
    roleAdminChangedEvents,
    roleGuardianChangedEvents,
    roleGrantDelayChangedEvents,
  ] = eventResults

  // --- Process Events ---

  // Initialize roles and track potential members from RoleGranted
  roleGrantedEvents.forEach((event) => {
    if (!event.args) return
    const roleId = event.args.roleId.toString()
    const account = event.args.account.toLowerCase()

    if (!rolesData.has(roleId)) {
      rolesData.set(roleId, {
        id: roleId,
        name: roleNames[roleId] || `Unknown Role (${roleId})`,
        currentGrantDelay: 0,
        members: new Map(),
      })
    }
    if (!accountsPerRole.has(roleId)) {
      accountsPerRole.set(roleId, new Set())
    }
    accountsPerRole.get(roleId)?.add(account)
  })

  // Refine member list based on RoleRevoked
  roleRevokedEvents.forEach((event) => {
    if (!event.args) return
    const roleId = event.args.roleId.toString()
    const account = event.args.account.toLowerCase()
    accountsPerRole.get(roleId)?.delete(account)
  })

  // Process role admin/guardian changes (latest change wins implicitly by processing order if needed)
  roleAdminChangedEvents.forEach((event) => {
    if (!event.args) return
    const roleId = event.args.roleId.toString()
    const adminRoleId = event.args.admin.toString()
    const role = rolesData.get(roleId)
    if (role && role.admin === undefined) {
      role.admin = adminRoleId
    }
  })

  roleGuardianChangedEvents.forEach((event) => {
    if (!event.args) return
    const roleId = event.args.roleId.toString()
    const guardianRoleId = event.args.guardian.toString()
    const role = rolesData.get(roleId)
    if (role && role.guardian === undefined) {
      role.guardian = guardianRoleId // Assign if guardian is undefined
    }
  })

  // Process role grant delay changes
  const currentTimestamp = Math.floor(Date.now() / 1000)
  roleGrantDelayChangedEvents.forEach((event) => {
    if (!event.args) return
    const roleId = event.args.roleId.toString()
    const newDelay = bnToNumber(event.args.delay)
    const effect = bnToNumber(event.args.since)
    const role = rolesData.get(roleId)
    if (role) {
      // Keep track of the latest change that has taken effect
      if (
        effect <= currentTimestamp &&
        (!role.pendingGrantDelay || effect > role.pendingGrantDelay.effect)
      ) {
        role.currentGrantDelay = newDelay
      }
      // Store the latest pending change
      if (
        effect > currentTimestamp &&
        (!role.pendingGrantDelay || effect > role.pendingGrantDelay.effect)
      ) {
        role.pendingGrantDelay = { newDelay, effect }
      }
      // Handle edge case where a pending change happened before a current change
      if (
        role.pendingGrantDelay &&
        role.pendingGrantDelay.effect <= currentTimestamp
      ) {
        role.currentGrantDelay = role.pendingGrantDelay.newDelay
        role.pendingGrantDelay = undefined
      }
    }
  })

  // --- Fetch Current State ---
  console.log(
    chalk.magenta('- Fetching current state for roles and members...'),
  )

  // Fetch current grant delays for all known roles in parallel
  await Promise.all(
    Array.from(rolesData.keys()).map(async (roleId) => {
      try {
        const grantDelay = await accessManager.getRoleGrantDelay(roleId)
        const role = rolesData.get(roleId)
        if (role) {
          // Overwrite with current on-chain value if different from event processing
          const currentDelayNum = bnToNumber(grantDelay)
          role.currentGrantDelay = currentDelayNum
          // Clear pending if it's already effective according to current state
          if (
            role.pendingGrantDelay &&
            role.pendingGrantDelay.newDelay === currentDelayNum
          ) {
            role.pendingGrantDelay = undefined
          }
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        console.error(
          chalk.red(
            `- Error fetching grant delay for role ${roleId}: ${errorMessage}`,
          ),
        )
      }
    }),
  )

  // Fetch current membership and execution delays for potential members in parallel
  const memberFetchPromises: Promise<void>[] = []
  accountsPerRole.forEach((accounts, roleId) => {
    accounts.forEach((account) => {
      memberFetchPromises.push(
        (async () => {
          try {
            const accessData = await accessManager.getAccess(roleId, account)
            const since = bnToNumber(accessData.since)
            const currentDelay = bnToNumber(accessData.currentDelay)
            const pendingDelay = bnToNumber(accessData.pendingDelay)
            const effect = bnToNumber(accessData.effect)

            const [isMember] = await accessManager.hasRole(roleId, account)

            if (isMember) {
              const memberInfo: RoleMemberInfo = {
                roleId,
                executionDelay: currentDelay,
                since,
                pendingDelay: pendingDelay,
                pendingEffect: effect,
              }

              // Update rolesByActor map
              if (!rolesByActor.has(account)) rolesByActor.set(account, [])
              rolesByActor.get(account)?.push(memberInfo) // Safe due to the check above

              // Update rolesData map
              rolesData.get(roleId)?.members.set(account, memberInfo)
            } else {
              // Explicitly remove if getAccess/hasRole shows not a member anymore
              rolesData.get(roleId)?.members.delete(account)
            }
          } catch (error: unknown) {
            const errorMessage =
              error instanceof Error ? error.message : String(error)
            console.error(
              chalk.red(
                `- Error fetching access for role ${roleId}, account ${account}: ${errorMessage}`,
              ),
            )
            // Remove from members if fetch fails, assuming revoked or error state
            rolesData.get(roleId)?.members.delete(account)
          }
        })(),
      )
    })
  })

  await Promise.all(memberFetchPromises)

  // Log summary
  console.log(chalk.green(`- Processed ${rolesData.size} distinct roles`))
  console.log(
    chalk.green(`- Found ${rolesByActor.size} actors with active roles`),
  )

  return { rolesData, rolesByActor }
}

async function fetchTargetData(
  accessManager: ethers.Contract,
  fromBlock: number,
): Promise<{
  targetDataMap: Map<string, TargetData>
  roleToTargetFunctions: Map<string, Map<string, Set<string>>>
}> {
  console.log(chalk.bold('\nFetching target events and data...'))

  const targetDataMap = new Map<string, TargetData>()
  const roleToTargetFunctions = new Map<string, Map<string, Set<string>>>() // roleId -> Map<targetAddr, Set<selector>>
  const potentialTargets = new Set<string>()

  // Fetch events in parallel
  const eventNames = [
    'TargetFunctionRoleUpdated',
    'TargetAdminDelayUpdated',
    'TargetClosed',
  ]
  const eventResults = await Promise.all(
    eventNames.map((name) => fetchEvents(accessManager, name, fromBlock)),
  )
  const [targetFuncRoleEvents, targetAdminDelayEvents, targetClosedEvents] =
    eventResults

  // --- Process Events ---

  // Process TargetFunctionRoleUpdated
  targetFuncRoleEvents.forEach((event) => {
    if (!event.args) return
    const target = event.args.target.toLowerCase()
    const selector = event.args.selector.toLowerCase()
    const roleId = event.args.roleId.toString()

    potentialTargets.add(target)
    if (!targetDataMap.has(target)) {
      targetDataMap.set(target, {
        address: target,
        name: addressNames[target] || `Unknown Target (${target})`,
        adminDelay: 0,
        closed: false,
        functionsByRole: new Map(),
        pendingAdminDelayChanges: [],
      })
    }

    const targetData = targetDataMap.get(target)
    if (targetData) {
      if (!targetData.functionsByRole.has(roleId)) {
        targetData.functionsByRole.set(roleId, {
          roleId: roleId,
          roleName: roleNames[roleId] || `Unknown Role (${roleId})`,
          selectors: new Set(),
        })
      }
      targetData.functionsByRole.get(roleId)?.selectors.add(selector) // Safe due to check above
    }

    // Update roleToTargetFunctions lookup
    if (!roleToTargetFunctions.has(roleId)) {
      roleToTargetFunctions.set(roleId, new Map())
    }
    const roleTargets = roleToTargetFunctions.get(roleId)
    if (roleTargets) {
      // Check if roleTargets exists
      if (!roleTargets.has(target)) {
        roleTargets.set(target, new Set())
      }
      roleTargets.get(target)?.add(selector) // Safe due to check above
    }
  })

  // Process TargetAdminDelayUpdated
  const currentTimestamp = Math.floor(Date.now() / 1000)
  targetAdminDelayEvents.forEach((event) => {
    if (!event.args) return
    const target = event.args.target.toLowerCase()
    const newDelay = bnToNumber(event.args.delay)
    const effect = bnToNumber(event.args.since)

    potentialTargets.add(target)
    if (!targetDataMap.has(target)) {
      targetDataMap.set(target, {
        address: target,
        name: addressNames[target] || `Unknown Target (${target})`,
        adminDelay: 0,
        closed: false,
        functionsByRole: new Map(),
        pendingAdminDelayChanges: [],
      })
    }

    const targetData = targetDataMap.get(target)
    if (targetData) {
      if (effect > currentTimestamp) {
        targetData.pendingAdminDelayChanges.push({ newDelay, effect })
        // Sort pending changes by effect time DESCENDING to easily find the latest
        targetData.pendingAdminDelayChanges.sort((a, b) => b.effect - a.effect)
      } else {
        // If change is in the past, update the current delay if this event is newer than last known
        // Let the direct fetch overwrite this later for simplicity and accuracy
        targetData.adminDelay = newDelay
      }
    }
  })

  // Process TargetClosed
  targetClosedEvents.forEach((event) => {
    if (!event.args) return
    const target = event.args.target.toLowerCase()
    const closed = event.args.closed

    potentialTargets.add(target)
    if (!targetDataMap.has(target)) {
      targetDataMap.set(target, {
        address: target,
        name: addressNames[target] || `Unknown Target (${target})`,
        adminDelay: 0,
        closed: false,
        functionsByRole: new Map(),
        pendingAdminDelayChanges: [],
      })
    }
    // Assume latest event reflects current state, direct fetch will confirm/overwrite
    const targetData = targetDataMap.get(target)
    if (targetData && targetData.closed === undefined) {
      targetData.closed = closed
    }
  })

  // --- Fetch Current State ---
  console.log(chalk.magenta('- Fetching current state for targets...'))
  await Promise.all(
    Array.from(potentialTargets).map(async (target) => {
      try {
        const [adminDelayBN, closed] = await Promise.all([
          accessManager.getTargetAdminDelay(target),
          accessManager.isTargetClosed(target),
        ])
        const targetData = targetDataMap.get(target)
        if (targetData) {
          targetData.adminDelay = bnToNumber(adminDelayBN)
          targetData.closed = closed

          // Clean up pending changes that are now effective based on current time
          targetData.pendingAdminDelayChanges =
            targetData.pendingAdminDelayChanges.filter(
              (change) => change.effect > currentTimestamp,
            )
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        console.error(
          chalk.red(
            `- Error fetching config for target ${target}: ${errorMessage}`,
          ),
        )
      }
    }),
  )

  console.log(
    chalk.green(
      `- Processed configuration data for ${targetDataMap.size} targets`,
    ),
  )

  return { targetDataMap, roleToTargetFunctions }
}

async function fetchOperationsData(
  accessManager: ethers.Contract,
  fromBlock: number,
): Promise<{
  scheduledOps: ScheduledOperation[]
  pendingRoleGrantChanges: Array<{
    roleId: string
    newDelay: number
    effect: number
  }>
}> {
  console.log(chalk.bold('\nFetching queued operations and pending changes...'))

  // Fetch events in parallel
  const eventNames = [
    'OperationScheduled',
    'OperationExecuted',
    'OperationCanceled',
    'RoleGrantDelayChanged',
  ]
  const eventResults = await Promise.all(
    eventNames.map((name) => fetchEvents(accessManager, name, fromBlock)),
  )
  const [
    operationScheduledEvents,
    operationExecutedEvents,
    operationCanceledEvents,
    roleGrantDelayChangedEvents,
  ] = eventResults

  // --- Process Operations ---
  const executedOrCanceled = new Set<string>()
  operationExecutedEvents.forEach((event) => {
    if (event.args) executedOrCanceled.add(event.args.operationId)
  })
  operationCanceledEvents.forEach((event) => {
    if (event.args) executedOrCanceled.add(event.args.operationId)
  })

  const scheduledOps: ScheduledOperation[] = []
  operationScheduledEvents.forEach((event) => {
    if (!event.args) return
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
  })
  console.log(chalk.green(`- Found ${scheduledOps.length} pending operations`))

  // --- Process Pending Role Grant Delay Changes ---
  const pendingRoleGrantChanges: Array<{
    roleId: string
    newDelay: number
    effect: number
  }> = []
  const currentTimestamp = Math.floor(Date.now() / 1000)
  // Keep track of the latest pending change per role
  const latestPendingGrantChange = new Map<
    string,
    { newDelay: number; effect: number }
  >()

  roleGrantDelayChangedEvents.forEach((event) => {
    if (!event.args) return
    const roleId = event.args.roleId.toString()
    const effect = bnToNumber(event.args.since)
    const newDelay = bnToNumber(event.args.delay)

    if (effect > currentTimestamp) {
      const existing = latestPendingGrantChange.get(roleId)
      if (!existing || effect > existing.effect) {
        latestPendingGrantChange.set(roleId, { newDelay, effect })
      }
    }
  })

  latestPendingGrantChange.forEach((change, roleId) => {
    pendingRoleGrantChanges.push({ roleId, ...change })
  })

  console.log(
    chalk.green(
      `- Found ${pendingRoleGrantChanges.length} pending role grant delay changes`,
    ),
  )

  return { scheduledOps, pendingRoleGrantChanges }
}

async function fetchExternalDelays(
  provider: ethers.providers.Provider,
): Promise<{
  kintoIdExitWindow: number | null
  kintoWalletRecoveryTime: number | null
}> {
  console.log(chalk.bold('\nFetching external delay values...'))
  let kintoIdExitWindow: number | null = null
  let kintoWalletRecoveryTime: number | null = null

  try {
    const kintoIdContract = new ethers.Contract(
      KINTO_ID_ADDRESS,
      kintoIdAbi,
      provider,
    )
    const kintoWalletContract = new ethers.Contract(
      KINTO_WALLET_EXAMPLE_ADDRESS,
      kintoWalletAbi,
      provider,
    )

    const [exitWindowResult, recoveryTimeResult] = await Promise.allSettled([
      kintoIdContract.EXIT_WINDOW_PERIOD(),
      kintoWalletContract.RECOVERY_TIME(),
    ])

    if (
      exitWindowResult.status === 'fulfilled' &&
      exitWindowResult.value !== null
    ) {
      kintoIdExitWindow = bnToNumber(exitWindowResult.value)
      console.log(
        chalk.green(
          `- KintoID EXIT_WINDOW_PERIOD: ${kintoIdExitWindow} (${formatDuration(kintoIdExitWindow)})`,
        ),
      )
    } else if (exitWindowResult.status === 'rejected') {
      const reason = exitWindowResult.reason
      const errorMessage =
        reason instanceof Error ? reason.message : String(reason)
      console.error(
        chalk.red(
          `- Error fetching KintoID EXIT_WINDOW_PERIOD: ${errorMessage}`,
        ),
      )
    }

    if (
      recoveryTimeResult.status === 'fulfilled' &&
      recoveryTimeResult.value !== null
    ) {
      kintoWalletRecoveryTime = bnToNumber(recoveryTimeResult.value)
      console.log(
        chalk.green(
          `- KintoWallet RECOVERY_TIME: ${kintoWalletRecoveryTime} (${formatDuration(kintoWalletRecoveryTime)})`,
        ),
      )
    } else if (recoveryTimeResult.status === 'rejected') {
      const reason = recoveryTimeResult.reason
      const errorMessage =
        reason instanceof Error ? reason.message : String(reason)
      console.error(
        chalk.red(
          `- Error fetching KintoWallet RECOVERY_TIME: ${errorMessage}`,
        ),
      )
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(
      chalk.red(
        `- Error creating contracts for external delays: ${errorMessage}`,
      ),
    )
  }

  return { kintoIdExitWindow, kintoWalletRecoveryTime }
}

// =========================
// COMPLIANCE CHECKING
// =========================

function checkCompliance(
  rolesData: Map<string, RoleData>,
  targetDataMap: Map<string, TargetData>,
  externalDelays: {
    kintoIdExitWindow: number | null
    kintoWalletRecoveryTime: number | null
  },
): ComplianceIssue[] {
  const issues: ComplianceIssue[] = []
  const securityCouncilAddrLower = SECURITY_COUNCIL_ADDRESS.toLowerCase()

  // 1. Check KintoID.EXIT_WINDOW_PERIOD
  if (externalDelays.kintoIdExitWindow !== null) {
    if (externalDelays.kintoIdExitWindow < MIN_DELAY_SECONDS) {
      issues.push({
        type: 'External Delay',
        item: 'KintoID.EXIT_WINDOW_PERIOD',
        currentValue: externalDelays.kintoIdExitWindow,
        requiredValue: MIN_DELAY_SECONDS,
      })
    }
  } else {
    issues.push({
      type: 'External Delay',
      item: 'KintoID.EXIT_WINDOW_PERIOD',
      currentValue: -1,
      requiredValue: MIN_DELAY_SECONDS,
      details: 'Could not fetch value.',
    })
  }

  // 2. Check KintoWallet.RECOVERY_TIME
  if (externalDelays.kintoWalletRecoveryTime !== null) {
    if (externalDelays.kintoWalletRecoveryTime < MIN_DELAY_SECONDS) {
      issues.push({
        type: 'External Delay',
        item: `KintoWallet.RECOVERY_TIME (from ${formatAddress(KINTO_WALLET_EXAMPLE_ADDRESS)})`,
        currentValue: externalDelays.kintoWalletRecoveryTime,
        requiredValue: MIN_DELAY_SECONDS,
      })
    }
  } else {
    issues.push({
      type: 'External Delay',
      item: `KintoWallet.RECOVERY_TIME (from ${formatAddress(KINTO_WALLET_EXAMPLE_ADDRESS)})`,
      currentValue: -1,
      requiredValue: MIN_DELAY_SECONDS,
      details: 'Could not fetch value.',
    })
  }

  // 3. Check targetAdminDelay for critical targets
  CRITICAL_TARGETS_FOR_ADMIN_DELAY.forEach((targetAddr) => {
    const targetData = targetDataMap.get(targetAddr.toLowerCase())
    if (targetData) {
      if (targetData.adminDelay < MIN_DELAY_SECONDS) {
        issues.push({
          type: 'Target Admin Delay',
          item: targetData.name,
          currentValue: targetData.adminDelay,
          requiredValue: MIN_DELAY_SECONDS,
        })
      }
    } else {
      issues.push({
        type: 'Target Admin Delay',
        item: addressNames[targetAddr.toLowerCase()] || targetAddr,
        currentValue: -1,
        requiredValue: MIN_DELAY_SECONDS,
        details: 'Target configuration not found.',
      })
    }
  })

  // 4. Check executionDelay for non-SecurityCouncil actors with critical roles
  rolesData.forEach((role) => {
    if (CRITICAL_ROLES_FOR_DELAY.has(role.name)) {
      role.members.forEach((memberInfo, account) => {
        if (account.toLowerCase() !== securityCouncilAddrLower) {
          if (memberInfo.executionDelay < MIN_DELAY_SECONDS) {
            issues.push({
              type: 'Actor Execution Delay',
              item: `${formatAddress(account)} (${role.name})`,
              currentValue: memberInfo.executionDelay,
              requiredValue: MIN_DELAY_SECONDS,
            })
          }
        }
      })
    }
  })

  return issues
}

// =========================
// REPORTING FUNCTIONS
// =========================

function generateRolesOverviewReport(rolesData: Map<string, RoleData>): void {
  console.log(chalk.bold('\n================ Roles Overview ================'))

  if (rolesData.size === 0) {
    console.log(chalk.yellow('No roles found.'))
    return
  }

  const sortedRoles = Array.from(rolesData.values()).sort((a, b) => {
    // Try to sort numerically by ID, fallback to string sort
    try {
      const numA = BigInt(a.id)
      const numB = BigInt(b.id)
      if (numA < numB) return -1
      if (numA > numB) return 1
      return 0
    } catch (_e) {
      return a.id.localeCompare(b.id) // Fallback for non-numeric IDs
    }
  })

  sortedRoles.forEach((roleData) => {
    console.log(
      `\n${chalk.yellow(roleData.name)} (ID: ${chalk.gray(roleData.id)}):`,
    )
    console.log(
      `  ${chalk.cyan('roleGrantDelay')}: ${chalk.magenta(roleData.currentGrantDelay)} (${chalk.magenta(formatDuration(roleData.currentGrantDelay))})`,
    )

    if (roleData.pendingGrantDelay) {
      console.log(
        `  ${chalk.cyan('pendingGrantDelay')}: ${chalk.magenta(roleData.pendingGrantDelay.newDelay)} (${chalk.magenta(formatDuration(roleData.pendingGrantDelay.newDelay))}) effective at ${chalk.green(formatTimestamp(roleData.pendingGrantDelay.effect))}`,
      )
    }
    if (roleData.admin) {
      const adminRoleName =
        roleNames[roleData.admin] || `Role ID ${roleData.admin}`
      console.log(
        `  ${chalk.cyan('adminRole')}: ${chalk.yellow(adminRoleName)}`,
      )
    }
    if (roleData.guardian) {
      const guardianRoleName =
        roleNames[roleData.guardian] || `Role ID ${roleData.guardian}`
      console.log(
        `  ${chalk.cyan('guardianRole')}: ${chalk.yellow(guardianRoleName)}`,
      )
    }

    if (roleData.members.size > 0) {
      console.log(`  members (${roleData.members.size}):`)
      const sortedMembers = Array.from(roleData.members.entries()).sort(
        ([addrA], [addrB]) => addrA.localeCompare(addrB),
      )
      sortedMembers.forEach(([account, memberInfo]) => {
        console.log(
          `    ${formatAddress(account)}: ${chalk.cyan('executionDelay')}: ${chalk.magenta(memberInfo.executionDelay)} (${chalk.magenta(formatDuration(memberInfo.executionDelay))})`,
        )
        if (
          memberInfo.pendingDelay > 0 &&
          memberInfo.pendingEffect > Math.floor(Date.now() / 1000)
        ) {
          console.log(
            `      ${chalk.cyan('pendingExecutionDelay')}: ${chalk.magenta(memberInfo.pendingDelay)} (${chalk.magenta(formatDuration(memberInfo.pendingDelay))}) effective at ${chalk.green(formatTimestamp(memberInfo.pendingEffect))}`,
          )
        }
      })
    } else {
      console.log(`  members: None`)
    }
  })
}

function generateActorsReport(
  rolesByActor: Map<string, RoleMemberInfo[]>,
  roleToTargetFunctions: Map<string, Map<string, Set<string>>>,
): void {
  console.log(chalk.bold('\n================ Actors ================'))

  if (rolesByActor.size === 0) {
    console.log(chalk.yellow('\nNo actors with active roles found.'))
    return
  }

  const sortedActors = Array.from(rolesByActor.keys()).sort()

  sortedActors.forEach((account) => {
    console.log(`\n${formatAddress(account)}:`)
    const roles = rolesByActor.get(account) ?? [] // Use nullish coalescing for safety
    roles.sort((a, b) => a.roleId.localeCompare(b.roleId)) // Sort roles per actor

    roles.forEach((roleInfo) => {
      const roleName =
        roleNames[roleInfo.roleId] || `Role ID ${roleInfo.roleId}`
      const delayStr = `${chalk.magenta(roleInfo.executionDelay)} (${chalk.magenta(formatDuration(roleInfo.executionDelay))})`
      console.log(
        `  ${chalk.yellow(roleName)}: ${chalk.cyan('executionDelay')}: ${delayStr}`,
      )

      // Display pending execution delay change if any
      if (
        roleInfo.pendingDelay > 0 &&
        roleInfo.pendingEffect > Math.floor(Date.now() / 1000)
      ) {
        console.log(
          `    ${chalk.cyan('pendingExecutionDelay')}: ${chalk.magenta(roleInfo.pendingDelay)} (${chalk.magenta(formatDuration(roleInfo.pendingDelay))}) effective at ${chalk.green(formatTimestamp(roleInfo.pendingEffect))}`,
        )
      }

      const targetsForRole = roleToTargetFunctions.get(roleInfo.roleId)
      if (targetsForRole && targetsForRole.size > 0) {
        console.log('    Callable targets and functions:')
        const sortedTargets = Array.from(targetsForRole.keys()).sort()
        sortedTargets.forEach((targetAddr) => {
          const functions = targetsForRole.get(targetAddr) // Already checked targetsForRole exists
          if (functions && functions.size > 0) {
            console.log(`      Target ${formatAddress(targetAddr)}:`)
            const formattedFuncs = Array.from(functions)
              .map(formatSelector)
              .sort()
            console.log(`        Functions: ${formattedFuncs.join(', ')}`)
          }
        })
      }
    })
  })
}

function generateTargetsReport(targetDataMap: Map<string, TargetData>): void {
  console.log(chalk.bold('\n================ Targets ================'))

  if (targetDataMap.size === 0) {
    console.log(chalk.yellow('\nNo target configurations found.'))
    return
  }

  const sortedTargets = Array.from(targetDataMap.values()).sort((a, b) =>
    a.address.localeCompare(b.address),
  )

  sortedTargets.forEach((targetData) => {
    console.log(`\n${formatAddress(targetData.address)}:`)
    console.log(
      `  ${chalk.cyan('targetAdminDelay')}: ${chalk.magenta(targetData.adminDelay)} (${chalk.magenta(formatDuration(targetData.adminDelay))})`,
    )
    console.log(`  ${chalk.cyan('Closed')}: ${chalk.yellow(targetData.closed)}`)

    // Display pending admin delay changes
    if (targetData.pendingAdminDelayChanges.length > 0) {
      // Assuming already sorted descending by effect time from fetch phase
      const latestPending = targetData.pendingAdminDelayChanges[0]
      console.log(
        `  ${chalk.cyan('pendingAdminDelay')}: ${chalk.magenta(latestPending.newDelay)} (${chalk.magenta(formatDuration(latestPending.newDelay))}) effective at ${chalk.green(formatTimestamp(latestPending.effect))}`,
      )
    }

    console.log('  Function Roles:')
    if (targetData.functionsByRole.size === 0) {
      console.log(
        chalk.yellow('    No function roles configured for this target'),
      )
    } else {
      const sortedRoles = Array.from(targetData.functionsByRole.values()).sort(
        (a, b) => a.roleId.localeCompare(b.roleId),
      )
      sortedRoles.forEach((roleInfo) => {
        const formattedFuncs = Array.from(roleInfo.selectors)
          .map(formatSelector)
          .sort()
        console.log(
          `    ${chalk.yellow(roleInfo.roleName)}: ${formattedFuncs.join(', ')}`,
        )
      })
    }
  })
}

function generatePendingChangesReport(
  scheduledOps: ScheduledOperation[],
  pendingRoleGrantChanges: Array<{
    roleId: string
    newDelay: number
    effect: number
  }>,
): void {
  console.log(
    chalk.bold(
      '\n============= Queued Operations and Pending Role Grant Delays =============',
    ),
  )

  let changesFound = false

  // Queued operations (scheduled calls)
  if (scheduledOps.length > 0) {
    changesFound = true
    console.log(chalk.bold('\nQueued Operations:'))
    // Sort operations by schedule time
    scheduledOps.sort((a, b) => a.schedule - b.schedule)
    scheduledOps.forEach((op) => {
      const selector = op.data.slice(0, 10)
      const decodedFunction = decodeOperationData(selector, op.data)

      console.log(`\nOperation ${chalk.cyan(op.operationId)}:`)
      console.log(`    Nonce: ${chalk.yellow(op.nonce)}`)
      console.log(
        `    Scheduled for: ${chalk.green(formatTimestamp(op.schedule))}`,
      )
      console.log(`    Caller: ${formatAddress(op.caller)}`)
      console.log(`    Target: ${formatAddress(op.target)}`)
      console.log(`    Function: ${decodedFunction}`) // Already formatted by decoder
    })
  } else {
    console.log(chalk.yellow('No queued operations found.'))
  }

  // Pending role grant delay changes
  console.log(chalk.bold('\nPending Role Grant Delay Changes:'))
  if (pendingRoleGrantChanges.length > 0) {
    changesFound = true
    // Sort changes by effect time
    pendingRoleGrantChanges.sort((a, b) => a.effect - b.effect)
    pendingRoleGrantChanges.forEach((change) => {
      const roleName = roleNames[change.roleId] || `Role ID ${change.roleId}`
      const formattedDelay = `${chalk.magenta(change.newDelay)} (${chalk.magenta(formatDuration(change.newDelay))})`
      console.log(
        `  Role ${chalk.yellow(roleName)}: New ${chalk.cyan('grant delay')} ${formattedDelay} effective at ${chalk.green(formatTimestamp(change.effect))}`,
      )
    })
  } else {
    console.log(chalk.yellow('  No pending role grant delay changes found.'))
  }

  if (!changesFound) {
    console.log(
      chalk.yellow(
        '\nNo queued operations or pending role grant delay changes found.',
      ),
    )
  }
}

function generateComplianceReport(issues: ComplianceIssue[]): void {
  console.log(
    chalk.bold(
      '\n================ Compliance Report (Minimum 12d Delay) ================',
    ),
  )

  if (issues.length === 0) {
    console.log(
      chalk.green(
        '\nAll checked values meet the minimum 12-day delay requirement.',
      ),
    )
    return
  }

  console.log(chalk.red(`\nFound ${issues.length} non-compliant value(s):`))
  issues.forEach((issue) => {
    const currentFormatted =
      issue.currentValue >= 0
        ? `${chalk.red(issue.currentValue)} (${chalk.red(formatDuration(issue.currentValue))})`
        : chalk.red('Not Found/Error')
    const requiredFormatted = `${chalk.green(issue.requiredValue)} (${chalk.green(formatDuration(issue.requiredValue))})`

    console.log(`\n- ${chalk.cyan(issue.type)}: ${chalk.yellow(issue.item)}`)
    console.log(`    Current: ${currentFormatted}`)
    console.log(`    Required: >= ${requiredFormatted}`)
    if (issue.details) {
      console.log(`    Details: ${chalk.gray(issue.details)}`)
    }
  })
}

// =========================
// MAIN FUNCTION
// =========================

export async function runScanKintoAm(): Promise<void> {
  console.log(chalk.bold('Starting ScanKintoAm...'))

  try {
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
    const accessManager = new ethers.Contract(
      ACCESS_MANAGER_ADDRESS,
      accessManagerAbi,
      provider,
    )
    const network = await provider.getNetwork()
    const fromBlock = 0 // Start block for event queries

    console.log(
      chalk.blue('\nConnecting to RPC endpoint:'),
      chalk.gray(RPC_URL),
    )
    console.log(
      chalk.blue('Network:'),
      chalk.gray(`${network.name} (Chain ID: ${network.chainId})`),
    )
    console.log(
      chalk.blue('AccessManager contract:'),
      chalk.gray(ACCESS_MANAGER_ADDRESS),
    )

    // --- Parallel Data Fetching ---
    const [roleResult, targetResult, operationsResult, externalDelaysResult] =
      await Promise.all([
        fetchRoleData(accessManager, fromBlock),
        fetchTargetData(accessManager, fromBlock),
        fetchOperationsData(accessManager, fromBlock),
        fetchExternalDelays(provider),
      ])

    const { rolesData, rolesByActor } = roleResult
    const { targetDataMap, roleToTargetFunctions } = targetResult
    const { scheduledOps, pendingRoleGrantChanges } = operationsResult
    const externalDelays = externalDelaysResult

    // --- Compliance Checking ---
    const complianceIssues = checkCompliance(
      rolesData,
      targetDataMap,
      externalDelays,
    )

    // --- Generate Reports ---
    generateRolesOverviewReport(rolesData)
    generateActorsReport(rolesByActor, roleToTargetFunctions)
    generateTargetsReport(targetDataMap)
    generatePendingChangesReport(scheduledOps, pendingRoleGrantChanges)
    generateComplianceReport(complianceIssues) // Add the compliance report

    console.log(chalk.bold('\nScan finished.'))
  } catch (error: unknown) {
    console.error(chalk.red('\n--- Fatal Error during scan ---'))
    if (error instanceof Error) {
      console.error(error.stack || error.message)
    } else {
      console.error(String(error))
    }
    process.exitCode = 1 // Indicate failure
  }
}

// --- Self-invocation ---
// If script is run directly: node <script_name>.js
if (require.main === module) {
  runScanKintoAm().catch((error: unknown) => {
    console.error('Unhandled error in runScanKintoAm:', error)
    process.exitCode = 1
  })
}
