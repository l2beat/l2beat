import { assert, ChainId } from '@l2beat/shared-pure'
import { isEqual } from 'lodash'
import { type ChainConfig, ProjectService } from '../../src'
import type { GeneratedToken } from '../../src/tokens/types'
import { ScriptLogger } from './utils/ScriptLogger'
import { readGeneratedFile, readTokensFile } from './utils/fsIntegration'

describe('tokens script', () => {
  const logger = ScriptLogger.SILENT
  const tokensFile = readTokensFile(logger)
  const generatedFile = readGeneratedFile(logger)

  let chains: ChainConfig[] = []
  before(async () => {
    const ps = new ProjectService()
    const projects = await ps.getProjects({ select: ['chainConfig'] })
    chains = projects.map((x) => x.chainConfig)
  })

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
          `${chain}:${source.symbol} is missing in generated.json. Please run "pnpm tokens"`,
        )

        for (const [key, value] of Object.entries(source)) {
          if (!isEqual(output[key as keyof typeof output], value))
            throw new Error(
              `${chain}:${source.symbol} has different ${key} in generated.json. Please run "pnpm tokens"`,
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
        `${chainName}:${output.symbol} is missing in tokens.json. Please run "pnpm tokens"`,
      )
    }
  })
})
