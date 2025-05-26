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
  '2827137176883084373': 'RECOVERY_APPROVER_ROLE',
  '565311800027786426': 'SANCTIONER_ROLE',
  '1635978423191113331': 'NIO_GOVERNOR_ROLE',
  '18446744073709551615': 'PUBLIC_ROLE',
  '12665434841745889720': 'DEV_HELPER_ROLE',
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
  [KINTO_WALLET_EXAMPLE_ADDRESS.toLowerCase()]: 'Kinto Multisig 2', // Used for RECOVERY_TIME example
  '0x0000000000000000000000000000000000000000': 'Zero Address', // Added for clarity in decodings
}

// Function selector mapping (lowercase keys)
const functionSignatures: Record<string, string> = {
  // Upgrade functions
  '0xf4f4b03a': 'upgradeAllWalletImplementations(address)',
  '0x3659cfe6': 'upgradeTo(address)',
  '0xc233e2a3': 'updateSystemApps(address[])',
  '0x0e6ff432': 'updateSystemContracts(address[])',
  '0x72592851': 'updateReservedContracts(address[])',

  // sanctions
  '0xfb0b2940': 'confirmSanction(address)',

  // recovery
  '0x456cf492': 'approveWalletRecovery(address)',

  // appregistry other
  '0x9a6896f6': 'overrideChildToParentContract(address,address)',

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

  // delays in non-AM contracts
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
  txHash: string // Transaction hash that scheduled the operation
}

interface ComplianceIssue {
  type: string // e.g., 'Actor Execution Delay', 'Target Admin Delay', 'Non-AM Delay'
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
        // Warning message color
        `Warning: BigNumber too large for toNumber(), using potentially imprecise conversion: ${valueStr}`,
      ),
    )
    if (e instanceof Error) {
      console.warn(chalk.yellow(`       Original error: ${e.message}`)) // Warning message color
    }
    return Number(valueStr)
  }
}

// Colors: Blue for known name, Gray for address
function formatAddress(address: string): string {
  const lowerAddress = address.toLowerCase()
  const name = addressNames[lowerAddress]
  if (name) {
    return `${chalk.blue(name)} (${chalk.gray(lowerAddress)})`
  }
  return chalk.gray(lowerAddress)
}

