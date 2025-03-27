import chalk from 'chalk'
import { ethers } from 'ethers'
import { Interface } from 'ethers/lib/utils'

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================

const RPC_URL = 'https://rpc.kinto-rpc.com'
const ACCESS_MANAGER_ADDRESS = '0xacC000818e5Bbd911D5d449aA81CB5cA24024739'

// New addresses for specific checks
const KINTO_ID_ADDRESS = '0xf369f78e3a0492cc4e96a90dae0728a38498e9c7'
const KINTO_WALLET_EXAMPLE_ADDRESS =
  '0x2e2b1c42e38f5af81771e65d87729e57abd1337a'
const SECURITY_COUNCIL_ADDRESS =
  '0x28fc10e12a78f986c78f973fc70ed88072b34c8e'.toLowerCase()

// Minimum delay requirement (12 days in seconds)
const MIN_DELAY_SECONDS = 1036800

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
  '0x2e2b1c42e38f5af81771e65d87729e57abd1337a': 'Kinto Multisig 2',
  '0x28fc10e12a78f986c78f973fc70ed88072b34c8e': 'SecurityCouncil',
  '0x010600ff5f36c8ef3b6aaf2a88c2de85c798594a': 'NioGovernor',
  '0x8a4720488ca32f1223ccfe5a087e250fe3bc5d75': 'KintoWalletFactory',
  '0x5a2b641b84b0230c8e75f55d5afd27f4dbd59d5b': 'KintoAppRegistry',
  '0xf369f78e3a0492cc4e96a90dae0728a38498e9c7': 'KintoID',
  '0x793500709506652fcc61f0d2d0fda605638d4293': 'Treasury',
  '0xacc000818e5bbd911d5d449aa81cb5ca24024739': 'AccessManager',
}

// ============================================================================
// TYPES
// ============================================================================

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
  pendingGrantDelay?: { newDelay: number; effect: number }
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

interface NonCompliantItem {
  item: string
  address?: string
  role?: string
  actual: number
  expected: number
}

// ============================================================================
// ABI FRAGMENTS
// ============================================================================

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
  'function grantRole(uint64 roleId, address account, uint32 executionDelay)',
  'function revokeRole(uint64 roleId, address account)',
  'function setTargetAdminDelay(address target, uint32 newDelay)',
  'function setTargetClosed(address target, bool closed)',
  'function setGrantDelay(uint64 roleId, uint32 newDelay)',
]

const kintoIdAbi = ['function EXIT_WINDOW_PERIOD() view returns (uint256)']
const kintoWalletAbi = ['function RECOVERY_TIME() view returns (uint256)']

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/** Convert a BigNumber or number to a JS number (with a fallback for too large numbers). */
function bnToNumber(value: ethers.BigNumber | number): number {
  if (typeof value === 'number') return value
  try {
    return value.toNumber()
  } catch {
    console.warn(
      chalk.yellow(
        `Warning: BigNumber ${value.toString()} too large for JS number, returning Number.MAX_SAFE_INTEGER.`,
      ),
    )
    return Number.MAX_SAFE_INTEGER
  }
}

/** Returns the 4-byte function selector for a given signature. */
function getSelector(signature: string): string {
  return ethers.utils.hexDataSlice(
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes(signature)),
    0,
    4,
  )
}

/** Format an address by using a friendly name if available. */
function formatAddress(address: string): string {
  const lowerAddr = address.toLowerCase()
  return addressNames[lowerAddr]
    ? `${chalk.blue(addressNames[lowerAddr])} (${chalk.gray(lowerAddr)})`
    : chalk.gray(lowerAddr)
}

/** Format a duration in seconds into a human-readable string. */
function formatDuration(seconds: number): string {
  if (seconds < 0) return 'Invalid duration'
  if (seconds === 0) return '0s'

  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  const parts = []
  if (days) parts.push(`${days}d`)
  if (hours) parts.push(`${hours}h`)
  if (minutes) parts.push(`${minutes}m`)
  if (secs || parts.length === 0) parts.push(`${secs}s`)
  return parts.join(' ')
}

