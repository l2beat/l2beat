import { getPagePaths } from '~/server/pagePaths'
import { testPage } from './testPage'

async function main() {
  const pages = await getPagePaths()

  for (const page of pages) {
    console.log(
      `Testing ${page} (${pages.indexOf(page) + 1} of ${pages.length})`,
    )

    const result = await testPage(`http://localhost:3000${page}`)
    if (result.type === 'error') {
      console.error(
        `HTTP ${result.status}: ${result.message} - Failed to fetch ${result.url}`,
      )
      process.exit(1)
    }
  }
}

main().catch(console.error)
