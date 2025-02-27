import { readFileSync } from 'fs'
import path from 'path'
import type { TvsConfig } from '../types'

// const arbitrum = await ps.getProject({ id: ProjectId('arbitrum'), select: ['tvlConfig', 'chainConfig'] })
// export const arbitrumConfig = mapConfig(arbitrum, arbitrum.chainConfig)

const filePath = path.join(__dirname, 'arbitrum-config.json')
export const arbitrumConfig: TvsConfig = JSON.parse(
  readFileSync(filePath, 'utf8'),
)
