/**
 * The flattened source the model reads, produced exactly as V1 produces
 * the `.flat` files at save time, so the prompt shows the text a
 * researcher would open for the same contract.
 *
 * A bundle that fails to flatten becomes an empty string plus a warning:
 * the draft is decided from the ABI, the baseline and the worklist, and one
 * broken bundle must not cost the whole contract its template.
 */
import type { Logger } from '@l2beat/backend-tools'
import { flattenStartingFrom } from '../../flatten/flatten'
import { getErrorMessage } from '../../utils/getErrorMessage'
import { addSolidityVersionComment } from '../output/flattenDiscoveredSource'
import type { PerContractSource } from '../source/SourceCodeService'
import type { FlatSource } from './facts'

export function flattenSources(
  bundles: readonly PerContractSource[],
  logger: Logger,
): FlatSource[] {
  return bundles.map((bundle) => ({
    address: bundle.address,
    name: bundle.name,
    flattened: flattenBundle(bundle, logger),
  }))
}

function flattenBundle(bundle: PerContractSource, logger: Logger): string {
  const files = solidityFiles(bundle)
  if (files.length === 0) {
    return ''
  }
  try {
    const flat = flattenStartingFrom(
      bundle.name,
      bundle.source.rootFile,
      files,
      bundle.source.remappings,
      { includeAll: true },
    )
    return addSolidityVersionComment(bundle.source.solidityVersion, flat)
  } catch (error) {
    logger.warn('Could not flatten source for the templatizer', {
      name: bundle.name,
      address: bundle.address,
      error: getErrorMessage(error),
    })
    return ''
  }
}

function solidityFiles(bundle: PerContractSource) {
  return Object.entries(bundle.source.files)
    .map(([path, content]) => ({ path, content }))
    .filter((file) => file.path.endsWith('.sol'))
}
