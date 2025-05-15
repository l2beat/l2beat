import { writeFileSync } from 'fs'
import path from 'path'
import { pages, projectPages } from './pages'

const BASE_URL = 'https://fe-rewrite-a882664d4be9.herokuapp.com'
// const BASE_URL = 'http://localhost:3000'

const results: {
  mainPages: Record<
    string,
    {
      htmlSize: string
      ssrDataSize: string
      ssrDataSizes: Record<string, SSRSize>
    }
  >
  projects: Record<
    string,
    {
      ssrDataSize: string
      ssrDataSizes: Record<string, SSRSize>
      minHtmlSize: {
        value: string
        page: string
      }
      maxHtmlSize: {
        value: string
        page: string
      }
      avgHtmlSize: string
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
    const { htmlSize, ssrDataSize, ssrDataSizes } = await testPage(page)
    results.mainPages[page] = {
      htmlSize: formatBytes(htmlSize),
      ssrDataSize: formatBytes(ssrDataSize),
      ssrDataSizes,
    }
  }
  for (const [type, pages] of Object.entries(projectPages)) {
    const typeResult: {
      page: string
      htmlSize: number
      ssrDataSize: string
      ssrDataSizes: Record<string, SSRSize>
    }[] = []
    for (const page of pages) {
      console.log(`Testing ${page}...`)
      const { htmlSize, ssrDataSize, ssrDataSizes } = await testPage(page)
      typeResult.push({
        page,
        htmlSize,
        ssrDataSize: formatBytes(ssrDataSize),
        ssrDataSizes,
      })
    }
    const firstResult = typeResult[0]
    if (!firstResult) {
      throw new Error('No results found')
    }
    const minSize = typeResult.reduce(
      (min, curr) => (curr.htmlSize < min.htmlSize ? curr : min),
      firstResult,
    )
    const maxSize = typeResult.reduce(
      (max, curr) => (curr.htmlSize > max.htmlSize ? curr : max),
      firstResult,
    )
    const avgSize =
      typeResult.reduce((sum, curr) => sum + curr.htmlSize, 0) /
      typeResult.length

    results.projects[type] = {
      minHtmlSize: { value: formatBytes(minSize.htmlSize), page: minSize.page },
      maxHtmlSize: { value: formatBytes(maxSize.htmlSize), page: maxSize.page },
      avgHtmlSize: formatBytes(avgSize),
      ssrDataSize: firstResult.ssrDataSize,
      ssrDataSizes: firstResult.ssrDataSizes,
    }
  }
  console.log('Performance test completed.')
  writeFileSync(
    path.join(__dirname, 'dataSizeTest.json'),
    JSON.stringify(results, null, 2),
  )
}

type PageResult = {
  htmlSize: number
  ssrDataSize: number
  ssrDataSizes: Record<string, SSRSize>
}

type SSRSize =
  | {
      type: 'array'
      size: string
      length: number
      elements: SSRSize[]
    }
  | {
      type: 'object'
      size: string
      fields: Record<string, SSRSize>
    }
  | string

async function testPage(page: string): Promise<PageResult> {
  const response = await fetch(`${BASE_URL}${page}`)

  let htmlSize = 0
  const reader = response.body?.getReader()

  const htmlChunks: string[] = []
  while (true && reader) {
    const { done, value } = await reader.read()
    const text = new TextDecoder().decode(value)
    htmlChunks.push(text)
    if (done) break
    htmlSize += value?.length ?? 0
  }
  const html = htmlChunks.join('')
  const ssrData = extractSSRData(html)
  if (!ssrData) {
    return { htmlSize, ssrDataSize: 0, ssrDataSizes: {} }
  }

  const ssrDataSize = JSON.stringify(ssrData).length
  const ssrDataSizes = Object.fromEntries(
    Object.entries(ssrData.props).map(([key, value]) => {
      return [key, getSSRSize(value)]
    }),
  ) as Record<string, SSRSize>

  return { htmlSize, ssrDataSize, ssrDataSizes }
}

function getSSRSize(value: unknown, depth = 0): SSRSize {
  const size = JSON.stringify(value).length

  if (depth > getDepth()) {
    return formatBytes(size)
  }

  if (Array.isArray(value)) {
    return {
      type: 'array',
      size: formatBytes(size),
      length: value.length,
      elements: value
        .map((v) => getSSRSize(v, depth + 1))
        .sort((a, b) => parseSize(b) - parseSize(a)),
    }
  }
  if (typeof value === 'object' && value !== null) {
    return {
      type: 'object',
      size: formatBytes(size),
      fields: Object.fromEntries(
        Object.entries(value)
          .map(([key, value]) => [key, getSSRSize(value, depth + 1)] as const)
          .sort(([, a], [, b]) => parseSize(b) - parseSize(a)),
      ),
    }
  }
  return formatBytes(size)
}

function extractSSRData(html: string) {
  const match = /<script>window\.__SSR_DATA__=(.*?)<\/script>/.exec(html)
  const result = match?.[1]
  if (!result) {
    return undefined
  }
  return JSON.parse(result) as { page: string; props: Record<string, unknown> }
}

function getDepth() {
  const args = process.argv.slice(2)
  const depthIndex = args.indexOf('--depth')
  const depth = depthIndex !== -1 ? args[depthIndex + 1] : null
  if (!depth) {
    return 0
  }

  return parseInt(depth)
}

function parseSize(ssr: SSRSize) {
  if (typeof ssr === 'string') {
    return parseInt(ssr)
  }
  return parseInt(ssr.size)
}

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KiB`
  }
  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(2)} MiB`
  }
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GiB`
}
