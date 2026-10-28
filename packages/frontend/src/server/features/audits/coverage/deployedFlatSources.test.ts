import { expect } from 'earl'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'fs'
import os from 'os'
import path from 'path'
import {
  indexFlatSources,
  readFlatDirectory,
  sha256,
  stripFlatHeader,
} from './deployedFlatSources'

describe('deployedFlatSources', () => {
  const body = 'contract A {}\n'
  const withHeader = `// SPDX-License-Identifier: Unknown\npragma solidity 0.8.20;\n\n${body}`

  it('strips the header discovery prepends and nothing else', () => {
    expect(stripFlatHeader(withHeader)).toEqual(body)
    expect(stripFlatHeader(body)).toEqual(body)
  })

  it('indexes the stripped sources by their sha256', () => {
    const index = indexFlatSources({ 'A.sol': withHeader, 'B.sol': 'x' })
    expect(index.get(sha256(body))).toEqual(body)
    expect(index.get(sha256('x'))).toEqual('x')
    expect(index.size).toEqual(2)
  })

  it('reads every Solidity file of a .flat directory, proxies included', () => {
    const dir = mkdtempSync(path.join(os.tmpdir(), 'flat-'))
    try {
      writeFileSync(path.join(dir, 'A.sol'), withHeader)
      mkdirSync(path.join(dir, 'P'))
      writeFileSync(path.join(dir, 'P', 'Proxy.p.sol'), 'proxy')
      writeFileSync(path.join(dir, 'P', 'Impl.sol'), 'impl')
      writeFileSync(path.join(dir, 'notes.txt'), 'ignored')
      const files = readFlatDirectory(dir)
      expect(Object.keys(files).map((f) => path.relative(dir, f))).toEqual([
        'A.sol',
        'P/Impl.sol',
        'P/Proxy.p.sol',
      ])
      expect(indexFlatSources(files).get(sha256(body))).toEqual(body)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })
})
