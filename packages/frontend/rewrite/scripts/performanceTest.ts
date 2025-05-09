import { writeFileSync } from 'fs'

const BASE_URL = 'https://fe-rewrite-a882664d4be9.herokuapp.com'
// const BASE_URL = 'http://localhost:3000'
const pages = [
  '/scaling/summary',
  '/scaling/risk',
  '/scaling/tvs',
  '/scaling/activity',
  '/scaling/data-availability',
  '/scaling/liveness',
  '/scaling/finality',
  '/scaling/costs',
  '/scaling/upcoming',
  '/scaling/archived',
  '/bridges/summary',
  '/bridges/archived',
  '/data-availability/summary',
  '/data-availability/risk',
  '/data-availability/throughput',
  '/zk-catalog',
  '/about-us',
  '/donate',
  '/glossary',
  '/faq',
  '/governance',
  '/governance/publications',
  '/governance/publications/governance-review-50',
]

const projectPages = {
  scaling: [
    '/scaling/projects/arbitrum',
    '/scaling/projects/base',
    '/scaling/projects/unichain',
    '/scaling/projects/linea',
    '/scaling/projects/fuel',
    '/scaling/projects/zora',
    '/scaling/projects/gasp',
  ],
  bridges: [
    '/bridges/projects/sonicgateway',
    '/bridges/projects/omni',
    '/bridges/projects/connext',
    '/bridges/projects/acrossv3',
    '/bridges/projects/opticsv2',
    '/bridges/projects/transporter',
  ],
  dataAvailability: [
    '/data-availability/projects/ethereum/ethereum',
    '/data-availability/projects/celestia/no-bridge',
    '/data-availability/projects/memo/no-bridge',
    '/data-availability/projects/near/no-bridge',
    '/data-availability/projects/espresso-da/espresso-da',
    '/data-availability/projects/eigen-da/no-bridge',
  ],
  zkCatalog: [
    '/zk-catalog/abstract',
    '/zk-catalog/nebra-upa',
    '/zk-catalog/worldcoin-smtb',
    '/zk-catalog/zeronetwork',
    '/zk-catalog/starknet',
    '/zk-catalog/zksync-era',
    '/zk-catalog/zkcandy',
  ],
}

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
  for (const page of pages) {
    console.log(`Testing ${page}...`)
    const { duration, bytes } = await testPage(page)
    results.mainPages[page] = {
      duration: formatDuration(duration),
      size: formatBytes(bytes),
    }
  }
  for (const [type, pages] of Object.entries(projectPages)) {
    const typeResult: { page: string; duration: number; bytes: number }[] = []
    for (const page of pages) {
      console.log(`Testing ${page}...`)
      const { duration, bytes } = await testPage(page)
      typeResult.push({ page, duration, bytes })
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
      (min, curr) => (curr.bytes < min.bytes ? curr : min),
      firstResult,
    )
    const maxSize = typeResult.reduce(
      (max, curr) => (curr.bytes > max.bytes ? curr : max),
      firstResult,
    )
    const avgSize =
      typeResult.reduce((sum, curr) => sum + curr.bytes, 0) / typeResult.length

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
      minSize: { value: formatBytes(minSize.bytes), page: minSize.page },
      maxSize: { value: formatBytes(maxSize.bytes), page: maxSize.page },
      avgSize: formatBytes(avgSize),
    }
  }
  console.log('Performance test completed.')
  writeFileSync('result.json', JSON.stringify(results, null, 2))
}

async function testPage(page: string) {
  const start = performance.now()
  const response = await fetch(`${BASE_URL}${page}`)
  const end = performance.now()
  const duration = end - start

  let bytes = 0
  const reader = response.body?.getReader()

  while (true && reader) {
    const { done, value } = await reader.read()
    if (done) break
    bytes += value.length
  }
  return { duration, bytes }
}

function formatBytes(bytes: number) {
  return `${(bytes / 1024).toFixed(2)} KiB`
}

function formatDuration(duration: number) {
  return `${Math.round(duration)} ms`
}
