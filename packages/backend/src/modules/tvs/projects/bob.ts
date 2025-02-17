import { readFileSync } from 'fs'
import path from 'path'
import type { TvsConfig } from '../types'

// const bob = layer2s.find((l) => l.id === ProjectId('bob'))
// assert(bob, 'Arbitrum not found')
// assert(bob.chainConfig, 'Arbitrum chain config not defined')
// const backendProject = toBackendProject(bob)

// export const bobConfig = mapConfig(backendProject, bob.chainConfig)

const filePath = path.join(__dirname, 'bob-config.json')
export const bobConfig: TvsConfig = JSON.parse(readFileSync(filePath, 'utf8'))
