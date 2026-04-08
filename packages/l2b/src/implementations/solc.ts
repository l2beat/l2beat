import type { CompilerSettings } from '@l2beat/discovery'
import type { EthereumAddress } from '@l2beat/shared-pure'
import solc from 'solc'

export interface CompilationInput {
  flattenedSource: string
  contractName: string
  solidityVersion: string
  compilerSettings: CompilerSettings
  libraries: Record<string, EthereumAddress>
}

export interface CompilationOutput {
  runtimeBytecode: string
  immutableReferences: Record<string, ImmutableReference[]>
}

export interface ImmutableReference {
  start: number
  length: number
}

type SolcInstance = {
  compile: (input: string) => string
}

const solcCache = new Map<string, SolcInstance>()

export function parseSolcVersion(solidityVersion: string): string {
  // Etherscan format: "v0.8.20+commit.a1b79de6" -> "v0.8.20+commit.a1b79de6"
  // or: "0.8.20" -> "v0.8.20"
  // solc.loadRemoteVersion expects e.g. "v0.8.20+commit.a1b79de6"
  let version = solidityVersion.trim()
  if (version.startsWith('v')) {
    return version
  }
  // If it's just a semver like "0.8.20", we need the full version string
  // loadRemoteVersion needs exact version from the solc-bin list
  if (!version.includes('+')) {
    version = `v${version}`
  }
  return version
}

async function loadSolc(solidityVersion: string): Promise<SolcInstance> {
  const version = parseSolcVersion(solidityVersion)
  const cached = solcCache.get(version)
  if (cached !== undefined) {
    return cached
  }

  const instance = await new Promise<SolcInstance>((resolve, reject) => {
    solc.loadRemoteVersion(version, (err: Error | null, snapshot: unknown) => {
      if (err) {
        reject(new Error(`Failed to load solc ${version}: ${err.message}`))
      } else {
        resolve(snapshot as SolcInstance)
      }
    })
  })

  solcCache.set(version, instance)
  return instance
}

export async function compileFlattenedSource(
  input: CompilationInput,
): Promise<CompilationOutput> {
  const compiler = await loadSolc(input.solidityVersion)

  const libraries: Record<string, Record<string, string>> = {}
  if (Object.keys(input.libraries).length > 0) {
    libraries['Flattened.sol'] = {}
    for (const [name, address] of Object.entries(input.libraries)) {
      libraries['Flattened.sol'][name] = address.toString()
    }
  }

  const outputSelection = {
    '*': {
      '*': [
        'evm.deployedBytecode.object',
        'evm.deployedBytecode.immutableReferences',
      ],
    },
  }

  const rawSettings = input.compilerSettings.rawJsonSettings
  const settings = rawSettings
    ? {
        ...rawSettings,
        remappings: undefined,
        libraries,
        outputSelection,
      }
    : {
        optimizer: {
          enabled: input.compilerSettings.optimizationUsed,
          runs: input.compilerSettings.runs,
        },
        evmVersion:
          input.compilerSettings.evmVersion === 'default'
            ? undefined
            : input.compilerSettings.evmVersion,
        libraries,
        outputSelection,
      }

  const compilerInput = JSON.stringify({
    language: 'Solidity',
    sources: {
      'Flattened.sol': {
        content: input.flattenedSource,
      },
    },
    settings,
  })

  const rawOutput = compiler.compile(compilerInput)
  const output = JSON.parse(rawOutput) as SolcOutput

  if (output.errors) {
    const errors = output.errors.filter((e) => e.severity === 'error')
    if (errors.length > 0) {
      const messages = errors.map((e) => e.formattedMessage ?? e.message)
      throw new Error(
        `Compilation failed:\n${messages.join('\n')}\nsolc version: ${input.solidityVersion}\nsolc settings: ${JSON.stringify(settings)}`,
      )
    }
  }

  const contracts = output.contracts?.['Flattened.sol']
  if (!contracts) {
    throw new Error('No contracts in compilation output')
  }

  const contract = contracts[input.contractName]
  if (!contract) {
    const available = Object.keys(contracts).join(', ')
    throw new Error(
      `Contract "${input.contractName}" not found in output. Available: ${available}`,
    )
  }

  const runtimeBytecode = contract.evm?.deployedBytecode?.object
  if (!runtimeBytecode) {
    throw new Error('No runtime bytecode in compilation output')
  }

  const rawRefs = contract.evm?.deployedBytecode?.immutableReferences ?? {}
  const immutableReferences: Record<string, ImmutableReference[]> = {}
  for (const [key, refs] of Object.entries(rawRefs)) {
    immutableReferences[key] = refs.map((r) => ({
      start: r.start,
      length: r.length,
    }))
  }

  return { runtimeBytecode, immutableReferences }
}

interface SolcError {
  severity: 'error' | 'warning'
  message: string
  formattedMessage?: string
}

interface SolcContract {
  evm?: {
    deployedBytecode?: {
      object?: string
      immutableReferences?: Record<
        string,
        { start: number; length: number }[]
      >
    }
  }
}

interface SolcOutput {
  errors?: SolcError[]
  contracts?: Record<string, Record<string, SolcContract>>
}
