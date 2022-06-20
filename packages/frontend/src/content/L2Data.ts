import { HttpClient } from '@l2beat/common'
import crypto from 'crypto'
import { mkdir, readdir, readFile, stat, writeFile } from 'fs/promises'
import z from 'zod'

export const ChartData = z.object({
  types: z.tuple([z.literal('date'), z.string(), z.string()]),
  data: z.array(z.tuple([z.string(), z.number(), z.number()])),
})
export type ChartData = z.infer<typeof ChartData>

export const ProjectData = z.object({
  aggregate: ChartData,
  byToken: z.record(z.string(), ChartData),
})
export type ProjectData = z.infer<typeof ProjectData>

export const L2Data = z.object({
  aggregate: ChartData,
  byProject: z.record(z.string(), ProjectData),
})
export type L2Data = z.infer<typeof L2Data>

export async function getL2Data(apiUrl: string): Promise<L2Data> {
  const cached = await readCachedData(apiUrl)
  if (cached) {
    return cached
  }

  const http = new HttpClient()
  const response = await http.fetch(apiUrl)
  if (!response.ok) {
    throw new Error(
      `Could not get data from api (received status ${response.status})`,
    )
  }
  const json = await response.json()
  const data = L2Data.parse(json)
  await writeCachedData(apiUrl, data)
  return data
}

const TEN_MINUTES_IN_MS = 10 * 60 * 1000
async function readCachedData(apiUrl: string): Promise<L2Data | undefined> {
  const hash = getUrlHash(apiUrl)
  const now = Date.now()
  try {
    await stat('cache')
  } catch {
    await mkdir('cache')
  }
  const files = await readdir('cache')
  for (const file of files) {
    if (file.startsWith(hash)) {
      const timestamp = Number(file.slice(9, -5))
      if (now - timestamp <= TEN_MINUTES_IN_MS) {
        const contents = await readFile(`cache/${file}`, 'utf-8')
        return L2Data.parse(JSON.parse(contents))
      }
    }
  }
  return undefined
}

async function writeCachedData(apiUrl: string, data: L2Data) {
  const hash = getUrlHash(apiUrl)
  const now = Date.now()
  await writeFile(`cache/${hash}-${now}.json`, JSON.stringify(data))
}

function getUrlHash(url: string) {
  return crypto.createHash('sha256').update(url).digest('hex').slice(0, 8)
}
