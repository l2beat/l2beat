import { readFileSync } from 'fs'
import path from 'path'
import { Logger } from '@l2beat/backend-tools'
import { ProjectService } from '@l2beat/config'
import { assert, ProjectId } from '@l2beat/shared-pure'
import { mapConfig } from '../mapConfig'

export async function getArbitrumConfig(regenerate: boolean = false) {
  if (regenerate) {
    const ps = new ProjectService()
    const arbitrum = await ps.getProject({
      id: ProjectId('arbitrum'),
      select: ['tvlConfig', 'chainConfig'],
    })
    assert(arbitrum, 'Arbitrum project not found')
    return mapConfig(arbitrum, Logger.INFO)
  }

  const filePath = path.join(__dirname, 'arbitrum-config.json')
  return JSON.parse(readFileSync(filePath, 'utf8'))
}
