import { projects } from './projects'
import { getConfig } from './tools'

main()
async function main() {
  const config = getConfig()
  const promised = projects.map((project) => project(config))
  const results = await Promise.all(promised)
  console.log(results)
}
