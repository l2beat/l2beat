import { assert } from '@l2beat/backend-tools'
import { Token } from '@l2beat/shared-pure'
import { deepStrictEqual } from 'assert'

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
        const output: Token | undefined = generatedFile.tokens.find(
          (x: Token) => +x.chainId === chainId && x.address === source.address,
        )

        assert(
          output,
          `${chain}:${source.symbol} is missing in generated.json. Please run "yarn tokens"`,
        )

        for (const [key, value] of Object.entries(source)) {
          deepStrictEqual(
            output[key as keyof typeof output],
            value,
            `${chain}:${source.symbol} has different ${key} in generated.json. Please run "yarn tokens"`,
          )
        }
      }
    }
  })
})
