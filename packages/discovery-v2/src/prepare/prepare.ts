/**
 * Everything about one address that needs no plan: the first half of V1's
 * `AddressAnalyzer.analyze`, stopped before handlers run.
 *
 * V1's proxy detection, source fetching and flattening are called, not
 * imitated, because `prepared.json` must describe the contract exactly as V1
 * would (same proxy type and `$` values, same ABI merge, same source hashes)
 * or the entry built from it cannot be compared with a V1 entry. The three
 * collaborators arrive as dependencies so tests can drive `prepare` with
 * canned proxy and source results instead of replaying the dozens of RPC
 * calls `ProxyDetector` makes.
 *
 * The flattened source exists for the model: it is the text the authoring
 * prompt shows, and it is also how V1 computes the shape hash. A source that
 * fails to flatten is kept as an empty string with a warning, as V1 logs and
 * moves on, so one broken bundle does not lose the whole address.
 */
import {
  addSolidityVersionComment,
  type ContractSources,
  codeIsEOA,
  flattenStartingFrom,
  getErrorMessage,
  getHashToBeMatched,
  getImplementationNames,
  type IProvider,
  type PerContractSource,
  ProxyDetector,
  recalculateSourceHashes,
  SourceCodeService,
} from '@l2beat/discovery'
import {
  type ChainSpecificAddress,
  withoutUndefinedKeys,
} from '@l2beat/shared-pure'
import type { Prepared, PreparedSource } from '../types/Prepared'

export interface PrepareDeps {
  provider: IProvider
  proxyDetector: Pick<ProxyDetector, 'detectProxy'>
  sourceCodeService: Pick<SourceCodeService, 'getSources'>
}

/** V1's real collaborators, for the CLI; tests build the deps by hand. */
export function defaultPrepareDeps(provider: IProvider): PrepareDeps {
  return {
    provider,
    proxyDetector: new ProxyDetector(),
    sourceCodeService: new SourceCodeService(),
  }
}

export async function prepare(
  deps: PrepareDeps,
  address: ChainSpecificAddress,
): Promise<Prepared> {
  const { provider } = deps
  const code = await provider.getBytecode(address)
  const isEOA = codeIsEOA(code)

  const proxy = await deps.proxyDetector.detectProxy(
    provider,
    address,
    undefined,
  )
  const sources = await deps.sourceCodeService.getSources(
    provider,
    proxy.addresses,
    {},
  )

  const warnings: string[] = []
  const preparedSources = sources.sources.map((bundle) =>
    toPreparedSource(bundle, warnings),
  )

  return withoutUndefinedKeys({
    chain: provider.chain,
    address,
    blockNumber: provider.blockNumber,
    timestamp: provider.timestamp,
    isEOA,
    name: isEOA ? '' : sources.name,
    isVerified: sources.isVerified,
    proxy: {
      type: proxy.type,
      values: proxy.values,
      addresses: proxy.addresses,
    },
    deployment:
      proxy.deployment === undefined
        ? undefined
        : {
            deployer: proxy.deployment.deployer,
            transactionHash: proxy.deployment.transactionHash.toString(),
            blockNumber: proxy.deployment.blockNumber,
            timestamp: proxy.deployment.timestamp,
          },
    abi: sources.abi,
    abis: sources.abis,
    sources: preparedSources,
    implementationNames: isEOA
      ? undefined
      : getImplementationNames(address, sources),
    shapeHash: shapeHashOf(sources),
    warnings,
  })
}

function toPreparedSource(
  bundle: PerContractSource,
  warnings: string[],
): PreparedSource {
  return withoutUndefinedKeys({
    address: bundle.address,
    name: bundle.name,
    hash: bundle.hash,
    solidityVersion: bundle.source.solidityVersion,
    constructorArguments: bundle.source.constructorArguments,
    flattened: flatten(bundle, warnings),
  })
}

/** Same inputs and options as V1's `flattenDiscoveredSources`, one bundle at a time. */
function flatten(bundle: PerContractSource, warnings: string[]): string {
  const input = Object.entries(bundle.source.files)
    .map(([path, content]) => ({ path, content }))
    .filter((file) => file.path.endsWith('.sol'))
  if (input.length === 0) {
    return ''
  }
  try {
    const flat = flattenStartingFrom(
      bundle.name,
      bundle.source.rootFile,
      input,
      bundle.source.remappings,
      { includeAll: true },
    )
    return addSolidityVersionComment(bundle.source.solidityVersion, flat)
  } catch (error) {
    warnings.push(
      `Flattener error at ${bundle.name} (${bundle.address}): ${getErrorMessage(error)}`,
    )
    return ''
  }
}

/**
 * V1's template-matching hash. `getHashToBeMatched` throws "No sources
 * found" when the slot it wants to match is empty; for us that is the same
 * as having no shape, so it becomes undefined and the plan store is skipped.
 * Any other error (a malformed hash) is a real fault and propagates.
 */
function shapeHashOf(sources: ContractSources): string | undefined {
  const hashes = recalculateSourceHashes(sources.sources)
  if (hashes === undefined) {
    return undefined
  }
  try {
    return getHashToBeMatched(hashes)?.toString()
  } catch (error) {
    if (getErrorMessage(error) === 'No sources found') {
      return undefined
    }
    throw error
  }
}
