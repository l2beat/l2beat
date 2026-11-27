import { expect } from 'earl'
import { reportDisplayTitle } from './reportDisplayTitle'

describe(reportDisplayTitle.name, () => {
  it('drops trailing parentheses that only name the auditor', () => {
    expect(
      reportDisplayTitle(
        'Optimism Upgrade 20 Security Review (Cantina Managed)',
        'Cantina',
      ),
    ).toEqual('Optimism Upgrade 20 Security Review')
    expect(
      reportDisplayTitle(
        'Optimism Incident Response Updates Review (Offbeat Security)',
        'Offbeat Labs',
      ),
    ).toEqual('Optimism Incident Response Updates Review')
  })

  it('keeps what else the parentheses say', () => {
    expect(
      reportDisplayTitle(
        'Optimism Cycle 19 Security Review (Cantina, MCP L1)',
        'Cantina',
      ),
    ).toEqual('Optimism Cycle 19 Security Review (MCP L1)')
    expect(
      reportDisplayTitle(
        'Security Review of Gnosis Safe 1.3.0 (Final)',
        'G0 Group',
      ),
    ).toEqual('Security Review of Gnosis Safe 1.3.0 (Final)')
  })

  it('leaves a list of firms and titles without parentheses alone', () => {
    expect(
      reportDisplayTitle(
        'Optimism - Fix Review: MIPS EventFd (Spearbit/Cantina)',
        'Cantina',
      ),
    ).toEqual('Optimism - Fix Review: MIPS EventFd (Spearbit/Cantina)')
    expect(
      reportDisplayTitle(
        'Veridise Auditing Report: Aztec Governance',
        'Veridise',
      ),
    ).toEqual('Veridise Auditing Report: Aztec Governance')
  })
})
