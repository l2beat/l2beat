import { expect } from 'earl'
import MarkdownIt from 'markdown-it'
import { identifierBreaksPlugin } from './identifierBreaksPlugin'

// Why: long camel-case contract names otherwise break mid-word on phones.
// How: render list items and compare where <wbr> lands.
describe(identifierBreaksPlugin.name, () => {
  const markdown = MarkdownIt().use(identifierBreaksPlugin)
  const render = (text: string) => markdown.renderInline(text)

  it('offers a break at each camel-case hump of a long identifier', () => {
    expect(render('SecurityCouncilMemberElectionGovernor via')).toEqual(
      'Security<wbr>Council<wbr>Member<wbr>Election<wbr>Governor via',
    )
  })

  it('leaves short names and prose alone', () => {
    expect(render('L2ERC20Gateway and the Security Council')).toEqual(
      'L2ERC20Gateway and the Security Council',
    )
  })

  it('leaves checksummed addresses alone', () => {
    const address = '0x5aEd5f8A1e3607476F1f81c3d8fe126deB0aFE94'
    expect(render(address)).toEqual(address)
  })

  it('does not touch link targets or code', () => {
    expect(
      render(
        '[SecurityCouncilNomineeElectionGovernor](/a) `UpgradeExecutorImplementation`',
      ),
    ).toEqual(
      '<a href="/a">Security<wbr>Council<wbr>Nominee<wbr>Election<wbr>Governor</a> <code>UpgradeExecutorImplementation</code>',
    )
  })
})
