import { expect } from 'earl'
import { strFromU8, strToU8, unzipSync } from 'fflate'
import { createSourcesArchive } from './AnalyzeClient'

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
