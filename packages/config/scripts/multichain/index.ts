import { writeFile } from 'fs/promises'
import { fetchMultichainConfig } from './fetchMultichainConfig'
import { generateOutput } from './generateOutput'

main()
async function main() {
  const config = await fetchMultichainConfig()
  const output = generateOutput(config)
  writeFile('src/bridges/multichain.json', JSON.stringify(output, null, 2))
}
