import { readdirSync, readFileSync } from 'fs'

const BRIDGES_PATH = '../config/src/bridges/'
const LAYER2_PATH = '../config/src/layer2s/'

export function getHardcoded(): Record<string, number> {
  const hardcoded: Record<string, number> = {}

  readdirSync(BRIDGES_PATH)
    .filter(
      (f) =>
        f.includes('.ts') &&
        !f.includes('index.ts') &&
        !f.includes('index.test.ts') &&
        !f.includes('lzOmnichain.escrows.ts'),
    )
    .forEach((bridgeFile) => {
      const contents = readFileSync(`${BRIDGES_PATH}${bridgeFile}`, 'utf-8')
      const count = [...contents.matchAll(/0x[a-fA-F0-9]{40}/g)].length
      const id = contents.match(/ProjectId\('(.*)'\)/)

      if (id && id[1]) {
        hardcoded[id[1]] = count
      }
    })

  readdirSync(LAYER2_PATH)
    .filter(
      (f) =>
        f.includes('.ts') &&
        !f.includes('index.ts') &&
        !f.includes('index.test.ts'),
    )
    .forEach((layer2File) => {
      const contents = readFileSync(`${LAYER2_PATH}${layer2File}`, 'utf-8')

      const count = [...contents.matchAll(/0x[a-fA-F0-9]{40}/g)].length
      const id = contents.match(/ProjectId\('(.*)'\)/)

      if (id && id[1]) {
        hardcoded[id[1]] = count
      }
    })

  return hardcoded
}
