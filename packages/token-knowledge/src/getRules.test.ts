import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { expect } from 'earl'
import { getRulesContent, getRulesPath } from './getRules'

describe('rules loading', () => {
  it('reads rules from the source tree in development', () => {
    const root = mkdtempSync(path.join(tmpdir(), 'token-knowledge-rules-src-'))
    const srcDir = path.join(root, 'src')
    const trpcDir = path.join(srcDir, 'trpc')
    mkdirSync(trpcDir, { recursive: true })

    const rulesPath = path.join(srcDir, 'rules.lp')
    writeFileSync(rulesPath, 'source rules')

    expect(getRulesPath(trpcDir)).toEqual(rulesPath)
    expect(getRulesContent(trpcDir)).toEqual('source rules')
  })

  it('reads rules from the build output in production', () => {
    const root = mkdtempSync(
      path.join(tmpdir(), 'token-knowledge-rules-build-'),
    )
    const buildDir = path.join(root, 'build')
    const trpcDir = path.join(buildDir, 'trpc')
    mkdirSync(trpcDir, { recursive: true })

    const rulesPath = path.join(buildDir, 'rules.lp')
    writeFileSync(rulesPath, 'build rules')

    expect(getRulesPath(trpcDir)).toEqual(rulesPath)
    expect(getRulesContent(trpcDir)).toEqual('build rules')
  })

  it('falls back to source rules when the build asset is missing', () => {
    const root = mkdtempSync(
      path.join(tmpdir(), 'token-knowledge-rules-fallback-'),
    )
    const srcDir = path.join(root, 'src')
    const trpcDir = path.join(root, 'build', 'trpc')
    mkdirSync(srcDir, { recursive: true })
    mkdirSync(trpcDir, { recursive: true })

    const rulesPath = path.join(srcDir, 'rules.lp')
    writeFileSync(rulesPath, 'fallback rules')

    expect(getRulesPath(trpcDir)).toEqual(rulesPath)
    expect(getRulesContent(trpcDir)).toEqual('fallback rules')
  })
})
