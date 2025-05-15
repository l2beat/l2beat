import { writeFileSync } from 'fs'
import path from 'path'
import { pages, projectPages } from './pages'

const BASE_URL = 'https://fe-rewrite-a882664d4be9.herokuapp.com'
// const BASE_URL = 'http://localhost:3000'

const results: {
  mainPages: Record<string, string>
  projects: Record<
    string,
    {
      minDuration: {
        value: string
        page: string
      }
      maxDuration: {
        value: string
        page: string
      }
      avgDuration: string
    }
  >
} = {
  mainPages: {},
  projects: {},
}

main().catch(console.error)

async function main() {
  console.log('Starting performance test...')
  for (const page of pages) {
    console.log(`Testing ${page}...`)
    const duration = await testPage(page)
    results.mainPages[page] = formatDuration(duration)
  }
  for (const [type, pages] of Object.entries(projectPages)) {
    const typeResult: { page: string; duration: number }[] = []
    for (const page of pages) {
      console.log(`Testing ${page}...`)
      const duration = await testPage(page)
      typeResult.push({ page, duration })
    }
    const firstResult = typeResult[0]
    if (!firstResult) {
      throw new Error('No results found')
    }
    const minDuration = typeResult.reduce(
      (min, curr) => (curr.duration < min.duration ? curr : min),
      firstResult,
    )
    const maxDuration = typeResult.reduce(
      (max, curr) => (curr.duration > max.duration ? curr : max),
      firstResult,
    )
    const avgDuration =
      typeResult.reduce((sum, curr) => sum + curr.duration, 0) /
      typeResult.length

    results.projects[type] = {
      minDuration: {
        value: formatDuration(minDuration.duration),
        page: minDuration.page,
      },
      maxDuration: {
        value: formatDuration(maxDuration.duration),
        page: maxDuration.page,
      },
      avgDuration: formatDuration(avgDuration),
    }
  }
  console.log('Performance test completed.')
  writeFileSync(
    path.join(__dirname, 'loadDurationTest.json'),
    JSON.stringify(results, null, 2),
  )
}

async function testPage(page: string) {
  const start = performance.now()
  await fetch(`${BASE_URL}${page}`)
  const end = performance.now()
  const duration = end - start

  return duration
}

function formatDuration(duration: number) {
  return `${Math.round(duration)} ms`
}
