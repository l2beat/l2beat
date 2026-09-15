import { expect } from 'earl'
import { createPagePreloads, type ViteManifest } from './PagePreloads'

// A manifest shaped like Vite's: the entry statically imports `shared`, the
// page statically imports `shared` and `chart`, and lazily imports `dialog`.
const manifest: ViteManifest = {
  'src/ssr/ClientEntry.tsx': {
    file: 'assets/index-abc.js',
    isEntry: true,
    imports: ['_shared'],
  },
  'src/pages/layer2s/project/L2ProjectPage.tsx': {
    file: 'assets/L2ProjectPage-def.js',
    imports: ['_shared', '_chart'],
    css: ['assets/L2ProjectPage-def.css'],
  },
  _shared: { file: 'assets/shared-111.js' },
  _chart: { file: 'assets/chart-222.js', imports: ['_paths'] },
  _paths: { file: 'assets/paths-333.js' },
  _dialog: { file: 'assets/dialog-444.js' },
}

describe(createPagePreloads.name, () => {
  const preloads = createPagePreloads(manifest)

  it('preloads the page chunk and its transitive static imports', () => {
    const tags = preloads('L2ProjectPage')
    expect(tags).toInclude('href="/static/assets/L2ProjectPage-def.js"')
    expect(tags).toInclude('href="/static/assets/chart-222.js"')
    expect(tags).toInclude('href="/static/assets/paths-333.js"')
  })

  it('skips chunks the entry script already loads', () => {
    expect(preloads('L2ProjectPage')).not.toInclude('shared-111.js')
  })

  it('does not preload lazily imported chunks', () => {
    expect(preloads('L2ProjectPage')).not.toInclude('dialog-444.js')
  })

  it('links the page stylesheet', () => {
    expect(preloads('L2ProjectPage')).toInclude(
      '<link rel="stylesheet" crossorigin href="/static/assets/L2ProjectPage-def.css">',
    )
  })

  it('emits nothing for a page missing from the manifest', () => {
    expect(preloads('HomePage')).toEqual('')
  })
})
