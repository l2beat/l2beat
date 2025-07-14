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
    path.join(__dirname, 'detailedDataSizeTest.json'),
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
      biggestElement: Record<string, SSRSize>
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
    const sortedValue = value.sort(
      (a, b) =>
        parseSize(getSSRSize(b, depth + 1)) -
        parseSize(getSSRSize(a, depth + 1)),
    )

    const elements = sortedValue.map((v) => getSSRSize(v, depth + 1))

    const biggestElement = sortedValue[0] as Record<string, unknown>
    return {
      type: 'array',
      size: formatBytes(size),
      length: value.length,
      biggestElement: Object.fromEntries(
        Object.entries(biggestElement).map(([key, value]) => [
          key,
          getSSRSize(value, Number.POSITIVE_INFINITY),
        ]),
      ),
      elements,
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

  return Number.parseInt(depth)
}

function parseSize(ssr: SSRSize) {
  if (typeof ssr === 'string') {
    return Number.parseInt(ssr)
  }
  return Number.parseInt(ssr.size)
}
