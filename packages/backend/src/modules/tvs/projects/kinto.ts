import { readFileSync } from 'fs'
import path from 'path'
import { Logger } from '@l2beat/backend-tools'
import { ProjectService } from '@l2beat/config'
import { assert, ProjectId } from '@l2beat/shared-pure'
import { mapConfig } from '../mapConfig'

export async function getKintoConfig(regenerate: boolean = false) {
  if (regenerate) {
    const ps = new ProjectService()
    const kinto = await ps.getProject({
      id: ProjectId('kinto'),
      select: ['tvlConfig', 'chainConfig'],
    })
    assert(kinto, 'Kinto project not found')
    return mapConfig(kinto, kinto.chainConfig, Logger.INFO)
  }

  const filePath = path.join(__dirname, 'kinto-config.json')
  return JSON.parse(readFileSync(filePath, 'utf8'))
}
