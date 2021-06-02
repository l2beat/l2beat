import { projects } from './projects'
import { setup } from './services'

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

async function main() {
  const services = setup()

  const promised = projects.map((project) => project(services))
  const results = await Promise.all(promised)
  console.log(results)
}
