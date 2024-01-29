import { assert } from '@l2beat/backend-tools'

import { chains } from '../../src'
import { readGeneratedFile, readTokensFile } from './utils/fsIntegration'
import { ScriptLogger } from './utils/ScriptLogger'

describe('tokens script', () => {
  it('every source has corresponding output entry', () => {
    const logger = ScriptLogger.SILENT

    const tokensFile = readTokensFile(logger)
    const generatedFile = readGeneratedFile(logger)

    for (const [chain, tokens] of Object.entries(tokensFile)) {
      const chainId = chains.find((x) => x.name === chain)?.chainId
      assert(chainId, `Unknown chain ${chain}`)

      for (const source of tokens) {
        const output = generatedFile.tokens.find(
          (x) => +x.chainId === chainId && x.address === source.address,
        )

        assert(
          output,
          `${chain}:${source.symbol} is missing in generated.json. Please run "yarn tokens"`,
        )

        // TODO check fields
      }
    }
  })

  it('every output entry has corresponding source', () => {})
})
