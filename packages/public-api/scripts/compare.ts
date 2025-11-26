import { v } from '@l2beat/validate'
import { writeFileSync } from 'fs'
import path from 'path'
import { ProjectSchema } from '../src/routes/projects/types'

const prod = 'https://api.l2beat.com'
const local = 'http://localhost:3000'

const tvsRanges = ['7d', '30d', '90d', '180d', '1y', 'max']
const activityRanges = ['30d', '90d', '180d', '1y', 'max']

export async function main() {
  const projects = await fetch(withApiKey(`${prod}/v1/projects`))
  const projectsData = await projects.json()
  const parsedProjects = v.array(ProjectSchema).parse(projectsData)

  const toCheck = [
    'v1/tvs',
    ...tvsRanges.map((range) => `v1/tvs?range=${range}`),
    ...parsedProjects.map((project) => `v1/tvs/${project.id}`),
    ...parsedProjects.flatMap((project) =>
      tvsRanges.map((range) => `v1/tvs/${project.id}?range=${range}`),
    ),
    'v1/activity',
    ...activityRanges.map((range) => `v1/activity?range=${range}`),
    ...parsedProjects.map((project) => `v1/activity/${project.id}`),
    ...parsedProjects.flatMap((project) =>
      activityRanges.map((range) => `v1/activity/${project.id}?range=${range}`),
    ),
  ]

  const diffs: string[] = []

  for (const endpoint of toCheck) {
    console.log(`Checking ${endpoint}...`)
    const [prodResponse, localResponse] = await Promise.all([
      fetch(withApiKey(`${prod}/${endpoint}`)),
      fetch(withApiKey(`${local}/${endpoint}`)),
    ])
    const prodDataJson = await prodResponse.json()
    const localDataJson = await localResponse.json()

    if (
      JSON.stringify(roundNestedValues(prodDataJson)) !==
      JSON.stringify(roundNestedValues(localDataJson))
    ) {
      console.log(`Diff found for ${endpoint}`)
      diffs.push(endpoint)
    }
  }
  writeFileSync(
    path.join(__dirname, 'diffs.json'),
    JSON.stringify(diffs, null, 2),
  )
}

function roundNestedValues(data: unknown) {
  if (Array.isArray(data)) {
    return data.map(roundNestedValues)
  }
  if (data === null || data === undefined) {
    return data
  }
  if (typeof data === 'object') {
    for (const key in data) {
      const keyValue = data[key]
      if (typeof keyValue === 'number') {
        data[key] = Math.round(keyValue)
      }
      if (typeof keyValue === 'object') {
        data[key] = roundNestedValues(keyValue)
      }
    }
  }
  return data
}

main().catch(console.error)

function withApiKey(url: string) {
  if (url.includes('?')) {
    return `${url}&apiKey=twojastara123`
  }
  return `${url}?apiKey=twojastara123`
}
