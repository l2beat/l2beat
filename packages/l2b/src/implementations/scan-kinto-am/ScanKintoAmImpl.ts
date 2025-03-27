import chalk from 'chalk'
import { ethers } from 'ethers'

// -------------------------
// CONFIGURATION
// -------------------------

const RPC_URL = 'https://rpc.kinto-rpc.com'

const ACCESS_MANAGER_ADDRESS = '0xacC000818e5Bbd911D5d449aA81CB5cA24024739'
const KINTO_ID_ADDRESS = '0xf369f78e3a0492cc4e96a90dae0728a38498e9c7' // Assuming KintoID target address is the KintoID contract
const KINTO_WALLET_EXAMPLE_ADDRESS = '0x2e2b1c42e38f5af81771e65d87729e57abd1337a' // Using Kinto Multisig 2 as an example KintoWallet

const MINIMUM_DELAY_SECONDS = 1036800 // 12 days in seconds
const SECURITY_COUNCIL_ADDRESS = '0x28fc10e12a78f986c78f973fc70ed88072b34c8e'.toLowerCase() // Ensure lowercase for comparison

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
  '0x2e2b1c42e38f5af81771e65d87729e57abd1337a': 'Kinto Multisig 2',
  '0x28fc10e12a78f986c78f973fc70ed88072b34c8e': 'SecurityCouncil',
  '0x010600ff5f36c8ef3b6aaf2a88c2de85c798594a': 'NioGovernor',
  // Targets
  '0x8a4720488ca32f1223ccfe5a087e250fe3bc5d75': 'KintoWalletFactory',
  '0x5a2b641b84b0230c8e75f55d5afd27f4dbd59d5b': 'KintoAppRegistry',
  '0xf369f78e3a0492cc4e96a90dae0728a38498e9c7': 'KintoID',
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

  // KintoID / KintoWallet functions
  '0xd00bb535': 'EXIT_WINDOW_PERIOD()', // KintoID.EXIT_WINDOW_PERIOD()
  '0x8b1b3b45': 'RECOVERY_TIME()', // KintoWallet.RECOVERY_TIME()
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

interface ExternalDelays {
    kintoIdExitWindowPeriod?: number;
    kintoWalletRecoveryTime?: number;
}

interface NonCompliantValue {
    type: 'Actor Execution Delay' | 'Target Admin Delay' | 'KintoID Exit Window' | 'KintoWallet Recovery Time';
    location: string; // Address or descriptive name
    role?: string; // Applicable for Actor Execution Delay
    currentValue: number;
    requiredValue: number;
}

// -------------------------
// HELPER FUNCTIONS
// -------------------------

