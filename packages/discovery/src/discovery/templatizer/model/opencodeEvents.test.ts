import { expect } from 'earl'
import { parseOpenCodeEvents } from './opencodeEvents'

describe(parseOpenCodeEvents.name, () => {
  it('reports the whole prompt as input tokens, cached part included, as Codex does', () => {
    const parsed = parseOpenCodeEvents(
      [
        '{"type":"step_start","sessionID":"ses_1","part":{"type":"step-start"}}',
        '{"type":"text","sessionID":"ses_1","part":{"type":"text","text":"{\\"version\\":1}"}}',
        '{"type":"step_finish","sessionID":"ses_1","part":{"type":"step-finish","tokens":{"input":129,"output":18,"reasoning":7,"cache":{"read":123848,"write":0}}}}',
      ].join('\n'),
    )
    expect(parsed.sessionId).toEqual('ses_1')
    expect(parsed.text).toEqual('{"version":1}')
    expect(parsed.usage).toEqual({
      inputTokens: 123977,
      cachedInputTokens: 123848,
      outputTokens: 18,
      reasoningOutputTokens: 7,
    })
  })

  it('records a tool part so the turn can be refused', () => {
    const parsed = parseOpenCodeEvents(
      '{"type":"tool","sessionID":"ses_1","part":{"type":"tool","tool":"read"}}',
    )
    expect(parsed.toolParts).toEqual(['tool read'])
  })

  it('records tool-call markup written into the text as a tool part', () => {
    const markup =
      '<｜｜DSML｜｜ calls>\n<｜｜DSML｜｜ invoke name="bash">\n<｜｜DSML｜｜ parameter name="command" string="true">ls</｜｜DSML｜｜ parameter>\n</｜｜DSML｜｜ invoke>\n</｜｜DSML｜｜ calls>'
    const parsed = parseOpenCodeEvents(
      JSON.stringify({
        type: 'text',
        sessionID: 'ses_1',
        part: { type: 'text', text: markup },
      }),
    )
    expect(parsed.toolParts).toEqual(['text holding tool-call markup (DSML)'])
    expect(parsed.text).toEqual(markup)

    const plain = parseOpenCodeEvents(
      JSON.stringify({
        type: 'text',
        sessionID: 'ses_1',
        part: { type: 'text', text: '{"fields":{},"skips":[]}' },
      }),
    )
    expect(plain.toolParts).toEqual([])
  })
})
