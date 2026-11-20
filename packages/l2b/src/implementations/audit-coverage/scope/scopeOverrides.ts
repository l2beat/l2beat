/**
 * What the audit dataset's summaries cannot say yet about a report's scope.
 * Every entry names the place in the report's Markdown it rests on. See
 * section 9 of
 * docs/superpowers/specs/2026-11-17-audit-scope-explicitness-design.md.
 */
export interface ScopeOverride {
  /**
   * What the report says about code it does not list. The summary's
   * `imports: "not_audited"` reads as `excluded`, which holds only when the
   * report has words for it.
   */
  unlisted?: 'not-mentioned' | 'excluded'
  /** A general statement about third-party dependencies. */
  dependencies?: 'included' | 'excluded'
  /**
   * Paths the report says were not reviewed that the summary does not record
   * as `not_audited`, in any repository of the report.
   */
  excluded?: string[]
  evidence: string
}

export const SCOPE_OVERRIDES: Record<string, ScopeOverride> = {
  // uniswapv2
  'dapp-org-uniswap-v2-2020-05': {
    unlisted: 'not-mentioned',
    evidence:
      'Scope section names the core repository at a commit and says nothing about other code; uniswapv2/reports, "### Scope" (line 100).',
  },

  // optimism: `imports: "not_audited"` without limiting words in the report
  'code4rena-base-2023-08': {
    unlisted: 'not-mentioned',
    evidence:
      'The report gives a contract count and points to the contest repository; no statement about unlisted code. 2023_08-OP-Stack-Base-Code4rena.md:123.',
  },
  'code4rena-superchain-2024-08': {
    unlisted: 'not-mentioned',
    evidence:
      'The report gives a contract count and points to the contest repository; no statement about unlisted code. 2024_08-Superchain-Code4rena.md:116.',
  },
  'spearbit-verify-opcm-2025-07': {
    unlisted: 'not-mentioned',
    evidence:
      'Two files listed as in scope, nothing said about their imports. 2025_07-VerifyOPCM-Spearbit.md:135.',
  },
  'spearbit-u16a-2025-09': {
    unlisted: 'not-mentioned',
    evidence:
      'An appendix lists the reviewed files with hashes; no limiting sentence. 2025_09-U16a-Spearbit.md:754.',
  },
  'cantina-u17-2025-10': {
    unlisted: 'not-mentioned',
    evidence:
      'An appendix lists the reviewed files with hashes; no limiting sentence. 2025_10-U17-Spearbit.md:241.',
  },

  // tornado-cash: no report was reviewed for scope statements in the dataset
  'abdk-tornado-smart-contract-audit-2019-11-19': {
    unlisted: 'not-mentioned',
    evidence:
      'Asked to review the codebase at a repository link; section headings name four files; no limiting sentence. TornadoCash_contract_audit_ABDK.md:20.',
  },
  'abdk-tornado-anonymity-mining-first-audit-2020-09-01': {
    unlisted: 'not-mentioned',
    evidence:
      'Asked to review the Farm contract and circuits given in private files; no scope or disclaimer section. ABDK - Tornado Cash Anonymity Mining First Audit.md:20-26.',
  },
  'zeropool-tornado-anonymity-mining-2020-10-15': {
    unlisted: 'not-mentioned',
    evidence:
      'Scope is two directories with five named exclusions, which the summary records; nothing about code outside them. Zeropool - Tornado Cash Anonymity Mining.md:14-19.',
  },
  'abdk-tornado-anonymity-mining-recheck-2020-12-22': {
    unlisted: 'not-mentioned',
    evidence:
      'Says ABDK is "now reviewing the changes only", which limits depth and names no excluded code; the summary records the ten files as fully audited. Ambiguous, read as silent. ABDK - Tornado Cash Anonymity Mining Recheck.md:334-335.',
  },

  // safe: no report was reviewed for scope statements in the dataset
  'akhunov-gnosis-safe-2018': {
    unlisted: 'not-mentioned',
    excluded: [
      'contracts/modules/DailyLimitModule.sol',
      'contracts/modules/SocialRecoveryModule.sol',
      'contracts/modules/WhitelistModule.sol',
    ],
    evidence:
      'Under Modules the auditor says he was asked to audit only StateChannelModule.sol; the summary scopes all of `contracts`. Gnosis_Safe_Audit_Report.md:300.',
  },
  'akhunov-audit-results-note': {
    unlisted: 'not-mentioned',
    evidence:
      'Says only that the report was based on a commit and later changes were checked by symbolic execution. safe-early__docs__alexey_audit.md:9-11.',
  },
  'g0-safe-1-1-0': {
    unlisted: 'not-mentioned',
    evidence:
      '"Files in Scope" heading and a file tree, no limiting sentence. Gnosis_Safe_Audit_Report_1_1_0.md:15-58.',
  },
  'g0-safe-1-1-1': {
    unlisted: 'not-mentioned',
    evidence:
      'Same file tree as 1.1.0, no limiting sentence. Gnosis_Safe_Audit_Report_1_1_1.md:22-67.',
  },
  'g0-safe-gas-validation-1-2-0': {
    unlisted: 'not-mentioned',
    evidence:
      'Two files given as links, no limiting sentence. Gnosis_Safe_Audit_Report_1_2_0.md:18-24.',
  },
  'g0-safe-1-3-0-initial': {
    unlisted: 'not-mentioned',
    evidence:
      'Scope is every Solidity file in the repository tree at the commit. Gnosis_Safe_Audit_Report_1_3_0_Initial.md:10-13.',
  },
  'g0-safe-1-3-0-final': {
    unlisted: 'not-mentioned',
    evidence:
      'Scope is every Solidity file in the repository tree at the commit. Gnosis_Safe_Audit_Report_1_3_0_Final.md:10-13.',
  },
  'certora-safe-1-3-0': {
    unlisted: 'not-mentioned',
    evidence:
      'Lists the contracts included in scope; no sentence about other files. Safe_Audit_Report_1_3_0_Certora.md:82.',
  },
  'nethermind-safe-1-3-0': {
    unlisted: 'not-mentioned',
    evidence:
      'A table of audited files; the disclaimer ties the report to the materials provided and disclaims liability for third-party software, which is not a scope statement. Safe_Audit_Report_1_3_0_Nethermind.md:1213-1225.',
  },
  'ackee-safe-1-4-0': {
    unlisted: 'not-mentioned',
    dependencies: 'included',
    evidence:
      'Scope is five named contracts "with all imports (recursively)"; at that commit every import is a file the summary already lists. Safe_Audit_Report_1_4_0.md:344-361.',
  },
  'ackee-safe-1-5-0': {
    unlisted: 'not-mentioned',
    evidence:
      'Scope is all Solidity files in `contracts` except two directories, which the summary records. Safe_Audit_Report_1_5_0_Ackee.md:396-398.',
  },
  'certora-safe-1-5-0': {
    unlisted: 'not-mentioned',
    evidence:
      'Lists the contracts included in scope; no sentence about other files. Safe_Audit_Report_1_5_0_Certora.md:102-151.',
  },
  'certora-safe-library-contracts-1-4-1': {
    unlisted: 'not-mentioned',
    evidence:
      'Three library files listed as the scope, nothing about the Safe code they call. Safe_Library_Contracts_Audit_Report_1_4_1.md:125-130.',
  },

  // aztecnetwork: no report was reviewed for scope statements in the dataset
  'consensys-diligence-aztec-protocol-2019-04-08': {
    unlisted: 'excluded',
    evidence:
      'The disclaimer limits the review to the Solidity code the report notes as in scope. ConsenSys Diligence - Aztec Protocol v1.md:508.',
  },
  'veridise-governance-2025-10-13': {
    unlisted: 'excluded',
    dependencies: 'excluded',
    evidence:
      'Scope "was limited to a specific set of source files"; external libraries are assumed to behave correctly and be free of vulnerabilities. Veridise - Governance.md:421 and :542.',
  },
  'cantina-coinissuer-2025-11-12': {
    unlisted: 'not-mentioned',
    evidence:
      'The review "focused on" one file at a commit; no sentence about other code. Cantina - Coinissuer.md:95-99.',
  },
  'cantina-escape-hatch-2026-02-24': {
    unlisted: 'not-mentioned',
    evidence:
      'A tree of components in scope at a commit, no limiting sentence. Cantina - Escape Hatch.md:146-176.',
  },
  'cantina-payload-2026-03-05': {
    unlisted: 'not-mentioned',
    evidence:
      'A tree of components in scope at a commit plus one pull request, no limiting sentence. Cantina - Payload 2025.03.05.md:116-128.',
  },
  'solidified-aztec-lido-bridge-2022-04-12': {
    unlisted: 'not-mentioned',
    evidence:
      'File tree under "Audited Files" with repository and commit, no limiting sentence. Solidified - Aztec Lido Bridge.md:18-36.',
  },
  'solidified-aztec-element-bridge-2022-05-11': {
    unlisted: 'not-mentioned',
    evidence:
      'File tree under "Audited Files" with repository and commit, no limiting sentence. Solidified - Aztec Element Bridge.md:18-35.',
  },
  'solidified-aztec-set-bridge-2022-05-11': {
    unlisted: 'not-mentioned',
    evidence:
      'File tree under "Audited Files" with repository and commit, no limiting sentence. Solidified - Aztec Set Bridge.md:18-34.',
  },
  'solidified-aztec-aave-bridge-2022-05-18': {
    unlisted: 'not-mentioned',
    evidence:
      'File tree under "Audited Files" with repository and commit, no limiting sentence. Solidified - Aztec Aave Bridge.md:18-36.',
  },
  'solidified-aztec-liquity-bridge-2022-06-14': {
    unlisted: 'not-mentioned',
    evidence:
      'File tree under "Audited Files" with repository and commit, no limiting sentence. Solidified - Aztec Liquity Bridge.md:18-36.',
  },
  'solidified-aztec-compound-bridge-2022-06-17': {
    unlisted: 'not-mentioned',
    evidence:
      'File tree under "Audited Files" with repository and commit, no limiting sentence. Solidified - Aztec Compound Bridge.md:18-34.',
  },
  'solidified-aztec-curve-bridge-2022-07-05': {
    unlisted: 'not-mentioned',
    evidence:
      'File tree under "Audited Files" with repository and commit, no limiting sentence. Solidified - Aztec Curve Bridge.md:18-33.',
  },
  'solidified-aztec-subsidy-contract-2022-08-10': {
    unlisted: 'not-mentioned',
    evidence:
      'File tree under "Audited Files" with repository and commit, no limiting sentence. Solidified - Aztec Subsidy Contract.md:17-31.',
  },
  'solidified-aztec-dca-bridge-2022-09-21': {
    unlisted: 'not-mentioned',
    evidence:
      'File tree under "Audited Files" with repository and commit, no limiting sentence. Solidified - Aztec DCA Bridge.md:18-35.',
  },
  'solidified-aztec-liquity-trove-bridge-ii-2022-11-21': {
    unlisted: 'not-mentioned',
    evidence:
      'File tree under "Audited Files" with repository and commit, no limiting sentence. Solidified - Aztec Liquity Trove Bridge II.md:22-37.',
  },
}