function bnToNumber(value: ethers.BigNumber | number): number {
  if (typeof value === 'number') return value
  // Handle potential overflow for large BigNumber values if needed, though delays are usually within uint32
  try {
    return value.toNumber();
  } catch (e) {
    console.warn(chalk.yellow(`Warning: BigNumber overflow converting ${value.toString()} to number. Using MAX_SAFE_INTEGER.`));
    return Number.MAX_SAFE_INTEGER;
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
  if (seconds < 0) return 'Invalid Duration';
  if (seconds >= 86400 && seconds % 86400 === 0) {
    return `${seconds / 86400}d`
  } else if (seconds >= 3600 && seconds % 3600 === 0) {
    return `${seconds / 3600}h`
  }
  return `${seconds}s`
}

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
        const delayNum = bnToNumber(executionDelay);

        return `grantRole(${chalk.yellow(roleName)}, ${accountNameFormatted}, ${chalk.green(delayNum)} (${chalk.green(formatDuration(delayNum))}))`
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
        const delayNum = bnToNumber(newDelay);

        return `setTargetAdminDelay(${targetNameFormatted}, ${chalk.green(delayNum)} (${chalk.green(formatDuration(delayNum))}))`
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

      // setGrantDelay(uint64 roleId, uint32 newDelay)
      case '0xa64d95ce': {
        const [roleId, newDelay] = abiCoder.decode(
          ['uint64', 'uint32'],
          paramsData,
        )

        const roleName = roleNames[roleId.toString()] || roleId.toString()
        const delayNum = bnToNumber(newDelay);

        return `setGrantDelay(${chalk.yellow(roleName)}, ${chalk.green(delayNum)} (${chalk.green(formatDuration(delayNum))}))`
      }

      // upgradeTo(address)
      case getSelector('upgradeTo(address)'): {
         const [newImplementation] = abiCoder.decode(['address'], paramsData);
         return `upgradeTo(${formatAddress(newImplementation)})`;
      }
      // upgradeAllWalletImplementations(address)
      case getSelector('upgradeAllWalletImplementations(address)'): {
         const [newImplementation] = abiCoder.decode(['address'], paramsData);
         return `upgradeAllWalletImplementations(${formatAddress(newImplementation)})`;
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

// -------------------------
// ABI fragments
// -------------------------

const accessManagerAbi = [
  // Existing events...
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
  // Existing view functions...
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

const kintoIdAbi = [
    'function EXIT_WINDOW_PERIOD() view returns (uint256)' // 0xd00bb535
]

const kintoWalletAbi = [
    'function RECOVERY_TIME() view returns (uint256)' // 0x8b1b3b45
]

// -------------------------
// DATA FETCHING FUNCTIONS
// -------------------------

// Fetch role-related data (no changes needed here for requirements)
async function fetchRoleData(
  accessManager: ethers.Contract,
  fromBlock: number,
): Promise<{
  rolesData: Map<string, RoleData>
  rolesByActor: { [account: string]: Array<RoleInfo> }
  roleToTargetFunctions: { [roleId: string]: { [target: string]: Set<string> } }
}> {
  console.log(chalk.bold('\nFetching role events...'))
  const rolesData = new Map<string, RoleData>()
  const rolesByActor: { [account: string]: Array<RoleInfo> } = {}
  const roleToTargetFunctions: {
    [roleId: string]: { [target: string]: Set<string> }
  } = {}

  console.log(chalk.magenta('- Querying RoleGranted events...'))
  const roleGrantedEvents = await accessManager.queryFilter('RoleGranted', fromBlock, 'latest')
  console.log(chalk.green(`- Found ${roleGrantedEvents.length} RoleGranted events`))

  console.log(chalk.magenta('- Querying RoleRevoked events...'))
  const roleRevokedEvents = await accessManager.queryFilter('RoleRevoked', fromBlock, 'latest')
  console.log(chalk.green(`- Found ${roleRevokedEvents.length} RoleRevoked events`))

  console.log(chalk.magenta('- Querying RoleAdminChanged events...'))
  const roleAdminChangedEvents = await accessManager.queryFilter('RoleAdminChanged', fromBlock, 'latest')
  console.log(chalk.green(`- Found ${roleAdminChangedEvents.length} RoleAdminChanged events`))

  console.log(chalk.magenta('- Querying RoleGuardianChanged events...'))
  const roleGuardianChangedEvents = await accessManager.queryFilter('RoleGuardianChanged', fromBlock, 'latest')
  console.log(chalk.green(`- Found ${roleGuardianChangedEvents.length} RoleGuardianChanged events`))

  console.log(chalk.magenta('- Querying RoleGrantDelayChanged events...'))
  const roleGrantDelayChangedEvents = await accessManager.queryFilter('RoleGrantDelayChanged', fromBlock, 'latest')
  console.log(chalk.green(`- Found ${roleGrantDelayChangedEvents.length} RoleGrantDelayChanged events`))

  const accountsPerRole: { [role: string]: Set<string> } = {}
  for (const event of roleGrantedEvents) {
    if (!event.args) continue
    const roleId = event.args.roleId.toString()
    const account = event.args.account.toLowerCase()
    if (!rolesData.has(roleId)) rolesData.set(roleId, { id: roleId, currentGrantDelay: 0, members: new Map() })
    if (!accountsPerRole[roleId]) accountsPerRole[roleId] = new Set()
    accountsPerRole[roleId].add(account)
  }

  for (const event of roleRevokedEvents) {
    if (!event.args) continue
    const roleId = event.args.roleId.toString()
    const account = event.args.account.toLowerCase()
    accountsPerRole[roleId]?.delete(account)
  }

  for (const event of roleAdminChangedEvents) {
    if (!event.args) continue
    const roleId = event.args.roleId.toString()
    const adminRoleId = event.args.admin.toString()
    if (!rolesData.has(roleId)) rolesData.set(roleId, { id: roleId, currentGrantDelay: 0, members: new Map() })
    const roleData = rolesData.get(roleId)
    if (roleData) roleData.admin = adminRoleId
  }

  for (const event of roleGuardianChangedEvents) {
    if (!event.args) continue
    const roleId = event.args.roleId.toString()
    const guardianRoleId = event.args.guardian.toString()
    if (!rolesData.has(roleId)) rolesData.set(roleId, { id: roleId, currentGrantDelay: 0, members: new Map() })
    const roleData = rolesData.get(roleId)
    if (roleData) roleData.guardian = guardianRoleId
  }

  const currentTimestamp = Math.floor(Date.now() / 1000)
  for (const event of roleGrantDelayChangedEvents) {
    if (!event.args) continue
    const roleId = event.args.roleId.toString()
    const newDelay = bnToNumber(event.args.delay)
    const effect = bnToNumber(event.args.since)
    if (!rolesData.has(roleId)) rolesData.set(roleId, { id: roleId, currentGrantDelay: 0, members: new Map() })
    const roleData = rolesData.get(roleId)
    if (roleData) {
      if (effect <= currentTimestamp) {
        roleData.currentGrantDelay = newDelay
      } else {
        roleData.pendingGrantDelay = { newDelay, effect }
      }
    }
  }

  console.log(chalk.magenta('- Fetching current role data for actors...'))
  for (const roleId in accountsPerRole) {
    for (const account of accountsPerRole[roleId]) {
      try {
        const [isMember] = await accessManager.hasRole(roleId, account)
        if (isMember) {
          const accessData = await accessManager.getAccess(roleId, account)
          const since = bnToNumber(accessData[0])
          const currentDelay = bnToNumber(accessData[1])
          const pendingDelay = bnToNumber(accessData[2])
          const effect = bnToNumber(accessData[3])

          if (!rolesByActor[account]) rolesByActor[account] = []
          rolesByActor[account].push({ roleId, executionDelay: currentDelay, since, pendingDelay, pendingEffect: effect })

          const roleData = rolesData.get(roleId)
          if (roleData) {
            roleData.members.set(account, { roleId, executionDelay: currentDelay, since, pendingDelay, pendingEffect: effect })
          }
        }
      } catch (error: any) {
        console.error(chalk.red(`Error fetching role data for ${account} and role ${roleId}: ${error.message}`))
      }
    }
  }

  console.log(chalk.magenta('- Fetching current grant delays for all roles...'))
  for (const roleId of rolesData.keys()) {
    try {
      const grantDelay = await accessManager.getRoleGrantDelay(roleId)
      const roleData = rolesData.get(roleId)
      if (roleData) roleData.currentGrantDelay = bnToNumber(grantDelay)
    } catch (error: any) {
      console.error(chalk.red(`Error fetching grant delay for role ${roleId}: ${error.message}`))
    }
  }

  console.log(chalk.green(`- Found ${Object.keys(rolesByActor).length} actors with active roles`))
  console.log(chalk.green(`- Found ${rolesData.size} distinct roles`))

  return { rolesData, rolesByActor, roleToTargetFunctions }
}

// Fetch target configuration data (no changes needed here for requirements)
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

  console.log(chalk.magenta('- Querying TargetFunctionRoleUpdated events...'))
  const targetFuncRoleEvents = await accessManager.queryFilter('TargetFunctionRoleUpdated', fromBlock, 'latest')
  console.log(chalk.green(`- Found ${targetFuncRoleEvents.length} TargetFunctionRoleUpdated events`))

  console.log(chalk.magenta('- Querying TargetAdminDelayUpdated events...'))
  const targetAdminDelayEvents = await accessManager.queryFilter('TargetAdminDelayUpdated', fromBlock, 'latest')
  console.log(chalk.green(`- Found ${targetAdminDelayEvents.length} TargetAdminDelayUpdated events`))

  for (const event of targetFuncRoleEvents) {
    if (!event.args) continue
    const target = event.args.target.toLowerCase()
    const selector = event.args.selector
    const roleId = event.args.roleId.toString()

    if (!targetData[target]) targetData[target] = { adminDelay: 0, closed: false, functions: {} }
    if (!targetData[target].functions[roleId]) targetData[target].functions[roleId] = new Set()
    targetData[target].functions[roleId].add(selector)

    if (!roleToTargetFunctions[roleId]) roleToTargetFunctions[roleId] = {}
    if (!roleToTargetFunctions[roleId][target]) roleToTargetFunctions[roleId][target] = new Set()
    roleToTargetFunctions[roleId][target].add(selector)
  }

  for (const event of targetAdminDelayEvents) {
    if (!event.args) continue
    const target = event.args.target.toLowerCase()
    if (!targetData[target]) targetData[target] = { adminDelay: 0, closed: false, functions: {} }
    const newDelay = bnToNumber(event.args.delay)
    const effect = bnToNumber(event.args.since)
    if (!targetData[target].pendingAdminDelayChanges) targetData[target].pendingAdminDelayChanges = []
    targetData[target].pendingAdminDelayChanges.push({ newDelay, effect })
  }

  console.log(chalk.magenta('- Fetching current admin delays and closures for targets...'))
  // Add known targets even if they don't have events, to ensure we query their current state
  const knownTargets = Object.values(addressNames).map(addr => addr.toLowerCase());
  for (const targetAddr of knownTargets) {
      if (!targetData[targetAddr] && targetAddr !== ACCESS_MANAGER_ADDRESS.toLowerCase()) { // Don't treat AM itself as a target here
          // Check if it's a contract before assuming it's a target
          const provider = accessManager.provider;
          const code = await provider.getCode(targetAddr);
          if (code && code !== '0x') {
             targetData[targetAddr] = { adminDelay: 0, closed: false, functions: {} };
             console.log(chalk.dim(`- Added known address ${formatAddress(targetAddr)} as potential target for query.`));
          }
      }
  }

  for (const target in targetData) {
    try {
      const adminDelayBN = await accessManager.getTargetAdminDelay(target)
      targetData[target].adminDelay = bnToNumber(adminDelayBN)
      const closed = await accessManager.isTargetClosed(target)
      targetData[target].closed = closed
    } catch (error: any) {
      // It's possible getTargetAdminDelay fails if the address is not actually a target in AM
      if (!error.message.includes('CALL_EXCEPTION')) { // Filter out expected errors for non-targets
         console.error(chalk.red(`Error fetching config for target ${target}: ${error.message}`))
      } else {
         // Remove entry if it's not a valid target according to AM
         delete targetData[target];
         console.log(chalk.dim(`- Removed ${formatAddress(target)} as it's not a configured target in AccessManager.`));
      }
    }
  }

  console.log(chalk.green(`- Found configuration data for ${Object.keys(targetData).length} targets`))

  return { targetData, roleToTargetFunctions }
}

// Fetch scheduled operations and pending changes (no changes needed here for requirements)
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

  console.log(chalk.magenta('- Querying OperationScheduled events...'))
  const operationScheduledEvents = await accessManager.queryFilter('OperationScheduled', fromBlock, 'latest')
  console.log(chalk.green(`- Found ${operationScheduledEvents.length} OperationScheduled events`))

  console.log(chalk.magenta('- Querying OperationExecuted events...'))
  const operationExecutedEvents = await accessManager.queryFilter('OperationExecuted', fromBlock, 'latest')
  console.log(chalk.green(`- Found ${operationExecutedEvents.length} OperationExecuted events`))

  console.log(chalk.magenta('- Querying OperationCanceled events...'))
  const operationCanceledEvents = await accessManager.queryFilter('OperationCanceled', fromBlock, 'latest')
  console.log(chalk.green(`- Found ${operationCanceledEvents.length} OperationCanceled events`))

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
  const scheduledOps: ScheduledOperation[] = []
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
  const roleGrantDelayChangedEvents = await accessManager.queryFilter('RoleGrantDelayChanged', fromBlock, 'latest')

  const pendingRoleGrantChanges: Array<{ roleId: string; newDelay: number; effect: number }> = []
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
  console.log(chalk.green(`- Found ${pendingRoleGrantChanges.length} pending role grant delay changes`))

  return { scheduledOps, pendingRoleGrantChanges }
}

// *** NEW FUNCTION: Fetch delays from external contracts ***
async function fetchExternalContractDelays(provider: ethers.providers.Provider): Promise<ExternalDelays> {
    console.log(chalk.bold('\nFetching external contract delays...'));
    const delays: ExternalDelays = {};

    try {
        console.log(chalk.magenta(`- Querying KintoID.EXIT_WINDOW_PERIOD at ${KINTO_ID_ADDRESS}...`));
        const kintoIdContract = new ethers.Contract(KINTO_ID_ADDRESS, kintoIdAbi, provider);
        const exitWindowPeriod = await kintoIdContract.EXIT_WINDOW_PERIOD();
        delays.kintoIdExitWindowPeriod = bnToNumber(exitWindowPeriod);
        console.log(chalk.green(`- Found KintoID.EXIT_WINDOW_PERIOD: ${delays.kintoIdExitWindowPeriod} (${formatDuration(delays.kintoIdExitWindowPeriod)})`));
    } catch (error: any) {
        console.error(chalk.red(`Error fetching KintoID.EXIT_WINDOW_PERIOD: ${error.message}`));
    }

    try {
        console.log(chalk.magenta(`- Querying KintoWallet.RECOVERY_TIME at ${KINTO_WALLET_EXAMPLE_ADDRESS}...`));
        const kintoWalletContract = new ethers.Contract(KINTO_WALLET_EXAMPLE_ADDRESS, kintoWalletAbi, provider);
        const recoveryTime = await kintoWalletContract.RECOVERY_TIME();
        delays.kintoWalletRecoveryTime = bnToNumber(recoveryTime);
        console.log(chalk.green(`- Found KintoWallet.RECOVERY_TIME: ${delays.kintoWalletRecoveryTime} (${formatDuration(delays.kintoWalletRecoveryTime)})`));
    } catch (error: any) {
        console.error(chalk.red(`Error fetching KintoWallet.RECOVERY_TIME: ${error.message}`));
    }

    return delays;
}


// -------------------------
// REPORTING FUNCTIONS
// -------------------------

// Generate roles overview report (no changes needed here)
function generateRolesOverviewReport(rolesData: Map<string, RoleData>): void {
  console.log(chalk.bold('\n================ Roles Overview ================'))
  if (rolesData.size === 0) {
    console.log(chalk.red('No roles found.'))
    return
  }
  const sortedRoles = Array.from(rolesData.values()).sort((a, b) => parseInt(a.id) - parseInt(b.id))
  for (const roleData of sortedRoles) {
    const roleName = roleNames[roleData.id] || roleData.id
    console.log(`\n${chalk.yellow(roleName)} (ID: ${chalk.gray(roleData.id)}):`)
    console.log(`  ${chalk.magenta('roleGrantDelay')}: ${chalk.green(roleData.currentGrantDelay)} (${chalk.green(formatDuration(roleData.currentGrantDelay))})`)
    if (roleData.pendingGrantDelay) {
      console.log(`  ${chalk.magenta('pendingGrantDelay')}: ${chalk.green(roleData.pendingGrantDelay.newDelay)} (${chalk.green(formatDuration(roleData.pendingGrantDelay.newDelay))}) effective at ${chalk.green(new Date(roleData.pendingGrantDelay.effect * 1000).toISOString())}`)
    }
    if (roleData.admin) console.log(`  adminRole: ${chalk.yellow(roleNames[roleData.admin] || roleData.admin)}`)
    if (roleData.guardian) console.log(`  guardianRole: ${chalk.yellow(roleNames[roleData.guardian] || roleData.guardian)}`)
    if (roleData.members.size > 0) {
      console.log(`  members (${roleData.members.size}):`)
      for (const [account, memberInfo] of roleData.members) {
        console.log(`    ${formatAddress(account)}: ${chalk.magenta('executionDelay')}: ${chalk.green(memberInfo.executionDelay)} (${chalk.green(formatDuration(memberInfo.executionDelay))})`)
        if (memberInfo.pendingDelay > 0 && memberInfo.pendingEffect > Math.floor(Date.now() / 1000)) {
          console.log(`      ${chalk.magenta('pendingExecutionDelay')}: ${chalk.green(memberInfo.pendingDelay)} (${chalk.green(formatDuration(memberInfo.pendingDelay))}) effective at ${chalk.green(new Date(memberInfo.pendingEffect * 1000).toISOString())}`)
        }
      }
    } else {
      console.log(`  members: None`)
    }
  }
}

// Generate actors and roles report (no changes needed here)
function generateActorsReport(
  rolesByActor: { [account: string]: Array<RoleInfo> },
  roleToTargetFunctions: { [roleId: string]: { [target: string]: Set<string> } },
): void {
  console.log(chalk.bold('\n================ Actors ================'))
  if (Object.keys(rolesByActor).length === 0) {
    console.log(chalk.red('\nNo actors with active roles found.'))
    return
  }
  for (const account in rolesByActor) {
    console.log(`\n${formatAddress(account)}:`)
    for (const roleInfo of rolesByActor[account]) {
      const roleName = roleNames[roleInfo.roleId] || roleInfo.roleId
      const delayStr = `${chalk.green(roleInfo.executionDelay)} (${chalk.green(formatDuration(roleInfo.executionDelay))})`
      console.log(`  ${chalk.yellow(roleName)}: ${chalk.magenta('executionDelay')}: ${delayStr}`)
      if (roleToTargetFunctions[roleInfo.roleId]) {
        console.log('    Callable targets and functions:')
        const targets = roleToTargetFunctions[roleInfo.roleId]
        if (Object.keys(targets).length === 0) {
          console.log(chalk.red('      No targets or functions configured for this role'))
        } else {
          for (const target in targets) {
            console.log(`      Target ${formatAddress(target)}:`)
            const functions = Array.from(targets[target]).map((sel) =>
              functionSignatures[sel] ? chalk.gray(functionSignatures[sel]) : chalk.gray(sel),
            )
            console.log(`        Functions: ${functions.join(', ')}`)
          }
        }
      }
    }
  }
}

// Generate targets configuration report (no changes needed here)
function generateTargetsReport(targetData: { [target: string]: TargetData }): void {
  console.log(chalk.bold('\n================ Targets ================'))
  if (Object.keys(targetData).length === 0) {
    console.log(chalk.red('\nNo target configurations found.'))
    return
  }
  for (const target in targetData) {
    console.log(`\n${formatAddress(target)}:`)
    console.log(`  ${chalk.magenta('targetAdminDelay')}: ${chalk.green(targetData[target].adminDelay)} (${chalk.green(formatDuration(targetData[target].adminDelay))})`)
    console.log(`  ${chalk.magenta('Closed')}: ${chalk.yellow(targetData[target].closed)}`)
    console.log('  Function Roles:')
    if (Object.keys(targetData[target].functions).length === 0) {
      console.log(chalk.red('    No function roles configured for this target'))
    } else {
      for (const roleId in targetData[target].functions) {
        const roleName = roleNames[roleId] || roleId
        const funcs = Array.from(targetData[target].functions[roleId]).map(
          (sel) => functionSignatures[sel] ? chalk.gray(functionSignatures[sel]) : chalk.gray(sel),
        )
        console.log(`    ${chalk.yellow(roleName)}: ${funcs.join(', ')}`)
      }
    }
  }
}

// Generate pending changes and queued operations report (no changes needed here)
function generatePendingChangesReport(
  rolesByActor: { [account: string]: Array<RoleInfo> },
  targetData: { [target: string]: TargetData },
  scheduledOps: ScheduledOperation[],
  pendingRoleGrantChanges: Array<{ roleId: string; newDelay: number; effect: number }>,
): void {
  console.log(chalk.bold('\n============= Queued Delay/Config Changes and Queued Actions ============='))
  let changesFound = false
  const currentTimestamp = Math.floor(Date.now() / 1000)

  for (const account in rolesByActor) {
    for (const roleInfo of rolesByActor[account]) {
      if (roleInfo.pendingDelay > 0 && roleInfo.pendingEffect > currentTimestamp) {
        changesFound = true
        const roleName = roleNames[roleInfo.roleId] || roleInfo.roleId
        console.log(`\nActor ${formatAddress(account)} has a scheduled change for role ${chalk.yellow(roleName)}:`)
        console.log(`  ${chalk.magenta('executionDelay')} change from ${chalk.green(roleInfo.executionDelay)} (${chalk.green(formatDuration(roleInfo.executionDelay))}) to ${chalk.green(roleInfo.pendingDelay)} (${chalk.green(formatDuration(roleInfo.pendingDelay))}) effective at ${chalk.green(new Date(roleInfo.pendingEffect * 1000).toISOString())}`)
      }
    }
  }

  let pendingAdminDelayChangesFound = false
  for (const target in targetData) {
    if (targetData[target].pendingAdminDelayChanges) {
      for (const change of targetData[target].pendingAdminDelayChanges) {
        if (change.effect > currentTimestamp) {
          changesFound = true
          pendingAdminDelayChangesFound = true
          console.log(`\nTarget ${formatAddress(target)} scheduled targetAdminDelay change:`)
          console.log(`  New ${chalk.magenta('targetAdminDelay')}: ${chalk.green(change.newDelay)} (${chalk.green(formatDuration(change.newDelay))}) effective at ${chalk.green(new Date(change.effect * 1000).toISOString())}`)
        }
      }
    }
  }
  if (!pendingAdminDelayChangesFound && !changesFound) { // Only show if no other changes found yet
      console.log(chalk.grey('No pending target admin delay changes found.')); // Less emphasis than red
  }


  if (scheduledOps.length > 0) {
    changesFound = true
    console.log(chalk.bold('\nQueued Operations:'))
    for (const op of scheduledOps) {
      const selector = op.data.slice(0, 10)
      const decodedFunction = decodeOperationData(selector, op.data)
      console.log(`\nOperation ${chalk.cyan(op.operationId)}:`)
      console.log(`    Nonce: ${chalk.yellow(op.nonce)}`)
      console.log(`    Scheduled for: ${chalk.green(new Date(op.schedule * 1000).toISOString())}`)
      console.log(`    Caller: ${formatAddress(op.caller)}`)
      console.log(`    Target: ${formatAddress(op.target)}`)
      console.log(`    Function: ${decodedFunction}`) // Removed extra gray wrap
    }
  } else {
     if (!changesFound) console.log(chalk.grey('No queued operations found.'));
  }

  console.log(chalk.bold('\nPending Role Grant Delay Changes:'))
  if (pendingRoleGrantChanges.length > 0) {
    changesFound = true
    for (const change of pendingRoleGrantChanges) {
      const roleName = roleNames[change.roleId] || change.roleId
      console.log(`  Role ${chalk.yellow(roleName)} scheduled to change grant delay to ${chalk.green(change.newDelay)} (${chalk.green(formatDuration(change.newDelay))}) effective at ${chalk.green(new Date(change.effect * 1000).toISOString())}`)
    }
  } else {
    console.log(chalk.grey('  No pending role grant delay changes found.'))
  }

  if (!changesFound && !pendingAdminDelayChangesFound && scheduledOps.length === 0 && pendingRoleGrantChanges.length === 0) {
      console.log(chalk.green('\nNo pending changes or queued actions found.')) // Changed to green
  }
}

// *** NEW FUNCTION: Generate Non-Compliant Values Report ***
function generateNonCompliantReport(nonCompliantValues: NonCompliantValue[]): void {
    console.log(chalk.bold('\n============ Non-Compliant Values (Minimum 12d Delay) ============'));

    if (nonCompliantValues.length === 0) {
        console.log(chalk.green('All checked values meet the minimum 12-day delay requirement.'));
        return;
    }

    console.log(chalk.red(`Found ${nonCompliantValues.length} non-compliant value(s):\n`));

    const requiredFormatted = `${MINIMUM_DELAY_SECONDS} (${formatDuration(MINIMUM_DELAY_SECONDS)})`;

    for (const issue of nonCompliantValues) {
        const currentFormatted = `${issue.currentValue} (${formatDuration(issue.currentValue)})`;
        switch (issue.type) {
            case 'Actor Execution Delay':
                console.log(
                    `- ${chalk.yellow('Actor Execution Delay')} for ${formatAddress(issue.location)} ` +
                    `with role ${chalk.magenta(issue.role || 'Unknown')}: ` +
                    `Current: ${chalk.red(currentFormatted)}, Required: >= ${chalk.green(requiredFormatted)}`
                );
                break;
            case 'Target Admin Delay':
                console.log(
                    `- ${chalk.yellow('Target Admin Delay')} for ${formatAddress(issue.location)}: ` +
                    `Current: ${chalk.red(currentFormatted)}, Required: >= ${chalk.green(requiredFormatted)}`
                );
                break;
            case 'KintoID Exit Window':
                console.log(
                     `- ${chalk.yellow('KintoID.EXIT_WINDOW_PERIOD')} (${formatAddress(issue.location)}): ` +
                     `Current: ${chalk.red(currentFormatted)}, Required: >= ${chalk.green(requiredFormatted)}`
                 );
                break;
            case 'KintoWallet Recovery Time':
                 console.log(
                     `- ${chalk.yellow('KintoWallet.RECOVERY_TIME')} (${formatAddress(issue.location)}): ` +
                     `Current: ${chalk.red(currentFormatted)}, Required: >= ${chalk.green(requiredFormatted)}`
                 );
                break;
            default:
                 console.log(chalk.grey(`- Unknown non-compliant type: ${JSON.stringify(issue)}`));
        }
    }
}


// -------------------------
// MAIN FUNCTION
// -------------------------

export async function runScanKintoAm(): Promise<void> {
  console.log(chalk.bold('Starting ScanKintoAm...'));
  try {
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
    const accessManager = new ethers.Contract(ACCESS_MANAGER_ADDRESS, accessManagerAbi, provider)

    const fromBlock = 0 // Start block for event queries

    console.log(chalk.blue('\nConnecting to RPC endpoint:'), chalk.gray(RPC_URL))
    console.log(chalk.blue('AccessManager contract:'), chalk.gray(ACCESS_MANAGER_ADDRESS))

    // 1. Fetch role data
    const { rolesData, rolesByActor, roleToTargetFunctions: roleFunctions1 } = await fetchRoleData(accessManager, fromBlock)

    // 2. Fetch target configuration
    const { targetData, roleToTargetFunctions: roleFunctions2 } = await fetchTargetData(accessManager, fromBlock)

    // Merge the two roleToTargetFunctions objects
    const roleToTargetFunctions = { ...roleFunctions1 }
    for (const roleId in roleFunctions2) {
      if (!roleToTargetFunctions[roleId]) roleToTargetFunctions[roleId] = {}
      for (const target in roleFunctions2[roleId]) {
        if (!roleToTargetFunctions[roleId][target]) roleToTargetFunctions[roleId][target] = new Set()
        for (const func of roleFunctions2[roleId][target]) {
          roleToTargetFunctions[roleId][target].add(func)
        }
      }
    }

    // 3. Fetch queued operations and pending changes
    const { scheduledOps, pendingRoleGrantChanges } = await fetchOperationsData(accessManager, fromBlock)

    // *** NEW: Fetch external contract delays ***
    const externalDelays = await fetchExternalContractDelays(provider);

    // 4. Verify delays and collect non-compliant values
    const nonCompliantValues: NonCompliantValue[] = [];

    // 4.1 Verify Actor Execution Delays (excluding Security Council for specified roles)
    const criticalRoles = ['0', '8663528507529876195', '14661544942390944024']; // ADMIN_ROLE, UPGRADER_ROLE, SECURITY_COUNCIL_ROLE IDs
    for (const roleId of criticalRoles) {
        const roleData = rolesData.get(roleId);
        if (roleData?.members) {
            for (const [account, memberInfo] of roleData.members) {
                if (account.toLowerCase() !== SECURITY_COUNCIL_ADDRESS) {
                    if (memberInfo.executionDelay < MINIMUM_DELAY_SECONDS) {
                        nonCompliantValues.push({
                            type: 'Actor Execution Delay',
                            location: account,
                            role: roleNames[roleId] || roleId,
                            currentValue: memberInfo.executionDelay,
                            requiredValue: MINIMUM_DELAY_SECONDS,
                        });
                    }
                }
            }
        }
    }

    // 4.2 Verify Target Admin Delays for specific targets
    const criticalTargets = [
        addressNames['KintoAppRegistry'].toLowerCase(),
        addressNames['KintoID'].toLowerCase(),
        addressNames['KintoWalletFactory'].toLowerCase()
    ];
    for (const targetAddress in targetData) {
        if (criticalTargets.includes(targetAddress.toLowerCase())) {
            if (targetData[targetAddress].adminDelay < MINIMUM_DELAY_SECONDS) {
                nonCompliantValues.push({
                    type: 'Target Admin Delay',
                    location: targetAddress,
                    currentValue: targetData[targetAddress].adminDelay,
                    requiredValue: MINIMUM_DELAY_SECONDS,
                });
            }
        }
    }

    // 4.3 Verify KintoID Exit Window Period
    if (externalDelays.kintoIdExitWindowPeriod !== undefined) {
        if (externalDelays.kintoIdExitWindowPeriod < MINIMUM_DELAY_SECONDS) {
            nonCompliantValues.push({
                type: 'KintoID Exit Window',
                location: KINTO_ID_ADDRESS,
                currentValue: externalDelays.kintoIdExitWindowPeriod,
                requiredValue: MINIMUM_DELAY_SECONDS,
            });
        }
    } else {
         console.warn(chalk.yellow('Could not verify KintoID.EXIT_WINDOW_PERIOD (fetch failed).'));
    }

    // 4.4 Verify KintoWallet Recovery Time
    if (externalDelays.kintoWalletRecoveryTime !== undefined) {
        if (externalDelays.kintoWalletRecoveryTime < MINIMUM_DELAY_SECONDS) {
            nonCompliantValues.push({
                type: 'KintoWallet Recovery Time',
                location: KINTO_WALLET_EXAMPLE_ADDRESS, // Location shown is the example wallet checked
                currentValue: externalDelays.kintoWalletRecoveryTime,
                requiredValue: MINIMUM_DELAY_SECONDS,
            });
        }
    } else {
         console.warn(chalk.yellow('Could not verify KintoWallet.RECOVERY_TIME (fetch failed).'));
    }


    // 5. Generate reports
    generateRolesOverviewReport(rolesData)
    generateActorsReport(rolesByActor, roleToTargetFunctions)
    generateTargetsReport(targetData)
    generatePendingChangesReport(rolesByActor, targetData, scheduledOps, pendingRoleGrantChanges)
    generateNonCompliantReport(nonCompliantValues); // *** NEW REPORT ***

  } catch (error) {
    console.error(chalk.red('\nError running scan:'), error)
  }
}

// Helper to run the script if executed directly
if (require.main === module) {
  runScanKintoAm().catch(error => {
    console.error('Unhandled error in script execution:', error);
    process.exit(1);
  });
}