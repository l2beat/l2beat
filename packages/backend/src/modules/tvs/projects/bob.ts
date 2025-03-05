import { readFileSync } from 'fs'
import path from 'path'
import { Logger } from '@l2beat/backend-tools'
import { ProjectService } from '@l2beat/config'
import { assert, ProjectId } from '@l2beat/shared-pure'
import { mapConfig } from '../mapConfig'

export async function getBobConfig(regenerate: boolean = false) {
  if (regenerate) {
    const ps = new ProjectService()
    const bob = await ps.getProject({
      id: ProjectId('bob'),
      select: ['tvlConfig', 'chainConfig'],
    })
    assert(bob, 'Bob project not found')
    return mapConfig(bob, bob.chainConfig, Logger.INFO)
  }

  const filePath = path.join(__dirname, 'bob-config.json')
  return JSON.parse(readFileSync(filePath, 'utf8'))
}
