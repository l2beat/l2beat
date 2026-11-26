import { Logger } from '@l2beat/backend-tools'
import { expect } from 'earl'
import { interpretGitShowResult } from './git'

describe(interpretGitShowResult.name, () => {
  it('returns file contents and main hash on exit 0', () => {
    const res = interpretGitShowResult(
      './a.md',
      { status: 0, stdout: 'hello', stderr: '', error: undefined },
      Logger.SILENT,
      () => 'abc123',
    )
    expect(res).toEqual({ content: 'hello', mainBranchHash: 'abc123' })
  })

  it('returns empty baseline only when git confirms the path is missing on main', () => {
    expect(
      interpretGitShowResult(
        './a.md',
        {
          status: 128,
          stdout: '',
          stderr: "fatal: path 'a.md' does not exist in 'main'\n",
          error: undefined,
        },
        Logger.SILENT,
        () => 'abc123',
      ),
    ).toEqual({ content: '', mainBranchHash: '' })

    expect(
      interpretGitShowResult(
        './a.md',
        {
          status: 128,
          stdout: '',
          stderr: "fatal: path 'a.md' exists on disk, but not in 'main'\n",
          error: undefined,
        },
        Logger.SILENT,
        () => 'abc123',
      ),
    ).toEqual({ content: '', mainBranchHash: '' })
  })

  it('throws on buffer overflow or other git errors instead of wiping history', () => {
    expect(() =>
      interpretGitShowResult(
        './a.md',
        {
          status: null,
          stdout: '',
          stderr: '',
          error: Object.assign(new Error('spawnSync git ENOBUFS'), {
            code: 'ENOBUFS',
          }),
        },
        Logger.SILENT,
        () => 'abc123',
      ),
    ).toThrow('Failed to read file from main branch')

    expect(() =>
      interpretGitShowResult(
        './a.md',
        {
          status: 128,
          stdout: '',
          stderr: "fatal: invalid object name 'main'.\n",
          error: undefined,
        },
        Logger.SILENT,
        () => 'abc123',
      ),
    ).toThrow('Failed to read file from main branch')
  })
})
