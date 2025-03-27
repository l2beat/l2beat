import chalk from 'chalk'
import { ethers } from 'ethers'
import { Interface } from 'ethers/lib/utils'

// -------------------------
// CONFIGURATION
// -------------------------

const RPC_URL = 'https://rpc.kinto-rpc.com'
const ACCESS_MANAGER_ADDRESS = '0xacC000818e5Bbd911D5d449aA81CB5cA24024739'

// --- NEW: Addresses for specific checks ---
const KINTO_ID_ADDRESS = '0xf369f78e3a0492cc4e96a90dae0728a38498e9c7' // Using the existing KintoID target address
const KINTO_WALLET_EXAMPLE_ADDRESS =
  '0x2e2b1c42e38f5af81771e65d87729e57abd1337a' // Using Kinto Multisig 2 as example
const SECURITY_COUNCIL_ADDRESS =
  '0x28fc10e12a78f986c78f973fc70ed88072b34c8e'.toLowerCase() // Security Council Actor address

// --- NEW: Minimum delay requirement ---
const MIN_DELAY_SECONDS = 1036800 // 12 days in seconds

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
  '0x2e2b1c42e38f5af81771e65d87729e57abd1337a': 'Kinto Multisig 2', // Also used as KintoWallet Example
  '0x28fc10e12a78f986c78f973fc70ed88072b34c8e': 'SecurityCouncil',
  '0x010600ff5f36c8ef3b6aaf2a88c2de85c798594a': 'NioGovernor',
  // Targets
  '0x8a4720488ca32f1223ccfe5a087e250fe3bc5d75': 'KintoWalletFactory',
  '0x5a2b641b84b0230c8e75f55d5afd27f4dbd59d5b': 'KintoAppRegistry',
  '0xf369f78e3a0492cc4e96a90dae0728a38498e9c7': 'KintoID', // Also used as KintoID contract for EXIT_WINDOW_PERIOD
  '0x793500709506652fcc61f0d2d0fda605638d4293': 'Treasury',
  '0xacc000818e5bbd911d5d449aa81cb5ca24024739': 'AccessManager',
}

// Function selector mapping
const functionSignatures: { [selector: string]: string } = {
  // Upgrade functions
  [getSelector('upgradeAllWalletImplementations(address)')]:
    'upgradeAllWalletImplementations(address)',
  [getSelector('upgradeTo(address)')]: 'upgradeTo(address)',
  [getSelector('updateSystemApps(address[])')]: 'updateSystemApps(address[])',
  [getSelector('updateSystemContracts(address[])')]:
    'updateSystemContracts(address[])',
  [getSelector('updateReservedContracts(address[])')]:
    'updateReservedContracts(address[])',

  // --- NEW: KintoID & KintoWallet functions ---
  '0xd00bb535': 'EXIT_WINDOW_PERIOD()',
  '0x8b1b3b45': 'RECOVERY_TIME()',

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
}

// -------------------------
// TYPES
// -------------------------

interface RoleInfo {
  roleId: string
  executionDelay: number
  since: number
  pendingDelay: number
  pendingEffect: number
}

interface RoleData {
  id: string
  currentGrantDelay: number
  pendingGrantDelay?: {
    newDelay: number
    effect: number
  }
  admin?: string
  guardian?: string
  members: Map<string, RoleInfo>
}

interface TargetData {
  adminDelay: number
  closed: boolean
  functions: { [roleId: string]: Set<string> }
  pendingAdminDelayChanges?: Array<{ newDelay: number; effect: number }>
}

interface ScheduledOperation {
  operationId: string
  nonce: number
  schedule: number
  caller: string
  target: string
  data: string
}

// --- NEW: Type for non-compliant items ---
interface NonCompliantItem {
  item: string
  address?: string
  role?: string
  actual: number
  expected: number
}

// -------------------------
// HELPER FUNCTIONS
// -------------------------