// Color: Purple(magenta) for duration
function formatDuration(seconds: number): string {
  if (seconds < 0) return chalk.red('Invalid Duration') // Error color
  if (seconds === 0) return chalk.magenta('0s')

  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  const parts: string[] = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`) // Show 0s if duration is 0

  return chalk.magenta(parts.join(' '))
}

// Color: Purple(magenta) for timestamp
function formatTimestamp(timestamp: number): string {
  if (timestamp === 0) return chalk.magenta('Never')
  return chalk.magenta(new Date(timestamp * 1000).toISOString())
}

// Color: Gray for selector/signature
function formatSelector(selector: string): string {
  const signature = functionSignatures[selector.toLowerCase()]
  return signature ? chalk.gray(signature) : chalk.gray(selector)
}

// Colors: Yellow for Role, Purple(magenta) for Time/Delay, Blue/Gray for Address, Gray for function name
function decodeOperationData(selector: string, data: string): string {
  try {
    const abiCoder = ethers.utils.defaultAbiCoder
    const lowerSelector = selector.toLowerCase()

    // Remove the selector (0x + 8 hex chars = 10 chars)
    const paramsData = '0x' + data.slice(10)

    switch (lowerSelector) {
      // --- Access Manager Functions ---
      case '0x25c471a0': {
        // grantRole(uint64 roleId, address account, uint32 executionDelay)
        const [roleIdBN, account, executionDelay] = abiCoder.decode(
          ['uint64', 'address', 'uint32'],
          paramsData,
        )
        const roleId = roleIdBN.toString()
        const roleName = roleNames[roleId] || chalk.yellow(`Role ID ${roleId}`)
        const formattedDelay = `${chalk.magenta(executionDelay)} (${formatDuration(executionDelay)})`
        return `${chalk.gray('grantRole')}(${chalk.yellow(roleName)}, ${formatAddress(account)}, ${formattedDelay})`
      }
      case '0xb7d2b162': {
        // revokeRole(uint64 roleId, address account)
        const [roleIdBN, account] = abiCoder.decode(
          ['uint64', 'address'],
          paramsData,
        )
        const roleId = roleIdBN.toString()
        const roleName = roleNames[roleId] || chalk.yellow(`Role ID ${roleId}`)
        return `${chalk.gray('revokeRole')}(${chalk.yellow(roleName)}, ${formatAddress(account)})`
      }
      case '0xd22b5989': {
        // setTargetAdminDelay(address target, uint32 newDelay)
        const [target, newDelay] = abiCoder.decode(
          ['address', 'uint32'],
          paramsData,
        )
        const formattedDelay = `${chalk.magenta(newDelay)} (${formatDuration(newDelay)})`
        return `${chalk.gray('setTargetAdminDelay')}(${formatAddress(target)}, ${formattedDelay})`
      }
      case '0x167bd395': {
        // setTargetClosed(address target, bool closed)
        const [target, closed] = abiCoder.decode(
          ['address', 'bool'],
          paramsData,
        )
        return `${chalk.gray('setTargetClosed')}(${formatAddress(target)}, ${chalk.yellow(closed)})` // Yellow for boolean
      }
      case '0xa64d95ce': {
        // setGrantDelay(uint64 roleId, uint32 newDelay)
        const [roleIdBN, newDelay] = abiCoder.decode(
          ['uint64', 'uint32'],
          paramsData,
        )
        const roleId = roleIdBN.toString()
        const roleName = roleNames[roleId] || chalk.yellow(`Role ID ${roleId}`)
        const formattedDelay = `${chalk.magenta(newDelay)} (${formatDuration(newDelay)})`
        return `${chalk.gray('setGrantDelay')}(${chalk.yellow(roleName)}, ${formattedDelay})`
      }
      case '0x853551b8': {
        // labelRole(uint64 roleId, string label)
        const [roleIdBN, label] = abiCoder.decode(
          ['uint64', 'string'],
          paramsData,
        )
        const roleId = roleIdBN.toString()
        const roleName = roleNames[roleId] || chalk.yellow(`Role ID ${roleId}`)
        return `${chalk.gray('labelRole')}(${chalk.yellow(roleName)}, "${chalk.yellow(label)}")` // Yellow for label string
      }
      case '0x08d6122d': {
        // setTargetFunctionRole(address target, bytes4[] selectors, uint64 roleId)
        const [target, selectors, roleIdBN] = abiCoder.decode(
          ['address', 'bytes4[]', 'uint64'],
          paramsData,
        )
        const roleId = roleIdBN.toString()
        const roleName = roleNames[roleId] || chalk.yellow(`Role ID ${roleId}`)
        const formattedSelectors = selectors
          .map((sel: string) => formatSelector(sel))
          .join(', ')
        return `${chalk.gray('setTargetFunctionRole')}(${formatAddress(target)}, [${formattedSelectors}], ${chalk.yellow(roleName)})`
      }

      // --- Upgrade Functions ---
      case '0x3659cfe6': {
        // upgradeTo(address)
        const [newImplementation] = abiCoder.decode(['address'], paramsData)
        return `${chalk.gray('upgradeTo')}(${formatAddress(newImplementation)})`
      }
      case '0x91a221d3': {
        // upgradeAllWalletImplementations(address)
        const [newImplementation] = abiCoder.decode(['address'], paramsData)
        return `${chalk.gray('upgradeAllWalletImplementations')}(${formatAddress(newImplementation)})`
      }

      default:
        // Return signature if known, otherwise just selector
        return formatSelector(lowerSelector)
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.warn(
      chalk.yellow(
        // Warning color
        `Could not decode data for selector ${chalk.gray(selector)}: ${errorMessage}`,
      ),
    )
    // Return signature if known, otherwise just selector
    return formatSelector(selector)
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
  console.log(chalk.magenta(`- Querying ${eventName} events...`)) // Magenta for fetching status
  try {
    const events = await contract.queryFilter(eventName, fromBlock, toBlock)
    console.log(chalk.green(`- Found ${events.length} ${eventName} events`)) // Green for success count
    return events
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(
      chalk.red(`Error fetching ${eventName} events: ${errorMessage}`), // Red for errors
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
        name: roleNames[roleId] || chalk.yellow(`Unknown Role (${roleId})`), // Yellow for unknown role
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
    if (role) {
      // Ensure role exists before setting admin
      role.admin = adminRoleId
    }
  })

  roleGuardianChangedEvents.forEach((event) => {
    if (!event.args) return
    const roleId = event.args.roleId.toString()
    const guardianRoleId = event.args.guardian.toString()
    const role = rolesData.get(roleId)
    if (role) {
      // Ensure role exists before setting guardian
      role.guardian = guardianRoleId
    }
  })

  // Process role grant delay changes
  const currentTimestamp = Math.floor(Date.now() / 1000)
  const latestGrantDelayEffect = new Map<string, number>() // roleId -> latest effect timestamp

  roleGrantDelayChangedEvents.sort(
    (a, b) => a.blockNumber - b.blockNumber || a.logIndex - b.logIndex,
  ) // Sort by block, then index

  roleGrantDelayChangedEvents.forEach((event) => {
    if (!event.args) return
    const roleId = event.args.roleId.toString()
    const newDelay = bnToNumber(event.args.delay)
    const effect = bnToNumber(event.args.since)
    const role = rolesData.get(roleId)
    if (role) {
      const lastEffect = latestGrantDelayEffect.get(roleId) ?? 0
      // Update current only if this event is the latest effective one
      if (effect <= currentTimestamp && effect >= lastEffect) {
        role.currentGrantDelay = newDelay
        latestGrantDelayEffect.set(roleId, effect) // Update latest known effect time
        // If a pending change exists but is older than this now-effective one, clear it
        if (role.pendingGrantDelay && role.pendingGrantDelay.effect < effect) {
          role.pendingGrantDelay = undefined
        }
      }
      // Update pending only if this event's effect is in the future AND is the latest scheduled one
      else if (
        effect > currentTimestamp &&
        (!role.pendingGrantDelay || effect >= role.pendingGrantDelay.effect)
      ) {
        role.pendingGrantDelay = { newDelay, effect }
      }
    }
  })

  // --- Fetch Current State ---
  console.log(
    chalk.magenta('- Fetching current state for roles and members...'), // Magenta status
  )

  // Fetch current grant delays for all known roles in parallel
  await Promise.all(
    Array.from(rolesData.keys()).map(async (roleId) => {
      try {
        const grantDelay = await accessManager.getRoleGrantDelay(roleId)
        const role = rolesData.get(roleId)
        if (role) {
          // Overwrite with current on-chain value for certainty
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
            // Red error
            `- Error fetching grant delay for role ${chalk.yellow(roleId)}: ${errorMessage}`, // Yellow role ID
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
            // Use hasRole first to avoid unnecessary getAccess calls if not a member
            const [isMember] = await accessManager.hasRole(roleId, account)

            if (isMember) {
              const accessData = await accessManager.getAccess(roleId, account)
              const since = bnToNumber(accessData.since)
              const currentDelay = bnToNumber(accessData.currentDelay)
              const pendingDelay = bnToNumber(accessData.pendingDelay)
              const effect = bnToNumber(accessData.effect)

              const memberInfo: RoleMemberInfo = {
                roleId,
                executionDelay: currentDelay,
                since,
                pendingDelay: pendingDelay,
                pendingEffect: effect,
              }

              // Update rolesByActor map
              if (!rolesByActor.has(account)) rolesByActor.set(account, [])
              // Ensure no duplicate entries if event processing was slightly off
              const existingRoles = rolesByActor.get(account)
              // FIX: Check if existingRoles is defined before using it
              if (
                existingRoles &&
                !existingRoles.some((r) => r.roleId === roleId)
              ) {
                existingRoles.push(memberInfo)
              } else if (existingRoles) {
                // Update existing entry if needed (though usually getAccess is definitive)
                const index = existingRoles.findIndex(
                  (r) => r.roleId === roleId,
                )
                if (index > -1) {
                  // Ensure index is found
                  existingRoles[index] = memberInfo
                }
              }

              // Update rolesData map
              rolesData.get(roleId)?.members.set(account, memberInfo)
            } else {
              // Remove if hasRole is false, ensuring consistency
              rolesData.get(roleId)?.members.delete(account)
              // Also remove from rolesByActor if present
              if (rolesByActor.has(account)) {
                const actorRoles = rolesByActor.get(account)
                // FIX: Check if actorRoles is defined before using it
                if (actorRoles) {
                  const index = actorRoles.findIndex((r) => r.roleId === roleId)
                  if (index > -1) {
                    actorRoles.splice(index, 1)
                  }
                  // If actor has no more roles, remove the actor entry
                  if (actorRoles.length === 0) {
                    rolesByActor.delete(account)
                  }
                }
              }
            }
          } catch (error: unknown) {
            const errorMessage =
              error instanceof Error ? error.message : String(error)
            console.error(
              chalk.red(
                // Red error
                `- Error fetching access/hasRole for role ${chalk.yellow(roleId)}, account ${formatAddress(account)}: ${errorMessage}`, // Yellow role, Formatted address
              ),
            )
            // Assume revoked or error state on failure
            rolesData.get(roleId)?.members.delete(account)
            if (rolesByActor.has(account)) {
              const actorRoles = rolesByActor.get(account)
              // FIX: Check if actorRoles is defined before using it
              if (actorRoles) {
                const index = actorRoles.findIndex((r) => r.roleId === roleId)
                if (index > -1) actorRoles.splice(index, 1)
                if (actorRoles.length === 0) rolesByActor.delete(account)
              }
            }
          }
        })(),
      )
    })
  })

  await Promise.all(memberFetchPromises)

  // Log summary
  console.log(chalk.green(`- Processed ${rolesData.size} distinct roles`)) // Green success
  console.log(
    chalk.green(`- Found ${rolesByActor.size} actors with active roles`), // Green success
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
  const functionRoleUpdates = new Map<string, Map<string, string>>() // target -> selector -> roleId (store latest role for each func)
  targetFuncRoleEvents.sort(
    (a, b) => a.blockNumber - b.blockNumber || a.logIndex - b.logIndex,
  ) // Sort by block, then index

  targetFuncRoleEvents.forEach((event) => {
    if (!event.args) return
    const target = event.args.target.toLowerCase()
    const selector = event.args.selector.toLowerCase()
    const roleId = event.args.roleId.toString()

    potentialTargets.add(target)
    if (!functionRoleUpdates.has(target)) {
      functionRoleUpdates.set(target, new Map())
    }
    // FIX: Use optional chaining for safety
    functionRoleUpdates.get(target)?.set(selector, roleId) // Store/overwrite with the latest role for this selector
  })

  // Now build the targetDataMap and roleToTargetFunctions based on the final state from events
  functionRoleUpdates.forEach((selectorsMap, target) => {
    if (!targetDataMap.has(target)) {
      targetDataMap.set(target, {
        address: target,
        name: addressNames[target] || `Unknown Target (${chalk.gray(target)})`, // Gray address
        adminDelay: 0,
        closed: false,
        functionsByRole: new Map(),
        pendingAdminDelayChanges: [],
      })
    }
    const targetData = targetDataMap.get(target)
    // FIX: Add check for targetData existence
    if (!targetData) return // Should not happen based on logic above, but safer

    selectorsMap.forEach((roleId, selector) => {
      // Update targetData.functionsByRole
      if (!targetData.functionsByRole.has(roleId)) {
        targetData.functionsByRole.set(roleId, {
          roleId: roleId,
          roleName:
            roleNames[roleId] || chalk.yellow(`Unknown Role (${roleId})`), // Yellow unknown role
          selectors: new Set(),
        })
      }
      // FIX: Use optional chaining
      targetData.functionsByRole.get(roleId)?.selectors.add(selector)

      // Update roleToTargetFunctions lookup
      if (!roleToTargetFunctions.has(roleId)) {
        roleToTargetFunctions.set(roleId, new Map())
      }
      const roleTargets = roleToTargetFunctions.get(roleId)
      // FIX: Add check for roleTargets existence
      if (roleTargets) {
        if (!roleTargets.has(target)) {
          roleTargets.set(target, new Set())
        }
        // FIX: Use optional chaining
        roleTargets.get(target)?.add(selector)
      }
    })
  })

  // Process TargetAdminDelayUpdated
  const currentTimestamp = Math.floor(Date.now() / 1000)
  const latestAdminDelayEffect = new Map<string, number>() // target -> latest effect timestamp
  targetAdminDelayEvents.sort(
    (a, b) => a.blockNumber - b.blockNumber || a.logIndex - b.logIndex,
  ) // Sort

  targetAdminDelayEvents.forEach((event) => {
    if (!event.args) return
    const target = event.args.target.toLowerCase()
    const newDelay = bnToNumber(event.args.delay)
    const effect = bnToNumber(event.args.since)

    potentialTargets.add(target)
    if (!targetDataMap.has(target)) {
      targetDataMap.set(target, {
        address: target,
        name: addressNames[target] || `Unknown Target (${chalk.gray(target)})`, // Gray address
        adminDelay: 0,
        closed: false,
        functionsByRole: new Map(),
        pendingAdminDelayChanges: [],
      })
    }

    const targetData = targetDataMap.get(target)
    // FIX: Add check for targetData existence
    if (!targetData) return
    const lastEffect = latestAdminDelayEffect.get(target) ?? 0

    // Update current only if this event is the latest effective one
    if (effect <= currentTimestamp && effect >= lastEffect) {
      targetData.adminDelay = newDelay
      latestAdminDelayEffect.set(target, effect)
      // Clear pending changes that are older than this now-effective one
      targetData.pendingAdminDelayChanges =
        targetData.pendingAdminDelayChanges.filter(
          (change) => change.effect >= effect,
        )
    }
    // Update pending only if effect is in the future AND is the latest scheduled one
    else if (effect > currentTimestamp) {
      // Remove any older pending changes
      targetData.pendingAdminDelayChanges =
        targetData.pendingAdminDelayChanges.filter(
          (change) => change.effect > effect, // Keep only those strictly newer
        )
      // Add the new one if it's not already superseded
      if (
        !targetData.pendingAdminDelayChanges.some(
          (change) => change.effect > effect,
        )
      ) {
        targetData.pendingAdminDelayChanges.push({ newDelay, effect })
        // Keep it sorted, latest effect first might be useful, though not strictly necessary here
        targetData.pendingAdminDelayChanges.sort((a, b) => b.effect - a.effect)
      }
    }
  })

  // Process TargetClosed (Latest event wins)
  const latestClosedState = new Map<string, boolean>() // target -> closed state
  targetClosedEvents.sort(
    (a, b) => a.blockNumber - b.blockNumber || a.logIndex - b.logIndex,
  ) // Sort

  targetClosedEvents.forEach((event) => {
    if (!event.args) return
    const target = event.args.target.toLowerCase()
    const closed = event.args.closed

    potentialTargets.add(target)
    latestClosedState.set(target, closed) // Overwrite with latest state
  })

  latestClosedState.forEach((closed, target) => {
    if (!targetDataMap.has(target)) {
      targetDataMap.set(target, {
        address: target,
        name: addressNames[target] || `Unknown Target (${chalk.gray(target)})`, // Gray address
        adminDelay: 0, // Will be fetched or remain 0 if no delay events
        closed: closed,
        functionsByRole: new Map(),
        pendingAdminDelayChanges: [],
      })
    }
  })

  // --- Fetch Current State ---
  console.log(chalk.magenta('- Fetching current state for targets...')) // Magenta status
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

          // Clean up pending admin delay changes that are now effective based on current time
          targetData.pendingAdminDelayChanges =
            targetData.pendingAdminDelayChanges.filter(
              (change) =>
                change.effect > currentTimestamp &&
                change.newDelay !== targetData.adminDelay, // Also check if pending delay matches current
            )
        } else {
          // If target wasn't in events but is known (e.g. critical list), create entry
          if (CRITICAL_TARGETS_FOR_ADMIN_DELAY.has(target)) {
            targetDataMap.set(target, {
              address: target,
              name:
                addressNames[target] ||
                `Unknown Target (${chalk.gray(target)})`, // Gray address
              adminDelay: bnToNumber(adminDelayBN),
              closed: closed,
              functionsByRole: new Map(), // Assume no specific funcs unless found later
              pendingAdminDelayChanges: [],
            })
          }
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        console.error(
          chalk.red(
            // Red error
            `- Error fetching config for target ${formatAddress(target)}: ${errorMessage}`, // Formatted address
          ),
        )
      }
    }),
  )

  // Ensure all CRITICAL_TARGETS are present, even if they had no events/errors
  CRITICAL_TARGETS_FOR_ADMIN_DELAY.forEach((addr) => {
    const lowerAddr = addr.toLowerCase()
    if (!targetDataMap.has(lowerAddr)) {
      console.warn(
        chalk.yellow(
          `- Critical target ${formatAddress(lowerAddr)} not found in fetched data. Adding with defaults.`,
        ),
      ) // Yellow warning
      targetDataMap.set(lowerAddr, {
        address: lowerAddr,
        name:
          addressNames[lowerAddr] ||
          `Unknown Critical Target (${chalk.gray(lowerAddr)})`, // Gray address
        adminDelay: 0, // Default, compliance check will catch this
        closed: false, // Default
        functionsByRole: new Map(),
        pendingAdminDelayChanges: [],
      })
    }
  })

  console.log(
    chalk.green(
      // Green success
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
        txHash: event.transactionHash, // Capture the transaction hash
      })
    }
  })
  console.log(chalk.green(`- Found ${scheduledOps.length} pending operations`)) // Green success

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

  // Sort events to process them in order
  roleGrantDelayChangedEvents.sort(
    (a, b) => a.blockNumber - b.blockNumber || a.logIndex - b.logIndex,
  )

  roleGrantDelayChangedEvents.forEach((event) => {
    if (!event.args) return
    const roleId = event.args.roleId.toString()
    const effect = bnToNumber(event.args.since)
    const newDelay = bnToNumber(event.args.delay)

    if (effect > currentTimestamp) {
      const existing = latestPendingGrantChange.get(roleId)
      // Update only if this event is newer (has a later effect time)
      if (!existing || effect >= existing.effect) {
        latestPendingGrantChange.set(roleId, { newDelay, effect })
      }
    } else {
      // If an event is now in the past, it might cancel a pending change for this role
      const existingPending = latestPendingGrantChange.get(roleId)
      if (existingPending && existingPending.effect <= effect) {
        latestPendingGrantChange.delete(roleId) // This past event supersedes the pending one
      }
    }
  })

  // Fetch current grant delays again to verify against pending changes
  await Promise.all(
    Array.from(latestPendingGrantChange.keys()).map(async (roleId) => {
      try {
        const currentDelay = await accessManager.getRoleGrantDelay(roleId)
        const currentDelayNum = bnToNumber(currentDelay)
        const pendingChange = latestPendingGrantChange.get(roleId)
        // If the pending change's delay matches the current on-chain delay, it's no longer pending
        if (pendingChange && pendingChange.newDelay === currentDelayNum) {
          latestPendingGrantChange.delete(roleId)
        }
        // FIX: Rename unused error variable
      } catch (_error) {
        console.warn(
          // Yellow warning
          chalk.yellow(
            `- Could not verify current grant delay for role ${chalk.yellow(roleId)} while processing pending changes.`,
          ), // Yellow role ID
        )
      }
    }),
  )

  latestPendingGrantChange.forEach((change, roleId) => {
    pendingRoleGrantChanges.push({ roleId, ...change })
  })

  console.log(
    chalk.green(
      // Green success
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
  console.log(chalk.bold('\nFetching non-AM delay values...'))
  let kintoIdExitWindow: number | null = null
  let kintoWalletRecoveryTime: number | null = null

  try {
    const kintoIdContract = new ethers.Contract(
      KINTO_ID_ADDRESS,
      kintoIdAbi,
      provider,
    )
    // Use a specific Kinto Wallet instance *known* to exist, like the factory or a deployed example
    // KINTO_WALLET_EXAMPLE_ADDRESS should be a valid deployed KintoWallet
    const kintoWalletContract = new ethers.Contract(
      KINTO_WALLET_EXAMPLE_ADDRESS,
      kintoWalletAbi,
      provider,
    )

    const [exitWindowResult, recoveryTimeResult] = await Promise.allSettled([
      kintoIdContract.EXIT_WINDOW_PERIOD(),
      kintoWalletContract.RECOVERY_TIME(), // Call on the example wallet instance
    ])

    if (
      exitWindowResult.status === 'fulfilled' &&
      exitWindowResult.value !== null
    ) {
      kintoIdExitWindow = bnToNumber(exitWindowResult.value)
      console.log(
        chalk.green(
          // Green success
          `- KintoID EXIT_WINDOW_PERIOD: ${chalk.magenta(kintoIdExitWindow)} (${formatDuration(kintoIdExitWindow)})`, // Purple(magenta) value/duration
        ),
      )
    } else if (exitWindowResult.status === 'rejected') {
      const reason = exitWindowResult.reason
      const errorMessage =
        reason instanceof Error ? reason.message : String(reason)
      console.error(
        chalk.red(
          // Red error
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
          // Green success
          `- KintoWallet RECOVERY_TIME (from ${formatAddress(KINTO_WALLET_EXAMPLE_ADDRESS)}): ${chalk.magenta(kintoWalletRecoveryTime)} (${formatDuration(kintoWalletRecoveryTime)})`, // Purple(magenta) value/duration
        ),
      )
    } else if (recoveryTimeResult.status === 'rejected') {
      const reason = recoveryTimeResult.reason
      const errorMessage =
        reason instanceof Error ? reason.message : String(reason)
      console.error(
        chalk.red(
          // Red error
          `- Error fetching KintoWallet RECOVERY_TIME from ${formatAddress(KINTO_WALLET_EXAMPLE_ADDRESS)}: ${errorMessage}`,
        ),
      )
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(
      chalk.red(
        // Red error
        `- Error creating contracts or fetching external delays: ${errorMessage}`,
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
        type: 'Non-AM Delay',
        item: chalk.yellow('KintoID.EXIT_WINDOW_PERIOD'), // Yellow item
        currentValue: externalDelays.kintoIdExitWindow,
        requiredValue: MIN_DELAY_SECONDS,
      })
    }
  } else {
    issues.push({
      type: 'Non-AM Delay',
      item: chalk.yellow('KintoID.EXIT_WINDOW_PERIOD'), // Yellow item
      currentValue: -1,
      requiredValue: MIN_DELAY_SECONDS,
      details: 'Could not fetch value.',
    })
  }

  // 2. Check KintoWallet.RECOVERY_TIME
  if (externalDelays.kintoWalletRecoveryTime !== null) {
    if (externalDelays.kintoWalletRecoveryTime < MIN_DELAY_SECONDS) {
      issues.push({
        type: 'Non-AM Delay',
        item: chalk.yellow(
          `KintoWallet.RECOVERY_TIME (from ${formatAddress(KINTO_WALLET_EXAMPLE_ADDRESS)})`,
        ), // Yellow item
        currentValue: externalDelays.kintoWalletRecoveryTime,
        requiredValue: MIN_DELAY_SECONDS,
      })
    }
  } else {
    issues.push({
      type: 'Non-AM Delay',
      item: chalk.yellow(
        `KintoWallet.RECOVERY_TIME (from ${formatAddress(KINTO_WALLET_EXAMPLE_ADDRESS)})`,
      ), // Yellow item
      currentValue: -1,
      requiredValue: MIN_DELAY_SECONDS,
      details: 'Could not fetch value.',
    })
  }

  // 3. Check targetAdminDelay for critical targets
  CRITICAL_TARGETS_FOR_ADMIN_DELAY.forEach((targetAddr) => {
    const targetData = targetDataMap.get(targetAddr.toLowerCase())
    if (targetData) {
      // Check current delay, ignore pending changes for compliance report
      if (targetData.adminDelay < MIN_DELAY_SECONDS) {
        issues.push({
          type: 'Target Admin Delay',
          item: formatAddress(targetData.address), // Blue/Gray item
          currentValue: targetData.adminDelay,
          requiredValue: MIN_DELAY_SECONDS,
          details:
            targetData.pendingAdminDelayChanges.length > 0
              ? `Pending change: ${formatDuration(targetData.pendingAdminDelayChanges[0].newDelay)} effective ${formatTimestamp(targetData.pendingAdminDelayChanges[0].effect)}`
              : undefined,
        })
      }
    } else {
      issues.push({
        type: 'Target Admin Delay',
        item: formatAddress(targetAddr), // Blue/Gray item
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
          // Check current delay, ignore pending changes for compliance report
          const isPending =
            memberInfo.pendingDelay > 0 &&
            memberInfo.pendingEffect > Math.floor(Date.now() / 1000)
          if (memberInfo.executionDelay < MIN_DELAY_SECONDS) {
            issues.push({
              type: 'Actor Execution Delay',
              item: `${formatAddress(account)} (${chalk.yellow(role.name)})`, // Blue/Gray actor, Yellow role
              currentValue: memberInfo.executionDelay,
              requiredValue: MIN_DELAY_SECONDS,
              details: isPending
                ? `Pending change: ${formatDuration(memberInfo.pendingDelay)} effective ${formatTimestamp(memberInfo.pendingEffect)}`
                : undefined,
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
    console.log(chalk.yellow('No roles found.')) // Yellow info
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
      `\n${chalk.yellow(roleData.name)} (ID: ${chalk.gray(roleData.id)}):`, // Yellow Role, Gray ID
    )
    console.log(
      `  ${chalk.magenta('roleGrantDelay')}: ${chalk.magenta(roleData.currentGrantDelay)} (${formatDuration(roleData.currentGrantDelay)})`, // Purple(magenta) label, value, duration
    )

    if (roleData.pendingGrantDelay) {
      console.log(
        `  ${chalk.magenta('pendingGrantDelay')}: ${chalk.magenta(roleData.pendingGrantDelay.newDelay)} (${formatDuration(roleData.pendingGrantDelay.newDelay)}) effective at ${formatTimestamp(roleData.pendingGrantDelay.effect)}`, // Purple(magenta) label, value, duration, timestamp
      )
    }
    if (roleData.admin) {
      const adminRoleName =
        roleNames[roleData.admin] || chalk.yellow(`Role ID ${roleData.admin}`) // Yellow Role/ID
      console.log(
        `  ${chalk.gray('adminRole')}: ${chalk.yellow(adminRoleName)}`, // Gray label, Yellow value
      )
    } else {
      console.log(
        `  ${chalk.gray('adminRole')}: ${chalk.yellow('None/Default (ADMIN_ROLE)')}`,
      ) // Gray label, Yellow value
    }
    if (roleData.guardian) {
      const guardianRoleName =
        roleNames[roleData.guardian] ||
        chalk.yellow(`Role ID ${roleData.guardian}`) // Yellow Role/ID
      console.log(
        `  ${chalk.gray('guardianRole')}: ${chalk.yellow(guardianRoleName)}`, // Gray label, Yellow value
      )
    } else {
      console.log(`  ${chalk.gray('guardianRole')}: ${chalk.yellow('None')}`) // Gray label, Yellow value
    }

    if (roleData.members.size > 0) {
      console.log(`  members (${roleData.members.size}):`)
      const sortedMembers = Array.from(roleData.members.entries()).sort(
        ([addrA], [addrB]) => addrA.localeCompare(addrB),
      )
      sortedMembers.forEach(([account, memberInfo]) => {
        const isPending =
          memberInfo.pendingDelay !== 0 &&
          memberInfo.pendingEffect > Math.floor(Date.now() / 1000) &&
          memberInfo.pendingDelay !== memberInfo.executionDelay
        console.log(
          `    ${formatAddress(account)}: ${chalk.magenta('executionDelay')}: ${chalk.magenta(memberInfo.executionDelay)} (${formatDuration(memberInfo.executionDelay)})`, // Blue/Gray Actor, Purple(magenta) label, value, duration
        )
        if (isPending) {
          console.log(
            `      ${chalk.magenta('pendingExecutionDelay')}: ${chalk.magenta(memberInfo.pendingDelay)} (${formatDuration(memberInfo.pendingDelay)}) effective at ${formatTimestamp(memberInfo.pendingEffect)}`, // Purple(magenta) label, value, duration, timestamp
          )
        }
      })
    } else {
      console.log(`  members: ${chalk.yellow('None')}`) // Yellow value
    }
  })
}

function generateActorsReport(
  rolesByActor: Map<string, RoleMemberInfo[]>,
  roleToTargetFunctions: Map<string, Map<string, Set<string>>>,
): void {
  console.log(chalk.bold('\n================ Actors ================'))

  if (rolesByActor.size === 0) {
    console.log(chalk.yellow('\nNo actors with active roles found.')) // Yellow info
    return
  }

  const sortedActors = Array.from(rolesByActor.keys()).sort()

  sortedActors.forEach((account) => {
    console.log(`\n${formatAddress(account)}:`) // Blue/Gray Actor
    const roles = rolesByActor.get(account) ?? [] // Use nullish coalescing for safety
    roles.sort((a, b) => a.roleId.localeCompare(b.roleId)) // Sort roles per actor

    roles.forEach((roleInfo) => {
      const roleName =
        roleNames[roleInfo.roleId] || chalk.yellow(`Role ID ${roleInfo.roleId}`) // Yellow Role/ID
      const delayStr = `${chalk.magenta(roleInfo.executionDelay)} (${formatDuration(roleInfo.executionDelay)})` // Purple(magenta) value, duration
      const isPending =
        roleInfo.pendingDelay !== 0 &&
        roleInfo.pendingEffect > Math.floor(Date.now() / 1000) &&
        roleInfo.pendingDelay !== roleInfo.executionDelay

      console.log(
        `  ${chalk.yellow(roleName)}: ${chalk.magenta('executionDelay')}: ${delayStr}`, // Yellow Role, Purple(magenta) label, value/duration
      )

      // Display pending execution delay change if any
      if (isPending) {
        console.log(
          `    ${chalk.magenta('pendingExecutionDelay')}: ${chalk.magenta(roleInfo.pendingDelay)} (${formatDuration(roleInfo.pendingDelay)}) effective at ${formatTimestamp(roleInfo.pendingEffect)}`, // Purple(magenta) label, value, duration, timestamp
        )
      }

      const targetsForRole = roleToTargetFunctions.get(roleInfo.roleId)
      if (targetsForRole && targetsForRole.size > 0) {
        console.log('    Callable targets and functions:')
        const sortedTargets = Array.from(targetsForRole.keys()).sort()
        sortedTargets.forEach((targetAddr) => {
          const functions = targetsForRole.get(targetAddr) // Already checked targetsForRole exists
          if (functions && functions.size > 0) {
            console.log(`      Target ${formatAddress(targetAddr)}:`) // Blue/Gray Target
            const formattedFuncs = Array.from(functions)
              .map(formatSelector) // Gray Signatures
              .sort()
            console.log(`        Functions: ${formattedFuncs.join(', ')}`)
          }
        })
      } else {
        console.log(
          `    Callable targets and functions: ${chalk.yellow('None configured')}`,
        ) // Yellow value
      }
    })
  })
}

function generateTargetsReport(targetDataMap: Map<string, TargetData>): void {
  console.log(chalk.bold('\n================ Targets ================'))

  if (targetDataMap.size === 0) {
    console.log(chalk.yellow('\nNo target configurations found.')) // Yellow info
    return
  }

  const sortedTargets = Array.from(targetDataMap.values()).sort((a, b) =>
    a.address.localeCompare(b.address),
  )

  sortedTargets.forEach((targetData) => {
    console.log(`\n${formatAddress(targetData.address)}:`) // Blue/Gray Target
    console.log(
      `  ${chalk.magenta('targetAdminDelay')}: ${chalk.magenta(targetData.adminDelay)} (${formatDuration(targetData.adminDelay)})`, // Purple(magenta) label, value, duration
    )
    console.log(`  ${chalk.gray('Closed')}: ${chalk.yellow(targetData.closed)}`) // Gray label, Yellow value

    // Display pending admin delay changes
    if (targetData.pendingAdminDelayChanges.length > 0) {
      // Assuming already sorted descending by effect time from fetch phase
      const latestPending = targetData.pendingAdminDelayChanges[0]
      if (latestPending.newDelay !== targetData.adminDelay) {
        // Only show if it's actually a change
        console.log(
          `  ${chalk.magenta('pendingAdminDelay')}: ${chalk.magenta(latestPending.newDelay)} (${formatDuration(latestPending.newDelay)}) effective at ${formatTimestamp(latestPending.effect)}`, // Purple(magenta) label, value, duration, timestamp
        )
      }
    }

    console.log('  Function Roles:')
    if (targetData.functionsByRole.size === 0) {
      console.log(
        chalk.yellow(
          '    No specific function roles configured (may use PUBLIC_ROLE if not closed)',
        ), // Yellow info
      )
    } else {
      const sortedRoles = Array.from(targetData.functionsByRole.values()).sort(
        (a, b) => a.roleId.localeCompare(b.roleId),
      )
      sortedRoles.forEach((roleInfo) => {
        const formattedFuncs = Array.from(roleInfo.selectors)
          .map(formatSelector) // Gray Signatures
          .sort()
        console.log(
          `    ${chalk.yellow(roleInfo.roleName)}: ${formattedFuncs.join(', ')}`, // Yellow Role, Gray Signatures
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
      const explorerLink = `https://explorer.kinto.xyz/tx/${op.txHash}` // Construct link

      console.log(`\nOperation ${chalk.gray(op.operationId)}:`) // Gray ID
      console.log(`    Nonce: ${chalk.magenta(op.nonce)}`) // Purple(magenta) value
      console.log(
        `    Scheduled for: ${formatTimestamp(op.schedule)}`, // Purple(magenta) timestamp
      )
      console.log(`    Caller: ${formatAddress(op.caller)}`) // Blue/Gray Caller
      console.log(`    Target: ${formatAddress(op.target)}`) // Blue/Gray Target
      console.log(`    Function: ${decodedFunction}`) // Colors handled by decoder
      console.log(`    Scheduled by Tx: ${chalk.blue.underline(explorerLink)}`) // Blue link
    })
  } else {
    console.log(chalk.yellow('\nNo queued operations found.')) // Yellow info
  }

  // Pending role grant delay changes
  console.log(chalk.bold('\nPending Role Grant Delay Changes:'))
  if (pendingRoleGrantChanges.length > 0) {
    changesFound = true
    // Sort changes by effect time
    pendingRoleGrantChanges.sort((a, b) => a.effect - b.effect)
    pendingRoleGrantChanges.forEach((change) => {
      const roleName =
        roleNames[change.roleId] || chalk.yellow(`Role ID ${change.roleId}`) // Yellow Role/ID
      const formattedDelay = `${chalk.magenta(change.newDelay)} (${formatDuration(change.newDelay)})` // Purple(magenta) value/duration
      console.log(
        `  Role ${chalk.yellow(roleName)}: New ${chalk.magenta('grant delay')} ${formattedDelay} effective at ${formatTimestamp(change.effect)}`, // Yellow Role, Purple(magenta) label, value/duration, timestamp
      )
    })
  } else {
    console.log(chalk.yellow('  No pending role grant delay changes found.')) // Yellow info
  }

  if (!changesFound && scheduledOps.length === 0) {
    // Check scheduledOps again just in case
    console.log(
      chalk.yellow(
        '\nNo queued operations or pending role grant delay changes found.',
      ),
    ) // Yellow info
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
        // Green pass message
        '\nAll checked values meet the minimum 12-day delay requirement.',
      ),
    )
    return
  }

  console.log(chalk.red(`\nFound ${issues.length} non-compliant value(s):`)) // Red fail message
  issues.forEach((issue) => {
    // issue.item is already colored by checkCompliance
    const currentFormatted =
      issue.currentValue >= 0
        ? `${chalk.red(issue.currentValue)} (${chalk.red(formatDuration(issue.currentValue))})` // Red value/duration
        : chalk.red('Not Found/Error') // Red error
    const requiredFormatted = `${chalk.green(issue.requiredValue)} (${chalk.green(formatDuration(issue.requiredValue))})` // Green value/duration

    console.log(`\n- ${chalk.cyan(issue.type)}: ${issue.item}`) // Cyan type, item color from source
    console.log(`    Current: ${currentFormatted}`)
    console.log(`    Required: >= ${requiredFormatted}`)
    if (issue.details) {
      console.log(`    Details: ${chalk.gray(issue.details)}`) // Gray details
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
      chalk.blue('\nConnecting to RPC endpoint:'), // Blue label
      chalk.gray(RPC_URL), // Gray value
    )
    console.log(
      chalk.blue('Network:'), // Blue label
      chalk.gray(`${network.name} (Chain ID: ${network.chainId})`), // Gray value
    )
    console.log(
      chalk.blue('AccessManager contract:'), // Blue label
      chalk.gray(ACCESS_MANAGER_ADDRESS), // Gray value
    )

    // --- Parallel Data Fetching ---
    // Fetch roles and targets first as operations/compliance depend on them
    const [roleResult, targetResult] = await Promise.all([
      fetchRoleData(accessManager, fromBlock),
      fetchTargetData(accessManager, fromBlock),
    ])

    const { rolesData, rolesByActor } = roleResult
    const { targetDataMap, roleToTargetFunctions } = targetResult

    // Fetch operations and external delays in parallel
    const [operationsResult, externalDelaysResult] = await Promise.all([
      fetchOperationsData(accessManager, fromBlock), // Depends on accurate role/target names potentially
      fetchExternalDelays(provider),
    ])

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
    console.error(chalk.red('\n--- Fatal Error during scan ---')) // Red error
    if (error instanceof Error) {
      console.error(chalk.red(error.stack || error.message)) // Red error
    } else {
      console.error(chalk.red(String(error))) // Red error
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
