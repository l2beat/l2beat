import { expect } from 'earl'
import { strFromU8, strToU8, unzipSync } from 'fflate'
import { FetchError } from 'node-fetch'
import {
  AnalyzeClient,
  AnalyzeClientError,
  createSourcesArchive,
} from './AnalyzeClient'

describe(createSourcesArchive.name, () => {
  it('preserves nested source paths in the zip archive', () => {
    const archive = createSourcesArchive({
      'contracts/token/Token.sol': strToU8('contract Token {}'),
      'interfaces/IERC20.sol': strToU8('interface IERC20 {}'),
    })

    const files = unzipSync(archive)
    expect(Object.keys(files).sort()).toEqual([
      'contracts/token/Token.sol',
      'interfaces/IERC20.sol',
    ])
    expect(strFromU8(files['contracts/token/Token.sol']!)).toEqual(
      'contract Token {}',
    )
  })
})

describe(AnalyzeClient.name, () => {
  it('wraps transport failures as AnalyzeClientError', async () => {
    const previousUrl = process.env.L2ANALYZE_URL
    const previousApiKey = process.env.L2ANALYZE_API_KEY
    process.env.L2ANALYZE_URL = 'http://analyze.test'
    process.env.L2ANALYZE_API_KEY = 'test-api-key'

    try {
      const client = new AnalyzeClient(() => {
        throw new FetchError('connection refused', 'system')
      })

      let thrown: unknown
      try {
        await client.getAnalyzers()
      } catch (error) {
        thrown = error
      }

      expect(thrown).toBeA(AnalyzeClientError)
      expect((thrown as AnalyzeClientError).status).toEqual(502)
      expect(
        (thrown as AnalyzeClientError).message.startsWith(
          'Analyze service request failed:',
        ),
      ).toEqual(true)
    } finally {
      if (previousUrl === undefined) {
        Reflect.deleteProperty(process.env, 'L2ANALYZE_URL')
      } else {
        process.env.L2ANALYZE_URL = previousUrl
      }
      if (previousApiKey === undefined) {
        Reflect.deleteProperty(process.env, 'L2ANALYZE_API_KEY')
      } else {
        process.env.L2ANALYZE_API_KEY = previousApiKey
      }
    }
  })
})
