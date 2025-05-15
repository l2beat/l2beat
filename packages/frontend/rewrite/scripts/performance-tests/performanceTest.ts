import { writeFileSync } from 'fs'
import path from 'path'
import { formatBytes } from './formatBytes'
import { pages, projectPages } from './pages'

const BASE_URL = 'https://fe-rewrite-a882664d4be9.herokuapp.com'
// const BASE_URL = 'http://localhost:3000'

const results: {
  mainPages: Record<
    string,
    {
      duration: string
      size: string
    }
  >
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
      minSize: {
        value: string
        page: string
      }
      maxSize: {
        value: string
        page: string
      }
      avgSize: string
    }
  >
} = {
  mainPages: {},
  projects: {},
}

main().catch(console.error)

async function main() {
  console.log('Starting performance test...')
  for (let i = 0; i < 10; i++) {
    await testPage('/about-us')
  }
  console.log('Finished warming up website...')

  for (const page of pages) {
    console.log(`Testing ${page}...`)
    const { duration, size } = await testPage(page)
    results.mainPages[page] = {
      duration: formatDuration(duration),
      size: formatBytes(size),
    }
  }
  for (const [type, pages] of Object.entries(projectPages)) {
    const typeResult: { page: string; duration: number; size: number }[] = []
    for (const page of pages) {
      console.log(`Testing ${page}...`)
      const { size, duration } = await testPage(page)
      typeResult.push({ page, duration, size })
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

    const minSize = typeResult.reduce(
      (min, curr) => (curr.size < min.size ? curr : min),
      firstResult,
    )
    const maxSize = typeResult.reduce(
      (max, curr) => (curr.size > max.size ? curr : max),
      firstResult,
    )
    const avgSize =
      typeResult.reduce((sum, curr) => sum + curr.size, 0) / typeResult.length

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
      minSize: {
        value: formatBytes(minSize.size),
        page: minSize.page,
      },
      maxSize: {
        value: formatBytes(maxSize.size),
        page: maxSize.page,
      },
      avgSize: formatBytes(avgSize),
    }
  }
  console.log('Performance test completed.')
  writeFileSync(
    path.join(__dirname, 'performanceTest.json'),
    JSON.stringify(results, null, 2),
  )
}

async function testPage(page: string) {
  const response = await fetch(`${BASE_URL}${page}`)

  const duration = response.headers.get('metrics-execution-time')
  const size = response.headers.get('metrics-data-size')

  if (!duration || !size) {
    throw new Error('No metrics found')
  }

  return {
    duration: parseFloat(duration),
    size: parseInt(size),
  }
}

function formatDuration(duration: number) {
  return `${Math.round(duration)} ms`
}
