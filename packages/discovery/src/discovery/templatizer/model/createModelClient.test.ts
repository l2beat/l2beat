import { expect } from 'earl'
import { CodexClient } from './CodexClient'
import { createModelClient, describeModel } from './createModelClient'
import { OpenCodeClient } from './OpenCodeClient'

describe(createModelClient.name, () => {
  it('sends an opencode/ model to opencode with the whole string as its name', () => {
    expect(createModelClient('opencode/deepseek-v4.1-flash')).toEqual(
      new OpenCodeClient({ model: 'opencode/deepseek-v4.1-flash' }),
    )
  })

  it('sends any other model to codex, other opencode providers included', () => {
    expect(createModelClient('gpt-5.6-sol')).toEqual(
      new CodexClient({ model: 'gpt-5.6-sol' }),
    )
    expect(createModelClient('deepseek/deepseek-v4.1-flash')).toEqual(
      new CodexClient({ model: 'deepseek/deepseek-v4.1-flash' }),
    )
  })

  it("leaves the model to codex's default when none is given", () => {
    expect(createModelClient(undefined)).toEqual(
      new CodexClient({ model: undefined }),
    )
  })

  describe(describeModel.name, () => {
    it('names the given model, or the codex default when none is given', () => {
      expect(describeModel('opencode/deepseek-v4.1-flash')).toEqual(
        'opencode/deepseek-v4.1-flash',
      )
      expect(describeModel(undefined)).toEqual('codex default model')
    })
  })
})
