import { readFileSync } from 'fs'
import path from 'path'
import type { TvsConfig } from '../types'

// const bob = await ps.getProject({ id: ProjectId('bob'), select: ['tvlConfig', 'chainConfig'] })
// export const bobConfig = mapConfig(bob, bob.chainConfig)

const filePath = path.join(__dirname, 'bob-config.json')
export const bobConfig: TvsConfig = JSON.parse(readFileSync(filePath, 'utf8'))
