import { Logger } from '@l2beat/backend-tools'
import { expect } from 'earl'
import { join } from 'path'
import { type CoreResult, readExamples, runExampleCore } from '../core'
import { normalize } from '../snapshot/json'
import { RpcReplay } from '../snapshot/replay'
import { hashExampleDefinition, SnapshotService } from '../snapshot/service'

describe('interop examples', () => {
  const definitions = readExamples()
  const snapshotService = new SnapshotService({
    rootDir: join(__dirname, '..', 'snapshots'),
    noCompression: false,
  })
  const manifest = snapshotService.readManifest()
  const sealedExamples = Object.keys(manifest.examples)

  describe('example and manifest definition hashes should match', async () => {
    for (const example of sealedExamples) {
      it(example, () => {
        const definition = definitions[example]
        if (!definition) {
          throw new Error(
            'Definition for ' + example + ' not found - remove snapshot files',
          )
        }

        const currentHash = hashExampleDefinition(definition)
        const manifestEntry = manifest.examples[example]
        const sealedHash = manifestEntry.definitionHash

        expect(sealedHash).toEqual(currentHash)
      })
    }
  })

  describe('sealed snapshots should match inputs and outputs', () => {
    for (const example of sealedExamples) {
      it(example, async () => {
        const definition = definitions[example]
        if (!definition) {
          throw new Error(
            'Definition for ' + example + ' not found - remove snapshot files',
          )
        }

        const [inputs, outputs] = await Promise.all([
          snapshotService.readInputs(example),
          snapshotService.readOutputs(example),
        ])

        const result = await runExampleCore(definition, {
          makeRpcClient: ({ chain, multicallClient }) => {
            return RpcReplay.create({
              chain,
              multicallClient,
              inputs,
              logger: Logger.SILENT,
            })
          },
        })

        expect(normalize(result)).toEqual(normalize(outputs) as CoreResult)
      })
    }
  })
})
