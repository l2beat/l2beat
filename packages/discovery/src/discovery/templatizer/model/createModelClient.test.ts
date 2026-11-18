import { expect } from 'earl'
import { rejectedBy } from '../../../utils/thrownBy'
import { CodexClient } from './CodexClient'
import { chooseModel, describeModel } from './createModelClient'
import { OpenCodeClient } from './OpenCodeClient'

describe(chooseModel.name, () => {
  const DEEPSEEK_LEVELS = ['low', 'high', 'max']

  /** opencode's model list, as `openCodeEffortLevels` reads it. */
  function listing(levels: Record<string, string[]>) {
    return async (model: string) => levels[model]
  }

  it('sends a model of an opencode gateway, Zen or Go, to opencode at high effort by default', async () => {
    const levelsOf = listing({
      'opencode/deepseek-v4.1-flash': DEEPSEEK_LEVELS,
      'opencode-go/deepseek-v4.1-flash': DEEPSEEK_LEVELS,
    })

    const zen = await chooseModel(
      { model: 'opencode/deepseek-v4.1-flash' },
      levelsOf,
    )
    const go = await chooseModel(
      { model: 'opencode-go/deepseek-v4.1-flash' },
      levelsOf,
    )

    expect(zen.client).toEqual(
      new OpenCodeClient({
        model: 'opencode/deepseek-v4.1-flash',
        variant: 'high',
      }),
    )
    expect(go).toEqual({
      client: new OpenCodeClient({
        model: 'opencode-go/deepseek-v4.1-flash',
        variant: 'high',
      }),
      label: 'opencode-go/deepseek-v4.1-flash, high effort',
      effort: 'high',
    })
  })

  it('passes an effort the model has as its variant', async () => {
    const chosen = await chooseModel(
      { model: 'opencode-go/deepseek-v4.1-flash', effort: 'max' },
      listing({ 'opencode-go/deepseek-v4.1-flash': DEEPSEEK_LEVELS }),
    )

    expect(chosen.client).toEqual(
      new OpenCodeClient({
        model: 'opencode-go/deepseek-v4.1-flash',
        variant: 'max',
      }),
    )
  })

  it('refuses an effort the model lacks, which opencode would silently ignore', async () => {
    const levelsOf = listing({
      'opencode-go/deepseek-v4.1-flash': DEEPSEEK_LEVELS,
      'opencode-go/qwen3.8-flash': ['low', 'medium', 'xhigh'],
    })

    const asked = await rejectedBy(
      chooseModel(
        { model: 'opencode-go/deepseek-v4.1-flash', effort: 'medium' },
        levelsOf,
      ),
    )
    expect(asked.message).toEqual(
      'The model does not offer that effort; pass --ai-effort with one of its levels',
    )
    expect(asked.cause).toEqual({
      model: 'opencode-go/deepseek-v4.1-flash',
      effort: 'medium effort',
      levels: ['low', 'high', 'max'],
    })
    const byDefault = await rejectedBy(
      chooseModel({ model: 'opencode-go/qwen3.8-flash' }, levelsOf),
    )
    expect(byDefault.cause).toEqual({
      model: 'opencode-go/qwen3.8-flash',
      effort: 'high effort, the default',
      levels: ['low', 'medium', 'xhigh'],
    })
  })

  it('runs a model without effort levels as it is, unless an effort was asked for', async () => {
    const levelsOf = listing({ 'opencode-go/kimi-k2.7-code': [] })

    const chosen = await chooseModel(
      { model: 'opencode-go/kimi-k2.7-code' },
      levelsOf,
    )

    expect(chosen).toEqual({
      client: new OpenCodeClient({
        model: 'opencode-go/kimi-k2.7-code',
        variant: undefined,
      }),
      label: 'opencode-go/kimi-k2.7-code',
      effort: undefined,
    })
    const error = await rejectedBy(
      chooseModel(
        { model: 'opencode-go/kimi-k2.7-code', effort: 'high' },
        levelsOf,
      ),
    )
    expect(error.message).toEqual(
      'The model has no effort levels; leave --ai-effort out to run it',
    )
    expect(error.cause).toEqual({ model: 'opencode-go/kimi-k2.7-code' })
  })

  it('refuses a model opencode does not list', async () => {
    const error = await rejectedBy(
      chooseModel({ model: 'opencode-go/deepsek-v4.1-flash' }, listing({})),
    )
    expect(error.message).toEqual('opencode lists no such model')
    expect(error.cause).toEqual({
      model: 'opencode-go/deepsek-v4.1-flash',
      listModelsCommand: 'opencode models opencode-go',
    })
  })

  it('sends any other model to codex, at high effort by default, a provider/model name of no opencode gateway included', async () => {
    const noOpenCode = listing({})

    expect(
      (await chooseModel({ model: 'gpt-5.6-sol' }, noOpenCode)).client,
    ).toEqual(
      new CodexClient({ model: 'gpt-5.6-sol', reasoningEffort: 'high' }),
    )
    expect(
      (
        await chooseModel(
          { model: 'deepseek/deepseek-v4.1-flash', effort: 'xhigh' },
          noOpenCode,
        )
      ).client,
    ).toEqual(
      new CodexClient({
        model: 'deepseek/deepseek-v4.1-flash',
        reasoningEffort: 'xhigh',
      }),
    )
  })

  it("leaves the model to codex's default when none is given, and refuses an effort the API does not take", async () => {
    const noOpenCode = listing({})

    expect((await chooseModel({}, noOpenCode)).client).toEqual(
      new CodexClient({ model: undefined, reasoningEffort: 'high' }),
    )
    const error = await rejectedBy(
      chooseModel({ effort: 'extreme' }, noOpenCode),
    )
    expect(error.message).toEqual('Codex does not take that --ai-effort')
    expect(error.cause).toEqual({
      effort: 'extreme',
      accepted: ['none', 'minimal', 'low', 'medium', 'high', 'xhigh', 'max'],
    })
  })

  describe(describeModel.name, () => {
    it('names the model and its effort, or the codex default when no model is given', () => {
      expect(describeModel('opencode-go/deepseek-v4.1-flash', 'high')).toEqual(
        'opencode-go/deepseek-v4.1-flash, high effort',
      )
      expect(describeModel(undefined, 'high')).toEqual(
        'codex default model, high effort',
      )
      expect(describeModel('opencode-go/kimi-k2.7-code', undefined)).toEqual(
        'opencode-go/kimi-k2.7-code',
      )
    })
  })
})
