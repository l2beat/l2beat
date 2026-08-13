import type { Logger } from '@l2beat/backend-tools'
import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import merge from 'lodash/merge'
import { BlipRuntime } from '../blip/BlipRuntime'
import type {
  AddressesWithTemplates,
  Analysis,
  ExtendedTemplate,
} from '../discovery/analysis/AddressAnalyzer'
import type { TemplateService } from '../discovery/analysis/TemplateService'
import type { StructureContractConfig } from '../discovery/config/structureUtils'
import { orderByCopyDependencies } from '../discovery/handlers/orderByCopyDependencies'
import type { ContractValue } from '../discovery/output/types'
import { sha2_256bit } from '../flatten/utils'
import { decodeFunctionResult } from './cairoValues'
import {
  deriveContractName,
  generateAbiStrings,
  generateCairoInterface,
} from './generateCairoInterface'
import { pruneScarbWorkspace } from './pruneScarbWorkspace'
import type { StarknetDiscoveryProvider } from './StarknetDiscoveryProvider'
import {
  getViewFunctions,
  hasFunction,
  parseSierraAbi,
  type SierraAbi,
} from './sierraAbi'
import { starknetSelector } from './starknetKeccak'
import { getStarknetRoles, hasRolesEvents } from './starknetRoles'

export interface StarknetAnalysisResult {
  analysis: Analysis
  /** Deterministic single-file source, written to .flat/<Name>.sol */
  flatSource?: string
}

const REPLACEABLE_FUNCTIONS = ['replace_to', 'get_upgrade_delay']
// SNIP-6 account interface. Requiring is_valid_signature avoids
// misclassifying protocol contracts that merely expose an execute entrypoint
// (e.g. the strk20 privacy pool's IClient).
const ACCOUNT_FUNCTIONS = ['__execute__', '__validate__', 'is_valid_signature']

export async function analyzeStarknetContract(
  provider: StarknetDiscoveryProvider,
  address: ChainSpecificAddress,
  config: StructureContractConfig,
  templateService: TemplateService,
  logger: Logger,
  suggestedTemplates?: Set<string>,
): Promise<StarknetAnalysisResult> {
  const rawAddress = ChainSpecificAddress.address(address).toString()

  const classHash = await provider.getClassHashAt(rawAddress)
  if (classHash === undefined) {
    return { analysis: emptyEoa(address) }
  }

  const contractClass = await provider.getClass(classHash)
  const abi = parseSierraAbi(contractClass?.abi ?? [])

  if (ACCOUNT_FUNCTIONS.every((fn) => hasFunction(abi, fn))) {
    const account = emptyEoa(address)
    account.values = { $accountClassHash: classHash }
    return { analysis: account }
  }

  const voyagerInfo = await provider.getVoyagerContractInfo(rawAddress)

  const name =
    sanitizeName(voyagerInfo?.contractAlias) ??
    sanitizeName(voyagerInfo?.classAlias) ??
    deriveContractName(abi, 'Contract')

  const voyagerSource = await provider.getVoyagerSource(classHash)
  const isVerified = voyagerSource !== undefined
  // The fallback interface must not depend on the per-contract explorer
  // alias, so contracts sharing a class share a source hash (shape matching)
  const interfaceName = deriveContractName(abi, 'Contract')
  const files =
    voyagerSource !== undefined
      ? pruneScarbWorkspace(voyagerSource.files, abi)
      : ({
          [`${interfaceName}.cairo`]: generateCairoInterface(
            interfaceName,
            classHash,
            abi,
          ),
        } as Record<string, string>)
  const flatSource = flattenCairoSource(files)
  // Not flatteningHash: that runs the Solidity parser, this is Cairo
  const sourceHash = sha2_256bit(flatSource)

  // Apply the template before reading values so its ignoreMethods,
  // ignoreRelatives and field configs take effect, like in the EVM analyzer
  const extendedTemplate = applyTemplate(
    templateService,
    config,
    address,
    sourceHash,
    suggestedTemplates,
    logger,
  )

  const values: Record<string, ContractValue | undefined> = {
    $classHash: classHash,
  }

  for (const fn of getViewFunctions(abi)) {
    if (fn.inputs.length > 0 || fn.outputs.length === 0) {
      continue
    }
    if (config.ignoreMethods.includes(fn.name)) {
      continue
    }
    const outcome = await provider.call(rawAddress, starknetSelector(fn.name))
    if (!outcome.success) {
      logger.warn(`Call to ${fn.name} on ${address} failed`, {
        error: outcome.error,
      })
      continue
    }
    values[fn.name] = decodeFunctionResult(outcome.result, fn.outputs, abi)
  }

  // User-configured fields: `call` handlers with a Cairo method name and raw
  // felt calldata, e.g. { "handler": { "type": "call", "method":
  // "channel_exists", "args": ["0x123"] } }. Other handler types are EVM-only.
  for (const [field, fieldConfig] of Object.entries(config.fields)) {
    const handler = fieldConfig.handler
    if (handler === undefined) {
      continue
    }
    if (handler.type !== 'call') {
      logger.warn(
        `Field ${field} on ${address}: handler type '${handler.type}' is not supported on Starknet`,
      )
      continue
    }
    const method = handler.method ?? field
    const fn = abi.functions.find((f) => f.name === method)
    if (fn === undefined) {
      logger.warn(`Field ${field} on ${address}: no function named ${method}`)
      continue
    }
    let calldata: string[]
    try {
      calldata = handler.args.map(toCalldataFelt)
    } catch (error) {
      logger.warn(`Field ${field} on ${address}: ${getMessage(error)}`)
      continue
    }
    const outcome = await provider.call(
      rawAddress,
      starknetSelector(method),
      calldata,
    )
    if (!outcome.success) {
      logger.warn(`Field ${field} on ${address}: call failed`, {
        error: outcome.error,
      })
      continue
    }
    values[field] = decodeFunctionResult(outcome.result, fn.outputs, abi)
  }

  if (hasRolesEvents(abi)) {
    values.$roles = await getStarknetRoles(
      provider,
      rawAddress,
      voyagerInfo?.deploymentBlockNumber ?? 0,
    )
  }

  applyCopyAndEdit(values, config, provider.blockNumber, address, logger)

  const abiStrings = generateAbiStrings(abi)

  const analysis: Analysis = {
    type: 'Contract',
    name,
    address,
    deploymentTimestamp:
      voyagerInfo?.deploymentTimestamp !== undefined
        ? UnixTime(voyagerInfo.deploymentTimestamp)
        : undefined,
    deploymentBlockNumber: voyagerInfo?.deploymentBlockNumber,
    // The UI's code panel only fetches sources for entries that carry
    // implementationNames, so name the contract itself like the EVM analyzer
    implementationNames: { [address.toString()]: name } as Record<
      ChainSpecificAddress,
      string
    >,
    isVerified,
    proxyType: isReplaceable(abi) ? 'StarkWare Replaceable' : undefined,
    implementations: [],
    extendedTemplate,
    values,
    errors: {},
    abis: { [address.toString()]: abiStrings },
    sourceBundles: [
      {
        name,
        address,
        hash: sourceHash,
        source: {
          name,
          rootFile: undefined,
          isVerified,
          abi: abiStrings,
          solidityVersion: voyagerSource?.compilerVersion ?? '',
          constructorArguments: '',
          files,
          remappings: [],
          libraries: {},
        },
      },
    ],
    relatives: extractRelatives(values, config, address),
  }

  return { analysis, flatSource }
}

