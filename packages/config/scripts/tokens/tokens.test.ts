import { assert } from '@l2beat/backend-tools'
import { ChainId } from '@l2beat/shared-pure'
import { deepStrictEqual } from 'assert'

import { chains } from '../../src'
import { GeneratedToken } from '../../src/tokens/types'
import { readGeneratedFile, readTokensFile } from './utils/fsIntegration'
import { ScriptLogger } from './utils/ScriptLogger'

describe('tokens script', () => {
  const logger = ScriptLogger.SILENT
  const tokensFile = readTokensFile(logger)
  const generatedFile = readGeneratedFile(logger)

  it('every source has corresponding output entry', () => {
    for (const [chain, tokens] of Object.entries(tokensFile)) {
      const chainNumber = chains.find((x) => x.name === chain)?.chainId
      assert(chainNumber, `Unknown chain ${chain}`)
      const chainId = ChainId(chainNumber)

      for (const source of tokens) {
        const output: GeneratedToken | undefined = generatedFile.tokens.find(
          (x: GeneratedToken) =>
            x.chainId === chainId && x.address === source.address,
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

  it('every output entry has corresponding source', () => {
    for (const output of generatedFile.tokens) {
      const chainName = chains.find((x) => x.chainId === +output.chainId)?.name
      assert(chainName, `Unknown chain ${output.chainId.toString()}`)

      const source = tokensFile[chainName].find(
        (x) => x.address === output.address,
      )

      assert(
        source,
        `${chainName}:${output.symbol} is missing in tokens.json. Please run "yarn tokens"`,
      )
    }
  })
})
