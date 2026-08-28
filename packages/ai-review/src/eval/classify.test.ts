import { expect } from 'earl'
import { classifyStratum } from './classify.js'

describe(classifyStratum.name, () => {
  it('picks the majority stratum', () => {
    expect(
      classifyStratum([
        'packages/backend/src/a.ts',
        'packages/backend/src/b.ts',
        'packages/frontend/src/c.tsx',
      ]),
    ).toEqual('backend')
  })

  it('counts discovery and config as config', () => {
    expect(
      classifyStratum([
        'packages/config/src/projects/x.ts',
        'packages/discovery/src/y.ts',
      ]),
    ).toEqual('config')
  })

  it('returns other for root-only changes', () => {
    expect(classifyStratum(['README.md', 'package.json'])).toEqual('other')
  })

  it('prefers a package stratum over other on ties', () => {
    expect(classifyStratum(['README.md', 'packages/frontend/x.ts'])).toEqual(
      'frontend',
    )
  })
})
