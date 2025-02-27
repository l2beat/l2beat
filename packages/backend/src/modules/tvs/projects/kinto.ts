import { readFileSync } from 'fs'
import path from 'path'
import type { TvsConfig } from '../types'

// const kinto = await ps.getProject({ id: ProjectId('kinto'), select: ['tvlConfig', 'chainConfig'] })
// export const kintoConfig = mapConfig(kinto, kinto.chainConfig)

const filePath = path.join(__dirname, 'kinto-config.json')
export const kintoConfig: TvsConfig = JSON.parse(readFileSync(filePath, 'utf8'))