/** Decodes the operation data given its selector and full data payload. */
function decodeOperationData(selector: string, data: string): string {
  try {
    const functionName = functionSignatures[selector]
    if (!functionName) return selector

    if (!functionName.includes('(')) return functionName

    const iface = new Interface(accessManagerAbi)
    const decoded = iface.parseTransaction({ data })
    if (!decoded) return functionName

    const argsString = decoded.args
      .map((arg, idx) => {
        const type = decoded.functionFragment.inputs[idx].type
        if (type === 'address') return formatAddress(arg.toString())
        if (
          type === 'uint64' &&
          [
            'grantRole',
            'setRoleAdmin',
            'setRoleGuardian',
            'setTargetFunctionRole',
          ].includes(decoded.name)
        ) {
          return chalk.yellow(roleNames[arg.toString()] || arg.toString())
        }
        if (
          (type === 'uint32' || type === 'uint48') &&
          [
            'grantRole',
            'setGrantDelay',
            'setTargetAdminDelay',
            'schedule',
          ].includes(decoded.name)
        ) {
          const numValue = bnToNumber(arg)
          return numValue > 60
            ? `${chalk.green(numValue)} (${chalk.green(formatDuration(numValue))})`
            : chalk.green(numValue.toString())
        }
        if (Array.isArray(arg)) {
          return type === 'address[]'
            ? `[${arg.map((a: any) => formatAddress(a.toString())).join(', ')}]`
            : `[${arg.join(', ')}]`
        }
        return arg.toString()
      })
      .join(', ')
    return `${decoded.name}(${argsString})`
  } catch {
    return functionSignatures[selector] || selector
  }
}

