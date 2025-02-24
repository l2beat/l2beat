import { readFileSync } from 'fs'
import path from 'path'
import {} from '@l2beat/shared-pure'
import type { TvsConfig } from '../types'

// const arbitrum = layer2s.find((l) => l.id === ProjectId('arbitrum'))
// assert(arbitrum, 'Arbitrum not found')
// assert(arbitrum.chainConfig, 'Arbitrum chain config not defined')
// const backendProject = toBackendProject(arbitrum)

// export const arbitrumConfig = mapConfig(backendProject, arbitrum.chainConfig)

const filePath = path.join(__dirname, 'arbitrum-config.json')
export const arbitrumConfig: TvsConfig = JSON.parse(
  readFileSync(filePath, 'utf8'),
)
