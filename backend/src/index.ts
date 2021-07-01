import { tokenList } from '@l2beat/config'
import { setup } from './services'

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

async function main() {
  const { exchangeAddresses } = setup()
  const result = await exchangeAddresses.getExchanges(tokenList)
  console.log(result)
}
