import { expect } from 'earl'
import { readFileSync } from 'fs'

import { isProgramHashProven } from './isProgramHashProven'

describe(isProgramHashProven.name, () => {
  it('program hashes', () => {
    // this file includes input taken from the real tx on ethereum
    // 0x54c214bb9b0bc5dcce5f6dfef800448c0e39c1bc5295f7fe708499a2adf1acfb
    // this tx verifies both starknet and paradex
    const inputFile = 'src/test/sharpVerifierInput.txt'
    const contents = readFileSync(inputFile, 'utf-8')

    const isStarknetProven = isProgramHashProven({ input: contents }, [
      '1865367024509426979036104162713508294334262484507712987283009063059134893433',
    ])

    const isParadexProven = isProgramHashProven({ input: contents }, [
      '3258367057337572248818716706664617507069572185152472699066582725377748079373',
    ])

    expect(isStarknetProven).toEqual(true)
    expect(isParadexProven).toEqual(true)
  })
})
