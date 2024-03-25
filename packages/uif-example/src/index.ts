import { Application } from './Application'

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

async function main(): Promise<void> {
  const application = new Application()
  await application.start()
}
