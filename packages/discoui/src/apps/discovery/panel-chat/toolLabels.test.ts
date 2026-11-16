import { expect } from 'earl'
import { describeTool } from './toolLabels'

describe(describeTool.name, () => {
  it("names DiscoUI's tools as actions on the researcher's screen", () => {
    expect(describeTool('mcp__discoui__show')).toEqual({
      label: 'Pointed at it in DiscoUI',
      isDiscoUi: true,
    })
    expect(describeTool('mcp.discoui.board').label).toEqual('Built a board')
    expect(describeTool('mcp__discoui__later').label).toEqual(
      'Used DiscoUI later',
    )
  })

  it("keeps other calls' own titles", () => {
    expect(describeTool('ls -la')).toEqual({
      label: 'ls -la',
      isDiscoUi: false,
    })
    expect(describeTool(undefined).label).toEqual('Tool call')
  })
})
