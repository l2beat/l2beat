import { expect } from 'earl'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { FileArtifactSink } from './artifacts'

describe(FileArtifactSink.name, () => {
  let root: string

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'discovery-templatizer-'))
  })

  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true })
  })

  it('creates the trail directory on first write and overwrites a file written twice', () => {
    const directory = path.join(root, 'templatizer', 'project', '0x1234')
    const sink = new FileArtifactSink(directory)

    sink.write('round-1.prompt.md', 'first')
    sink.write('round-1.prompt.md', 'second')
    sink.write('summary.json', '{}')

    expect(fs.readdirSync(directory).sort()).toEqual([
      'round-1.prompt.md',
      'summary.json',
    ])
    expect(
      fs.readFileSync(path.join(directory, 'round-1.prompt.md'), 'utf8'),
    ).toEqual('second')
  })

  it('starts fresh, dropping what an earlier run left in the directory', () => {
    const directory = path.join(root, 'templatizer', 'project', '0x1234')
    new FileArtifactSink(directory).write('round-3.response.txt', 'old')

    const sink = FileArtifactSink.fresh(directory)
    sink.write('round-1.prompt.md', 'new')

    expect(fs.readdirSync(directory)).toEqual(['round-1.prompt.md'])
    expect(FileArtifactSink.fresh(path.join(root, 'absent')).directory).toEqual(
      path.join(root, 'absent'),
    )
  })
})
