import { projects } from '@l2beat/config'
import { assert } from 'ts-essentials'

export function findProjectBridges(name: string) {
  const bridges = projects.find((x) => x.name.toLowerCase() === name.toLowerCase())?.bridges
  assert(bridges, `Couldn't find ${name} in projects config`)
  return bridges
}