/** Mapping of function selectors to their signatures. */
const functionSignatures: { [selector: string]: string } = {
  [getSelector('upgradeAllWalletImplementations(address)')]:
    'upgradeAllWalletImplementations(address)',
  [getSelector('upgradeTo(address)')]: 'upgradeTo(address)',
  [getSelector('updateSystemApps(address[])')]: 'updateSystemApps(address[])',
  [getSelector('updateSystemContracts(address[])')]:
    'updateSystemContracts(address[])',
  [getSelector('updateReservedContracts(address[])')]:
    'updateReservedContracts(address[])',

  // KintoID & KintoWallet functions
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

// ============================================================================
// DATA FETCHING FUNCTIONS
// ============================================================================

async function fetchRoleData(
  accessManager: ethers.Contract,
  fromBlock: number,
): Promise<{
  rolesData: Map<string, RoleData>
  rolesByActor: { [account: string]: RoleInfo[] }
  roleToTargetFunctions: { [roleId: string]: { [target: string]: Set<string> } }
}> {
  console.log(chalk.bold('\nFetching role events...'))
  const rolesData = new Map<string, RoleData>()
  const rolesByActor: { [account: string]: RoleInfo[] } = {}
  const roleToTargetFunctions: {
    [roleId: string]: { [target: string]: Set<string> }
  } = {}

  // Helper: ensure roleData exists for a given roleId.
  const ensureRoleData = (roleId: string) => {
    if (!rolesData.has(roleId)) {
      rolesData.set(roleId, {
        id: roleId,
        currentGrantDelay: 0,
        members: new Map(),
      })
    }
  }

  // ------------------------------
  // Query Events
  // ------------------------------
  const roleGrantedEvents = await accessManager.queryFilter(
    'RoleGranted',
    fromBlock,
    'latest',
  )
  console.log(
    chalk.green(`- Found ${roleGrantedEvents.length} RoleGranted events`),
  )

  const roleRevokedEvents = await accessManager.queryFilter(
    'RoleRevoked',
    fromBlock,
    'latest',
  )
  console.log(
    chalk.green(`- Found ${roleRevokedEvents.length} RoleRevoked events`),
  )

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

  // ------------------------------
  // Build accounts per role
  // ------------------------------
  const accountsPerRole: { [role: string]: Set<string> } = {}
  for (const evt of roleGrantedEvents) {
    if (!evt.args) continue
    const roleId = evt.args.roleId.toString()
    const account = evt.args.account.toLowerCase()
    ensureRoleData(roleId)
    accountsPerRole[roleId] = accountsPerRole[roleId] || new Set()
    accountsPerRole[roleId].add(account)
  }
  // Process revocations: remove account if revoke event is after its grant.
  for (const evt of roleRevokedEvents) {
    if (!evt.args) continue
    const roleId = evt.args.roleId.toString()
    const account = evt.args.account.toLowerCase()
    let latestGrantBlock = 0
    for (let i = roleGrantedEvents.length - 1; i >= 0; i--) {
      const grantEvt = roleGrantedEvents[i]
      if (
        grantEvt.args &&
        grantEvt.args.roleId.toString() === roleId &&
        grantEvt.args.account.toLowerCase() === account &&
        grantEvt.blockNumber < evt.blockNumber
      ) {
        latestGrantBlock = grantEvt.blockNumber
        break
      }
    }
    if (evt.blockNumber > latestGrantBlock)
      accountsPerRole[roleId]?.delete(account)
  }

  // ------------------------------
  // Process admin and guardian changes
  // ------------------------------
  const processLatestChange = (
    events: any[],
    key: 'admin' | 'guardian',
  ): { [roleId: string]: { value: string; blockNumber: number } } => {
    const latest: { [roleId: string]: { value: string; blockNumber: number } } =
      {}
    for (const evt of events) {
      if (!evt.args) continue
      const roleId = evt.args.roleId.toString()
      const val = evt.args[key].toString()
      if (!latest[roleId] || evt.blockNumber > latest[roleId].blockNumber) {
        latest[roleId] = { value: val, blockNumber: evt.blockNumber }
      }
    }
    return latest
  }
  const latestAdminChanges = processLatestChange(
    roleAdminChangedEvents,
    'admin',
  )
  for (const roleId in latestAdminChanges) {
    ensureRoleData(roleId)
    rolesData.get(roleId)!.admin = latestAdminChanges[roleId].value
  }
  const latestGuardianChanges = processLatestChange(
    roleGuardianChangedEvents,
    'guardian',
  )
  for (const roleId in latestGuardianChanges) {
    ensureRoleData(roleId)
    rolesData.get(roleId)!.guardian = latestGuardianChanges[roleId].value
  }

  // ------------------------------
  // Process grant delay changes
  // ------------------------------
  const latestGrantDelayChanges: {
    [roleId: string]: { delay: number; since: number; blockNumber: number }
  } = {}
  for (const evt of roleGrantDelayChangedEvents) {
    if (!evt.args) continue
    const roleId = evt.args.roleId.toString()
    const delay = bnToNumber(evt.args.delay)
    const since = bnToNumber(evt.args.since)
    if (
      !latestGrantDelayChanges[roleId] ||
      evt.blockNumber > latestGrantDelayChanges[roleId].blockNumber
    ) {
      latestGrantDelayChanges[roleId] = {
        delay,
        since,
        blockNumber: evt.blockNumber,
      }
    }
  }
  const currentTimestamp = Math.floor(Date.now() / 1000)
  for (const roleId in latestGrantDelayChanges) {
    ensureRoleData(roleId)
    const roleData = rolesData.get(roleId)!
    try {
      const contractDelay = await accessManager.getRoleGrantDelay(roleId)
      roleData.currentGrantDelay = bnToNumber(contractDelay)
    } catch (error) {
      if (latestGrantDelayChanges[roleId].since <= currentTimestamp) {
        roleData.currentGrantDelay = latestGrantDelayChanges[roleId].delay
      } else {
        roleData.currentGrantDelay = 0
      }
    }
    if (latestGrantDelayChanges[roleId].since > currentTimestamp) {
      roleData.pendingGrantDelay = {
        newDelay: latestGrantDelayChanges[roleId].delay,
        effect: latestGrantDelayChanges[roleId].since,
      }
    } else {
      roleData.pendingGrantDelay = undefined
    }
  }

  // ------------------------------
  // Fetch current membership and delays for accounts
  // ------------------------------
  const allAccounts = new Set<string>()
  Object.values(accountsPerRole).forEach((s) =>
    s.forEach((a) => allAccounts.add(a)),
  )
  for (const account of allAccounts) {
    for (const roleId of Object.keys(accountsPerRole)) {
      try {
        const [isMember, executionDelayBN] = await accessManager.hasRole(
          roleId,
          account,
        )
        const roleData = rolesData.get(roleId)
        if (isMember && roleData) {
          const currentDelay = bnToNumber(executionDelayBN)
          const accessData = await accessManager.getAccess(roleId, account)
          const since = bnToNumber(accessData[0])
          const pendingDelay = bnToNumber(accessData[2])
          const effect = bnToNumber(accessData[3])
          const info: RoleInfo = {
            roleId,
            executionDelay: currentDelay,
            since,
            pendingDelay,
            pendingEffect: effect,
          }
          rolesByActor[account] = rolesByActor[account] || []
          if (!rolesByActor[account].some((r) => r.roleId === roleId))
            rolesByActor[account].push(info)
          roleData.members.set(account, info)
        } else if (roleData) {
          roleData.members.delete(account)
          if (rolesByActor[account]) {
            rolesByActor[account] = rolesByActor[account].filter(
              (r) => r.roleId !== roleId,
            )
            if (rolesByActor[account].length === 0) delete rolesByActor[account]
          }
        }
      } catch (err) {
        console.error(
          chalk.red(
            `- Error fetching role data for ${formatAddress(account)} and role ${roleNames[roleId] || roleId}:`,
          ),
          (err as Error).message,
        )
      }
    }
  }

  // Refresh grant delays for all roles
  for (const roleId of rolesData.keys()) {
    try {
      const grantDelay = await accessManager.getRoleGrantDelay(roleId)
      const roleData = rolesData.get(roleId)!
      roleData.currentGrantDelay = bnToNumber(grantDelay)
      if (
        roleData.pendingGrantDelay &&
        roleData.pendingGrantDelay.effect <= currentTimestamp
      ) {
        roleData.pendingGrantDelay = undefined
      }
    } catch (err) {
      console.error(
        chalk.red(
          `- Error fetching grant delay for role ${roleNames[roleId] || roleId}:`,
        ),
        (err as Error).message,
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

  const latestFunctionRoles: {
    [target: string]: {
      [selector: string]: { roleId: string; blockNumber: number }
    }
  } = {}
  for (const evt of targetFuncRoleEvents) {
    if (!evt.args) continue
    const target = evt.args.target.toLowerCase()
    const selector = evt.args.selector
    const roleId = evt.args.roleId.toString()
    latestFunctionRoles[target] = latestFunctionRoles[target] || {}
    if (
      !latestFunctionRoles[target][selector] ||
      evt.blockNumber > latestFunctionRoles[target][selector].blockNumber
    ) {
      latestFunctionRoles[target][selector] = {
        roleId,
        blockNumber: evt.blockNumber,
      }
    }
  }

  // Build target functions and role mapping
  for (const target in latestFunctionRoles) {
    targetData[target] = targetData[target] || {
      adminDelay: 0,
      closed: false,
      functions: {},
    }
    for (const selector in latestFunctionRoles[target]) {
      const { roleId } = latestFunctionRoles[target][selector]
      if (roleId === '0' || roleId === roleNames['18446744073709551615'])
        continue
      targetData[target].functions[roleId] =
        targetData[target].functions[roleId] || new Set()
      targetData[target].functions[roleId].add(selector)

      roleToTargetFunctions[roleId] = roleToTargetFunctions[roleId] || {}
      roleToTargetFunctions[roleId][target] =
        roleToTargetFunctions[roleId][target] || new Set()
      roleToTargetFunctions[roleId][target].add(selector)
    }
  }

  // --- TargetAdminDelayUpdated ---
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
  const latestAdminDelayChanges: {
    [target: string]: { delay: number; since: number; blockNumber: number }
  } = {}
  const allTargets = new Set<string>([...Object.keys(targetData)])
  targetAdminDelayEvents.forEach((evt) => {
    if (evt.args) allTargets.add(evt.args.target.toLowerCase())
  })
  for (const evt of targetAdminDelayEvents) {
    if (!evt.args) continue
    const target = evt.args.target.toLowerCase()
    const delay = bnToNumber(evt.args.delay)
    const since = bnToNumber(evt.args.since)
    if (
      !latestAdminDelayChanges[target] ||
      evt.blockNumber > latestAdminDelayChanges[target].blockNumber
    ) {
      latestAdminDelayChanges[target] = {
        delay,
        since,
        blockNumber: evt.blockNumber,
      }
    }
  }

  // Fetch current admin delay and closed state for each target
  const currentTimestamp = Math.floor(Date.now() / 1000)
  for (const target of allTargets) {
    targetData[target] = targetData[target] || {
      adminDelay: 0,
      closed: false,
      functions: {},
    }
    try {
      const adminDelayBN = await accessManager.getTargetAdminDelay(target)
      targetData[target].adminDelay = bnToNumber(adminDelayBN)
      targetData[target].closed = await accessManager.isTargetClosed(target)
      const latestChange = latestAdminDelayChanges[target]
      if (latestChange && latestChange.since > currentTimestamp) {
        targetData[target].pendingAdminDelayChanges =
          targetData[target].pendingAdminDelayChanges || []
        if (
          !targetData[target].pendingAdminDelayChanges.some(
            (c) =>
              c.effect === latestChange.since &&
              c.newDelay === latestChange.delay,
          )
        ) {
          targetData[target].pendingAdminDelayChanges.push({
            newDelay: latestChange.delay,
            effect: latestChange.since,
          })
        }
      } else if (latestChange && latestChange.since <= currentTimestamp) {
        targetData[target].pendingAdminDelayChanges = undefined
      }
    } catch (err) {
      console.error(
        chalk.red(
          `- Error fetching config for target ${formatAddress(target)}:`,
        ),
        (err as Error).message,
      )
      const latestChange = latestAdminDelayChanges[target]
      if (latestChange) {
        targetData[target].adminDelay =
          latestChange.since <= currentTimestamp ? latestChange.delay : 0
        if (latestChange.since > currentTimestamp) {
          targetData[target].pendingAdminDelayChanges = [
            { newDelay: latestChange.delay, effect: latestChange.since },
          ]
        }
      } else {
        targetData[target].adminDelay = 0
      }
      targetData[target].closed = false
    }
  }

  console.log(
    chalk.green(
      `- Found configuration data for ${Object.keys(targetData).length} targets`,
    ),
  )
  return { targetData, roleToTargetFunctions }
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
  console.log(chalk.bold('\nFetching queued operations...'))
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

  // Map executed/canceled operations by operationId -> nonce
  const executedOrCanceled = new Map<string, number>()
  for (const evt of operationExecutedEvents) {
    if (!evt.args) continue
    executedOrCanceled.set(evt.args.operationId, bnToNumber(evt.args.nonce))
  }
  for (const evt of operationCanceledEvents) {
    if (!evt.args) continue
    const existing = executedOrCanceled.get(evt.args.operationId)
    const currNonce = bnToNumber(evt.args.nonce)
    if (existing === undefined || currNonce >= existing) {
      executedOrCanceled.set(evt.args.operationId, currNonce)
    }
  }

  // Filter for pending operations (by unique opId-nonce)
  const scheduledOps: ScheduledOperation[] = []
  const seenOpIds = new Set<string>()
  const currentTimestamp = Math.floor(Date.now() / 1000)
  for (let i = operationScheduledEvents.length - 1; i >= 0; i--) {
    const evt = operationScheduledEvents[i]
    if (!evt.args) continue
    const opId = evt.args.operationId
    const nonce = bnToNumber(evt.args.nonce)
    const schedule = bnToNumber(evt.args.schedule)
    const uniqueKey = `${opId}-${nonce}`
    if (seenOpIds.has(uniqueKey)) continue
    const finalNonce = executedOrCanceled.get(opId)
    const isDone = finalNonce !== undefined && nonce <= finalNonce
    if (!isDone) {
      scheduledOps.push({
        operationId: opId,
        nonce,
        schedule,
        caller: evt.args.caller.toLowerCase(),
        target: evt.args.target.toLowerCase(),
        data: evt.args.data,
      })
      seenOpIds.add(uniqueKey)
    }
  }
  scheduledOps.reverse()
  console.log(chalk.green(`- Found ${scheduledOps.length} pending operations`))

  // Process pending role grant delay changes
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
  const latestPending: {
    [roleId: string]: { newDelay: number; effect: number; blockNumber: number }
  } = {}
  for (const evt of roleGrantDelayChangedEvents) {
    if (!evt.args) continue
    const effect = bnToNumber(evt.args.since)
    if (effect > currentTimestamp) {
      const roleId = evt.args.roleId.toString()
      if (
        !latestPending[roleId] ||
        evt.blockNumber > latestPending[roleId].blockNumber
      ) {
        latestPending[roleId] = {
          newDelay: bnToNumber(evt.args.delay),
          effect,
          blockNumber: evt.blockNumber,
        }
      }
    }
  }
  for (const roleId in latestPending) {
    pendingRoleGrantChanges.push({
      roleId,
      newDelay: latestPending[roleId].newDelay,
      effect: latestPending[roleId].effect,
    })
  }
  console.log(
    chalk.green(
      `- Found ${pendingRoleGrantChanges.length} pending role grant delay changes`,
    ),
  )
  return { scheduledOps, pendingRoleGrantChanges }
}

// ============================================================================
// REPORTING FUNCTIONS
// ============================================================================

function generateRolesOverviewReport(rolesData: Map<string, RoleData>): void {
  console.log(chalk.bold('\n================ Roles Overview ================'))
  if (rolesData.size === 0) {
    console.log(chalk.red('No roles found.'))
    return
  }
  const sortedRoles = Array.from(rolesData.values()).sort(
    (a, b) => parseInt(a.id) - parseInt(b.id),
  )
  for (const roleData of sortedRoles) {
    const roleName = roleNames[roleData.id] || roleData.id
    console.log(`\n${chalk.yellow(roleName)} (ID: ${chalk.gray(roleData.id)}):`)
    console.log(
      `  ${chalk.magenta('roleGrantDelay')}: ${chalk.green(roleData.currentGrantDelay)} (${chalk.green(
        formatDuration(roleData.currentGrantDelay),
      )})`,
    )
    if (roleData.pendingGrantDelay) {
      console.log(
        `  ${chalk.magenta('pendingGrantDelay')}: ${chalk.green(roleData.pendingGrantDelay.newDelay)} (${chalk.green(
          formatDuration(roleData.pendingGrantDelay.newDelay),
        )}) effective at ${chalk.cyan(new Date(roleData.pendingGrantDelay.effect * 1000).toISOString())}`,
      )
    }
    if (roleData.admin) {
      const adminName = roleNames[roleData.admin] || roleData.admin
      console.log(
        `  ${chalk.magenta('adminRole')}: ${chalk.yellow(adminName)} (${chalk.gray(roleData.admin)})`,
      )
    }
    if (roleData.guardian) {
      const guardianName = roleNames[roleData.guardian] || roleData.guardian
      console.log(
        `  ${chalk.magenta('guardianRole')}: ${chalk.yellow(guardianName)} (${chalk.gray(roleData.guardian)})`,
      )
    }
    if (roleData.members.size > 0) {
      console.log(`  members (${roleData.members.size}):`)
      const sortedMembers = Array.from(roleData.members.entries()).sort(
        ([a], [b]) => a.localeCompare(b),
      )
      for (const [account, info] of sortedMembers) {
        console.log(
          `    ${formatAddress(account)}: ${chalk.magenta('executionDelay')}: ${chalk.green(info.executionDelay)} (${chalk.green(
            formatDuration(info.executionDelay),
          )})`,
        )
        if (
          info.pendingDelay !== info.executionDelay &&
          info.pendingEffect > Math.floor(Date.now() / 1000)
        ) {
          console.log(
            `      ${chalk.magenta('pendingExecutionDelay')}: ${chalk.green(info.pendingDelay)} (${chalk.green(
              formatDuration(info.pendingDelay),
            )}) effective at ${chalk.cyan(new Date(info.pendingEffect * 1000).toISOString())}`,
          )
        }
      }
    } else {
      console.log(`  ${chalk.magenta('members')}: None`)
    }
  }
}

function generateActorsReport(
  rolesByActor: { [account: string]: RoleInfo[] },
  roleToTargetFunctions: {
    [roleId: string]: { [target: string]: Set<string> }
  },
): void {
  console.log(chalk.bold('\n================ Actors ================'))
  if (Object.keys(rolesByActor).length === 0) {
    console.log(chalk.red('No actors with active roles found.'))
    return
  }
  const sortedActors = Object.keys(rolesByActor).sort((a, b) =>
    a.localeCompare(b),
  )
  for (const account of sortedActors) {
    console.log(`\n${formatAddress(account)}:`)
    const sortedRoles = rolesByActor[account].sort((a, b) =>
      (roleNames[a.roleId] || a.roleId).localeCompare(
        roleNames[b.roleId] || b.roleId,
      ),
    )
    for (const roleInfo of sortedRoles) {
      const roleName = roleNames[roleInfo.roleId] || roleInfo.roleId
      const delayStr = `${chalk.green(roleInfo.executionDelay)} (${chalk.green(
        formatDuration(roleInfo.executionDelay),
      )})`
      console.log(
        `  ${chalk.yellow(roleName)}: ${chalk.magenta('executionDelay')}: ${delayStr}`,
      )
      if (
        roleInfo.pendingDelay !== roleInfo.executionDelay &&
        roleInfo.pendingEffect > Math.floor(Date.now() / 1000)
      ) {
        console.log(
          `      ${chalk.magenta('pendingExecutionDelay')}: ${chalk.green(roleInfo.pendingDelay)} (${chalk.green(
            formatDuration(roleInfo.pendingDelay),
          )}) effective at ${chalk.cyan(new Date(roleInfo.pendingEffect * 1000).toISOString())}`,
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
          const sortedTargets = Object.keys(targets).sort((a, b) =>
            a.localeCompare(b),
          )
          for (const target of sortedTargets) {
            console.log(`      Target ${formatAddress(target)}:`)
            const funcs = Array.from(targets[target])
              .map((sel) => functionSignatures[sel] || sel)
              .sort()
            console.log(
              `        Functions: ${funcs.map((f) => chalk.gray(f)).join(', ')}`,
            )
          }
        }
      }
    }
  }
}

function generateTargetsReport(targetData: {
  [target: string]: TargetData
}): void {
  console.log(chalk.bold('\n================ Targets ================'))
  if (Object.keys(targetData).length === 0) {
    console.log(chalk.red('No target configurations found.'))
    return
  }
  const sortedTargets = Object.keys(targetData).sort((a, b) =>
    a.localeCompare(b),
  )
  for (const target of sortedTargets) {
    const data = targetData[target]
    console.log(`\n${formatAddress(target)}:`)
    console.log(
      `  ${chalk.magenta('targetAdminDelay')}: ${chalk.green(data.adminDelay)} (${chalk.green(
        formatDuration(data.adminDelay),
      )})`,
    )
    const currentTimestamp = Math.floor(Date.now() / 1000)
    if (data.pendingAdminDelayChanges) {
      data.pendingAdminDelayChanges.forEach((change) => {
        if (change.effect > currentTimestamp) {
          console.log(
            `  ${chalk.magenta('pendingAdminDelay')}: ${chalk.green(change.newDelay)} (${chalk.green(
              formatDuration(change.newDelay),
            )}) effective at ${chalk.cyan(new Date(change.effect * 1000).toISOString())}`,
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
      const sortedRoleIds = Object.keys(data.functions).sort((a, b) =>
        (roleNames[a] || a).localeCompare(roleNames[b] || b),
      )
      for (const roleId of sortedRoleIds) {
        const roleName = roleNames[roleId] || roleId
        const funcs = Array.from(data.functions[roleId])
          .map((sel) => functionSignatures[sel] || sel)
          .sort()
        console.log(
          `    ${chalk.yellow(roleName)}: ${funcs.map((f) => chalk.gray(f)).join(', ')}`,
        )
      }
    }
  }
}

function generatePendingChangesReport(
  scheduledOps: ScheduledOperation[],
  pendingRoleGrantChanges: {
    roleId: string
    newDelay: number
    effect: number
  }[],
): void {
  console.log(
    chalk.bold(
      '\n============= Queued Operations and Pending Role Grant Delay Changes =============',
    ),
  )
  let changesFound = false
  const currentTimestamp = Math.floor(Date.now() / 1000)

  if (scheduledOps.length > 0) {
    changesFound = true
    console.log(chalk.bold('\nQueued Operations:'))
    const sortedOps = scheduledOps.sort((a, b) => a.schedule - b.schedule)
    for (const op of sortedOps) {
      const selector = op.data.slice(0, 10).toLowerCase()
      const decodedFunction = decodeOperationData(selector, op.data)
      const isEffective = op.schedule <= currentTimestamp
      const scheduleDate = new Date(op.schedule * 1000)
      const timeColor = isEffective ? chalk.yellow : chalk.cyan
      console.log(`\nOperation ${chalk.cyan(op.operationId)}:`)
      console.log(`    Nonce: ${chalk.yellow(op.nonce)}`)
      console.log(
        `    Scheduled for: ${timeColor(scheduleDate.toISOString())} ${isEffective ? chalk.yellow('(Ready to execute)') : ''}`,
      )
      console.log(`    Caller: ${formatAddress(op.caller)}`)
      console.log(`    Target: ${formatAddress(op.target)}`)
      console.log(`    Function: ${decodedFunction}`)
    }
  } else {
    console.log(chalk.grey('No queued operations found.'))
  }

  console.log(chalk.bold('\nPending Role Grant Delay Changes:'))
  if (pendingRoleGrantChanges.length > 0) {
    changesFound = true
    const sortedChanges = pendingRoleGrantChanges.sort(
      (a, b) => a.effect - b.effect,
    )
    for (const change of sortedChanges) {
      const roleName = roleNames[change.roleId] || change.roleId
      console.log(
        `  Role ${chalk.yellow(roleName)} grant delay to change to ${chalk.green(change.newDelay)} (${chalk.green(
          formatDuration(change.newDelay),
        )}) effective at ${chalk.cyan(new Date(change.effect * 1000).toISOString())}`,
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
      `(Minimum required delay for checked items: ${MIN_DELAY_SECONDS}s / ${formatDuration(
        MIN_DELAY_SECONDS,
      )})`,
    ),
  )
  const nonCompliantItems: NonCompliantItem[] = []
  const checkedTargets = [
    '0x5a2b641b84b0230c8e75f55d5afd27f4dbd59d5b', // KintoAppRegistry
    '0xf369f78e3a0492cc4e96a90dae0728a38498e9c7', // KintoID
    '0x8a4720488ca32f1223ccfe5a087e250fe3bc5d75', // KintoWalletFactory
  ]
  const checkedRoles = ['0', '8663528507529876195', '14661544942390944024']

  // Check KintoID.EXIT_WINDOW_PERIOD
  if (exitWindowPeriod < MIN_DELAY_SECONDS) {
    nonCompliantItems.push({
      item: 'KintoID.EXIT_WINDOW_PERIOD',
      address: KINTO_ID_ADDRESS,
      actual: exitWindowPeriod,
      expected: MIN_DELAY_SECONDS,
    })
  }
  // Check KintoWallet.RECOVERY_TIME
  if (recoveryTime < MIN_DELAY_SECONDS) {
    nonCompliantItems.push({
      item: `KintoWallet Example (${addressNames[KINTO_WALLET_EXAMPLE_ADDRESS] || 'Unknown'}) .RECOVERY_TIME`,
      address: KINTO_WALLET_EXAMPLE_ADDRESS,
      actual: recoveryTime,
      expected: MIN_DELAY_SECONDS,
    })
  }
  // Check target admin delays
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
  // Check execution delays for specific roles (excluding Security Council actor)
  for (const roleId of checkedRoles) {
    const rData = rolesData.get(roleId)
    if (rData && rData.members) {
      for (const [account, info] of rData.members) {
        if (
          account.toLowerCase() !== SECURITY_COUNCIL_ADDRESS &&
          info.executionDelay < MIN_DELAY_SECONDS
        ) {
          nonCompliantItems.push({
            item: `Execution Delay`,
            address: account,
            role: roleNames[roleId] || roleId,
            actual: info.executionDelay,
            expected: MIN_DELAY_SECONDS,
          })
        }
      }
    }
  }

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
      const addrStr = item.address ? formatAddress(item.address) : ''
      console.log(
        `  - ${item.item}${roleStr} for ${addrStr}: ${chalk.red(item.actual)}s (${chalk.red(
          formatDuration(item.actual),
        )}) - Expected >= ${chalk.green(item.expected)}s (${chalk.green(formatDuration(item.expected))})`,
      )
    })
  }
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

export async function runScanKintoAm(): Promise<void> {
  try {
    console.log(chalk.bold('Starting ScanKintoAm...\n'))
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
    const accessManager = new ethers.Contract(
      ACCESS_MANAGER_ADDRESS,
      accessManagerAbi,
      provider,
    )
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
    const fromBlock = 0

    console.log(chalk.blue('Connecting to RPC endpoint:'), chalk.gray(RPC_URL))
    console.log(
      chalk.blue('AccessManager contract:'),
      chalk.gray(ACCESS_MANAGER_ADDRESS),
    )

    // Fetch KintoID and KintoWallet constants
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
      console.error(
        chalk.red(
          `- Error fetching KintoID.EXIT_WINDOW_PERIOD from ${KINTO_ID_ADDRESS}:`,
        ),
        (e as Error).message,
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
      console.error(
        chalk.red(
          `- Error fetching KintoWallet_Example.RECOVERY_TIME from ${KINTO_WALLET_EXAMPLE_ADDRESS}:`,
        ),
        (e as Error).message,
      )
    }

    // Fetch data from AccessManager events
    const {
      rolesData,
      rolesByActor,
      roleToTargetFunctions: roleFuncs1,
    } = await fetchRoleData(accessManager, fromBlock)
    const { targetData, roleToTargetFunctions: roleFuncs2 } =
      await fetchTargetData(accessManager, fromBlock)
    const { scheduledOps, pendingRoleGrantChanges } = await fetchOperationsData(
      accessManager,
      fromBlock,
    )

    // Merge roleToTargetFunctions maps
    const roleToTargetFunctions: {
      [roleId: string]: { [target: string]: Set<string> }
    } = { ...roleFuncs1 }
    for (const roleId in roleFuncs2) {
      roleToTargetFunctions[roleId] = roleToTargetFunctions[roleId] || {}
      for (const target in roleFuncs2[roleId]) {
        roleToTargetFunctions[roleId][target] =
          roleToTargetFunctions[roleId][target] || new Set()
        for (const func of roleFuncs2[roleId][target]) {
          roleToTargetFunctions[roleId][target].add(func)
        }
      }
    }

    // Generate reports
    generateRolesOverviewReport(rolesData)
    generateActorsReport(rolesByActor, roleToTargetFunctions)
    generateTargetsReport(targetData)
    generatePendingChangesReport(scheduledOps, pendingRoleGrantChanges)
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

runScanKintoAm().catch((error) => {
  console.error('Unhandled error in runScanKintoAm:', error)
  process.exit(1)
})
