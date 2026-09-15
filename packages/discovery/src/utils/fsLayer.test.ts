import { expect } from 'earl'
import {
  mkdirSync,
  mkdtempSync,
  renameSync,
  rmSync,
  utimesSync,
  writeFileSync,
} from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { fileExistsCaseSensitive } from './fsLayer'

// Listings are cached per directory, so each test mutates a real temporary
// directory between lookups and forces a distinct mtime to prove the cache
// notices the change instead of serving a stale listing.
describe(fileExistsCaseSensitive.name, () => {
  let root: string

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'fsLayer-'))
  })

  afterEach(() => {
    rmSync(root, { recursive: true, force: true })
  })

  it('matches the exact basename only', () => {
    writeFileSync(join(root, 'README.md'), '')

    expect(fileExistsCaseSensitive(join(root, 'README.md'))).toEqual(true)
    expect(fileExistsCaseSensitive(join(root, 'readme.md'))).toEqual(false)
  })

  it('sees entries added after the directory was listed', () => {
    expect(fileExistsCaseSensitive(join(root, 'project'))).toEqual(false)

    mkdirSync(join(root, 'project'))
    bumpMtime(root)

    expect(fileExistsCaseSensitive(join(root, 'project'))).toEqual(true)
  })

  it('sees entries renamed after the directory was listed', () => {
    mkdirSync(join(root, 'Project'))
    expect(fileExistsCaseSensitive(join(root, 'Project'))).toEqual(true)

    renameSync(join(root, 'Project'), join(root, 'project'))
    bumpMtime(root)

    expect(fileExistsCaseSensitive(join(root, 'Project'))).toEqual(false)
    expect(fileExistsCaseSensitive(join(root, 'project'))).toEqual(true)
  })
})

// Coarse-grained filesystems can give two quick mutations the same mtime.
function bumpMtime(directory: string) {
  const future = new Date(Date.now() + 60_000)
  utimesSync(directory, future, future)
}
