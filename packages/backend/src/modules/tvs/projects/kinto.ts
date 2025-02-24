import { readFileSync } from 'fs'
import path from 'path'
import {} from '@l2beat/shared-pure'
import type { TvsConfig } from '../types'

// const kinto = layer2s.find((l) => l.id === ProjectId('kinto'))
// assert(kinto, 'Kinto not found')
// assert(kinto.chainConfig, 'Kinto chain config not defined')
// const backendProject = toBackendProject(kinto)

// export const kintoConfig = mapConfig(backendProject, kinto.chainConfig)

const filePath = path.join(__dirname, 'kinto-config.json')
export const kintoConfig: TvsConfig = JSON.parse(readFileSync(filePath, 'utf8'))
