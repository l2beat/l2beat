import { ChainConverter } from '@l2beat/shared-pure'
import { ProjectService } from '../../src'
import {
  generateTokenNames,
  saveTokenNames,
} from '../../src/tokens/generateTokenNames'

const DB_PATH = './build/db.sqlite'

main().catch((e: unknown) => {
  console.error(e)
})

async function main() {
  const ps = new ProjectService(DB_PATH)
  const chains = (await ps.getProjects({ select: ['chainConfig'] })).map(
    (x) => x.chainConfig,
  )
  const tokens = await ps.getTokens()

  const chainConverter = new ChainConverter(chains)

  const tokensToSave = tokens.map((token) => ({
    name: token.name,
    chain: chainConverter.toName(token.chainId),
    address: token.address,
  }))

  const names = generateTokenNames(tokensToSave)

  saveTokenNames(names)
}
