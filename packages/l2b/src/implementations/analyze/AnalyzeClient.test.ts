import { expect } from 'earl'
import { strFromU8, strToU8, unzipSync } from 'fflate'
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
    process.env.L2ANALYZE_URL = 'http://127.0.0.1:1'

    try {
      let thrown: unknown
      try {
        await new AnalyzeClient().getAnalyzers()
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
      process.env.L2ANALYZE_URL = previousUrl
    }
  })
})