function bnToNumber(value: ethers.BigNumber | number): number {
  if (typeof value === 'number') return value
  // Handle potential overflow for large BigNumbers if necessary, though delays should fit in JS number
  try {
    return value.toNumber()
  } catch (_e) {
    console.warn(
      chalk.yellow(
        `Warning: BigNumber ${value.toString()} too large for JS number, returning as string.`,
      ),
    )
    return Number.MAX_SAFE_INTEGER // Or handle as string/BigNumber object
  }
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

function formatDuration(seconds: number): string {
  if (seconds < 0) return 'Invalid duration'
  if (seconds === 0) return '0s'

  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  const parts: string[] = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`) // Show seconds if it's non-zero or if nothing else is shown

  return parts.join(' ')
}

// Function to decode operation data for known function selectors
function decodeOperationData(selector: string, data: string): string {
  try {
    // Find the function signature corresponding to the selector
    const functionName = functionSignatures[selector]
    if (!functionName) {
      return selector // Return selector if signature is unknown
    }

    // Check if the function has parameters (contains '(')
    if (!functionName.includes('(')) {
      return functionName // Return just the name if no parameters
    }

    // Basic decoding for known AccessManager functions
    const iface = new Interface(accessManagerAbi) // Use AccessManager ABI for decoding its functions
    const decoded = iface.parseTransaction({ data })

    if (decoded) {
      const argsString = decoded.args
        .map((arg, index) => {
          const paramType = decoded.functionFragment.inputs[index].type
          if (paramType === 'address') {
            return formatAddress(arg.toString())
          } else if (
            paramType === 'uint64' &&
            [
              'grantRole',
              'setRoleAdmin',
              'setRoleGuardian',
              'setTargetFunctionRole',
            ].includes(decoded.name)
          ) {
            const roleName = roleNames[arg.toString()] || arg.toString()
            return chalk.yellow(roleName)
          } else if (
            (paramType === 'uint32' || paramType === 'uint48') &&
            [
              'grantRole',
              'setGrantDelay',
              'setTargetAdminDelay',
              'schedule',
            ].includes(decoded.name)
          ) {
            const numValue = bnToNumber(arg)
            // Check if it looks like a duration (e.g., > 60 seconds)
            if (numValue > 60) {
              return `${chalk.green(numValue)} (${chalk.green(formatDuration(numValue))})`
            } else {
              return chalk.green(numValue.toString())
            }
          } else if (Array.isArray(arg)) {
            if (paramType === 'address[]') {
              return `[${arg.map((a) => formatAddress(a.toString())).join(', ')}]`
            }
            return `[${arg.join(', ')}]` // Basic array formatting
          }
          return arg.toString() // Default formatting
        })
        .join(', ')

      return `${decoded.name}(${argsString})`
    }

    // Fallback for other functions if direct decoding fails or is not specific enough
    return functionName
  } catch (_error) {
    // If decoding fails, just return the function signature or selector
    // console.warn(`Decoding failed for selector ${selector}:`, error);
    return functionSignatures[selector] || selector
  }
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
  // Include functions called by schedule for decoding
  'function grantRole(uint64 roleId, address account, uint32 executionDelay)',
  'function revokeRole(uint64 roleId, address account)',
  'function setTargetAdminDelay(address target, uint32 newDelay)',
  'function setTargetClosed(address target, bool closed)',
  'function setGrantDelay(uint64 roleId, uint32 newDelay)',
]

// --- NEW: ABI fragments for KintoID and KintoWallet ---
const kintoIdAbi = ['function EXIT_WINDOW_PERIOD() view returns (uint256)']

const kintoWalletAbi = ['function RECOVERY_TIME() view returns (uint256)']

// -------------------------
// DATA FETCHING FUNCTIONS
// -------------------------

// Fetch role-related data
async function fetchRoleData(
  accessManager: ethers.Contract,
  fromBlock: number,
): Promise<{
  rolesData: Map<string, RoleData>
  rolesByActor: { [account: string]: Array<RoleInfo> }
  roleToTargetFunctions: { [roleId: string]: { [target: string]: Set<string> } }
}> {
  console.log(chalk.bold('\nFetching role events...'))

  // Initialize return objects
  const rolesData = new Map<string, RoleData>()
  const rolesByActor: { [account: string]: Array<RoleInfo> } = {}
  const roleToTargetFunctions: {
    [roleId: string]: { [target: string]: Set<string> }
  } = {}

  // Fetch role grant and revoke events
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

  // Fetch role admin and guardian changes
  console.log(chalk.magenta('- Querying RoleAdminChanged events...'))
  const roleAdminChangedEvents = await accessManager.queryFilter(
    'RoleAdminChanged',
    fromBlock,
    'latest',
  )
  console.log(
    chalk.green(
      `- Found ${roleAdminChangedEvents.length} RoleAdminChanged events`,
    ),
  )

  console.log(chalk.magenta('- Querying RoleGuardianChanged events...'))
  const roleGuardianChangedEvents = await accessManager.queryFilter(
    'RoleGuardianChanged',
    fromBlock,
    'latest',
  )
  console.log(
    chalk.green(
      `- Found ${roleGuardianChangedEvents.length} RoleGuardianChanged events`,
    ),
  )

  // Fetch role grant delay changes
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

  // Process role events to build a mapping of accounts per role
  const accountsPerRole: { [role: string]: Set<string> } = {}
  for (const event of roleGrantedEvents) {
    if (!event.args) continue
    const roleId = event.args.roleId.toString()
    const account = event.args.account.toLowerCase()

    // Initialize role data structure if not exists
    if (!rolesData.has(roleId)) {
      rolesData.set(roleId, {
        id: roleId,
        currentGrantDelay: 0,
        members: new Map(),
      })
    }

    // Initialize accounts set for this role if not exists
    if (!accountsPerRole[roleId]) accountsPerRole[roleId] = new Set()
    accountsPerRole[roleId].add(account)
  }

  for (const event of roleRevokedEvents) {
    if (!event.args) continue
    const roleId = event.args.roleId.toString()
    const account = event.args.account.toLowerCase()
    // Find latest grant event for this role/account before this revocation
    let grantTimestamp = 0
    for (let i = roleGrantedEvents.length - 1; i >= 0; i--) {
      const grantEvent = roleGrantedEvents[i]
      if (
        grantEvent.args &&
        grantEvent.args.roleId.toString() === roleId &&
        grantEvent.args.account.toLowerCase() === account &&
        grantEvent.blockNumber < event.blockNumber
      ) {
        grantTimestamp = grantEvent.blockNumber // Use block number for ordering
        break
      }
    }

    // Only remove if this revoke event is later than the latest grant event
    if (event.blockNumber > grantTimestamp) {
      accountsPerRole[roleId]?.delete(account)
    }
  }

  // Process role admin and guardian changes
  const latestAdminChanges: {
    [roleId: string]: { adminRoleId: string; blockNumber: number }
  } = {}
  for (const event of roleAdminChangedEvents) {
    if (!event.args) continue
    const roleId = event.args.roleId.toString()
    const adminRoleId = event.args.admin.toString()
    if (
      !latestAdminChanges[roleId] ||
      event.blockNumber > latestAdminChanges[roleId].blockNumber
    ) {
      latestAdminChanges[roleId] = {
        adminRoleId,
        blockNumber: event.blockNumber,
      }
    }
  }
  for (const roleId in latestAdminChanges) {
    if (!rolesData.has(roleId)) {
      rolesData.set(roleId, {
        id: roleId,
        currentGrantDelay: 0,
        members: new Map(),
      })
    }
    const roleData = rolesData.get(roleId)
    if (roleData) roleData.admin = latestAdminChanges[roleId].adminRoleId
  }

  const latestGuardianChanges: {
    [roleId: string]: { guardianRoleId: string; blockNumber: number }
  } = {}
  for (const event of roleGuardianChangedEvents) {
    if (!event.args) continue
    const roleId = event.args.roleId.toString()
    const guardianRoleId = event.args.guardian.toString()
    if (
      !latestGuardianChanges[roleId] ||
      event.blockNumber > latestGuardianChanges[roleId].blockNumber
    ) {
      latestGuardianChanges[roleId] = {
        guardianRoleId,
        blockNumber: event.blockNumber,
      }
    }
  }
  for (const roleId in latestGuardianChanges) {
    if (!rolesData.has(roleId)) {
      rolesData.set(roleId, {
        id: roleId,
        currentGrantDelay: 0,
        members: new Map(),
      })
    }
    const roleData = rolesData.get(roleId)
    if (roleData)
      roleData.guardian = latestGuardianChanges[roleId].guardianRoleId
  }

  // Process role grant delay changes (consider latest event per role)
  const latestGrantDelayChanges: {
    [roleId: string]: { delay: number; since: number; blockNumber: number }
  } = {}
  for (const event of roleGrantDelayChangedEvents) {
    if (!event.args) continue
    const roleId = event.args.roleId.toString()
    if (
      !latestGrantDelayChanges[roleId] ||
      event.blockNumber > latestGrantDelayChanges[roleId].blockNumber
    ) {
      latestGrantDelayChanges[roleId] = {
        delay: bnToNumber(event.args.delay),
        since: bnToNumber(event.args.since),
        blockNumber: event.blockNumber,
      }
    }
  }

  // Apply latest grant delay changes
  const currentTimestamp = Math.floor(Date.now() / 1000)
  for (const roleId in latestGrantDelayChanges) {
    const change = latestGrantDelayChanges[roleId]
    if (!rolesData.has(roleId)) {
      rolesData.set(roleId, {
        id: roleId,
        currentGrantDelay: 0,
        members: new Map(),
      })
    }
    const roleData = rolesData.get(roleId)!

    // Get current delay from contract to be sure
    try {
      const currentDelayFromContract =
        await accessManager.getRoleGrantDelay(roleId)
      roleData.currentGrantDelay = bnToNumber(currentDelayFromContract)
    } catch (error) {
      console.error(
        `Error fetching current grant delay for role ${roleId}:`,
        error,
      )
      // Fallback to using event data if contract call fails
      if (change.since <= currentTimestamp) {
        roleData.currentGrantDelay = change.delay
      } else {
        // If the latest event is pending, fetch the *previous* delay if possible or assume 0
        roleData.currentGrantDelay = 0 // Simplified assumption
      }
    }

    // Set pending delay if the latest change is in the future
    if (change.since > currentTimestamp) {
      roleData.pendingGrantDelay = {
        newDelay: change.delay,
        effect: change.since,
      }
    } else {
      // Ensure no stale pending delay if the latest change is already effective
      roleData.pendingGrantDelay = undefined
    }
  }

  // Fetch current role data for all potentially active members identified from events
  console.log(chalk.magenta('- Fetching current role data for actors...'))
  const allPotentialMembers = new Set<string>()
  Object.values(accountsPerRole).forEach((set) =>
    set.forEach((acc) => allPotentialMembers.add(acc)),
  )

  for (const account of allPotentialMembers) {
    for (const roleId of Object.keys(accountsPerRole)) {
      // Check roles this account *might* have had
      try {
        // Use hasRole to confirm current membership and get current executionDelay directly
        const [isMember, executionDelayBN] = await accessManager.hasRole(
          roleId,
          account,
        )

        if (isMember) {
          const currentDelay = bnToNumber(executionDelayBN)
          const roleData = rolesData.get(roleId) // Should exist if we tracked the role

          // Fetch detailed access info only if needed (e.g., for pending changes)
          // Often hasRole is sufficient for current state. Let's get detailed info anyway for pending.
          const accessData = await accessManager.getAccess(roleId, account)
          const since = bnToNumber(accessData[0])
          // const currentDelayFromGetAccess = bnToNumber(accessData[1]); // Can sanity check against hasRole result
          const pendingDelay = bnToNumber(accessData[2])
          const effect = bnToNumber(accessData[3])

          const roleInfo: RoleInfo = {
            roleId,
            executionDelay: currentDelay, // Use delay from hasRole as primary
            since,
            pendingDelay,
            pendingEffect: effect,
          }

          // Update rolesByActor map
          if (!rolesByActor[account]) rolesByActor[account] = []
          // Avoid duplicates if re-processing
          if (!rolesByActor[account].some((r) => r.roleId === roleId)) {
            rolesByActor[account].push(roleInfo)
          }

          // Update rolesData map members
          if (roleData) {
            roleData.members.set(account, roleInfo)
          }
        } else {
          // Explicitly remove if hasRole returns false, in case event processing was imperfect
          const roleData = rolesData.get(roleId)
          if (roleData) {
            roleData.members.delete(account)
          }
          if (rolesByActor[account]) {
            rolesByActor[account] = rolesByActor[account].filter(
              (r) => r.roleId !== roleId,
            )
            if (rolesByActor[account].length === 0) {
              delete rolesByActor[account]
            }
          }
        }
      } catch (error) {
        const errour = error as Error
        console.error(
          chalk.red(
            `- Error fetching role data for ${formatAddress(account)} and role ${roleNames[roleId] || roleId}:`,
          ),
          errour.message,
        )
      }
    }
  }

  // Fetch current grant delays for *all* roles identified to ensure data is accurate
  console.log(chalk.magenta('- Fetching current grant delays for all roles...'))
  for (const roleId of rolesData.keys()) {
    try {
      const grantDelay = await accessManager.getRoleGrantDelay(roleId)
      const roleData = rolesData.get(roleId)
      if (roleData) {
        roleData.currentGrantDelay = bnToNumber(grantDelay)
        // Clear pending if it's now effective (double check)
        if (
          roleData.pendingGrantDelay &&
          roleData.pendingGrantDelay.effect <= currentTimestamp
        ) {
          roleData.pendingGrantDelay = undefined
        }
      }
    } catch (error) {
      const errour = error as Error
      console.error(
        chalk.red(
          `- Error fetching grant delay for role ${roleNames[roleId] || roleId}:`,
        ),
        errour.message,
      )
    }
  }

  console.log(
    chalk.green(
      `- Found ${Object.keys(rolesByActor).length} actors with active roles`,
    ),
  )
  console.log(chalk.green(`- Found ${rolesData.size} distinct roles`))

  return { rolesData, rolesByActor, roleToTargetFunctions }
}

// Fetch target configuration data
async function fetchTargetData(
  accessManager: ethers.Contract,
  fromBlock: number,
): Promise<{
  targetData: { [target: string]: TargetData }
  roleToTargetFunctions: { [roleId: string]: { [target: string]: Set<string> } }
}> {
  console.log(chalk.bold('\nFetching target events...'))

  const targetData: { [target: string]: TargetData } = {}
  const roleToTargetFunctions: {
    [roleId: string]: { [target: string]: Set<string> }
  } = {}

  // --- TargetFunctionRoleUpdated ---
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

  // Process TargetFunctionRoleUpdated: Keep track of the latest role per function
  const latestFunctionRoles: {
    [target: string]: {
      [selector: string]: { roleId: string; blockNumber: number }
    }
  } = {}
  for (const event of targetFuncRoleEvents) {
    if (!event.args) continue
    const target = event.args.target.toLowerCase()
    const selector = event.args.selector
    const roleId = event.args.roleId.toString()

    if (!latestFunctionRoles[target]) latestFunctionRoles[target] = {}

    if (
      !latestFunctionRoles[target][selector] ||
      event.blockNumber > latestFunctionRoles[target][selector].blockNumber
    ) {
      latestFunctionRoles[target][selector] = {
        roleId,
        blockNumber: event.blockNumber,
      }
    }
  }

  // Build final targetData.functions and roleToTargetFunctions based on latest roles
  for (const target in latestFunctionRoles) {
    if (!targetData[target]) {
      targetData[target] = { adminDelay: 0, closed: false, functions: {} }
    }
    for (const selector in latestFunctionRoles[target]) {
      const { roleId } = latestFunctionRoles[target][selector]
      // If roleId is 0 or PUBLIC_ROLE, it means the role was effectively removed or made public, handle as needed
      // For this script, we primarily care about non-zero roles granting specific permissions.
      // Let's assume roleId '0' means no specific role assigned (or public if PUBLIC_ROLE is 0, which it isn't here).
      if (
        roleId !== '0' &&
        roleId !== roleNames['18446744073709551615'] /* PUBLIC_ROLE ID */
      ) {
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
    }
  }

  // --- TargetAdminDelayUpdated ---
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

  // Process TargetAdminDelayUpdated: Find the latest change per target
  const latestAdminDelayChanges: {
    [target: string]: { delay: number; since: number; blockNumber: number }
  } = {}
  const allTargets = new Set<string>(Object.keys(targetData)) // Include targets from function roles
  targetAdminDelayEvents.forEach((event) =>
    allTargets.add(event.args?.target.toLowerCase()),
  ) // Add targets from delay events

  for (const event of targetAdminDelayEvents) {
    if (!event.args) continue
    const target = event.args.target.toLowerCase()
    if (
      !latestAdminDelayChanges[target] ||
      event.blockNumber > latestAdminDelayChanges[target].blockNumber
    ) {
      latestAdminDelayChanges[target] = {
        delay: bnToNumber(event.args.delay),
        since: bnToNumber(event.args.since),
        blockNumber: event.blockNumber,
      }
    }
  }

  // Fetch current admin delays and closures for all relevant targets
  console.log(
    chalk.magenta(
      '- Fetching current admin delays and closures for targets...',
    ),
  )
  const currentTimestamp = Math.floor(Date.now() / 1000)
  for (const target of allTargets) {
    if (!targetData[target]) {
      targetData[target] = { adminDelay: 0, closed: false, functions: {} }
    }
    try {
      // Fetch current state directly from the contract
      const adminDelayBN = await accessManager.getTargetAdminDelay(target)
      targetData[target].adminDelay = bnToNumber(adminDelayBN)
      const closed = await accessManager.isTargetClosed(target)
      targetData[target].closed = closed

      // Check the latest event for pending changes
      const latestChange = latestAdminDelayChanges[target]
      if (latestChange && latestChange.since > currentTimestamp) {
        if (!targetData[target].pendingAdminDelayChanges) {
          targetData[target].pendingAdminDelayChanges = []
        }
        // Avoid duplicates if reprocessing
        if (
          !targetData[target].pendingAdminDelayChanges?.some(
            (c) =>
              c.effect === latestChange.since &&
              c.newDelay === latestChange.delay,
          )
        ) {
          targetData[target].pendingAdminDelayChanges?.push({
            newDelay: latestChange.delay,
            effect: latestChange.since,
          })
        }
      } else if (latestChange && latestChange.since <= currentTimestamp) {
        // If the latest change is effective, ensure no pending change is recorded from older events
        targetData[target].pendingAdminDelayChanges = undefined
      }
    } catch (error) {
      const errour = error as Error
      console.error(
        chalk.red(
          `- Error fetching config for target ${formatAddress(target)}:`,
        ),
        errour.message,
      )
      // Assign default/event-based values if contract call fails
      const latestChange = latestAdminDelayChanges[target]
      if (latestChange) {
        if (latestChange.since <= currentTimestamp) {
          targetData[target].adminDelay = latestChange.delay
        } else {
          targetData[target].adminDelay = 0 // Or fetch previous state if possible
          targetData[target].pendingAdminDelayChanges = [
            { newDelay: latestChange.delay, effect: latestChange.since },
          ]
        }
      } else {
        targetData[target].adminDelay = 0 // Default if no events found and call failed
      }
      targetData[target].closed = false // Default assumption
    }
  }

  console.log(
    chalk.green(
      `- Found configuration data for ${Object.keys(targetData).length} targets`,
    ),
  )

  return { targetData, roleToTargetFunctions }
}

// Fetch scheduled operations and pending changes
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
  console.log(chalk.bold('\nFetching queued operations...'))

  // Fetch operation events
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

  // Build a map of executed or cancelled operations (operationId -> nonce)
  const executedOrCanceled = new Map<string, number>()
  for (const event of operationExecutedEvents) {
    if (!event.args) continue
    executedOrCanceled.set(event.args.operationId, bnToNumber(event.args.nonce))
  }
  for (const event of operationCanceledEvents) {
    if (!event.args) continue
    // Only add if nonce is greater or equal (in case of re-scheduling with same ID)
    const existingNonce = executedOrCanceled.get(event.args.operationId)
    const currentNonce = bnToNumber(event.args.nonce)
    if (existingNonce === undefined || currentNonce >= existingNonce) {
      executedOrCanceled.set(event.args.operationId, currentNonce)
    }
  }

  // Filter for pending operations by checking against executed/canceled map and schedule time
  console.log(chalk.magenta('- Filtering pending operations...'))
  const scheduledOps: ScheduledOperation[] = []
  const currentTimestamp = Math.floor(Date.now() / 1000)
  const seenOpIds = new Set<string>() // Track ops added to avoid duplicates from re-schedules

  // Process in reverse to easily find the latest schedule for a given opId/nonce
  for (let i = operationScheduledEvents.length - 1; i >= 0; i--) {
    const event = operationScheduledEvents[i]
    if (!event.args) continue

    const opId = event.args.operationId
    const nonce = bnToNumber(event.args.nonce)
    const schedule = bnToNumber(event.args.schedule)
    const uniqueOpIdentifier = `${opId}-${nonce}` // Use ID + Nonce for uniqueness

    // Skip if already processed a later schedule for this ID/Nonce or if it's executed/canceled
    if (seenOpIds.has(uniqueOpIdentifier)) {
      continue
    }

    const finalNonce = executedOrCanceled.get(opId)
    const isDone = finalNonce !== undefined && nonce <= finalNonce

    // Check if it's actually pending (not done and schedule time not passed, or just scheduled)
    // We include operations even if schedule time might seem passed, as `canCall` is the ultimate check.
    // But we definitely exclude executed/cancelled ones.
    if (!isDone) {
      scheduledOps.push({
        operationId: opId,
        nonce: nonce,
        schedule: schedule,
        caller: event.args.caller.toLowerCase(),
        target: event.args.target.toLowerCase(),
        data: event.args.data,
      })
      seenOpIds.add(uniqueOpIdentifier) // Mark as processed
    }
  }
  scheduledOps.reverse() // Restore chronological order

  console.log(chalk.green(`- Found ${scheduledOps.length} pending operations`))

  // Fetch role grant delay changes and filter for pending ones
  console.log(chalk.magenta('- Filtering pending role grant delay changes...'))
  const roleGrantDelayChangedEvents = await accessManager.queryFilter(
    'RoleGrantDelayChanged',
    fromBlock,
    'latest',
  )

  const pendingRoleGrantChanges: Array<{
    roleId: string
    newDelay: number
    effect: number
  }> = []
  const latestPendingGrantChanges: {
    [roleId: string]: { newDelay: number; effect: number; blockNumber: number }
  } = {}

  // Find the latest *pending* change for each role
  for (const event of roleGrantDelayChangedEvents) {
    if (!event.args) continue
    const effect = bnToNumber(event.args.since)
    if (effect > currentTimestamp) {
      const roleId = event.args.roleId.toString()
      if (
        !latestPendingGrantChanges[roleId] ||
        event.blockNumber > latestPendingGrantChanges[roleId].blockNumber
      ) {
        latestPendingGrantChanges[roleId] = {
          newDelay: bnToNumber(event.args.delay),
          effect: effect,
          blockNumber: event.blockNumber,
        }
      }
    }
  }

  // Add the latest pending changes to the result array
  for (const roleId in latestPendingGrantChanges) {
    const change = latestPendingGrantChanges[roleId]
    pendingRoleGrantChanges.push({
      roleId: roleId,
      newDelay: change.newDelay,
      effect: change.effect,
    })
  }

  console.log(
    chalk.green(
      `- Found ${pendingRoleGrantChanges.length} pending role grant delay changes`,
    ),
  )

  return { scheduledOps, pendingRoleGrantChanges }
}

// -------------------------
// REPORTING FUNCTIONS
// -------------------------

// Generate roles overview report
function generateRolesOverviewReport(rolesData: Map<string, RoleData>): void {
  console.log(chalk.bold('\n================ Roles Overview ================'))

  if (rolesData.size === 0) {
    console.log(chalk.red('No roles found.'))
    return
  }

  // Sort roles by ID for consistent display
  const sortedRoles = Array.from(rolesData.values()).sort((a, b) => {
    // Try to sort numerically if possible, fallback to string sort
    try {
      return parseInt(a.id) - parseInt(b.id)
    } catch {
      return a.id.localeCompare(b.id)
    }
  })

  for (const roleData of sortedRoles) {
    const roleName = roleNames[roleData.id] || roleData.id
    console.log(`\n${chalk.yellow(roleName)} (ID: ${chalk.gray(roleData.id)}):`)

    // Display role grant delay
    console.log(
      `  ${chalk.magenta('roleGrantDelay')}: ${chalk.green(roleData.currentGrantDelay)} (${chalk.green(formatDuration(roleData.currentGrantDelay))})`,
    )

    // Display pending grant delay change if any
    if (roleData.pendingGrantDelay) {
      console.log(
        `  ${chalk.magenta('pendingGrantDelay')}: ${chalk.green(roleData.pendingGrantDelay.newDelay)} (${chalk.green(formatDuration(roleData.pendingGrantDelay.newDelay))}) effective at ${chalk.cyan(new Date(roleData.pendingGrantDelay.effect * 1000).toISOString())}`,
      )
    }

    // Display admin role if available
    if (roleData.admin) {
      const adminRoleName = roleNames[roleData.admin] || roleData.admin
      console.log(
        `  ${chalk.magenta('adminRole')}: ${chalk.yellow(adminRoleName)} (${chalk.gray(roleData.admin)})`,
      )
    }

    // Display guardian role if available
    if (roleData.guardian) {
      const guardianRoleName = roleNames[roleData.guardian] || roleData.guardian
      console.log(
        `  ${chalk.magenta('guardianRole')}: ${chalk.yellow(guardianRoleName)} (${chalk.gray(roleData.guardian)})`,
      )
    }

    // List all members with this role
    if (roleData.members.size > 0) {
      console.log(`  members (${roleData.members.size}):`)
      // Sort members by address for consistent display
      const sortedMembers = Array.from(roleData.members.entries()).sort(
        ([addrA], [addrB]) => addrA.localeCompare(addrB),
      )

      for (const [account, memberInfo] of sortedMembers) {
        console.log(
          `    ${formatAddress(account)}: ${chalk.magenta('executionDelay')}: ${chalk.green(memberInfo.executionDelay)} (${chalk.green(formatDuration(memberInfo.executionDelay))})`,
        )

        // Display pending execution delay change if any
        const currentTimestamp = Math.floor(Date.now() / 1000)
        if (
          memberInfo.pendingDelay !== memberInfo.executionDelay && // Only show if different
          memberInfo.pendingEffect > currentTimestamp
        ) {
          console.log(
            `      ${chalk.magenta('pendingExecutionDelay')}: ${chalk.green(memberInfo.pendingDelay)} (${chalk.green(formatDuration(memberInfo.pendingDelay))}) effective at ${chalk.cyan(new Date(memberInfo.pendingEffect * 1000).toISOString())}`,
          )
        }
      }
    } else {
      console.log(`  ${chalk.magenta('members')}: None`)
    }
  }
}

// Generate actors and roles report
function generateActorsReport(
  rolesByActor: { [account: string]: Array<RoleInfo> },
  roleToTargetFunctions: {
    [roleId: string]: { [target: string]: Set<string> }
  },
): void {
  console.log(chalk.bold('\n================ Actors ================'))

  if (Object.keys(rolesByActor).length === 0) {
    console.log(chalk.red('\nNo actors with active roles found.'))
    return
  }

  // Sort actors by address
  const sortedActors = Object.keys(rolesByActor).sort((a, b) =>
    a.localeCompare(b),
  )

  for (const account of sortedActors) {
    console.log(`\n${formatAddress(account)}:`)
    // Sort roles for each actor
    const sortedRoles = rolesByActor[account].sort((a, b) =>
      (roleNames[a.roleId] || a.roleId).localeCompare(
        roleNames[b.roleId] || b.roleId,
      ),
    )

    for (const roleInfo of sortedRoles) {
      const roleName = roleNames[roleInfo.roleId] || roleInfo.roleId
      const delayStr = `${chalk.green(roleInfo.executionDelay)} (${chalk.green(formatDuration(roleInfo.executionDelay))})`
      console.log(
        `  ${chalk.yellow(roleName)}: ${chalk.magenta('executionDelay')}: ${delayStr}`,
      )

      // Display pending execution delay change if any
      const currentTimestamp = Math.floor(Date.now() / 1000)
      if (
        roleInfo.pendingDelay !== roleInfo.executionDelay && // Only show if different
        roleInfo.pendingEffect > currentTimestamp
      ) {
        console.log(
          `      ${chalk.magenta('pendingExecutionDelay')}: ${chalk.green(roleInfo.pendingDelay)} (${chalk.green(formatDuration(roleInfo.pendingDelay))}) effective at ${chalk.cyan(new Date(roleInfo.pendingEffect * 1000).toISOString())}`,
        )
      }

      if (roleToTargetFunctions[roleInfo.roleId]) {
        console.log('    Callable targets and functions:')
        const targets = roleToTargetFunctions[roleInfo.roleId]
        if (Object.keys(targets).length === 0) {
          console.log(
            chalk.grey(
              '      No targets or functions configured for this role on this actor.',
            ),
          )
        } else {
          // Sort targets by address
          const sortedTargets = Object.keys(targets).sort((a, b) =>
            a.localeCompare(b),
          )
          for (const target of sortedTargets) {
            console.log(`      Target ${formatAddress(target)}:`)
            // Sort functions alphabetically
            const functions = Array.from(targets[target])
              .map((sel) => functionSignatures[sel] || sel)
              .sort()
            const formattedFunctions = functions.map((f) => chalk.gray(f))
            console.log(`        Functions: ${formattedFunctions.join(', ')}`)
          }
        }
      }
    }
  }
}

// Generate targets configuration report
function generateTargetsReport(targetData: {
  [target: string]: TargetData
}): void {
  console.log(chalk.bold('\n================ Targets ================'))

  if (Object.keys(targetData).length === 0) {
    console.log(chalk.red('\nNo target configurations found.'))
    return
  }

  // Sort targets by address
  const sortedTargets = Object.keys(targetData).sort((a, b) =>
    a.localeCompare(b),
  )

  for (const target of sortedTargets) {
    const data = targetData[target]
    console.log(`\n${formatAddress(target)}:`)
    console.log(
      `  ${chalk.magenta('targetAdminDelay')}: ${chalk.green(data.adminDelay)} (${chalk.green(formatDuration(data.adminDelay))})`,
    )
    // Display pending admin delay changes if any
    const currentTimestamp = Math.floor(Date.now() / 1000)
    if (data.pendingAdminDelayChanges) {
      data.pendingAdminDelayChanges.forEach((change) => {
        if (change.effect > currentTimestamp) {
          console.log(
            `  ${chalk.magenta('pendingAdminDelay')}: ${chalk.green(change.newDelay)} (${chalk.green(formatDuration(change.newDelay))}) effective at ${chalk.cyan(new Date(change.effect * 1000).toISOString())}`,
          )
        }
      })
    }

    console.log(`  ${chalk.magenta('Closed')}: ${chalk.yellow(data.closed)}`)
    console.log('  Function Roles:')
    if (Object.keys(data.functions).length === 0) {
      console.log(
        chalk.grey('    No function roles configured for this target'),
      )
    } else {
      // Sort roles by name
      const sortedRoleIds = Object.keys(data.functions).sort((a, b) =>
        (roleNames[a] || a).localeCompare(roleNames[b] || b),
      )
      for (const roleId of sortedRoleIds) {
        const roleName = roleNames[roleId] || roleId
        // Sort functions alphabetically
        const funcs = Array.from(data.functions[roleId])
          .map((sel) => functionSignatures[sel] || sel)
          .sort()
        const formattedFuncs = funcs.map((f) => chalk.gray(f))
        console.log(
          `    ${chalk.yellow(roleName)}: ${formattedFuncs.join(', ')}`,
        )
      }
    }
  }
}

// Generate pending changes and queued operations report
function generatePendingChangesReport(
  // rolesByActor: { [account: string]: Array<RoleInfo> }, // No longer needed here, shown in Actors/Roles sections
  // targetData: { [target: string]: TargetData }, // No longer needed here, shown in Targets section
  scheduledOps: ScheduledOperation[],
  pendingRoleGrantChanges: Array<{
    roleId: string
    newDelay: number
    effect: number
  }>,
): void {
  console.log(
    chalk.bold(
      '\n============= Queued Operations and Pending Role Grant Delay Changes =============',
    ),
  )

  let changesFound = false
  const currentTimestamp = Math.floor(Date.now() / 1000)

  // --- Queued operations (scheduled calls) ---
  if (scheduledOps.length > 0) {
    changesFound = true
    console.log(chalk.bold('\nQueued Operations:'))
    // Sort operations by schedule time
    const sortedOps = scheduledOps.sort((a, b) => a.schedule - b.schedule)

    for (const op of sortedOps) {
      const selector = op.data.slice(0, 10).toLowerCase() // Ensure lowercase for matching
      const decodedFunction = decodeOperationData(selector, op.data)
      const isEffective = op.schedule <= currentTimestamp
      const scheduleDate = new Date(op.schedule * 1000)
      const timeColor = isEffective ? chalk.yellow : chalk.cyan // Yellow if past, cyan if future

      console.log(`\nOperation ${chalk.cyan(op.operationId)}:`)
      console.log(`    Nonce: ${chalk.yellow(op.nonce)}`)
      console.log(
        `    Scheduled for: ${timeColor(scheduleDate.toISOString())} ${isEffective ? chalk.yellow('(Ready to execute)') : ''}`,
      )
      console.log(`    Caller: ${formatAddress(op.caller)}`)
      console.log(`    Target: ${formatAddress(op.target)}`)
      console.log(`    Function: ${decodedFunction}`) // Use gray from decode function
    }
  } else {
    console.log(chalk.grey('No queued operations found.'))
  }

  // --- Pending role grant delay changes ---
  console.log(chalk.bold('\nPending Role Grant Delay Changes:'))
  if (pendingRoleGrantChanges.length > 0) {
    changesFound = true
    // Sort changes by effect time
    const sortedChanges = pendingRoleGrantChanges.sort(
      (a, b) => a.effect - b.effect,
    )
    for (const change of sortedChanges) {
      const roleName = roleNames[change.roleId] || change.roleId
      console.log(
        `  Role ${chalk.yellow(roleName)} grant delay to change to ${chalk.green(change.newDelay)} (${chalk.green(formatDuration(change.newDelay))}) effective at ${chalk.cyan(new Date(change.effect * 1000).toISOString())}`,
      )
    }
  } else {
    console.log(chalk.grey('  No pending role grant delay changes found.'))
  }

  if (!changesFound) {
    console.log(
      chalk.grey(
        '\nNo queued operations or pending role grant delay changes found.',
      ),
    )
  }
}

// --- NEW: Function to generate compliance report ---
function generateComplianceReport(
  exitWindowPeriod: number,
  recoveryTime: number,
  targetData: { [target: string]: TargetData },
  rolesData: Map<string, RoleData>,
): void {
  console.log(
    chalk.bold('\n================ Compliance Check Results ================'),
  )
  console.log(
    chalk.gray(
      `(Minimum required delay for checked items: ${MIN_DELAY_SECONDS}s / ${formatDuration(MIN_DELAY_SECONDS)})`,
    ),
  )

  const nonCompliantItems: NonCompliantItem[] = []
  const checkedTargets = [
    '0x5a2b641b84b0230c8e75f55d5afd27f4dbd59d5b', // KintoAppRegistry
    '0xf369f78e3a0492cc4e96a90dae0728a38498e9c7', // KintoID
    '0x8a4720488ca32f1223ccfe5a087e250fe3bc5d75', // KintoWalletFactory
  ]
  const checkedRoles = ['0', '8663528507529876195', '14661544942390944024'] // ADMIN_ROLE, UPGRADER_ROLE, SECURITY_COUNCIL_ROLE

  // 1. Check KintoID.EXIT_WINDOW_PERIOD
  if (exitWindowPeriod < MIN_DELAY_SECONDS) {
    nonCompliantItems.push({
      item: 'KintoID.EXIT_WINDOW_PERIOD',
      address: KINTO_ID_ADDRESS,
      actual: exitWindowPeriod,
      expected: MIN_DELAY_SECONDS,
    })
  }

  // 2. Check KintoWallet.RECOVERY_TIME
  if (recoveryTime < MIN_DELAY_SECONDS) {
    nonCompliantItems.push({
      item: `KintoWallet Example (${addressNames[KINTO_WALLET_EXAMPLE_ADDRESS] || 'Unknown'}).RECOVERY_TIME`,
      address: KINTO_WALLET_EXAMPLE_ADDRESS,
      actual: recoveryTime,
      expected: MIN_DELAY_SECONDS,
    })
  }

  // 3. Check targetAdminDelay for specific targets
  for (const targetAddress of checkedTargets) {
    const tData = targetData[targetAddress.toLowerCase()]
    if (tData) {
      if (tData.adminDelay < MIN_DELAY_SECONDS) {
        nonCompliantItems.push({
          item: `Target Admin Delay`,
          address: targetAddress,
          actual: tData.adminDelay,
          expected: MIN_DELAY_SECONDS,
        })
      }
    } else {
      console.warn(
        chalk.yellow(
          `- Warning: Target ${formatAddress(targetAddress)} not found in fetched data for compliance check.`,
        ),
      )
    }
  }

  // 4. Check executionDelay for specific roles, excluding Security Council actor
  for (const roleId of checkedRoles) {
    const rData = rolesData.get(roleId)
    if (rData && rData.members) {
      for (const [account, memberInfo] of rData.members) {
        // Exclude the Security Council actor
        if (account.toLowerCase() !== SECURITY_COUNCIL_ADDRESS) {
          if (memberInfo.executionDelay < MIN_DELAY_SECONDS) {
            nonCompliantItems.push({
              item: `Execution Delay`,
              address: account,
              role: roleNames[roleId] || roleId,
              actual: memberInfo.executionDelay,
              expected: MIN_DELAY_SECONDS,
            })
          }
        }
      }
    }
    // else {
    //    console.warn(chalk.yellow(`- Warning: Role ${roleNames[roleId] || roleId} not found or has no members for compliance check.`));
    // }
  }

  // Print results
  if (nonCompliantItems.length === 0) {
    console.log(
      chalk.green('\n✅ All checked delays meet the minimum 12d requirement.'),
    )
  } else {
    console.log(
      chalk.red(
        `\n❌ Found ${nonCompliantItems.length} item(s) below the minimum 12d delay requirement:`,
      ),
    )
    nonCompliantItems.forEach((item) => {
      const roleStr = item.role ? ` (Role: ${chalk.yellow(item.role)})` : ''
      const addressStr = item.address ? `${formatAddress(item.address)}` : ''
      const itemDescription = `${item.item}${roleStr} for ${addressStr}`
      console.log(
        `  - ${itemDescription}: ${chalk.red(item.actual)}s (${chalk.red(formatDuration(item.actual))}) - Expected >= ${chalk.green(item.expected)}s (${chalk.green(formatDuration(item.expected))})`,
      )
    })
  }
}

// -------------------------
// MAIN FUNCTION
// -------------------------

export async function runScanKintoAm(): Promise<void> {
  try {
    console.log(chalk.bold('Starting ScanKintoAm...\n'))
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
    const accessManager = new ethers.Contract(
      ACCESS_MANAGER_ADDRESS,
      accessManagerAbi,
      provider,
    )
    // --- NEW: Instantiate KintoID and KintoWallet contracts ---
    const kintoIdContract = new ethers.Contract(
      KINTO_ID_ADDRESS,
      kintoIdAbi,
      provider,
    )
    const kintoWalletExampleContract = new ethers.Contract(
      KINTO_WALLET_EXAMPLE_ADDRESS,
      kintoWalletAbi,
      provider,
    )

    const fromBlock = 0 // Start block for event queries

    console.log(chalk.blue('Connecting to RPC endpoint:'), chalk.gray(RPC_URL))
    console.log(
      chalk.blue('AccessManager contract:'),
      chalk.gray(ACCESS_MANAGER_ADDRESS),
    )

    // --- NEW: Fetch KintoID and KintoWallet constants ---
    console.log(chalk.bold('\nFetching specific contract constants...'))
    let exitWindowPeriod = -1
    let recoveryTime = -1
    try {
      const exitWindowPeriodBN = await kintoIdContract.EXIT_WINDOW_PERIOD()
      exitWindowPeriod = bnToNumber(exitWindowPeriodBN)
      console.log(
        chalk.green(
          `- Fetched KintoID.EXIT_WINDOW_PERIOD: ${exitWindowPeriod}s (${formatDuration(exitWindowPeriod)})`,
        ),
      )
    } catch (e) {
      const error = e as Error
      console.error(
        chalk.red(
          `- Error fetching KintoID.EXIT_WINDOW_PERIOD from ${KINTO_ID_ADDRESS}:`,
        ),
        error.message,
      )
    }
    try {
      const recoveryTimeBN = await kintoWalletExampleContract.RECOVERY_TIME()
      recoveryTime = bnToNumber(recoveryTimeBN)
      console.log(
        chalk.green(
          `- Fetched KintoWallet_Example.RECOVERY_TIME from ${KINTO_WALLET_EXAMPLE_ADDRESS}: ${recoveryTime}s (${formatDuration(recoveryTime)})`,
        ),
      )
    } catch (e) {
      const error = e as Error
      console.error(
        chalk.red(
          `- Error fetching KintoWallet_Example.RECOVERY_TIME from ${KINTO_WALLET_EXAMPLE_ADDRESS}:`,
        ),
        error.message,
      )
    }

    // 1. Fetch role data
    const {
      rolesData,
      rolesByActor,
      roleToTargetFunctions: roleFunctions1,
    } = await fetchRoleData(accessManager, fromBlock)

    // 2. Fetch target configuration
    const { targetData, roleToTargetFunctions: roleFunctions2 } =
      await fetchTargetData(accessManager, fromBlock)

    // Merge the two roleToTargetFunctions objects
    const roleToTargetFunctions = { ...roleFunctions1 }
    for (const roleId in roleFunctions2) {
      if (!roleToTargetFunctions[roleId]) {
        roleToTargetFunctions[roleId] = {}
      }
      for (const target in roleFunctions2[roleId]) {
        if (!roleToTargetFunctions[roleId][target]) {
          roleToTargetFunctions[roleId][target] = new Set()
        }
        for (const func of roleFunctions2[roleId][target]) {
          roleToTargetFunctions[roleId][target].add(func)
        }
      }
    }

    // 3. Fetch queued operations and pending changes
    const { scheduledOps, pendingRoleGrantChanges } = await fetchOperationsData(
      accessManager,
      fromBlock,
    )

    // 4. Generate standard reports
    generateRolesOverviewReport(rolesData)
    generateActorsReport(rolesByActor, roleToTargetFunctions)
    generateTargetsReport(targetData)
    generatePendingChangesReport(
      // rolesByActor, // No longer passed here
      // targetData, // No longer passed here
      scheduledOps,
      pendingRoleGrantChanges,
    )

    // --- NEW: 5. Generate Compliance Report ---
    generateComplianceReport(
      exitWindowPeriod,
      recoveryTime,
      targetData,
      rolesData,
    )
  } catch (error) {
    console.error(chalk.red('\nError running scan:'), error)
  }
}

// Helper to run the async function
runScanKintoAm().catch((error) => {
  console.error('Unhandled error in runScanKintoAm:', error)
  process.exit(1)
})
