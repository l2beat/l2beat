import { projects } from '@l2beat/config'
import { assert } from 'ts-essentials'

export function findProjectMetadata(name: string) {
  const metadata = projects.find((x) => x.name.toLowerCase() === name.toLowerCase())?.details
  assert(metadata, `Couldn't find ${name} in projects metadata config`)
  return metadata
}
