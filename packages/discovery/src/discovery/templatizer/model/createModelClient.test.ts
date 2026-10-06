import { expect } from 'earl'
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

    await expect(
      chooseModel(
        { model: 'opencode-go/deepseek-v4.1-flash', effort: 'medium' },
        levelsOf,
      ),
    ).toBeRejectedWith(
      'opencode-go/deepseek-v4.1-flash has no medium effort; pass --ai-effort with one of low, high, max',
    )
    await expect(
      chooseModel({ model: 'opencode-go/qwen3.8-flash' }, levelsOf),
    ).toBeRejectedWith(
      'opencode-go/qwen3.8-flash has no high effort, the default; pass --ai-effort with one of low, medium, xhigh',
    )
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
    await expect(
      chooseModel(
        { model: 'opencode-go/kimi-k2.7-code', effort: 'high' },
        levelsOf,
      ),
    ).toBeRejectedWith('opencode-go/kimi-k2.7-code has no effort levels')
  })

  it('refuses a model opencode does not list', async () => {
    await expect(
      chooseModel({ model: 'opencode-go/deepsek-v4.1-flash' }, listing({})),
    ).toBeRejectedWith(
      'opencode lists no model opencode-go/deepsek-v4.1-flash; `opencode models opencode-go` shows the ones there are',
    )
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
    await expect(
      chooseModel({ effort: 'extreme' }, noOpenCode),
    ).toBeRejectedWith('Codex takes --ai-effort none, minimal, low')
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
