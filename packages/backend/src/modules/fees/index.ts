import { writeFileSync } from 'fs'

import { Fee, Feenalyzer } from './types'

// node -r esbuild-register src/modules/fees/index.ts

async function main() {
  const feenalyzers: Feenalyzer[] = []

  for (const f of feenalyzers) {
    const data: Fee[] = []
    for (let i = f.fromBlock; i <= f.toBlock; i++) {
      const fee = await f.getData(i)
      data.push(fee)
    }
    writeFileSync(
      `./src/modules/fees/${f.name}.csv`,
      data.map((d) => Object.values(d).join(';')).join('\n'),
    )
  }
}

main().catch((e: unknown) => {
  console.error(e)
})
