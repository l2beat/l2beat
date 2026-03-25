import * as fs from 'fs'
import * as path from 'path'
import { ChainSpecificAddress, EthereumAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { BigNumber, utils } from 'ethers'

import type { IProvider } from '../../provider/IProvider'
import type { Handler, HandlerResult } from '../Handler'

export type EnumerableRolesHandlerDefinition = v.infer<
  typeof EnumerableRolesHandlerDefinition
>
export const EnumerableRolesHandlerDefinition = v.strictObject({
  type: v.literal('enumerableRoles'),
  roleNames: v.record(v.string(), v.string()).optional(),
  pickRoleMembers: v.string().optional(),
  flatDir: v.string().optional(),
  ignoreRelative: v.boolean().optional(),
})

const roleSetAbi = new utils.Interface([
  'event RoleSet(address indexed holder, uint256 indexed role, bool indexed active)',
])

const roleHoldersFragment = utils.FunctionFragment.from(
  'roleHolders(bytes32) view returns (address[])',
)

// Regex for: bytes32 public constant NAME = keccak256("NAME")
// Also handles inline hex: bytes32 public constant NAME = 0x...; // keccak256("NAME")
const ROLE_CONSTANT_REGEX =
  /bytes32\s+public\s+constant\s+(\w+)\s*=\s*keccak256\s*\(\s*"([^"]+)"\s*\)/g

/**
 * Scan all .sol files in the project's .flat/ directory for bytes32 constant
 * definitions that use keccak256("..."). Computes the hash and builds a
 * hash→name map so we can label roles discovered from events.
 */
function scanFlatSourcesForRoleNames(flatDir: string): Map<string, string> {
  const hashToName = new Map<string, string>()

  let entries: string[]
  try {
    entries = fs.readdirSync(flatDir)
  } catch {
    return hashToName
  }

  for (const entry of entries) {
    const entryPath = path.join(flatDir, entry)
    const stat = fs.statSync(entryPath)

    let solFiles: string[]
    if (stat.isDirectory()) {
      try {
        solFiles = fs
          .readdirSync(entryPath)
          .filter((f) => f.endsWith('.sol'))
          .map((f) => path.join(entryPath, f))
      } catch {
        continue
      }
    } else if (entry.endsWith('.sol')) {
      solFiles = [entryPath]
    } else {
      continue
    }

    for (const solFile of solFiles) {
      try {
        const source = fs.readFileSync(solFile, 'utf-8')
        let match: RegExpExecArray | null
        ROLE_CONSTANT_REGEX.lastIndex = 0
        while ((match = ROLE_CONSTANT_REGEX.exec(source)) !== null) {
          const constantName = match[1]!
          const keccakInput = match[2]!
          const hash = utils.solidityKeccak256(['string'], [keccakInput])
          hashToName.set(hash.toLowerCase(), constantName)
        }
      } catch {
        continue
      }
    }
  }

  return hashToName
}

export class EnumerableRolesHandler implements Handler {
  readonly dependencies: string[] = []
  private readonly userRoleNames: Record<string, string>

  constructor(
    readonly field: string,
    private readonly definition: EnumerableRolesHandlerDefinition,
    _abi: string[],
  ) {
    this.userRoleNames = definition.roleNames ?? {}
  }

  async execute(
    provider: IProvider,
    address: ChainSpecificAddress,
  ): Promise<HandlerResult> {
    try {
      const chain = ChainSpecificAddress.chain(address)

      // Step 1: Build hash→name map by scanning all .flat/ sources
      const flatDir = this.definition.flatDir
        ? path.resolve(process.cwd(), this.definition.flatDir)
        : path.join(process.cwd(), '.flat')
      const hashToName = scanFlatSourcesForRoleNames(flatDir)

      // User-provided mappings override source-derived names
      for (const [hash, name] of Object.entries(this.userRoleNames)) {
        hashToName.set(hash.toLowerCase(), name)
      }

      // Step 2: Discover ALL role hashes from RoleSet events
      const roleHashes = new Set<string>()

      const logs = await provider.getLogs(address, [
        [roleSetAbi.getEventTopic('RoleSet')],
      ])

      for (const log of logs) {
        const roleHash = log.topics[2]
        if (roleHash) {
          roleHashes.add(roleHash)
        }
      }

      // Step 3: Query current roleHolders for each discovered role
      const roles: Record<string, string[]> = {}

      for (const hash of roleHashes) {
        const name = hashToName.get(hash.toLowerCase()) ?? hash
        try {
          const bytes32Hash = utils.hexZeroPad(
            BigNumber.from(hash).toHexString(),
            32,
          )
          const holders = await provider.callMethod<string[]>(
            address,
            roleHoldersFragment,
            [bytes32Hash],
          )
          roles[name] = (holders ?? []).map((h) =>
            ChainSpecificAddress.from(chain, EthereumAddress(h)).toString(),
          )
        } catch {
          roles[name] = []
        }
      }

      if (this.definition.pickRoleMembers !== undefined) {
        const role = this.definition.pickRoleMembers
        const members = roles[role]
        if (members === undefined) {
          return {
            field: this.field,
            error: `Role "${role}" not found`,
          }
        }
        return {
          field: this.field,
          value: members,
          ignoreRelative: this.definition.ignoreRelative,
        }
      }

      return {
        field: this.field,
        value: roles,
        ignoreRelative: this.definition.ignoreRelative,
      }
    } catch (e) {
      return {
        field: this.field,
        error: e instanceof Error ? e.message : 'Unknown error',
      }
    }
  }
}
