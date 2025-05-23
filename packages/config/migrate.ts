import { ConfigReader, getDiscoveryPaths } from '@l2beat/discovery'
import { withoutUndefinedKeys } from '@l2beat/shared-pure'
import { readFileSync, writeFileSync } from 'fs'
import { parse } from 'jsonc-parser'
import { posix } from 'path'
import { toPrettyJson } from '../discovery/dist/discovery/output/toPrettyJson'

async function main() {
  const paths = getDiscoveryPaths()
  const configReader = new ConfigReader(paths.discovery)

  const pairs = configReader.readAllProjectChainPairs()
  for (const { project, chains } of pairs) {
    const configs = chains.map((chain) =>
      readJsonc(posix.join(paths.discovery, project, chain, 'config.jsonc')),
    )

    const result = {
      $schema: '../../../../../discovery/schemas/config.v2.schema.json',
      name: project,
      import: ['../globalConfig.jsonc'],
      chains: {},
    }

    for (const config of configs) {
      result.chains[config.chain] = {
        maxAddresses: config.maxAddresses,
        maxDepth: config.maxDepth,
        initialAddresses: config.initialAddresses,
        names: config.names,
        overrides: config.overrides,
        sharedModules: config.sharedModules,
        types: config.types,
      }
    }

    writeFileSync(
      posix.join(paths.discovery, project, 'config.jsonc'),
      await toPrettyJson(result),
    )
  }
}

function readJsonc(path: string): JSON {
  const contents = readFileSync(path, 'utf-8')
  const errors: ParseError[] = []
  const parsed = parse(contents, errors, {
    allowTrailingComma: true,
  }) as JSON
  if (errors.length !== 0) {
    throw new Error(`Cannot parse file ${path}`)
  }
  return parsed
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
