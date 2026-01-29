import { Logger } from '@l2beat/backend-tools'
import {
  AllProviders,
  asStructured,
  codeIsEOA,
  findLeadingCommentStart,
  flattenStartingFrom,
  getChainConfigs,
  getChainFullName,
  getDiscoveryPaths,
  type IProvider,
  SQLiteCache,
} from '@l2beat/discovery'
import type { ContractSource } from '@l2beat/discovery/dist/utils/IEtherscanClient'
import { HttpClient } from '@l2beat/shared'
import { assert, ChainSpecificAddress, formatJson } from '@l2beat/shared-pure'
import { type ASTNode, parse } from '@mradomski/fast-solidity-parser'
import { BigNumber, utils } from 'ethers'

type DiffoveryResult = {
  name: string
  sources: Record<string, string>
}

export class DiffoveryController {
  private cache = new Map<string, DiffoveryResult>()
  private httpClient = new HttpClient()
  private allProviders: AllProviders

  constructor() {
    const paths = getDiscoveryPaths()
    const cache = new SQLiteCache(paths.cache)

    this.allProviders = new AllProviders(
      getChainConfigs(),
      this.httpClient,
      cache,
      Logger.SILENT,
    )
  }

  async getClient(shortChain: string): Promise<IProvider> {
    const chain = getChainFullName(shortChain)
    const blockNumber = await this.allProviders.getLatestBlockNumber(chain)
    return this.allProviders.getByBlockNumber(chain, blockNumber)
  }

  async handle(
    address: ChainSpecificAddress,
  ): Promise<DiffoveryResult | undefined> {
    const chain = ChainSpecificAddress.chain(address)
    const client = await this.getClient(chain)
    const cacheKey = address.toString()
    const cached = this.cache.get(cacheKey)
    if (cached !== undefined) {
      return cached
    }

    const code = await client.getBytecode(address)
    if (codeIsEOA(code)) {
      const result = {
        name: 'EOA',
        sources: {
          'L2BEAT-EOA': '// NOTE: Address is an EOA, does not have source code',
        },
      }
      this.cache.set(cacheKey, result)
      return result
    }

    const source = await client.getSource(address)
    const flat = this.handleSource(source)
    if (source.isVerified) {
      this.cache.set(cacheKey, {
        name: source.name,
        sources: flat,
      })
    }

    return {
      name: source.name.length > 0 ? source.name : 'Unknown',
      sources: flat,
    }
  }

  private handleSource(source: ContractSource): Record<string, string> {
    if (!source.isVerified) {
      return {
        'L2BEAT-UNVERIFIED':
          '// NOTE: Source code for this address has not been verified',
      }
    }
    const input = Object.entries(source.files)
      .map(([fileName, content]) => ({
        path: fileName,
        content,
      }))
      .filter((e) => e.path.endsWith('.sol'))

    if (input.length === 0) {
      return {
        'L2BEAT-NON-SOLIDITY':
          '// NOTE: DIFFOVERY currently does not support non-solidity contracts',
      }
    }

    const flat = flattenStartingFrom(source.name, input, source.remappings, {
      includeAll: true,
    })
    const parts = splitFlatSolidity(flat)

    const result = {
      ['#ConstructorArguments']: decodeConstructorArguments(source),
      ...parts,
    }

    return result
  }
}

function decodeConstructorArguments(source: ContractSource): string {
  if (source.constructorArguments.length === 0) {
    return 'No constructor arguments'
  }

  try {
    const abi = new utils.Interface(source.abi)
    const fragment = abi.fragments.find((x) => x.type === 'constructor')
    if (!fragment) {
      return 'Constructor arguments present but no constructor found in ABI'
    }

    const rawResult = toReadable(
      utils.defaultAbiCoder.decode(
        fragment.inputs,
        '0x' + source.constructorArguments,
      ),
    )

    return formatJson(asStructured(rawResult, fragment.inputs)).trim()
  } catch {
    return 'Error during decoding constructor arguments'
  }
}

function splitFlatSolidity(flat: string): Record<string, string> {
  const result: Record<string, string> = {}

  const AST = parse(flat, { range: true })
  for (const child of AST.children) {
    const childName = getASTTopLevelChildName(child)

    assert(childName !== undefined)
    assert(child.range !== undefined)

    const left = findLeadingCommentStart(flat, child.range[0])
    const childContent = flat.substring(left, child.range[1] + 1)
    result[childName] = childContent
  }

  return result
}

// NOTE(radomski): This function needs to handle all nodes listed in
// https://docs.soliditylang.org/en/latest/grammar.html#a4.SolidityParser
function getASTTopLevelChildName(child: ASTNode): string | undefined {
  switch (child.type) {
    case 'UsingForDeclaration':
      assert(child.libraryName !== null)
      return child.libraryName
    case 'ContractDefinition':
      return child.name
    case 'FunctionDefinition':
      assert(child.name !== null)
      return child.name
    case 'VariableDeclaration':
      assert(child.name !== null)
      return child.name
    case 'StructDefinition':
      return child.name
    case 'EnumDefinition':
      return child.name
    case 'UserDefinedTypeName':
      return child.namePath
    case 'CustomErrorDefinition':
      return child.name
    case 'EventDefinition':
      return child.name
    case 'PragmaDirective':
    case 'ImportDirective':
      return undefined
    case 'TypeDefinition':
      return child.name
    case 'FileLevelConstant':
      return child.name
    default: {
      assert(false, `Unhandled child type: ${child.type}`)
    }
  }
}

export type Readable = string | number | boolean | Readable[]

function toReadable(value: utils.Result): Readable {
  if (Array.isArray(value)) {
    return value.map(toReadable)
  }
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value
  }
  if (BigNumber.isBigNumber(value)) {
    if (
      value.gt(Number.MAX_SAFE_INTEGER.toString()) ||
      value.lt(Number.MIN_SAFE_INTEGER.toString())
    ) {
      return value.toString()
    }
    return value.toNumber()
  }
  return `${value}`
}
