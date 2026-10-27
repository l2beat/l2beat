import { expect } from 'earl'
import { describeTool } from './toolLabels'

describe(describeTool.name, () => {
  it('names what a DiscoUI command did', () => {
    expect(describeTool('l2b ui-agent context')).toEqual({
      label: 'Looked at your screen',
      inDiscoUi: true,
      verbatim: false,
    })
    expect(
      describeTool('/tmp/bin/l2b ui-agent show --note "x" --path a,b'),
    ).toEqual({
      label: 'Pointed at it in DiscoUI',
      inDiscoUi: true,
      verbatim: false,
    })
    expect(describeTool('l2b ui-agent view --hide all --dry-run')).toEqual({
      label: 'Tried a view',
      inDiscoUi: true,
      verbatim: false,
    })
    expect(describeTool('l2b ui-agent frobnicate')).toEqual({
      label: 'Used DiscoUI frobnicate',
      inDiscoUi: true,
      verbatim: false,
    })
  })

  it('names the DiscoUI MCP tools the way each agent titles them', () => {
    expect(describeTool('mcp__discoui__permissions')).toEqual({
      label: 'Traced who controls it',
      inDiscoUi: true,
      verbatim: false,
    })
    expect(describeTool('mcp.discoui.control_map')).toEqual({
      label: 'Mapped who controls what',
      inDiscoUi: true,
      verbatim: false,
    })
    expect(describeTool('mcp__discoui__view', true)).toEqual({
      label: 'Tried a view',
      inDiscoUi: true,
      verbatim: false,
    })
    expect(describeTool('l2b ui-agent control-map --dry-run')).toEqual({
      label: 'Tried a control map',
      inDiscoUi: true,
      verbatim: false,
    })
  })

  it('keeps other tools as they are, without the quotes Codex adds', () => {
    expect(describeTool('"rg --files packages"')).toEqual({
      label: 'rg --files packages',
      inDiscoUi: false,
      verbatim: true,
    })
    expect(describeTool('Read AGENTS.md')).toEqual({
      label: 'Read AGENTS.md',
      inDiscoUi: false,
      verbatim: true,
    })
  })
})
