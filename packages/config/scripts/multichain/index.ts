import { writeFile } from 'fs/promises'
import { fetchMultichainConfig } from './fetchMultichainConfig'
import { generateFinalConfig } from './generateFinalConfig'
import { generateIntermediateConfig } from './generateIntermediateConfig'

main()
async function main() {
  const config = await fetchMultichainConfig()
  const intermediate = generateIntermediateConfig(config)
  writeFile(
    'scripts/multichain/intermediate.json',
    JSON.stringify(intermediate, null, 2),
  )
  const final = generateFinalConfig(intermediate)
  writeFile('src/bridges/multichain.json', JSON.stringify(final, null, 2))
}
