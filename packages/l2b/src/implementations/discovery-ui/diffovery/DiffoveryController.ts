import {
  type ExplorerConfig,
  type IEtherscanClient,
  flattenStartingFrom,
  getChainConfig,
  getChainFullName,
  getExplorerClient,
} from '@l2beat/discovery'
import { HttpClient } from '@l2beat/shared'
import { assert, type EthereumAddress } from '@l2beat/shared-pure'
import { type ASTNode, parse } from '@mradomski/fast-solidity-parser'

export class DiffoveryController {
  private cache = new Map<string, string>()
  private clients = new Map<string, IEtherscanClient>()
  private httpClient = new HttpClient()

  constructor(private readonly apiKey: string) {}

  getClient(chain: string): IEtherscanClient {
    let client = this.clients.get(chain)
    if (client) {
      return client
    }

    const fullChainName = getChainFullName(chain)
    const config = getChainConfig(fullChainName)
    client = getExplorerClient(this.httpClient, {
      ...config.explorer,
      apiKey: this.apiKey,
    } as ExplorerConfig)
    this.clients.set(chain, client)
    return client
  }

  async handle(
    chain: string,
    address: EthereumAddress,
  ): Promise<Record<string, string> | undefined> {
    const client = this.getClient(chain)
    const cacheKey = `${chain}:${address.toString()}`
    const cached = this.cache.get(cacheKey)
    if (cached !== undefined) {
      return splitFlatSolidity(cached)
    }

    const source = await client.getContractSource(address)
    const input = Object.entries(source.files)
      .map(([fileName, content]) => ({
        path: fileName,
        content,
      }))
      .filter((e) => e.path.endsWith('.sol'))

    if (input.length === 0) {
      return undefined
    }

    const flat = flattenStartingFrom(source.name, input, source.remappings, {
      includeAll: true,
    })
    this.cache.set(cacheKey, flat)
    return splitFlatSolidity(flat)
  }
}

function splitFlatSolidity(flat: string): Record<string, string> {
  const result: Record<string, string> = {}

  const AST = parse(flat, { range: true })
  for (const child of AST.children) {
    const childName = getASTTopLevelChildName(child)

    assert(childName !== undefined)
    assert(child.range !== undefined)

    const childContent = flat.substring(child.range[0], child.range[1] + 1)
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
    default: {
      assert(false, `Unhandled child type: ${child.type}`)
    }
  }
}
