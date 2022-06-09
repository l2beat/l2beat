import { HttpClient } from '@l2beat/common'
import { readFile } from 'fs/promises'
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

async function getDataFromFile() {
  const path = require.resolve('@l2beat/backend')
  const data = await readFile(path, { encoding: 'utf-8' })
  return JSON.parse(data)
}

async function getDataFromApi() {
  const http = new HttpClient()
  const response = await http.fetch('https://api.l2beat.com/api/data')
  if (!response.ok) {
    throw new Error(
      `Could not get data from api (received status ${response.status})`
    )
  }
  return response.json()
}

export async function getL2Data(source: 'api' | 'file'): Promise<L2Data> {
  const data =
    source === 'file' ? await getDataFromFile() : await getDataFromApi()
  return L2Data.parse(data)
}
