import { expect } from 'earl'
import { parseDailyCheckModel } from './config'

describe(parseDailyCheckModel.name, () => {
  it('parses a Claude model', () => {
    expect(parseDailyCheckModel('claude:opus-4.8')).toEqual({
      agent: 'claude',
      model: 'opus-4.8',
    })
  })

  it('parses a Codex model', () => {
    expect(parseDailyCheckModel('codex:gpt-5.6-sol')).toEqual({
      agent: 'codex',
      model: 'gpt-5.6-sol',
    })
  })

  it('rejects values without an agent and model', () => {
    expect(() => parseDailyCheckModel('opus')).toThrow(
      'DAILY_CHECK_MODEL must use the format',
    )
    expect(() => parseDailyCheckModel('claude:')).toThrow(
      'DAILY_CHECK_MODEL must use the format',
    )
  })

  it('rejects unsupported agents', () => {
    expect(() => parseDailyCheckModel('other:model')).toThrow(
      'Unsupported DAILY_CHECK_MODEL agent "other"',
    )
  })
})
