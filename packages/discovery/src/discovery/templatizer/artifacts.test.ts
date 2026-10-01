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
})
