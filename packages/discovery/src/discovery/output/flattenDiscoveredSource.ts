import { posix } from 'path'
import { assert } from '@l2beat/shared-pure'
import { FileContent } from '../../flatten/ParsedFilesManager'
import { flattenStartingFrom } from '../../flatten/flatten'
import { formatSI, getThroughput, timed } from '../../utils/timing'
import { DiscoveryLogger } from '../DiscoveryLogger'
import { Analysis } from '../analysis/AddressAnalyzer'

export function flattenDiscoveredSources(
  results: Analysis[],
  logger: DiscoveryLogger,
): Record<string, string> {
  const nameCounts = new Map<string, number>()
  for (const contract of results) {
    if (contract.type === 'EOA') {
      continue
    }

    const name = contract.name
    const count = nameCounts.get(name) || 0
    nameCounts.set(name, count + 1)
  }

  const flatSources: Record<string, string> = {}
  for (const analyzedContract of results) {
    try {
      if (analyzedContract.type === 'EOA') {
        continue
      }

      let outName = analyzedContract.name
      const count = nameCounts.get(outName) || 0
      if (count > 1) {
        outName = `${outName}-${analyzedContract.address}`
      }

      let containingDirectory = ''
      if (analyzedContract.sourceBundles.length > 1) {
        containingDirectory = outName
      }

      for (const [
        bundleIndex,
        bundle,
      ] of analyzedContract.sourceBundles.entries()) {
        const input: FileContent[] = Object.entries(bundle.source.files)
          .map(([fileName, content]) => ({
            path: fileName,
            content,
          }))
          .filter((e) => e.path.endsWith('.sol'))

        if (input.length === 0) {
          logger.log(`[SKIP]: ${outName}-${bundle.name} no .sol files`)
          continue
        }

        const result = timed(() => {
          const output = flattenStartingFrom(
            bundle.name,
            input,
            bundle.source.remappings,
          )

          return output
        })

        const throughput = formatThroughput(input, result.executionTime)

        const flatContent = addSolidityVersionComment(
          bundle.source.solidityVersion,
          result.value,
        )

        const fileName =
          analyzedContract.sourceBundles.length > 1 ? bundle.name : outName

        const hasProxy = analyzedContract.sourceBundles.length > 1
        const isProxy = hasProxy && bundleIndex === 0
        const hasManyImplementations = analyzedContract.sourceBundles.length > 2

        const implementationPostfix = hasManyImplementations
          ? `.${bundleIndex}`
          : ''
        const proxyPostfix = isProxy ? '.p' : ''
        const postfix = isProxy ? proxyPostfix : implementationPostfix

        const path = posix.join(
          containingDirectory,
          `${fileName}${postfix}.sol`,
        )
        flatSources[path] = flatContent

        logger.log(`[ OK ]: ${outName} @ ${throughput}`)
      }
    } catch (e) {
      assert(analyzedContract.type !== 'EOA', 'This should never happen')
      const contractName = analyzedContract.derivedName ?? analyzedContract.name

      logger.log(`[FAIL]: ${contractName} - ${stringifyError(e)}`)
    }
  }

  return flatSources
}

function addSolidityVersionComment(
  solidityVersion: string,
  flatSource: string,
): string {
  return `// Compiled with solc version: ${solidityVersion}\n\n${flatSource}`
}

function formatThroughput(
  input: FileContent[],
  executionTimeMilliseconds: number,
): string {
  const sourceLineCount = input.reduce(
    (acc, { content }) => acc + content.split('\n').length,
    0,
  )
  const throughput = formatSI(
    getThroughput(sourceLineCount, executionTimeMilliseconds),
    'lines/s',
  )

  return throughput
}

function stringifyError(e: unknown): string {
  if (e instanceof Error) {
    return e.message
  } else if (typeof e === 'string') {
    return e
  }

  return JSON.stringify(e)
}
