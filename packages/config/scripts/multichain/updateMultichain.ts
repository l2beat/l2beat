import { writeFile } from 'fs/promises'
import { fetchMultichainConfig } from './fetchMultichainConfig'
import { generateOutput } from './generateOutput'

/*

Escrows:

1. Get all escrows through swapin & swapout as usual
2. Download all token lists for all known chainIds
2.5 https://bridgeapi.anyswap.exchange/v4/tokenlistv4/all
3. Find destinations leading back to chainid 1
4. Add those escrows

AnyTokens:

anyDAI (1) -> underlying: DAI (1)
anyDAI (250) -> underlying: DAI (250)

Goal: list all any* on Ethereum with underlying

*/

main()
async function main() {
  const config = await fetchMultichainConfig()
  const output = generateOutput(config)
  writeFile('src/bridges/multichain.json', JSON.stringify(output, null, 2))
}