/**
 * The `copy` and `edit` (BLIP) field configs from the EVM pipeline, applied
 * to the collected values. Used e.g. to derive per-role holder fields from
 * $roles so permissions can differ per role. Unlike the EVM pipeline, errors
 * drop the field with a warning and no prefixAddresses pass runs afterwards -
 * only ContractAddress-decoded values may look like addresses by design.
 */
function applyCopyAndEdit(
  values: Record<string, ContractValue | undefined>,
  config: StructureContractConfig,
  blockNumber: number,
  address: ChainSpecificAddress,
  logger: Logger,
): void {
  const runtime = new BlipRuntime(config.types ?? {}, {
    blockNumber,
    chainName: 'starknet',
  })

  const fields = merge({}, values, config.fields)
  for (const batch of orderByCopyDependencies(fields)) {
    for (const fieldName of batch) {
      const copy = config.fields[fieldName]?.copy
      if (copy === undefined) {
        continue
      }
      if (values[copy] === undefined) {
        logger.warn(`Field ${fieldName} on ${address}: copy ${copy} not found`)
        continue
      }
      values[fieldName] = values[copy]
    }
  }

  for (const fieldName in config.fields) {
    const edit = config.fields[fieldName]?.edit
    if (edit === undefined || values[fieldName] === undefined) {
      continue
    }
    try {
      values[fieldName] = runtime.executeBlip(values[fieldName], edit)
    } catch (error) {
      logger.warn(
        `Field ${fieldName} on ${address}: edit failed - ${getMessage(error)}`,
      )
      delete values[fieldName]
    }
  }
}

/** Calldata felts for `call` handler args: hex/decimal strings, numbers, or strk: addresses */
function toCalldataFelt(arg: string | number): string {
  if (typeof arg === 'number') {
    if (!Number.isInteger(arg) || arg < 0) {
      throw new Error(`Invalid calldata number: ${arg}`)
    }
    return `0x${arg.toString(16)}`
  }
  if (ChainSpecificAddress.check(arg)) {
    return ChainSpecificAddress.address(
      arg as unknown as ChainSpecificAddress,
    ).toString()
  }
  if (/^0x[0-9a-fA-F]+$/.test(arg)) {
    return arg
  }
  if (/^\d+$/.test(arg)) {
    return `0x${BigInt(arg).toString(16)}`
  }
  throw new Error(`Cannot encode calldata argument: ${arg}`)
}

function getMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

function applyTemplate(
  templateService: TemplateService,
  config: StructureContractConfig,
  address: ChainSpecificAddress,
  sourceHash: ReturnType<typeof sha2_256bit>,
  suggestedTemplates: Set<string> | undefined,
  logger: Logger,
): ExtendedTemplate | undefined {
  let template: string | undefined
  let reason: ExtendedTemplate['reason'] | undefined

  const suggested = [...(suggestedTemplates ?? [])]
  if (suggested.length > 0) {
    template = suggested[0]
    reason = 'byReferrer'
    if (suggested.length > 1) {
      logger.warn(
        `Multiple templates suggested for ${address}: ${suggested.join(', ')}`,
      )
    }
  } else {
    const matching = templateService.findMatchingTemplatesByHash(
      sourceHash,
      address,
    )
    template = matching[0]
    reason = 'byShapeMatch'
    if (matching.length > 1) {
      logger.warn(
        `Multiple shapes matched for ${address}: ${matching.join(', ')}`,
      )
    }
  }

  if (template === undefined || reason === undefined) {
    return undefined
  }

  config.pushValues(templateService.loadContractTemplate(template))
  return {
    template,
    reason,
    templateHash: templateService.getTemplateHash(template),
  }
}

function emptyEoa(address: ChainSpecificAddress): Analysis & { type: 'EOA' } {
  return {
    type: 'EOA',
    name: undefined,
    address,
    isVerified: true,
    implementations: [],
    values: {},
    errors: {},
    abis: {},
    sourceBundles: [],
    relatives: {},
  }
}

/**
 * Explorer aliases can be arbitrary prose ('Starknet: Canonical Privacy
 * Pool'). Entry names become .flat filenames, so they must be portable
 * identifiers (a ':' in a committed filename breaks git on Windows).
 */
function sanitizeName(alias: string | undefined): string | undefined {
  if (alias === undefined) {
    return undefined
  }
  const name = alias
    .split(/[^a-zA-Z0-9]+/)
    .filter((word) => word !== '')
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join('')
  return name === '' ? undefined : name
}

function isReplaceable(abi: SierraAbi): boolean {
  return REPLACEABLE_FUNCTIONS.every((fn) => hasFunction(abi, fn))
}

/**
 * Every decoded ContractAddress becomes a relative to crawl. Only values
 * decoded from ContractAddress-typed outputs are ChainSpecificAddress
 * strings, so plain felts never leak into the graph. Fields configured with
 * a `template` (in config or an applied template) suggest that template for
 * the addresses they contain, like in the EVM analyzer.
 */
function extractRelatives(
  values: Record<string, ContractValue | undefined>,
  config: StructureContractConfig,
  self: ChainSpecificAddress,
): AddressesWithTemplates {
  const relatives: AddressesWithTemplates = {}
  if (config.ignoreRelatives === true) {
    return relatives
  }
  const zero = ChainSpecificAddress.ZERO('starknet').toString()

  const visit = (value: ContractValue | undefined, template?: string) => {
    if (value === undefined) {
      return
    }
    if (typeof value === 'string') {
      if (
        ChainSpecificAddress.check(value) &&
        ChainSpecificAddress.chain(value as ChainSpecificAddress) === 'strk' &&
        value !== zero &&
        value !== self.toString()
      ) {
        relatives[value] ??= new Set()
        if (template !== undefined) {
          relatives[value].add(template)
        }
      }
      return
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        visit(item, template)
      }
      return
    }
    if (typeof value === 'object') {
      for (const item of Object.values(value)) {
        visit(item, template)
      }
    }
  }

  for (const [field, value] of Object.entries(values)) {
    if (config.ignoreRelatives.includes(field)) {
      continue
    }
    const handler = config.fields[field]?.handler
    if (
      handler !== undefined &&
      'ignoreRelative' in handler &&
      handler.ignoreRelative === true
    ) {
      continue
    }
    visit(value, config.fields[field]?.template)
  }

  return relatives
}

/** Deterministic single-file rendering of a Cairo source tree, code first */
export function flattenCairoSource(files: Record<string, string>): string {
  const paths = Object.keys(files)
    .filter(isTextSourceFile)
    .sort((a, b) => fileOrder(a) - fileOrder(b) || a.localeCompare(b))
  const sections: string[] = []
  for (const path of paths) {
    sections.push(
      `// ${'='.repeat(70)}\n// File: ${path}\n// ${'='.repeat(70)}\n\n${files[path]}`,
    )
  }
  return `${sections.join('\n\n').trimEnd()}\n`
}

function isTextSourceFile(path: string): boolean {
  return (
    path.endsWith('.cairo') ||
    path.endsWith('Scarb.toml') ||
    path.endsWith('Scarb.lock')
  )
}

function fileOrder(path: string): number {
  if (path.endsWith('.cairo')) return 0
  if (path.endsWith('Scarb.toml')) return 1
  return 2
}
