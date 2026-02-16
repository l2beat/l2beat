import { type Env, getEnv, Logger } from '@l2beat/backend-tools'
import type { HttpClient } from '@l2beat/shared'
import { getTokenDbClient, type TokenDbClient } from '@l2beat/token-backend'
import { expect, mockObject } from 'earl'
import { join } from 'path'
import { readExamples } from '../core'
import { ExampleRunner } from '../runner'
import { normalize } from '../snapshot/json'
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

  withTokenDbClient(
    'sealed snapshots should match inputs and outputs',
    async (tokenDbClient) => {
      for (const example of sealedExamples) {
        it(example, async () => {
          const definition = definitions[example]
          if (!definition) {
            throw new Error(
              'Definition for ' +
                example +
                ' not found - remove snapshot files',
            )
          }

          const [inputs, outputs] = await Promise.all([
            snapshotService.readInputs(example),
            snapshotService.readOutputs(example),
          ])

          const runner = new ExampleRunner({
            exampleId: example,
            example: definition,
            logger: Logger.SILENT,
            http: mockObject<HttpClient>({}),
            tokenDbClient,
            snapshotService,
            env: mockObject<Env>({}),
            mode: 'replay',
            inputs,
          })

          const result = await runner.run()

          expect(normalize(result)).toEqual(normalize(outputs))
        })
      }
    },
  )
})

export function withTokenDbClient(
  name: string,
  suite: (client: TokenDbClient) => void,
) {
  const client = getTestTokenDbClient()

  describe(name, function () {
    before(async function () {
      if (!client) {
        this.skip()
      }
    })

    if (client) {
      suite(client)
    } else {
      it.skip('Token DB client tests skipped')
    }
  })
}

function getTestTokenDbClient() {
  const env = getEnv()
  const apiUrl = env.optionalString('TOKEN_BACKEND_TRPC_URL')
  const authToken = env.optionalString('TOKEN_BACKEND_CF_TOKEN')
  if (!apiUrl || !authToken) {
    if (env.optionalString('CI') !== undefined) {
      throw new Error(
        'TOKEN_BACKEND_TRPC_URL and TOKEN_BACKEND_CF_TOKEN are required in CI',
      )
    }
    return
  }

  const database = getTokenDbClient({
    apiUrl,
    authToken,
    callSource: 'interop-tests',
  })

  return database
}
