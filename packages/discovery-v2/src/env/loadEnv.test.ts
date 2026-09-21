import { expect } from 'earl'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { loadEnv } from './loadEnv'

/**
 * Writes a throwaway env file and loads it explicitly. The default search
 * needs the repository layout and is covered by the CLI running against the
 * real repository; here we check the explicit path, the missing-file error
 * and that existing process values are not overwritten, which is what lets
 * CI inject secrets while a developer relies on the file.
 */
describe(loadEnv.name, () => {
  const key = 'DISCOVERY_V2_TEST_ENV_VALUE'
  let directory: string

  beforeEach(() => {
    directory = fs.mkdtempSync(path.join(os.tmpdir(), 'discovery-v2-env-'))
    delete process.env[key]
  })

  afterEach(() => {
    fs.rmSync(directory, { recursive: true, force: true })
    delete process.env[key]
  })

  it('loads the given file and reports its absolute path without values', () => {
    const file = path.join(directory, 'custom.env')
    fs.writeFileSync(file, `${key}=from-file\n`)
    const loaded = loadEnv(file)
    expect(loaded).toEqual({ file })
    expect(process.env[key]).toEqual('from-file')
  })

  it('keeps a value that is already in the process environment', () => {
    process.env[key] = 'from-process'
    const file = path.join(directory, 'custom.env')
    fs.writeFileSync(file, `${key}=from-file\n`)
    loadEnv(file)
    expect(process.env[key]).toEqual('from-process')
  })

  it('throws when an explicit file does not exist', () => {
    expect(() => loadEnv(path.join(directory, 'missing.env'))).toThrow(
      /Env file does not exist/,
    )
  })
})
